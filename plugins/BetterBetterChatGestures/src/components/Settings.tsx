import { stylesheet, constants, React } from '@vendetta/metro/common';
import { manifest } from '@vendetta/plugin';
import { General, Forms } from "@vendetta/ui/components";
import { storage } from '@vendetta/plugin';
import { useProxy } from '@vendetta/storage';
import Credits from "./Dependent/Credits";
import SectionWrapper from "./Dependent/SectionWrapper";
import { Icons, Miscellaneous, Constants } from "../common";
import { findByProps } from '@vendetta/metro';
import { semanticColors } from '@vendetta/ui';
import { ReactNative } from '@vendetta/metro/common';
import { getDebugInfo } from '@vendetta/debug';

const { FormRow, FormSwitch, FormDivider, FormInput, FormText } = Forms;
const { ScrollView, View, Text } = General;

const Router = findByProps('transitionToGuild', "openURL")

const styles = stylesheet.createThemedStyleSheet({
   icon: {
      color: semanticColors.INTERACTIVE_NORMAL
   },
   item: {
      color: semanticColors.TEXT_MUTED,
      fontFamily: constants.Fonts.PRIMARY_MEDIUM
   },
   container: {
      width: '90%',
      marginLeft: '5%',
      borderRadius: 10,
      backgroundColor: semanticColors.BACKGROUND_MOBILE_SECONDARY,
      ...Miscellaneous.shadow()
   },
   subheaderText: {
      color: semanticColors.HEADER_SECONDARY,
      textAlign: 'center',
      margin: 10,
      marginBottom: 50,
      letterSpacing: 0.25,
      fontFamily: constants.Fonts.PRIMARY_BOLD,
      fontSize: 14
   },
   image: {
      width: "100%",
      maxWidth: 350,
      borderRadius: 10
   }
});

/**
 * Main @arg Settings page implementation
 * @param manifest: The main plugin manifest passed donw as a prop.
 */
export default () => {
   useProxy(storage);

   // const [tapUsernameMention, setTapUsernameMention] = React.useState(storage.tapUsernameMention);
   // const [reply, setReply] = React.useState(storage.reply);
   // const [userEdit, setUserEdit] = React.useState(storage.userEdit);
   // const [delay, setDelay] = React.useState(storage.delay);
   const isAndroid = ReactNative.Platform.OS === "android"

   return <ScrollView>
      <Credits 
         name={manifest.name}
         authors={manifest.authors}
      /> 
      <View style={{marginTop: 20}}>
         <SectionWrapper label='Preferences'>
            <View style={[styles.container]}>
               <FormRow
                  label="Tap Username to Mention"
                  subLabel={`Allows you to tap on a username to mention them instead of opening their profile.${isAndroid ? "This option is disabled on Android." : ""}`}
                  onLongPress={() => Miscellaneous.displayToast(`By default, Discord opens a profile when tapping on a username in chat. With this, it now mentions them, like on Android.`, 'tooltip')}
                  leading={<FormRow.Icon style={styles.icon} source={storage.tapUsernameMention ? Icons.Forum : Icons.Failed} />}
                  trailing={<FormSwitch
                     value={isAndroid ? false : storage.tapUsernameMention}
                     onValueChange={() => {
                        if (isAndroid) return;
                        storage.tapUsernameMention = !storage.tapUsernameMention;
                     }}
                  />}
                  disabled={isAndroid}
               />
               <FormDivider />
               <FormRow
                  label={`Double Tap To Reply`}
                  subLabel={`Allows you to tap double tap on any messages to reply to them.`}
                  onLongPress={() => Miscellaneous.displayToast(`When double tapping on any messages, you can now reply to them!`, 'tooltip')}
                  leading={<FormRow.Icon style={styles.icon} source={storage.reply ? Icons.Settings.Reply : Icons.Failed} />}
                  trailing={<FormSwitch
                     value={storage.reply}
                     onValueChange={() => {
                        storage.reply = !storage.reply;
                     }}
                  />}
               />
               <FormDivider />
               <FormRow
                  label={`Open Keyboard Automatically`}
                  subLabel={`Opens the Keyboard when you reply to or edit a message with a double tap.`}
                  onLongPress={() => Miscellaneous.displayToast(`Opens the Keyboard when you reply to or edit a message with a double tap.`, 'tooltip')}
                  leading={<FormRow.Icon style={styles.icon} source={storage.keyboardPopup ? Icons.Settings.Keyboard : Icons.Failed} />}
                  trailing={<FormSwitch
                     value={storage.keyboardPopup}
                     onValueChange={() => {
                        storage.keyboardPopup = !storage.keyboardPopup;
                     }}
                  />}
               />
               <FormDivider />
               <FormRow
                  label={`${storage.userEdit ? "Editing" : "Replying to"} your own messages`}
                  subLabel={`Allows you to tap double tap on any of your own messages to ${storage.userEdit ? "edit" : "reply to"} them.`}
                  onLongPress={() => Miscellaneous.displayToast(`When double tapping on any of your own messages, you can now ${storage.userEdit ? "start an edit" : "reply to them"}!`, 'tooltip')}
                  leading={<FormRow.Icon style={styles.icon} source={storage.userEdit ? Icons.Settings.Edit : Icons.Settings.Reply} />}
                  trailing={<FormSwitch
                     value={storage.userEdit}
                     onValueChange={() => {
                        storage.userEdit = !storage.userEdit;
                     }}
                  />}
               />
               <FormDivider />
               <FormInput
                  value={storage.delay}
                  onChange={v => {
                     storage.delay = v
                  }}
                  placeholder={"300"}
                  title='Maximum Delay'
               />
               <FormDivider />
               <FormText style={{ padding: 10 }}>
                  The maximum delay between taps until the double tap event is cancelled. This is 300ms by default.
               </FormText>
            </View>
         </SectionWrapper>
         <SectionWrapper label='Source'>
            <View style={styles.container}>
               <FormRow
                  label="Source"
                  subLabel={`Open the repository of ${manifest.name} externally.`}
                  onLongPress={() => Miscellaneous.displayToast(`Opens the repository of ${manifest.name} on GitHub in an external page to view any source code of the plugin.`, 'tooltip')}
                  leading={<FormRow.Icon style={styles.icon} source={Icons.Open} />}
                  trailing={() => <FormRow.Arrow />}
                  onPress={() => Router.openURL(Constants.plugin.source)}
               />
            </View>
         </SectionWrapper>
      </View>
      <Text style={styles.subheaderText}>
         {`Build: (${manifest.hash.substring(0, 8)})`}
      </Text>
   </ScrollView>
}
