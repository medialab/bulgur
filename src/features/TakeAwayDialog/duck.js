import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import publishGist from '../../helpers/gistExporter';

/*
 * Action names
 */
 import {RESET_APP} from '../Bulgur/duck';

const SET_TAKE_AWAY_TYPE = 'SET_TAKE_AWAY_TYPE';
const EXPORT_TO_GIST = 'EXPORT_TO_GIST';
const EXPORT_TO_GIST_STATUS = 'EXPORT_TO_GIST_STATUS';

export const TAKE_AWAY = 'TAKE_AWAY';

/*
 * Action creators
 */
export const exportToGithub = (content, gistId) => ({
  type: EXPORT_TO_GIST,
  promise: (dispatch) => {
    return new Promise((resolve, reject) => {
      return publishGist(content, dispatch, EXPORT_TO_GIST_STATUS, gistId)
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
    takeAwayLog: undefined,
    takeAwayLogStatus: undefined,
    gistUrl: undefined,
    gistId: undefined,
    blocksUrl: undefined
};
function takeAwayUi(state = DEFAULT_TAKE_AWAY_UI_SETTINGS, action) {
  switch (action.type) {
    case RESET_APP:
      return DEFAULT_TAKE_AWAY_UI_SETTINGS;
    // case SETUP_NEW_PRESENTATION:
    //   return {
    //     ...state,
    //     gistUrl: action.remoteUrls && action.remoteUrls.gistUrl,
    //     gistUri: action.remoteUrls && action.remoteUrls.gistUri,
    //     blocksUrl: action.remoteUrls && action.remoteUrls.blocksUrl
    //   };
    case SET_TAKE_AWAY_TYPE:
      return {
        ...state,
        takeAwayType: action.takeAwayType
      };
    case EXPORT_TO_GIST_STATUS:
      return {
        ...state,
        takeAwayLog: action.message,
        takeAwayLogStatus: action.status
      };
    case EXPORT_TO_GIST + '_SUCCESS':
      return {
        ...state,
        takeAwayLog: 'your presentation is online',
        takeAwayLogStatus: 'success',
        gistUrl: action.result.gistUrl,
        gistId: action.result.gistId,
        blocksUrl: action.result.blocksUrl
      };
    case EXPORT_TO_GIST + '_FAIL':
      return {
        ...state,
        takeAwayLog: 'your presentation could not be uploaded',
        takeAwayLogStatus: 'failure'
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

const takeAwayLog = state => state.takeAwayUi &&
  state.takeAwayUi.takeAwayLog;

const takeAwayLogStatus = state => state.takeAwayUi &&
  state.takeAwayUi.takeAwayLogStatus;

const gistUrl = state => state.takeAwayUi &&
  state.takeAwayUi.gistUrl;

const blocksUrl = state => state.takeAwayUi &&
  state.takeAwayUi.blocksUrl;

const gistId = state => state.takeAwayUi &&
  state.takeAwayUi.gistId;

export const selector = createStructuredSelector({
  takeAwayType,
  takeAwayLog,
  takeAwayLogStatus,
  gistUrl,
  blocksUrl,
  gistId
});

