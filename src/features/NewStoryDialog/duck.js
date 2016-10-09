import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

import {loadExampleFile} from '../../helpers/fileLoader';
/*
 * Action names
 */

const SET_VISUALIZATION_TYPE = 'SET_VISUALIZATION_TYPE';
const SET_NEW_STORY_DATA = 'SET_NEW_STORY_DATA';

const FETCH_EXAMPLE_FILE = 'FETCH_EXAMPLE_FILE';

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
  status: undefined
};

function newStoryData(state = DEFAULT_NEW_STORY_DATA, action) {
  switch (action.type) {
    case SET_NEW_STORY_DATA:
      return {
        ...state,
        data: action.data
      };
    case FETCH_EXAMPLE_FILE:
      return {
        ...state,
        status: 'loading'
      };
    case FETCH_EXAMPLE_FILE + '_SUCCESS':
      return {
        ...state,
        status: 'loaded'
      };
    case FETCH_EXAMPLE_FILE + '_FAILURE':
      return {
        ...state,
        status: 'error'
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
  state.newStoryData.status;

export const selector = createStructuredSelector({
  activeVisualizationType,
  activeData,
  activeDataStatus
});

