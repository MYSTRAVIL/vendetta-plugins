(function(P,s,e,M,t,T,V,n,R,k){"use strict";var o={Failed:n.getAssetIDByName("Small"),Delete:n.getAssetIDByName("ic_message_delete"),Copy:n.getAssetIDByName("toast_copy_link"),Open:n.getAssetIDByName("ic_leave_stage"),Clipboard:n.getAssetIDByName("pending-alert"),Clock:n.getAssetIDByName("clock"),Forum:n.getAssetIDByName("ic_forum_channel"),Settings:{Toasts:{Settings:n.getAssetIDByName("ic_selection_checked_24px"),Failed:n.getAssetIDByName("ic_close_circle_24px")},Initial:n.getAssetIDByName("coffee"),Update:n.getAssetIDByName("discover"),Locale:n.getAssetIDByName("ic_locale_24px"),External:n.getAssetIDByName("ic_raised_hand_list"),Edit:n.getAssetIDByName("ic_edit_24px"),Reply:n.getAssetIDByName("ic_reply_24px"),Keyboard:n.getAssetIDByName("ic_keyboard_24px")}},p={shadow:function(){let r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:.1;return{shadowColor:"#000",shadowOffset:{width:1,height:4},shadowOpacity:r,shadowRadius:4.65,elevation:8}},displayToast:function(r,a){e.toasts.open({content:a=="clipboard"?`Copied ${r} to clipboard.`:r,source:a=="clipboard"?o.Clipboard:o.Settings.Initial})}},v={plugin:{source:"https://github.com/MYSTRAVIL/vendetta-plugins"},author:{profile:{"Rosie<3":"https://github.com/acquitelol"}}};const{TouchableOpacity:w,View:D,Image:G,Text:_,Animated:A}=T.General,N=s.findByProps("transitionToGuild"),L=s.findByStoreName("UserStore"),K=s.findByProps("showUserProfile"),d=e.stylesheet.createThemedStyleSheet({container:{marginTop:25,marginLeft:"5%",marginBottom:-15,flexDirection:"row"},textContainer:{paddingLeft:15,paddingTop:5,flexDirection:"column",flexWrap:"wrap",...p.shadow()},image:{width:75,height:75,borderRadius:10,...p.shadow()},mainText:{opacity:.975,letterSpacing:.25},header:{color:R.semanticColors.HEADER_PRIMARY,fontFamily:e.constants.Fonts.DISPLAY_BOLD,fontSize:25,letterSpacing:.25},subHeader:{color:R.semanticColors.HEADER_SECONDARY,fontSize:12.75}});function Y(r){let{name:a,authors:g}=r;const l=e.React.useRef(new A.Value(1)).current,h=function(){return A.spring(l,{toValue:1.1,duration:10,useNativeDriver:!0}).start()},c=function(){return A.spring(l,{toValue:1,duration:250,useNativeDriver:!0}).start()},E=function(){return K.showUserProfile({userId:L.getCurrentUser().id})},b={transform:[{scale:l}]};return e.React.createElement(e.React.Fragment,null,e.React.createElement(D,{style:d.container},e.React.createElement(w,{onPress:E,onPressIn:h,onPressOut:c},e.React.createElement(A.View,{style:b},e.React.createElement(G,{style:[d.image],source:{uri:L?.getCurrentUser()?.getAvatarURL()?.replace("webp","png")}}))),e.React.createElement(D,{style:d.textContainer},e.React.createElement(w,{onPress:function(){return N.openURL(v.plugin.source)}},e.React.createElement(_,{style:[d.mainText,d.header]},a)),e.React.createElement(D,{style:{flexDirection:"row"}},e.React.createElement(_,{style:[d.mainText,d.subHeader]},"A project by"),g.map(function(f,S,u){return e.React.createElement(w,{onPress:function(){return N.openURL(v.author.profile[f.name]??"https://github.com/")}},e.React.createElement(_,{style:[d.mainText,d.subHeader,{paddingLeft:4,fontFamily:e.constants.Fonts.DISPLAY_BOLD,flexDirection:"row"}]},f.name,S<u.length-1?",":null))})))))}const{View:j,Text:W}=T.General,O=e.stylesheet.createThemedStyleSheet({text:{color:R.semanticColors.HEADER_SECONDARY,paddingLeft:"5.5%",paddingRight:10,marginBottom:10,letterSpacing:.25,fontFamily:e.constants.Fonts.PRIMARY_BOLD,fontSize:12}});function U(r){let{label:a,children:g}=r;return e.React.createElement(j,{style:{marginTop:10}},e.React.createElement(W,{style:[O.text,O.optionText]},a.toUpperCase()),g)}const{FormRow:i,FormSwitch:I,FormDivider:m,FormInput:z,FormText:q}=T.Forms,{ScrollView:X,View:B,Text:J}=T.General,Q=s.findByProps("transitionToGuild","openURL"),y=e.stylesheet.createThemedStyleSheet({icon:{color:R.semanticColors.INTERACTIVE_NORMAL},item:{color:R.semanticColors.TEXT_MUTED,fontFamily:e.constants.Fonts.PRIMARY_MEDIUM},container:{width:"90%",marginLeft:"5%",borderRadius:10,backgroundColor:R.semanticColors.BACKGROUND_MOBILE_SECONDARY,...p.shadow()},subheaderText:{color:R.semanticColors.HEADER_SECONDARY,textAlign:"center",margin:10,marginBottom:50,letterSpacing:.25,fontFamily:e.constants.Fonts.PRIMARY_BOLD,fontSize:14},image:{width:"100%",maxWidth:350,borderRadius:10}});function Z(){V.useProxy(t.storage);const r=e.ReactNative.Platform.OS==="android";return e.React.createElement(X,null,e.React.createElement(Y,{name:t.manifest.name,authors:t.manifest.authors}),e.React.createElement(B,{style:{marginTop:20}},e.React.createElement(U,{label:"Preferences"},e.React.createElement(B,{style:[y.container]},e.React.createElement(i,{label:"Tap Username to Mention",subLabel:`Allows you to tap on a username to mention them instead of opening their profile.${r?"This option is disabled on Android.":""}`,onLongPress:function(){return p.displayToast("By default, Discord opens a profile when tapping on a username in chat. With this, it now mentions them, like on Android.","tooltip")},leading:e.React.createElement(i.Icon,{style:y.icon,source:t.storage.tapUsernameMention?o.Forum:o.Failed}),trailing:e.React.createElement(I,{value:r?!1:t.storage.tapUsernameMention,onValueChange:function(){r||(t.storage.tapUsernameMention=!t.storage.tapUsernameMention)}}),disabled:r}),e.React.createElement(m,null),e.React.createElement(i,{label:"Double Tap To Reply",subLabel:"Allows you to tap double tap on any messages to reply to them.",onLongPress:function(){return p.displayToast("When double tapping on any messages, you can now reply to them!","tooltip")},leading:e.React.createElement(i.Icon,{style:y.icon,source:t.storage.reply?o.Settings.Reply:o.Failed}),trailing:e.React.createElement(I,{value:t.storage.reply,onValueChange:function(){t.storage.reply=!t.storage.reply}})}),e.React.createElement(m,null),e.React.createElement(i,{label:"Open Keyboard Automatically",subLabel:"Opens the Keyboard when you reply to or edit a message with a double tap.",onLongPress:function(){return p.displayToast("Opens the Keyboard when you reply to or edit a message with a double tap.","tooltip")},leading:e.React.createElement(i.Icon,{style:y.icon,source:t.storage.keyboardPopup?o.Settings.Keyboard:o.Failed}),trailing:e.React.createElement(I,{value:t.storage.keyboardPopup,onValueChange:function(){t.storage.keyboardPopup=!t.storage.keyboardPopup}})}),e.React.createElement(m,null),e.React.createElement(i,{label:`${t.storage.userEdit?"Editing":"Replying to"} your own messages`,subLabel:`Allows you to tap double tap on any of your own messages to ${t.storage.userEdit?"reply to":"edit"} them.`,onLongPress:function(){return p.displayToast(`When double tapping on any of your own messages, you can now ${t.storage.userEdit?"start an edit":"reply to them"}!`,"tooltip")},leading:e.React.createElement(i.Icon,{style:y.icon,source:t.storage.userEdit?o.Settings.Edit:o.Settings.Reply}),trailing:e.React.createElement(I,{value:t.storage.userEdit,onValueChange:function(){t.storage.userEdit=!t.storage.userEdit}})}),e.React.createElement(m,null),e.React.createElement(z,{value:t.storage.delay,onChange:function(a){t.storage.delay=a},placeholder:"300",title:"Maximum Delay"}),e.React.createElement(m,null),e.React.createElement(q,{style:{padding:10}},"The maximum delay between taps until the double tap event is cancelled. This is 300ms by default."))),e.React.createElement(U,{label:"Source"},e.React.createElement(B,{style:y.container},e.React.createElement(i,{label:"Source",subLabel:`Open the repository of ${t.manifest.name} externally.`,onLongPress:function(){return p.displayToast(`Opens the repository of ${t.manifest.name} on GitHub in an external page to view any source code of the plugin.`,"tooltip")},leading:e.React.createElement(i.Icon,{style:y.icon,source:o.Open}),trailing:function(){return e.React.createElement(i.Arrow,null)},onPress:function(){return Q.openURL(v.plugin.source)}})))),e.React.createElement(J,{style:y.subheaderText},`Build: (${t.manifest.hash.substring(0,8)})`))}const F=s.findByProps("insertText"),ee=s.findByStoreName("ChannelStore"),$=s.findByStoreName("MessageStore"),x=s.findByStoreName("UserStore"),te=s.findByProps("sendMessage","startEditMessage"),H=s.findByProps("createPendingReply"),{MessagesHandlers:C}=s.findByProps("MessagesHandlers"),ae={unpatchGetter:null,unpatchHandlers:null,currentTapIndex:0,currentMessageAuthor:null,doubleTapState(r){let{state:a="UNKNOWN",nativeEvent:g}=r;const l={state:a,data:g};return a=="INCOMPLETE"&&Object.assign(l,{reason:{required:{taps:2,isAuthor:!0},received:{taps:l.data.taps,isAuthor:l.data.isAuthor}}}),t.manifest.authors.find(function(h){return h.id===x.getCurrentUser().id})?console.log("DoubleTapState",l):void 0},patchHandlers(r){var a=this;if(r.__bcg_patched)return;r.__bcg_patched=!0;let g=Boolean(r.handleTapUsername)&&e.ReactNative.Platform.OS!=="android"&&M.instead("handleTapUsername",r,function(h,c){if(!t.storage.tapUsernameMention)return c.apply(a,h);const E=F.refs[0].current,{messageId:b}=h[0].nativeEvent,f=$.getMessage(E.props?.channel?.id,b);f&&F.insertText(`@${f.author.username}#${f.author.discriminator}`)}),l=Boolean(r.handleTapMessage)&&M.after("handleTapMessage",r,function(h){const{nativeEvent:c}=h[0],E=c.channelId,b=c.messageId;a.currentTapIndex++;let f=setTimeout(function(){a.currentTapIndex=0,a.currentMessageAuthor=null},Number(t.storage.delay));const S=ee.getChannel(E),u=$.getMessage(E,b);if(a.currentTapIndex===1&&(a.currentMessageAuthor=u.author.id),Object.assign(c,{taps:a.currentTapIndex,content:u?.content,authorId:u?.author?.id,isAuthor:u?.author?.id===x.getCurrentUser()?.id}),a.currentTapIndex!==2||a.currentMessageAuthor!==u.author.id)return a.doubleTapState({state:"INCOMPLETE",nativeEvent:c});if(clearTimeout(f),c?.authorId===x.getCurrentUser()?.id){if(t.storage.userEdit){const re=c.content;te.startEditMessage(E,b,re)}else H.createPendingReply({channel:S,message:u,shouldMention:!0});t.storage.keyboardPopup&&s.findByProps("openSystemKeyboard").openSystemKeyboardForLastCreatedInput();return}t.storage.reply&&(H.createPendingReply({channel:S,message:u,shouldMention:!0}),t.storage.keyboardPopup&&s.findByProps("openSystemKeyboard").openSystemKeyboardForLastCreatedInput()),a.currentTapIndex=0,a.currentMessageAuthor=null,a.doubleTapState({state:"COMPLETE",nativeEvent:c})});this.unpatchHandlers=function(){g&&g(),l&&l()}},onLoad(){k.logger.log("BetterChatGestures: storage.delay at ",t.storage.delay," with type ",typeof t.storage.delay),t.storage.tapUsernameMention??=e.ReactNative.Platform.select({android:!1,ios:!0,default:!0}),t.storage.reply??=!0,t.storage.userEdit??=!0,t.storage.delay??="300",t.storage.delay===""&&(t.storage.delay="300");const r=this,a=Object.getOwnPropertyDescriptor(C.prototype,"params").get;a&&Object.defineProperty(C.prototype,"params",{configurable:!0,get(){return this&&r.patchHandlers(this),a.call(this)}}),this.unpatchGetter=function(){a&&Object.defineProperty(C.prototype,"params",{configurable:!0,get:a})}},onUnload(){this.unpatchGetter?.(),this.unpatchHandlers?.()},settings:Z};return P.default=ae,Object.defineProperty(P,"__esModule",{value:!0}),P})({},vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.plugin,vendetta.ui.components,vendetta.storage,vendetta.ui.assets,vendetta.ui,vendetta);
