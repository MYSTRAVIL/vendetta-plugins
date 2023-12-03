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

const { FormRow, FormDivider, FormInput, FormText } = Forms;
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

   // const [hideMessagesIndex, setHideMessagesIndex] = React.useState(storage.hideMessagesIndex);

   return <ScrollView>
      <Credits 
         name={manifest.name}
         authors={manifest.authors}
      /> 
      <View style={{marginTop: 20}}>
         <SectionWrapper label='Preferences'>
            <View style={[styles.container]}>
               <FormInput
                  value={storage.hideMessagesIndex}
                  onChange={v => {
                     storage.hideMessagesIndex = v
                  }}
                  placeholder={"2"}
                  title='Position Index'
               />
               <FormDivider />
               <FormText style={{ padding: 10 }}>
                  The index at which the "Hide Message" Button will be inserted. 2 by default.
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