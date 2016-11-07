import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import equals from 'shallow-equals';

import {SETUP_NEW_STORY} from '../NewStoryDialog/duck';

import {createDefaultSlideParameters} from '../../models/visualizationTypes';

/*
 * Action names
 */

const OPEN_NEW_STORY_MODAL = 'OPEN_NEW_STORY_MODAL';
const CLOSE_NEW_STORY_MODAL = 'CLOSE_NEW_STORY_MODAL';
const OPEN_TAKE_AWAY_MODAL = 'OPEN_TAKE_AWAY_MODAL';
const CLOSE_TAKE_AWAY_MODAL = 'CLOSE_TAKE_AWAY_MODAL';
const VIEW_EQUALS_SLIDE_PARAMETERS = 'VIEW_EQUALS_SLIDE_PARAMETERS';
const UPDATE_VIEW = 'UPDATE_VIEW';
const SET_QUINOA_SLIDE_PARAMETERS = 'SET_QUINOA_SLIDE_PARAMETERS';
export const RESET_APP = 'RESET_APP';

/*
 * Action creators
 */

export const openNewStoryModal = () => ({
  type: OPEN_NEW_STORY_MODAL
});

export const closeNewStoryModal = () => ({
  type: CLOSE_NEW_STORY_MODAL
});

export const openTakeAwayModal = () => ({
  type: OPEN_TAKE_AWAY_MODAL
});

export const closeTakeAwayModal = () => ({
  type: CLOSE_TAKE_AWAY_MODAL
});

export const updateView = (parameters) => ({
  type: UPDATE_VIEW,
  parameters
});

export const viewEqualsSlideParameters = (payload) => ({
  type: VIEW_EQUALS_SLIDE_PARAMETERS,
  payload
});

export const setQuinoaSlideParameters = (parameters) => ({
  type: SET_QUINOA_SLIDE_PARAMETERS,
  parameters
});

export const resetApp = () => ({
  type: RESET_APP
});

/*
 * Reducers
 */

const VISUALIZATION_DEFAULT_STATE = {
    data: undefined,
    dataMap: undefined,
    visualizationType: undefined,
    viewParameters: {},
    quinoaSlideParameters: {},
    readOnly: false,
    viewEqualsSlideParameters: false
};

function visualization(state = VISUALIZATION_DEFAULT_STATE, action) {
  let isSync;
  switch (action.type) {
    case RESET_APP:
      return VISUALIZATION_DEFAULT_STATE;
    case SETUP_NEW_STORY:
      // consume original data points against dataMap
      const finalData = (action.dataMap && action.dataMap.length) ? action.data.map(point => {
        return action.dataMap.reduce((finalObject, thatModel) => {
          // map data mapped field to visualization dimension id
          if (point[thatModel.mappedField]) {
            finalObject[thatModel.id] = point[thatModel.mappedField];
          }
          return finalObject;
        }, {});
      }) : action.data;
      return {
        ...state,
        data: finalData,
        visualizationType: action.visualizationType,
        viewParameters: createDefaultSlideParameters(action.visualizationType)
      };
    case UPDATE_VIEW:
      isSync = equals(state.quinoaSlideParameters, action.parameters);
      return {
        ...state,
        viewParameters: action.parameters,
        viewEqualsSlideParameters: isSync
      };
    case SET_QUINOA_SLIDE_PARAMETERS:
      isSync = equals(state.viewParameters, action.parameters);
      return {
        ...state,
        quinoaSlideParameters: action.parameters,
        viewEqualsSlideParameters: true
      };
    default:
      return state;
  }
}

const GLOBAL_UI_DEFAULT_STATE = {
    newStoryModalOpen: false,
    takeAwayModalOpen: false
};
function globalUi(state = GLOBAL_UI_DEFAULT_STATE, action) {
  switch (action.type) {
    case RESET_APP:
      return GLOBAL_UI_DEFAULT_STATE;
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
    case OPEN_TAKE_AWAY_MODAL:
      return {
        ...state,
        takeAwayModalOpen: true
      };
    case CLOSE_TAKE_AWAY_MODAL:
      return {
        ...state,
        takeAwayModalOpen: false
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

const isTakeAwayModalOpen = state => state.globalUi.takeAwayModalOpen;

const doesViewEqualsSlideParameters = state => state.visualization.viewEqualsSlideParameters;

const visualizationData = state => state.visualization;

const activeViewParameters = state => state.visualization.viewParameters;

const quinoaSlideParameters = state => state.visualization.quinoaSlideParameters;

const isReadOnly = state => state.visualization.readOnly;

export const selector = createStructuredSelector({
  isNewStoryModalOpen,
  isTakeAwayModalOpen,
  visualizationData,
  doesViewEqualsSlideParameters,
  activeViewParameters,
  quinoaSlideParameters,
  isReadOnly
});
