import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import equals from 'shallow-equals';
import {v4 as uuid} from 'uuid';


// import {EditorState} from 'draft-js';
// import {
//   quinoaCreateEditorReducer,
//   quinoaActions as qActions
// } from 'quinoa';
// function createSlide(data = {}) {
//   return {
//     id: uuid.v4(),
//     title: data.title || '',
//     markdown: data.markdown || '',
//     draft: EditorState.create(),
//     meta: data.meta || {}
//   };
// }
// const quinoaEditor = quinoaCreateEditorReducer(createSlide);

import {SETUP_PRESENTATION_CANDIDATE} from '../PresentationCandidateDialog/duck';

import {createDefaultSlideParameters} from '../../models/visualizationTypes';

/*
 * Action names
 */
export const START_PRESENTATION_CANDIDATE_CONFIGURATION = 'START_PRESENTATION_CANDIDATE_CONFIGURATION';

const OPEN_PRESENTATION_CANDIDATE_MODAL = 'OPEN_PRESENTATION_CANDIDATE_MODAL';
const CLOSE_PRESENTATION_CANDIDATE_MODAL = 'CLOSE_PRESENTATION_CANDIDATE_MODAL';
const OPEN_TAKE_AWAY_MODAL = 'OPEN_TAKE_AWAY_MODAL';
const CLOSE_TAKE_AWAY_MODAL = 'CLOSE_TAKE_AWAY_MODAL';
const VIEW_EQUALS_SLIDE_PARAMETERS = 'VIEW_EQUALS_SLIDE_PARAMETERS';
const UPDATE_VIEW = 'UPDATE_VIEW';
const SET_QUINOA_SLIDE_PARAMETERS = 'SET_QUINOA_SLIDE_PARAMETERS';
export const RESET_APP = 'RESET_APP';

/*
 * Action creators
 */

export const startPresentationCandidateConfiguration = () => ({
  type: START_PRESENTATION_CANDIDATE_CONFIGURATION,
  id: uuid()
});

// export const quinoaActions = qActions;

export const openPresentationCandidateModal = () => ({
  type: OPEN_PRESENTATION_CANDIDATE_MODAL
});

export const closePresentationCandidateModal = () => ({
  type: CLOSE_PRESENTATION_CANDIDATE_MODAL
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
    viewEqualsSlideParameters: false
};
function visualization(state = VISUALIZATION_DEFAULT_STATE, action) {
  let isSync;
  switch (action.type) {
    case RESET_APP:
      return VISUALIZATION_DEFAULT_STATE;
    case SETUP_PRESENTATION_CANDIDATE:
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
            id: uuid(),
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
    presentationCandidateModalOpen: false,
    takeAwayModalOpen: false
};
function globalUi(state = GLOBAL_UI_DEFAULT_STATE, action) {
  switch (action.type) {
    case RESET_APP:
      return GLOBAL_UI_DEFAULT_STATE;
    case START_PRESENTATION_CANDIDATE_CONFIGURATION:
    case OPEN_PRESENTATION_CANDIDATE_MODAL:
      return {
        ...state,
        presentationCandidateModalOpen: true
      };
    case CLOSE_PRESENTATION_CANDIDATE_MODAL:
      return {
        ...state,
        presentationCandidateModalOpen: false
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
  visualization,
  // quinoaEditor
});

/*
 * Selectors
 */

const isPresentationCandidateModalOpen = state => state.globalUi.presentationCandidateModalOpen;

const isTakeAwayModalOpen = state => state.globalUi.takeAwayModalOpen;

const doesViewEqualsSlideParameters = state => state.visualization.viewEqualsSlideParameters;

const visualizationData = state => state.visualization;

const activeViewParameters = state => state.visualization.viewParameters;

const quinoaSlideParameters = state => state.visualization.quinoaSlideParameters;

export const selector = createStructuredSelector({
  isPresentationCandidateModalOpen,
  isTakeAwayModalOpen,
  visualizationData,
  doesViewEqualsSlideParameters,
  activeViewParameters,
  quinoaSlideParameters
});
