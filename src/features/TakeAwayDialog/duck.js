import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import publishGist from '../../helpers/githubExporter';

/*
 * Action names
 */

const SET_TAKE_AWAY_TYPE = 'SET_TAKE_AWAY_TYPE';
const EXPORT_TO_GITHUB = 'EXPORT_TO_GITHUB';
const EXPORT_TO_GITHUB_STATUS = 'EXPORT_TO_GITHUB_STATUS';

export const TAKE_AWAY = 'TAKE_AWAY';

/*
 * Action creators
 */
export const exportToGithub = (content) => ({
  type: EXPORT_TO_GITHUB,
  promise: (dispatch) => {
    return new Promise((resolve, reject) => {
      return publishGist(content, dispatch, EXPORT_TO_GITHUB_STATUS)
              .then(resolve)
              .catch(reject);
    });
  }
});

/*
 * Reducers
 */

const DEFAULT_TAKE_AWAY_SETTINGS = {
    takeAwayType: undefined,
    takeAwayLog: undefined
};
function ui(state = DEFAULT_TAKE_AWAY_SETTINGS, action) {
  switch (action.type) {
    case SET_TAKE_AWAY_TYPE:
      return {
        ...state,
        takeAwayType: action.takeAwayType
      };
    case EXPORT_TO_GITHUB_STATUS:
      return {
        ...state,
        takeAwayLog: action.message,
        takeAwayLogStatus: action.status
      };
    case EXPORT_TO_GITHUB + '_SUCCESS':
      window.open(action.result.blocksUrl, '_blank');
      return {
        ...state,
        takeAwayLog: 'publication was successful !',
        takeAwayLogStatus: 'success',
        gistUrl: action.result.gistUrl,
        blocksUrl: action.result.blocksUrl
      };
    default:
      return state;
  }
}

export default combineReducers({
  ui
});

/*
 * Selectors
 */

const takeAwayType = state => state.ui &&
  state.ui.takeAwayType;

const takeAwayLog = state => state.ui &&
  state.ui.takeAwayLog;

const takeAwayLogStatus = state => state.ui &&
  state.ui.takeAwayLogStatus;

const gistUrl = state => state.ui &&
  state.ui.gistUrl;

const blocksUrl = state => state.ui &&
  state.ui.blocksUrl;

export const selector = createStructuredSelector({
  takeAwayType,
  takeAwayLog,
  takeAwayLogStatus,
  gistUrl,
  blocksUrl
});

