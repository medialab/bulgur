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

// import {createDefaultSlideParameters} from '../../models/visualizationTypes';

/*
 * Action names
 */
export const START_PRESENTATION_CANDIDATE_CONFIGURATION = 'START_PRESENTATION_CANDIDATE_CONFIGURATION';
export const APPLY_PRESENTATION_CANDIDATE_CONFIGURATION = 'APPLY_PRESENTATION_CANDIDATE_CONFIGURATION';


export const SET_ACTIVE_PRESENTATION_ID = 'SET_ACTIVE_PRESENTATION_ID';

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

export const startPresentationCandidateConfiguration = (presentation) => ({
  type: START_PRESENTATION_CANDIDATE_CONFIGURATION,
  presentation,
  id: presentation !== undefined && presentation.id ? presentation.id : uuid()
});

export const applyPresentationCandidateConfiguration = (presentation) => ({
  type: APPLY_PRESENTATION_CANDIDATE_CONFIGURATION,
  presentation
});

export const setActivePresentationId = (id) => ({
  type: SET_ACTIVE_PRESENTATION_ID,
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
    activePresentationId: undefined
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
    case SET_ACTIVE_PRESENTATION_ID:
      return {
        ...state,
        activePresentationId: action.id
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

 const activePresentationId = state => state.globalUi.activePresentationId;

const isPresentationCandidateModalOpen = state => state.globalUi.presentationCandidateModalOpen;

const isTakeAwayModalOpen = state => state.globalUi.takeAwayModalOpen;

const doesViewEqualsSlideParameters = state => state.visualization.viewEqualsSlideParameters;

const visualizationData = state => state.visualization;

const activeViewParameters = state => state.visualization.viewParameters;


const quinoaSlideParameters = state => state.visualization.quinoaSlideParameters;

export const selector = createStructuredSelector({
  activePresentationId,
  isPresentationCandidateModalOpen,
  isTakeAwayModalOpen,
  visualizationData,
  doesViewEqualsSlideParameters,
  activeViewParameters,
  quinoaSlideParameters
});
