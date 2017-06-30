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

import {
  RESET_APP,
  OPEN_TAKE_AWAY_MODAL,
  CLOSE_TAKE_AWAY_MODAL
} from '../PresentationEditor/duck';
/*
 * Action names
 */
const SET_TAKE_AWAY_TYPE = '§Bulgur/TakeAwayDialog/SET_TAKE_AWAY_TYPE';
const EXPORT_TO_GIST_STATUS = '§Bulgur/TakeAwayDialog/EXPORT_TO_GIST_STATUS';
const EXPORT_TO_SERVER_STATUS = '§Bulgur/TakeAwayDialog/EXPORT_TO_SERVER_STATUS';
const SET_BUNDLE_HTML_STATUS = '§Bulgur/TakeAwayDialog/SET_BUNDLE_HTML_STATUS';
export const EXPORT_TO_SERVER = '§Bulgur/TakeAwayDialog/EXPORT_TO_SERVER';
export const TAKE_AWAY = '§Bulgur/TakeAwayDialog/TAKE_AWAY';
export const EXPORT_TO_GIST = '§Bulgur/TakeAwayDialog/EXPORT_TO_GIST';
/*
 * Action creators
 */
/**
 * @param {string} status - the status of the html bundling process to display
 * @param {string} log - the log message of the html bundling process to display
 */
export const setBundleHtmlStatus = (status, log) => dispatch => {
  // remove message after a while if it is an "end-of-operation" status
  if (status === 'failure' || status === 'success') {
    setTimeout(() => {
      dispatch({
        type: SET_BUNDLE_HTML_STATUS,
        status: undefined,
        log: undefined
      });
    }, 5000);
  }
  dispatch({
    type: SET_BUNDLE_HTML_STATUS,
    status,
    log
  });
};
/**
 * @param {string} takeAwayType - the type to set for the interface
 */
export const setTakeAwayType = (takeAwayType) => ({
  type: SET_TAKE_AWAY_TYPE,
  takeAwayType
});
/**
 * @param {string} status - the status of the gist export process to display
 * @param {string} log - the log message of the gist export process to display
 */
export const setExportToGistStatus = (status, log) => dispatch => {
  if (status === 'failure' || status === 'success') {
    setTimeout(() => {
      dispatch({
        type: EXPORT_TO_GIST_STATUS,
        status: undefined,
        log: undefined
      });
    }, 5000);
  }
  dispatch({
    type: EXPORT_TO_GIST_STATUS,
    status,
    log
  });
};
/**
 * @param {string} status - the status of the server export process to display
 * @param {string} log - the log message of the server export process to display
 */
export const setExportToServerStatus = (status, log) => dispatch => {
  if (status === 'failure' || status === 'success') {
    setTimeout(() => {
      dispatch({
        type: EXPORT_TO_SERVER_STATUS,
        status: undefined,
        log: undefined
      });
    }, 5000);
  }
  dispatch({
    type: EXPORT_TO_SERVER_STATUS,
    status,
    log
  });
};
/**
 * @param {object} htmlContent - the html content of the app to export to gist
 * @param {object} presentation - the presentation data to export to gist
 * @param {string} id - the id of the gist to which the presentation is stored (if it has already been exported once)
 */
export const exportToGist = (htmlContent, presentation, gistId) => ({
  type: EXPORT_TO_GIST,
  promise: (dispatch) => {
    dispatch({
      type: EXPORT_TO_GIST_STATUS,
      takeAwayGistLog: 'connecting to github',
      takeAwayGistLogStatus: 'processing'
    });
    return new Promise((resolve, reject) => {
      return publishToGist(htmlContent, presentation, dispatch, EXPORT_TO_GIST_STATUS, gistId)
              .then((d) => {
                resolve(d);
                // remove message after a while
                setTimeout(() =>
                  dispatch({
                    type: EXPORT_TO_GIST_STATUS,
                    takeAwayGistLog: undefined,
                    takeAwayGistLogStatus: undefined
                  }), 5000);
              })
              .catch((e) => {
                reject(e);
                // remove message after a while
                setTimeout(() =>
                  dispatch({
                    type: EXPORT_TO_GIST_STATUS,
                    takeAwayGistLog: undefined,
                    takeAwayGistLogStatus: undefined
                  }), 5000);
              });
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
              .then((d) => {
                resolve(d);
                // remove message after a while
                setTimeout(() =>
                  dispatch({
                    type: EXPORT_TO_SERVER_STATUS,
                    takeAwayGistLog: undefined,
                    takeAwayGistLogStatus: undefined
                  }), 5000);
              })
              .catch((e) => {
                reject(e);
                // remove message after a while
                setTimeout(() =>
                  dispatch({
                    type: EXPORT_TO_SERVER_STATUS,
                    takeAwayGistLog: undefined,
                    takeAwayGistLogStatus: undefined
                  }), 5000);
              });
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
     * The global status of gist export (processing, success, error)
     * @type {string}
     */
    takeAwayGistLogStatus: undefined,
    /**
     * The precise status of gist export
     * @type {string}
     */
    takeAwayGistLog: undefined,
    /**
     * The global status of server export (processing, success, error)
     * @type {string}
     */
    takeAwayServerLogStatus: undefined,
    /**
     * The precise status of server export
     * @type {string}
     */
    takeAwayServerLog: undefined,
    /**
     * The global status of html bundling
     * @type {string}
     */
    bundleToHtmlLogStatus: undefined,
    /**
     * The precise status of html bundling
     * @type {string}
     */
    bundleToHtmlLog: undefined,
};
/**
 * This redux reducer handles the modification of the ui state for take away choices
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 */
function takeAwayUi(state = DEFAULT_TAKE_AWAY_UI_SETTINGS, action) {
  switch (action.type) {
    case OPEN_TAKE_AWAY_MODAL:
    case CLOSE_TAKE_AWAY_MODAL:
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
        takeAwayGistLog: action.log,
        takeAwayGistLogStatus: action.status
      };
    case EXPORT_TO_GIST + '_SUCCESS':
      return {
        ...state,
        takeAwayGistLog: 'your presentation is synchronized with gist',
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
        takeAwayServerLog: action.log,
        takeAwayServerLogStatus: action.status
      };
    case EXPORT_TO_SERVER + '_SUCCESS':
      return {
        ...state,
        takeAwayServerLog: 'your presentation is now synchronized with the forccast server',
        takeAwayServerLogStatus: 'success'
      };
    case EXPORT_TO_SERVER + '_FAIL':
      return {
        ...state,
        takeAwayServerLog: 'your presentation could not be uploaded on server',
        takeAwayServerLogStatus: 'failure'
      };
    case SET_BUNDLE_HTML_STATUS:
      return {
        ...state,
        bundleToHtmlLog: action.log,
        bundleToHtmlLogStatus: action.status
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
const bundleToHtmlLog = state => state.takeAwayUi &&
  state.takeAwayUi.bundleToHtmlLog;
const bundleToHtmlLogStatus = state => state.takeAwayUi &&
  state.takeAwayUi.bundleToHtmlLogStatus;
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
  bundleToHtmlLog,
  bundleToHtmlLogStatus
});

