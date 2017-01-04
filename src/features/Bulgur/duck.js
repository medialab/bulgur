import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import equals from 'shallow-equals';
import {v4} from 'uuid';

import {quinoaCreateEditorReducer} from 'quinoa';

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
      let finalData = action.data;
      let viewParameters;
      const okForMap = (action.dataMap && action.dataMap.length);
      if (okForMap) {
        finalData = action.data.map(point => {
            return action.dataMap.reduce((finalObject, thatModel) => {
              // map data mapped field to visualization dimension id
              if (point[thatModel.mappedField]) {
                finalObject[thatModel.id] = point[thatModel.mappedField];
              }
              return finalObject;
            }, {});
        });
      }
      // todo : find a format for declaring that as a vis model ?
      if (action.visualizationType === 'time') {
        finalData = finalData.map(point => {
          const start = new Date();

          if (point.year) {
            start.setFullYear(+point.year);
          }
          if (point.month) {
            start.setMonth(+point.month - 1);
          }
          else start.setMonth(0);
          if (point.day) {
            start.setDate(+point.day);
          }
          else start.setDate(1);

          let end;

          if (point['end year']) {
            end = new Date();
            if (point['end year']) {
              end.setFullYear(+point['end year']);
            }
            if (point['end month']) {
              end.setMonth(+point['end month'] - 1);
            }
            else end.setMonth(0);
            if (point['end day']) {
              end.setDate(+point['end day']);
            }
            else end.setDate(1);
          }

          return {
            start: start.getTime(),
            end: end !== undefined ? end.getTime() : undefined,
            id: v4(),
            ...point
          };
        });
        const min = Math.min.apply(Math, finalData.map(point => point.start));
        const max = Math.max.apply(Math, finalData.map(point => point.start));
        const dist = max - min;
        viewParameters = {
          fromDate: min - dist / 4,
          toDate: max + dist / 4
        };
      }
      else {
        viewParameters = createDefaultSlideParameters(action.visualizationType);
      }
      return {
        ...state,
        data: finalData,
        visualizationType: action.visualizationType,
        viewParameters
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
