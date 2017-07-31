/**
 * This module exports logic-related elements for the fonio presentation settings manager feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module fonio/features/PresentationSettingsManager
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {persistentReducer} from 'redux-pouchdb';


/**
 * ACTION NAMES
 */
const SET_SETTINGS_VISIBILITY = '§Fonio/PresentationSettingsManager/SET_SETTINGS_VISIBILITY';
export const SET_STORY_CSS = '§Fonio/PresentationSettingsManager/SET_STORY_CSS';
export const SET_PRESENTATION_SETTING_OPTION = '§Fonio/PresentationSettingsManager/SET_PRESENTATION_SETTING_OPTION';
export const SET_PRESENTATION_CSS = '§Fonio/PresentationSettingsManager/SET_PRESENTATION_CSS';
export const SET_PRESENTATION_TEMPLATE = '§Fonio/PresentationSettingsManager/SET_PRESENTATION_TEMPLATE';

/*
 * Action creators
 */

/**
 * Sets the visibility of the settings pannel
 * @param {boolean} visible - whether to set to visible or hidden 
 * @return {object} action - the redux action to dispatch
 */
export const setSettingsVisibility = (visible) => ({
  type: SET_SETTINGS_VISIBILITY,
  visible,
});

/**
 * Sets new custom css code for a presentation
 * @param {string} id - id of the presentation to update
 * @param {string} css - new css code to set 
 * @return {object} action - the redux action to dispatch
 */
export const setPresentationCss = (id, css) => ({
  type: SET_PRESENTATION_CSS,
  id,
  css,
});

/**
 * Sets the template of a given presentation
 * @param {string} id - id of the presentation to update
 * @param {string} template - name of the template to set for the presentation
 * @return {object} action - the redux action to dispatch
 */
export const setPresentationTemplate = (id, template) => ({
  type: SET_PRESENTATION_TEMPLATE,
  id,
  template,
});

/**
 * Sets new setting options (available options are template-dependent)
 * @param {string} id - id of the presentation to update
 * @param {string} field - field key to change
 * @param {string|number|boolean} value - value to set
 * @return {object} action - the redux action to dispatch
 */
export const setPresentationSettingOption = (id, field, value) => ({
  type: SET_PRESENTATION_SETTING_OPTION,
  id,
  field,
  value,
});

/*
 * Reducers
 */


/**
 * Default state of the settings manager ui
 */
const SETTINGS_MANAGER_UI_DEFAULT_STATE = {

  /**
   * Whether the setting pannel is visible
   */
  settingsVisible: false
};

/**
 * This redux reducer handles the modification of the data state for the presentation settings view
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function settingsManagerUi (state = SETTINGS_MANAGER_UI_DEFAULT_STATE, action) {
  switch (action.type) {
    // the settings manager is shown or hidden
    case SET_SETTINGS_VISIBILITY:
      return {
        ...state,
        settingsVisible: action.visible,
      };
    default:
      return state;
  }
}


/**
 * The module exports a reducer connected to pouchdb thanks to redux-pouchdb
 */
export default combineReducers({
  settingsManagerUi: persistentReducer(settingsManagerUi, 'fonio-settings-manager-ui')
});

/*
 * Selectors
 */
const settingsVisible = state => state.settingsManagerUi.settingsVisible;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  settingsVisible,
});
