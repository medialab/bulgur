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
export const setSettingsVisibility = (visible) => ({
  type: SET_SETTINGS_VISIBILITY,
  visible,
});

export const setPresentationCss = (id, css) => ({
  type: SET_PRESENTATION_CSS,
  id,
  css,
});

export const setPresentationTemplate = (id, template) => ({
  type: SET_PRESENTATION_TEMPLATE,
  id,
  template,
});

export const setPresentationSettingOption = (id, field, value) => ({
  type: SET_PRESENTATION_SETTING_OPTION,
  id,
  field,
  value,
});

/*
 * Reducers
 */
const SETTINGS_MANAGER_UI_DEFAULT_STATE = {
  settingsVisible: false
};
function settingsManagerUi (state = SETTINGS_MANAGER_UI_DEFAULT_STATE, action) {
  switch (action.type) {
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
