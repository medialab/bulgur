import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import equals from 'shallow-equals';
import {v4 as uuid} from 'uuid';
import {persistentReducer} from 'redux-pouchdb';

import {
  mapMapData,
  mapTimelineData,
  mapNetworkData
} from 'quinoa-vis-modules';

import models from '../../models/visualizationTypes';

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

// import {createDefaultSlideParameters} from '../../models/visualizationTypes';

/*
 * Action names
 */
export const START_PRESENTATION_CANDIDATE_CONFIGURATION = 'START_PRESENTATION_CANDIDATE_CONFIGURATION';
export const APPLY_PRESENTATION_CANDIDATE_CONFIGURATION = 'APPLY_PRESENTATION_CANDIDATE_CONFIGURATION';


export const SET_ACTIVE_PRESENTATION = 'SET_ACTIVE_PRESENTATION';
export const UNSET_ACTIVE_PRESENTATION = 'UNSET_ACTIVE_PRESENTATION';

export const CHANGE_VIEW_BY_USER = 'CHANGE_VIEW_BY_USER';

const OPEN_PRESENTATION_CANDIDATE_MODAL = 'OPEN_PRESENTATION_CANDIDATE_MODAL';
const CLOSE_PRESENTATION_CANDIDATE_MODAL = 'CLOSE_PRESENTATION_CANDIDATE_MODAL';
const OPEN_TAKE_AWAY_MODAL = 'OPEN_TAKE_AWAY_MODAL';
const CLOSE_TAKE_AWAY_MODAL = 'CLOSE_TAKE_AWAY_MODAL';
const SET_UI_MODE = 'SET_UI_MODE';


const VIEW_EQUALS_SLIDE_PARAMETERS = 'VIEW_EQUALS_SLIDE_PARAMETERS';
const UPDATE_VIEW = 'UPDATE_VIEW';
const SET_QUINOA_SLIDE_PARAMETERS = 'SET_QUINOA_SLIDE_PARAMETERS';
export const RESET_APP = 'RESET_APP';

/*
 * Action creators
 */

export const startPresentationCandidateConfiguration = (presentation) => ({
  type: START_PRESENTATION_CANDIDATE_CONFIGURATION,
  presentation,
  id: presentation !== undefined && presentation.id ? presentation.id : uuid()
});

export const applyPresentationCandidateConfiguration = (presentation) => ({
  type: APPLY_PRESENTATION_CANDIDATE_CONFIGURATION,
  presentation
});

export const setActivePresentation = (presentation) => ({
  type: SET_ACTIVE_PRESENTATION,
  presentation
});

export const unsetActivePresentation = () => ({
  type: UNSET_ACTIVE_PRESENTATION
});

export const changeViewByUser = (id, event) => ({
  type: CHANGE_VIEW_BY_USER,
  event,
  id
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

export const setUiMode = (mode = 'edition') => ({
  type: SET_UI_MODE,
  mode
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

const EDITOR_DEFAULT_STATE = {
    activeViews: undefined,
    // todo : remove these
    data: undefined,
    dataMap: undefined,
    visualizationType: undefined,
    viewParameters: {},
    quinoaSlideParameters: {},
    viewEqualsSlideParameters: false
};
function editor(state = EDITOR_DEFAULT_STATE, action) {
  let isSync;
  switch (action.type) {
    case RESET_APP:
      return EDITOR_DEFAULT_STATE;

    case APPLY_PRESENTATION_CANDIDATE_CONFIGURATION:
    case SET_ACTIVE_PRESENTATION:
      const defaultViews = Object.keys(action.presentation.visualizations).reduce((result, visualizationKey) => {
        const visualization = action.presentation.visualizations[visualizationKey];
        const viewParameters = {
          ...models[visualization.metadata.visualizationType].defaultViewParameters,
          colorsMap: visualization.colorsMap
        };
        let data;
        // flatten datamap fields (todo: refactor as helper)
        const dataMap = Object.keys(visualization.dataMap).reduce((dataMapResult, collectionId) => ({
          ...dataMapResult,
          [collectionId]: Object.keys(visualization.dataMap[collectionId]).reduce((propsMap, parameterId) => {
            const parameter = visualization.dataMap[collectionId][parameterId];
            if (parameter.mappedField) {
              return {
                ...propsMap,
                [parameterId]: parameter.mappedField
              };
            }
            return propsMap;
          }, {})
        }), {});
        switch (visualization.metadata.visualizationType) {
          case 'space':
            data = mapMapData(visualization.data, dataMap);
            break;
          case 'time':
            data = mapTimelineData(visualization.data, dataMap);
            break;
          case 'relation':
            data = mapNetworkData(visualization.data, dataMap);
            break;
          default:
            data = visualization.data;
            break;
        }
        return {
          ...result,
          [visualizationKey]: {
            ...visualization,
            viewParameters,
            data
          }
        };
      }, {});
      return {
        ...state,
        activeViews: {
          ...defaultViews
        }
      };
    case CHANGE_VIEW_BY_USER:
      return {
        ...state,
        activeViews: {
          ...state.activeViews,
          [action.id]: {
            ...state.activeViews[action.id],
            ...action.event.viewParameters
          }
        }
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
    takeAwayModalOpen: false,
    activePresentationId: undefined,
    uiMode: 'edition' // in ['edition', 'preview']
};
function globalUi(state = GLOBAL_UI_DEFAULT_STATE, action) {
  switch (action.type) {
    case RESET_APP:
      return GLOBAL_UI_DEFAULT_STATE;
    case APPLY_PRESENTATION_CANDIDATE_CONFIGURATION:
      return {
        ...state,
        presentationCandidateModalOpen: false,
        activePresentationId: action.presentation.id
      };
    case SET_ACTIVE_PRESENTATION:
      return {
        ...state,
        activePresentationId: action.presentation.id
      };
    case UNSET_ACTIVE_PRESENTATION:
      return {
        ...state,
        activePresentationId: undefined
      };
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
    case SET_UI_MODE:
      return {
        ...state,
        uiMode: action.mode
      };
    default:
      return state;
  }
}

export default persistentReducer(combineReducers({
  globalUi,
  editor
}), 'bulgur-editor');

/*
 * Selectors
 */

 const activePresentationId = state => state.globalUi.activePresentationId;

const isPresentationCandidateModalOpen = state => state.globalUi.presentationCandidateModalOpen;

const isTakeAwayModalOpen = state => state.globalUi.takeAwayModalOpen;

const globalUiMode = state => state.globalUi.uiMode;

const activeViews = state => state.editor.activeViews;

const doesViewEqualsSlideParameters = state => state.editor.viewEqualsSlideParameters;
const visualizationData = state => state.editor;
const activeViewParameters = state => state.editor.viewParameters;
const quinoaSlideParameters = state => state.editor.quinoaSlideParameters;

export const selector = createStructuredSelector({
  activePresentationId,
  isPresentationCandidateModalOpen,
  isTakeAwayModalOpen,
  globalUiMode,

  activeViews,

  visualizationData,
  doesViewEqualsSlideParameters,
  activeViewParameters,
  quinoaSlideParameters
});
