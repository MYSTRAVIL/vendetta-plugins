import { findByProps, findByStoreName } from "@vendetta/metro";
import { ReactNative } from "@vendetta/metro/common";
import { after, before, instead } from "@vendetta/patcher";
import { storage, manifest } from "@vendetta/plugin";
import Settings from "./components/Settings";
import { DefaultNativeEvent, DoubleTapStateProps, Plugin, NativeEvent } from "./def";
import { findInReactTree } from "@vendetta/utils";
import {logger} from "@vendetta";

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

    doubleTapState({ state = "UNKNOWN", nativeEvent }: DoubleTapStateProps) {
        const stateObject = {
            state,
            data: nativeEvent
        };

        if (state == "INCOMPLETE") {
            Object.assign(stateObject, {
                reason: {
                    required: {
                        taps: 2,
                        isAuthor: true
                    },
                    received: {
                        taps: stateObject.data.taps,
                        isAuthor: stateObject.data.isAuthor
                    }
                }
            })
        }

        return manifest.authors.find(author => author.id === UserStore.getCurrentUser().id)
            ? console.log("DoubleTapState", stateObject)
            : void 0;
    },

    patchHandlers(handlers) {
        if (handlers.__bcg_patched) return;
        handlers.__bcg_patched = true;

        // patch username tapping to mention user instead
        let tapUsernamePatch = Boolean(handlers.handleTapUsername)
            && ReactNative.Platform.OS !== "android"
            && instead("handleTapUsername", handlers, (args, orig) => {
                if (!storage.tapUsernameMention) return orig.apply(this, args);

                const ChatInput = ChatInputRef.refs[0].current;
                const { messageId } = args[0].nativeEvent;

                const message = MessageStore.getMessage(
                    ChatInput.props?.channel?.id,
                    messageId
                )

                if (!message) return;
                ChatInputRef.insertText(`@${message.author.username}#${message.author.discriminator}`)
            });

        // patch tapping a message to require 2 taps and author and provide edit event if both conditions are met
        let tapMessagePatch = Boolean(handlers.handleTapMessage) && after("handleTapMessage", handlers, (args) => {
            const { nativeEvent }: { nativeEvent: DefaultNativeEvent } = args[0];
            const ChannelID = nativeEvent.channelId;
            const MessageID = nativeEvent.messageId;

            this.currentTapIndex++;

            let timeoutTap = setTimeout(() => {
                this.currentTapIndex = 0;
                this.currentMessageID = null;
            }, Number(storage.delay));
            //    ^ oh my god

            const channel = ChannelStore.getChannel(ChannelID);
            const message = MessageStore.getMessage(ChannelID, MessageID);

            if (this.currentTapIndex === 1) this.currentMessageID = MessageID

            Object.assign(nativeEvent, {
                taps: this.currentTapIndex,
                content: message?.content,
                authorId: message?.author?.id,
                isAuthor: message?.author?.id === UserStore.getCurrentUser()?.id
            });

            if (this.currentTapIndex !== 2 || this.currentMessageID !== MessageID)
                return this.doubleTapState({
                    state: "INCOMPLETE",
                    nativeEvent
                });

            clearTimeout(timeoutTap);

            if ((nativeEvent as NativeEvent)?.authorId === UserStore.getCurrentUser()?.id) {
                if (storage.userEdit) {
                    const MessageContent = (nativeEvent as NativeEvent).content;

                    Messages.startEditMessage(
                        ChannelID,
                        MessageID,
                        MessageContent
                    );
                } else {
                    ReplyManager.createPendingReply({
                        channel,
                        message,
                        shouldMention: true
                    });
                }

                if (storage.keyboardPopup) findByProps("openSystemKeyboard").openSystemKeyboardForLastCreatedInput()

                return;
            }

            if (storage.reply) {
                ReplyManager.createPendingReply({
                    channel,
                    message,
                    shouldMention: true
                })

                if (storage.keyboardPopup) findByProps("openSystemKeyboard").openSystemKeyboardForLastCreatedInput()
            }

            this.currentTapIndex = 0;
            this.currentMessageID = null;
            this.doubleTapState({
                state: "COMPLETE",
                nativeEvent
            })
        });

        this.unpatchHandlers = () => {
            tapUsernamePatch && tapUsernamePatch();
            tapMessagePatch && tapMessagePatch();
        };
    },

    onLoad() {
        logger.log("BetterChatGestures: storage.delay at ", storage.delay, " with type ", typeof(storage.delay))

        // initialize
        storage.tapUsernameMention ??= ReactNative.Platform.select({
            android: false,
            ios: true,
            default: true
        });
        storage.reply ??= true;
        storage.userEdit ??= true;
        storage.delay ??= "300";
        //                  ^ this is horrible
        // and this might be even worse
        if (storage.delay === "") storage.delay = "300"

        const self = this;
        const origGetParams = Object.getOwnPropertyDescriptor(MessagesHandlers.prototype, "params").get;

        origGetParams && Object.defineProperty(MessagesHandlers.prototype, "params", {
            configurable: true,
            get() {
                this && self.patchHandlers(this);
                return origGetParams.call(this);
            }
        });


        this.unpatchGetter = () => {
            origGetParams && Object.defineProperty(MessagesHandlers.prototype, "params", {
                configurable: true,
                get: origGetParams
            });
        }
    },

    onUnload() {
        this.unpatchGetter?.();
        this.unpatchHandlers?.();
    },

    settings: Settings
}

export default BetterChatGestures;