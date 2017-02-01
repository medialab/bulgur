import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import publishToGist from '../../helpers/gistExporter';
import publishToServer from '../../helpers/serverExporter';

/*
 * Action names
 */
 import {RESET_APP} from '../Bulgur/duck';

const SET_TAKE_AWAY_TYPE = 'SET_TAKE_AWAY_TYPE';
export const EXPORT_TO_GIST = 'EXPORT_TO_GIST';
const EXPORT_TO_GIST_STATUS = 'EXPORT_TO_GIST_STATUS';

export const EXPORT_TO_SERVER = 'EXPORT_TO_SERVER';
const EXPORT_TO_SERVER_STATUS = 'EXPORT_TO_SERVER_STATUS';

export const TAKE_AWAY = 'TAKE_AWAY';

/*
 * Action creators
 */
export const exportToGist = (content, gistId) => ({
  type: EXPORT_TO_GIST,
  promise: (dispatch) => {
    return new Promise((resolve, reject) => {
      return publishToGist(content, dispatch, EXPORT_TO_GIST_STATUS, gistId)
              .then(resolve)
              .catch(reject);
    });
  }
});

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
    takeAwayType: undefined,
    takeAwayGistLog: undefined,
    takeAwayGistLogStatus: undefined,
    takeAwayServerLog: undefined,
    takeAwayServerLogStatus: undefined
};
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

export default combineReducers({
  takeAwayUi
});

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


export const selector = createStructuredSelector({
  takeAwayType,
  takeAwayGistLog,
  takeAwayGistLogStatus,
  takeAwayServerLog,
  takeAwayServerLogStatus
});

