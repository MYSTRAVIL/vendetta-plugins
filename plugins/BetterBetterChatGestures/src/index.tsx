import { findByProps, findByStoreName } from "@vendetta/metro";
import { ReactNative } from "@vendetta/metro/common";
import { after, before, instead } from "@vendetta/patcher";
import { storage, manifest } from "@vendetta/plugin";
import Settings from "./components/Settings";
import { DefaultNativeEvent, DoubleTapStateProps, Plugin, NativeEvent } from "./def";
import { findInReactTree } from "@vendetta/utils";
import { logger } from "@vendetta";

const ChatInputRef = findByProps("insertText");
const ChannelStore = findByStoreName("ChannelStore");
const MessageStore = findByStoreName("MessageStore");
const UserStore = findByStoreName("UserStore");
const Messages = findByProps("sendMessage", "startEditMessage");
const ReplyManager = findByProps("createPendingReply");
const { MessagesHandlers } = findByProps("MessagesHandlers");

const BetterChatGestures: Plugin = {
    unpatchGetter: null,
    unpatchHandlers: null,
    currentTapIndex: 0,
    currentMessageID: null,
    timeoutTap: null,
    patches: [],

    doubleTapState({ state = "UNKNOWN", nativeEvent }: DoubleTapStateProps) {
        try {
            const stateObject = {
                state,
                data: nativeEvent
            };

            if (state === "INCOMPLETE" && nativeEvent) {
                Object.assign(stateObject, {
                    reason: {
                        required: {
                            taps: 2,
                            isAuthor: true
                        },
                        received: {
                            taps: nativeEvent.taps,
                            isAuthor: nativeEvent.isAuthor
                        }
                    }
                });
            }

            const currentUser = UserStore?.getCurrentUser();
            if (currentUser && manifest.authors.find(author => author.id === currentUser.id)) {
                console.log("DoubleTapState", stateObject);
            }
        } catch (error) {
            logger.error("BetterChatGestures: Error in doubleTapState", error);
        }
    },

    resetTapState() {
        try {
            if (this.timeoutTap) {
                clearTimeout(this.timeoutTap);
                this.timeoutTap = null;
            }
            this.currentTapIndex = 0;
            this.currentMessageID = null;
        } catch (error) {
            logger.error("BetterChatGestures: Error in resetTapState", error);
        }
    },

    patchHandlers(handlers) {
        if (handlers.__bcg_patched) return;
        handlers.__bcg_patched = true;

        try {
            // patch username tapping to mention user instead
            if (handlers.handleTapUsername && storage.tapUsernameMention) {
                const tapUsernamePatch = instead("handleTapUsername", handlers, (args, orig) => {
                    try {
                        if (!storage.tapUsernameMention) return orig.apply(handlers, args);
                        if (!args?.[0]?.nativeEvent) return orig.apply(handlers, args);

                        const ChatInput = ChatInputRef.refs?.[0]?.current;
                        const { messageId } = args[0].nativeEvent;
                        
                        if (!ChatInput?.props?.channel?.id) return orig.apply(handlers, args);

                        const message = MessageStore.getMessage(
                            ChatInput.props.channel.id,
                            messageId
                        );

                        if (!message?.author) return orig.apply(handlers, args);
                        
                        // Include discriminator only if it's not "0" (new Discord username system)
                        const discriminatorText = message.author.discriminator !== "0" 
                            ? `#${message.author.discriminator}` 
                            : '';
                        ChatInputRef.insertText(`@${message.author.username}${discriminatorText}`);
                    } catch (error) {
                        logger.error("BetterChatGestures: Error in handleTapUsername patch", error);
                        return orig.apply(handlers, args);
                    }
                });
                this.patches.push(tapUsernamePatch);
            }

            // patch tapping a message to require 2 taps and author and provide edit event if both conditions are met
            if (handlers.handleTapMessage) {
                const tapMessagePatch = after("handleTapMessage", handlers, (args) => {
                    try {
                        if (!args?.[0]) return;
                        
                        const { nativeEvent }: { nativeEvent: DefaultNativeEvent } = args[0];
                        if (!nativeEvent) return;
                        
                        const ChannelID = nativeEvent.channelId;
                        const MessageID = nativeEvent.messageId;
                        if (!ChannelID || !MessageID) return;

                        const channel = ChannelStore.getChannel(ChannelID);
                        const message = MessageStore.getMessage(ChannelID, MessageID);

                        if (!message) return;

                        // Track taps for the same message
                        if (this.currentMessageID === MessageID) {
                            this.currentTapIndex++;
                        } else {
                            // If tapping a different message, reset and start with 1
                            this.resetTapState();
                            this.currentTapIndex = 1;
                            this.currentMessageID = MessageID;
                        }

                        // Validate delay setting
                        let delayMs = 300; // Default value
                        if (storage.delay) {
                            const parsedDelay = parseInt(storage.delay, 10);
                            if (!isNaN(parsedDelay) && parsedDelay > 0) {
                                delayMs = parsedDelay;
                            }
                        }
                        
                        // Clear previous timeout and set a new one
                        if (this.timeoutTap) {
                            clearTimeout(this.timeoutTap);
                        }
                        
                        this.timeoutTap = setTimeout(() => {
                            this.resetTapState();
                        }, delayMs);

                        const currentUser = UserStore.getCurrentUser();
                        const isAuthor = currentUser && message.author ? message.author.id === currentUser.id : false;

                        const enrichedNativeEvent = {
                            ...nativeEvent,
                            taps: this.currentTapIndex,
                            content: message.content || '',
                            authorId: message.author?.id,
                            isAuthor
                        };

                        if (this.currentTapIndex !== 2) {
                            this.doubleTapState({
                                state: "INCOMPLETE",
                                nativeEvent: enrichedNativeEvent
                            });
                            return;
                        }

                        // Store the message ID before resetting
                        const currentMessageID = this.currentMessageID;
                        
                        // We've confirmed it's a double tap, reset the state
                        this.resetTapState();

                        if (isAuthor) {
                            if (storage.userEdit) {
                                Messages.startEditMessage(
                                    ChannelID,
                                    currentMessageID,
                                    enrichedNativeEvent.content
                                );
                            } else if (storage.reply && channel) {
                                ReplyManager.createPendingReply({
                                    channel,
                                    message,
                                    shouldMention: true
                                });
                            }
                        } else if (storage.reply && channel) {
                            ReplyManager.createPendingReply({
                                channel,
                                message,
                                shouldMention: true
                            });
                        }

                        if ((isAuthor && (storage.userEdit || storage.reply)) || 
                            (!isAuthor && storage.reply)) {
                            if (storage.keyboardPopup) {
                                try {
                                    const keyboardModule = findByProps("openSystemKeyboard");
                                    if (keyboardModule) keyboardModule.openSystemKeyboardForLastCreatedInput();
                                } catch (error) {
                                    logger.error("BetterChatGestures: Error opening keyboard", error);
                                }
                            }
                        }

                        this.doubleTapState({
                            state: "COMPLETE",
                            nativeEvent: enrichedNativeEvent
                        });
                    } catch (error) {
                        logger.error("BetterChatGestures: Error in handleTapMessage patch", error);
                        this.resetTapState();
                    }
                });
                this.patches.push(tapMessagePatch);
            }

            this.unpatchHandlers = () => {
                try {
                    // Unpatch all registered patches
                    this.patches.forEach(unpatch => {
                        if (typeof unpatch === 'function') {
                            unpatch();
                        }
                    });
                    this.patches = [];
                    
                    // Remove our marker
                    if (handlers.__bcg_patched) {
                        delete handlers.__bcg_patched;
                    }
                } catch (error) {
                    logger.error("BetterChatGestures: Error in unpatchHandlers", error);
                }
            };
        } catch (error) {
            logger.error("BetterChatGestures: Error in patchHandlers", error);
        }
    },

    onLoad() {
        try {
            // initialize with default values if not set
            storage.tapUsernameMention ??= ReactNative.Platform.select({
                android: false,
                ios: true,
                default: true
            });
            
            // Always disable for Android regardless of stored value
            if (ReactNative.Platform.OS === 'android') {
                storage.tapUsernameMention = false;
            }
            
            storage.reply ??= true;
            storage.userEdit ??= true;
            storage.keyboardPopup ??= false;
            storage.delay ??= "300";
            
            // Validate delay
            if (!storage.delay || storage.delay === "" || isNaN(parseInt(storage.delay, 10)) || parseInt(storage.delay, 10) <= 0) {
                storage.delay = "300";
            }
            
            logger.log("BetterChatGestures: initialized with delay =", storage.delay);
            
            const self = this;
            const origGetParams = Object.getOwnPropertyDescriptor(MessagesHandlers.prototype, "params")?.get;
            
            if (origGetParams) {
                Object.defineProperty(MessagesHandlers.prototype, "params", {
                    configurable: true,
                    get() {
                        if (this) self.patchHandlers.call(self, this);
                        return origGetParams.call(this);
                    }
                });
            }
            
            this.unpatchGetter = () => {
                try {
                    if (origGetParams) {
                        Object.defineProperty(MessagesHandlers.prototype, "params", {
                            configurable: true,
                            get: origGetParams
                        });
                    }
                } catch (error) {
                    logger.error("BetterChatGestures: Error in unpatchGetter", error);
                }
            };
        } catch (error) {
            logger.error("BetterChatGestures: Error in onLoad", error);
        }
    },

    onUnload() {
        try {
            this.resetTapState();
            
            if (this.unpatchGetter) this.unpatchGetter();
            if (this.unpatchHandlers) this.unpatchHandlers();
            
            // Clear any remaining timeouts
            if (this.timeoutTap) {
                clearTimeout(this.timeoutTap);
                this.timeoutTap = null;
            }
        } catch (error) {
            logger.error("BetterChatGestures: Error in onUnload", error);
        }
    },

    settings: Settings
};

export default BetterChatGestures;