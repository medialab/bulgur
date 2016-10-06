import { combineReducers } from 'redux';
import { createStructuredSelector } from 'reselect';

/*
 * Action names
 */

const SET_VISUALIZATION_TYPE = 'SET_VISUALIZATION_TYPE';
const RESET_NEW_STORY_SETTINGS = 'RESET_NEW_STORY_SETTINGS';

/*
 * Action creators
 */

export const setVisualizationType = (visualizationType) => ({
  type: SET_VISUALIZATION_TYPE,
  visualizationType
});

export const resetNewStorySettings = () => ({
  type: RESET_NEW_STORY_SETTINGS
});

/*
 * Default states
 */

const DEFAULT_NEW_STORY_SETTINGS = {
    visualizationType: undefined
};

/*
 * Reducers
 */

function newStorySettings(state=DEFAULT_NEW_STORY_SETTINGS, action) {
  switch (action.type) {
    case SET_VISUALIZATION_TYPE:
      return {
        ...state,
        visualizationType: action.visualizationType
      }
    case RESET_NEW_STORY_SETTINGS:
      return DEFAULT_NEW_STORY_SETTINGS;
    default:
      return state;
  }
}

export default combineReducers({
  newStorySettings
});

/*
 * Selectors
 */

const activeVisualizationType = state => state.newStorySettings &&
  state.newStorySettings.visualizationType;

export const selector = createStructuredSelector({
  activeVisualizationType
});



