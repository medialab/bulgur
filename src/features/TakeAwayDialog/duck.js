/**
 * This module exports logic-related elements for handling the export of presentations
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module bulgur/features/TakeAwayDialog
 */
import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import publishToGist from '../../helpers/gistExporter';
import publishToServer from '../../helpers/serverExporter';
import {persistentReducer} from 'redux-pouchdb';

import {RESET_APP} from '../Editor/duck';
/*
 * Action names
 */
const SET_TAKE_AWAY_TYPE = '§Bulgur/TakeAwayDialog/SET_TAKE_AWAY_TYPE';
const EXPORT_TO_GIST_STATUS = '§Bulgur/TakeAwayDialog/EXPORT_TO_GIST_STATUS';
const EXPORT_TO_SERVER_STATUS = '§Bulgur/TakeAwayDialog/EXPORT_TO_SERVER_STATUS';
export const EXPORT_TO_SERVER = '§Bulgur/TakeAwayDialog/EXPORT_TO_SERVER';
export const TAKE_AWAY = '§Bulgur/TakeAwayDialog/TAKE_AWAY';
export const EXPORT_TO_GIST = '§Bulgur/TakeAwayDialog/EXPORT_TO_GIST';
/*
 * Action creators
 */
/**
 * @param {object} htmlContent - the html content of the app to export to gist
 * @param {object} presentation - the presentation data to export to gist
 * @param {string} id - the id of the gist to which the presentation is stored (if it has already been exported once)
 */
export const exportToGist = (htmlContent, presentation, gistId) => ({
  type: EXPORT_TO_GIST,
  promise: (dispatch) => {
    return new Promise((resolve, reject) => {
      return publishToGist(htmlContent, presentation, dispatch, EXPORT_TO_GIST_STATUS, gistId)
              .then(resolve)
              .catch(reject);
    });
  }
});
/**
 * @param {object} presentation - the presentation to export to the distant server
 */
export const exportToServer = (presentation) => ({
  type: EXPORT_TO_SERVER,
  promise: (dispatch) => {
    return new Promise((resolve, reject) => {
      return publishToServer(presentation, dispatch, EXPORT_TO_SERVER_STATUS)
              .then(resolve)
              .catch(reject);
    });
  }
});
/*
 * Reducers
 */
const DEFAULT_TAKE_AWAY_UI_SETTINGS = {
    /**
     * The type of export being processed
     * @type {string}
     */
    takeAwayType: undefined,
    /**
     * The global status of gist export (ongoing, success, error)
     * @type {string}
     */
    takeAwayGistLogStatus: undefined,
    /**
     * The precise status of gist export
     * @type {string}
     */
    takeAwayGistLog: undefined,
    /**
     * The global status of server export (ongoing, success, error)
     * @type {string}
     */
    takeAwayServerLogStatus: undefined,
    /**
     * The precise status of server export
     * @type {string}
     */
    takeAwayServerLog: undefined,
};
/**
 * This redux reducer handles the modification of the ui state for take away choices
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 */
function takeAwayUi(state = DEFAULT_TAKE_AWAY_UI_SETTINGS, action) {
  switch (action.type) {
    case RESET_APP:
      return DEFAULT_TAKE_AWAY_UI_SETTINGS;
    case SET_TAKE_AWAY_TYPE:
      return {
        ...state,
        takeAwayType: action.takeAwayType
      };

    case EXPORT_TO_GIST_STATUS:
      return {
        ...state,
        takeAwayGistLog: action.message,
        takeAwayGistLogStatus: action.status
      };
    case EXPORT_TO_GIST + '_SUCCESS':
      return {
        ...state,
        takeAwayGistLog: 'your presentation is online on gist',
        takeAwayGistLogStatus: 'success'
      };
    case EXPORT_TO_GIST + '_FAIL':
      return {
        ...state,
        takeAwayGistLog: 'your presentation could not be uploaded on gist',
        takeAwayGistLogStatus: 'failure'
      };

    case EXPORT_TO_SERVER_STATUS:
      return {
        ...state,
        takeAwayServerLog: action.message,
        takeAwayServerLogStatus: action.status
      };
    case EXPORT_TO_SERVER + '_SUCCESS':
      return {
        ...state,
        takeAwayServerLog: 'your presentation is online on quinoa server',
        takeAwayServerLogStatus: 'success'
      };
    case EXPORT_TO_SERVER + '_FAIL':
      return {
        ...state,
        takeAwayServerLog: 'your presentation could not be uploaded on server',
        takeAwayServerLogStatus: 'failure'
      };
    default:
      return state;
  }
}
/**
 * The module exports a reducer connected to pouchdb thanks to redux-pouchdb
 */
export default persistentReducer(combineReducers({
  takeAwayUi
}), 'bulgur-takeaway');
/*
 * Selectors
 */
const takeAwayType = state => state.takeAwayUi &&
  state.takeAwayUi.takeAwayType;
const takeAwayGistLog = state => state.takeAwayUi &&
  state.takeAwayUi.takeAwayGistLog;
const takeAwayGistLogStatus = state => state.takeAwayUi &&
  state.takeAwayUi.takeAwayGistLogStatus;
const takeAwayServerLog = state => state.takeAwayUi &&
  state.takeAwayUi.takeAwayServerLog;
const takeAwayServerLogStatus = state => state.takeAwayUi &&
  state.takeAwayUi.takeAwayServerLogStatus;
/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  takeAwayGistLog,
  takeAwayGistLogStatus,
  takeAwayServerLog,
  takeAwayServerLogStatus,
  takeAwayType,
});

