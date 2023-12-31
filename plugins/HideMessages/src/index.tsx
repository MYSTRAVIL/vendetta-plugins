import {findByProps} from "@vendetta/metro";
import {FluxDispatcher} from "@vendetta/metro/common";
import {after, before} from "@vendetta/patcher";
import {React} from "@vendetta/metro/common";
import {getAssetIDByName as getAssetId} from "@vendetta/ui/assets"
import {findInReactTree} from "@vendetta/utils"
import Settings from "./components/Settings";
import {storage} from "@vendetta/plugin";
import {logger} from "@vendetta";
import {RedesignRow} from "@nexpid/vdp-shared";

let patches = [];

const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

function onLoad() {
    logger.log("HideMessages: Index at ", storage.hideMessagesIndex);
    patches.push(before("openLazy", LazyActionSheet, ([component, key, msg]) => {
        const message = msg?.message;
        if (key != "MessageLongPressActionSheet" || !message) return;
        component.then(instance => {
            const unpatch = after("default", instance, (_, component) => {
                React.useEffect(() => () => {
                    unpatch()
                }, [])
                const buttons = findInReactTree(component, x => x?.[0]?.type?.name === "ButtonRow")
                if (!buttons) return

                buttons.splice(storage.hideMessagesIndex || 2, 0,
                    <RedesignRow
                        label={"Hide Message"}
                        icon={getAssetId("ic_close_16px")}
                        onPress={() => {
                            FluxDispatcher.dispatch({
                                type: "MESSAGE_DELETE",
                                channelId: message.channel_id,
                                id: message.id,
                                __vml_cleanup: true,
                                otherPluginBypass: true
                            })
                            LazyActionSheet.hideActionSheet()
                        }}
                    />)
            })
        })
    }));
}

export default {
    onLoad,
    onUnload: () => {
        for (const unpatch of patches) {
            unpatch();
        }
    },

    settings: Settings
}
