/**
 * Main Miscellaneous Modules
 * @param shadow: Native shadow implementation so that it can be changed from a single place.
 * @param displayToast: Opens an @arg Toast which informs the user that @arg {any} something has been copied to clipboard or @arg {opens} tooltip
 */
import Miscellaneous from './misc';

/**
 * @param Icons: List of icons used throughout PronounDB, all in a single Object to allow for changing easily.
 */
import Icons from "./icons";

/**
 * @param Constants: Constant information used throughout the plugin
 */
import Constants from "./info"


/**
 * Finally, export all of these functions. Other components in the code will be able to access these methods by accessing @arg index.ts afterwards
 */
export {
    Miscellaneous,
    Icons,
    Constants
};