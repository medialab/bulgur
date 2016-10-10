import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

import {loadExampleFile} from '../../helpers/fileLoader';
/*
 * Action names
 */

const SET_VISUALIZATION_TYPE = 'SET_VISUALIZATION_TYPE';
const SET_NEW_STORY_DATA = 'SET_NEW_STORY_DATA';

const FETCH_EXAMPLE_FILE = 'FETCH_EXAMPLE_FILE';

const FETCH_USER_FILE = 'FETCH_USER_FILE';
const FETCH_USER_FILE_SUCCESS = 'FETCH_USER_FILE_SUCCESS';
const FETCH_USER_FILE_FAILURE = 'FETCH_USER_FILE_FAILURE';

const SHOW_INVALID_FILE_TYPE = 'SHOW_INVALID_FILE_TYPE';
const HIDE_INVALID_FILE_TYPE = 'HIDE_INVALID_FILE_TYPE';


const RESET_NEW_STORY_SETTINGS = 'RESET_NEW_STORY_SETTINGS';

/*
 * Action creators
 */

export const fetchExampleFile = (fileName) => ({
  type: FETCH_EXAMPLE_FILE,
  promise: (/*dispatch, getState*/) => {
    return new Promise((resolve, reject) => {
      try {
        const data = loadExampleFile(fileName);
        resolve(data);
      }
      catch (e) {
        return reject(e);
      }
    });
  }
});

export const setVisualizationType = (visualizationType) => ({
  type: SET_VISUALIZATION_TYPE,
  visualizationType
});

export const resetNewStorySettings = () => ({
  type: RESET_NEW_STORY_SETTINGS
});

export const fetchUserFile = () => ({
  type: FETCH_USER_FILE
});
export const fetchUserFileSuccess = (result) => ({
  type: FETCH_USER_FILE_SUCCESS,
  result
});
export const fetchUserFileFailure = (error) => ({
  type: FETCH_USER_FILE_FAILURE,
  error
});
export const showInvalidFileTypeWarning = () => ({
  type: SHOW_INVALID_FILE_TYPE
});
export const hideInvalidFileTypeWarning = () => ({
  type: HIDE_INVALID_FILE_TYPE
});


/*
 * Reducers
 */

const DEFAULT_NEW_STORY_SETTINGS = {
    visualizationType: undefined
};
function newStorySettings(state = DEFAULT_NEW_STORY_SETTINGS, action) {
  switch (action.type) {
    case SET_VISUALIZATION_TYPE:
      return {
        ...state,
        visualizationType: action.visualizationType
      };
    case RESET_NEW_STORY_SETTINGS:
      return DEFAULT_NEW_STORY_SETTINGS;
    default:
      return state;
  }
}

const DEFAULT_NEW_STORY_DATA = {
  rawData: undefined,
  loadingStatus: undefined,
  invalidFileType: undefined
};

function newStoryData(state = DEFAULT_NEW_STORY_DATA, action) {
  switch (action.type) {
    case SET_NEW_STORY_DATA:
      return {
        ...state,
        data: action.data
      };
    case FETCH_EXAMPLE_FILE:
    case FETCH_USER_FILE:
      return {
        ...state,
        loadingStatus: 'loading'
      };
    case FETCH_EXAMPLE_FILE + '_SUCCESS':
    case FETCH_USER_FILE + '_SUCCESS':
      return {
        ...state,
        loadingStatus: 'loaded'
      };
    case FETCH_EXAMPLE_FILE + '_FAILURE':
    case FETCH_USER_FILE + '_FAILURE':
      return {
        ...state,
        loadingStatus: 'error'
      };
    case SHOW_INVALID_FILE_TYPE:
      return {
        ...state,
        invalidFileType: true
      };
    case HIDE_INVALID_FILE_TYPE:
      return {
        ...state,
        invalidFileType: undefined,
        loadingStatus: undefined
      };
    case RESET_NEW_STORY_SETTINGS:
      return DEFAULT_NEW_STORY_DATA;
    default:
      return state;
  }
}

export default combineReducers({
  newStorySettings,
  newStoryData
});

/*
 * Selectors
 */

const activeVisualizationType = state => state.newStorySettings &&
  state.newStorySettings.visualizationType;

const activeData = state => state.newStoryData &&
  state.newStoryData.data;

const activeDataStatus = state => state.newStoryData &&
  state.newStoryData.loadingStatus;

const invalidFileType = state => state.newStoryData &&
  state.newStoryData.invalidFileType;

export const selector = createStructuredSelector({
  activeVisualizationType,
  activeData,
  activeDataStatus,
  invalidFileType
});

