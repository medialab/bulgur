import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

import {SETUP_NEW_STORY} from '../NewStoryDialog/duck';

/*
 * Action names
 */

const OPEN_NEW_STORY_MODAL = 'OPEN_NEW_STORY_MODAL';
const CLOSE_NEW_STORY_MODAL = 'CLOSE_NEW_STORY_MODAL';
const VIEW_EQUALS_SLIDE_PARAMETERS = 'VIEW_EQUALS_SLIDE_PARAMETERS';
const UPDATE_VIEW = 'UPDATE_VIEW';

/*
 * Action creators
 */

export const openNewStoryModal = () => ({
  type: OPEN_NEW_STORY_MODAL
});

export const closeNewStoryModal = () => ({
  type: CLOSE_NEW_STORY_MODAL
});

export const updateView = (parameters) => ({
  type: UPDATE_VIEW,
  parameters
});

export const viewEqualsSlideParameters = (payload) => ({
  type: VIEW_EQUALS_SLIDE_PARAMETERS,
  payload
});

/*
 * Reducers
 */

const VISUALIZATION_DEFAULT_STATE = {
    data: undefined,
    dataMap: undefined,
    visualizationType: undefined,
    parameters: {}
};

function visualization(state = VISUALIZATION_DEFAULT_STATE, action) {
  switch (action.type) {
    case SETUP_NEW_STORY:
      // consume original data points against dataMap
      const finalData = action.data.map(point => {
        return action.dataMap.reduce((finalObject, thatModel) => {
          // map data mapped field to visualization dimension id
          if (point[thatModel.mappedField]) {
            finalObject[thatModel.id] = point[thatModel.mappedField];
            // console.log(thatModel.id, finalObject[thatModel.id]);
          }
          return finalObject;
        }, {});
      });
      return {
        ...state,
        data: finalData,
        visualizationType: action.visualizationType
      };
    case UPDATE_VIEW:
      return {
        ...state,
        viewParameters: action.parameters
      };
    default:
      return state;
  }
}

const GLOBAL_UI_DEFAULT_STATE = {
    newStoryModalOpen: false,
    viewEqualsSlideParameters: false
};
function globalUi(state = GLOBAL_UI_DEFAULT_STATE, action) {
  switch (action.type) {
    case OPEN_NEW_STORY_MODAL:
      return {
        ...state,
        newStoryModalOpen: true
      };
    case CLOSE_NEW_STORY_MODAL:
      return {
        ...state,
        newStoryModalOpen: false
      };
    case VIEW_EQUALS_SLIDE_PARAMETERS:
      return {
        ...state,
        viewEqualsSlideParameters: action.payload
      };
    default:
      return state;
  }
}

export default combineReducers({
  globalUi,
  visualization
});

/*
 * Selectors
 */

const isNewStoryModalOpen = state => state.globalUi.newStoryModalOpen;

const doesViewEqualsSlideParameters = state => state.globalUi.viewEqualsSlideParameters;

const visualizationData = state => state.visualization;

const activeViewParameters = state => state.visualization.viewParameters;

export const selector = createStructuredSelector({
  isNewStoryModalOpen,
  visualizationData,
  doesViewEqualsSlideParameters,
  activeViewParameters
});
