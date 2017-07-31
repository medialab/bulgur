/**
 * This module provides helpers for translation management
 * @module bulgur/utils/translateUtils
 */


/**
 * Automatically functions a translate function
 * @param {function} translateFn - the translate function to namespace
 * @param {string} nameSpace - the namespace to use
 * @return {function} translateFnBis - a new function using the namespace
 */
export const translateNameSpacer = (translateFn, nameSpace) => {
  return function(key, props) {
    return translateFn(nameSpace + '.' + key, props);
  };
};
