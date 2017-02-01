import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {persistentReducer} from 'redux-pouchdb';
import {v4 as uuid} from 'uuid';
/*
 * Action names
 */
import {
  START_CANDIDATE_PRESENTATION_CONFIGURATION,
  APPLY_PRESENTATION_CANDIDATE_CONFIGURATION,
  UNSET_ACTIVE_PRESENTATION
} from '../Bulgur/duck';

const CREATE_PRESENTATION = 'CREATE_PRESENTATION';

const PROMPT_DELETE_PRESENTATION = 'PROMPT_DELETE_PRESENTATION';
const UNPROMPT_DELETE_PRESENTATION = 'UNPROMPT_DELETE_PRESENTATION';

const DELETE_PRESENTATION = 'DELETE_PRESENTATION';
const UPDATE_PRESENTATION = 'UPDATE_PRESENTATION';
const SET_ACTIVE_PRESENTATION_ID = 'SET_ACTIVE_PRESENTATION_ID';

const COPY_PRESENTATION = 'COPY_PRESENTATION';

const IMPORT_ABORD = 'IMPORT_ABORD';
const IMPORT_OVERRIDE_PROMPT = 'IMPORT_OVERRIDE_PROMPT';
const IMPORT_FAIL = 'IMPORT_FAIL';
const IMPORT_SUCCESS = 'IMPORT_SUCCESS';
const IMPORT_RESET = 'IMPORT_RESET';

/*
 * Action creators
 */

export const createPresentation = (id, presentation, setActive = true) => ({
  type: CREATE_PRESENTATION,
  presentation,
  setActive,
  id
});

export const copyPresentation = (presentation) => ({
  type: COPY_PRESENTATION,
  presentation
});

export const promptDeletePresentation = (id) => ({
  type: PROMPT_DELETE_PRESENTATION,
  id
});

export const unpromptDeletePresentation = () => ({
  type: UNPROMPT_DELETE_PRESENTATION
});

export const deletePresentation = (id) => ({
  type: DELETE_PRESENTATION,
  id
});

export const updatePresentation = (id) => ({
  type: UPDATE_PRESENTATION,
  id
});

export const setActivePresentationId = (id, presentation) => ({
  type: SET_ACTIVE_PRESENTATION_ID,
  presentation,
  id
});

export const importReset = () => ({
  type: IMPORT_RESET
});

export const abordImport = () => ({
  type: IMPORT_ABORD
});

export const promptOverrideImport = (candidate) => ({
  type: IMPORT_OVERRIDE_PROMPT,
  candidate
});


export const importSuccess = (data) => (dispatch) => {
  dispatch({
    type: IMPORT_SUCCESS,
    data
  });
  // resets import state after a while
  setTimeout(() => dispatch(importReset()), 5000);
};

export const importFail = (error) => (dispatch) => {
  dispatch({
    type: IMPORT_FAIL,
    error
  });
  // resets import state after a while
  setTimeout(() => dispatch(importReset()), 5000);
};

/*
 * Reducers
 */
const PRESENTATIONS_DEFAULT_STATE = {
  // todo : remove that
  presentations: {
  },
  activePresentationId: undefined
};
function presentations(state = PRESENTATIONS_DEFAULT_STATE, action) {
  switch (action.type) {
    case APPLY_PRESENTATION_CANDIDATE_CONFIGURATION:
      if (state.activePresentationId) {
        // case update
        return {
          ...state,
          presentations: {
            ...state.presentations,
            [action.presentation.id]: {
              ...state.presentations[action.presentation.id],
              ...action.presentation
            }
          },
          activePresentationId: action.presentation.id
        };
      }
      else {
        // case create
        return {
          ...state,
          presentations: {
            ...state.presentations,
            [action.presentation.id]: action.presentation
          },
          activePresentationId: action.presentation.id
        };
      }
    case SET_ACTIVE_PRESENTATION_ID:
      return {
        ...state,
        activePresentationId: action.id
      };
    case UNSET_ACTIVE_PRESENTATION:
      return {
        ...state,
        activePresentationId: undefined
      };
    case CREATE_PRESENTATION:
      const id = action.id;
      let presentation = {
        ...action.presentation,
        id
      };
      return {
        ...state,
        presentations: {
          ...state.presentations,
          [id]: presentation
        }
      };
    case DELETE_PRESENTATION:
      const newState = Object.assign({}, state);
      delete newState.presentations[action.id];
      return newState;
    case UPDATE_PRESENTATION:
      return {
        ...state,
        presentations: {
          ...state.presentations,
          [action.id]: action.presentation
        }
      };
    case IMPORT_SUCCESS:
      presentation = action.data;
      return {
        ...state,
        presentations: {
          ...state.presentations,
          [presentation.id]: presentation
        }
      };
    case COPY_PRESENTATION:
      const original = action.presentation;
      const newId = uuid();
      const newPresentation = {
        ...original,
        id: newId,
        metadata: {
          ...original.metadata,
          title: original.metadata.title + ' - copy'
        }
      };
      return {
        ...state,
        presentations: {
          ...state.presentations,
          [newId]: newPresentation
        }
      };
    default:
      return state;
  }
}

const PRESENTATIONS_UI_DEFAULT_STATE = {
  activePresentationId: undefined,
  promptedToDelete: undefined
};
function presentationsUi(state = PRESENTATIONS_UI_DEFAULT_STATE, action) {
  switch (action.type) {
    case START_CANDIDATE_PRESENTATION_CONFIGURATION:
      return {
        activePresentationId: action.id
      };
    case CREATE_PRESENTATION:
      return {
        ...state,
        activePresentationId: action.setActive ? action.id : state.activePresentationId
      };
    case PROMPT_DELETE_PRESENTATION:
      return {
        ...state,
        promptedToDelete: action.id
      };
    case UNPROMPT_DELETE_PRESENTATION:
      return {
        ...state,
        promptedToDelete: undefined
      };
    case DELETE_PRESENTATION:
      return {
        ...state,
        promptedToDelete: undefined,
        activePresentationId: state.activePresentationId === action.id ? undefined : state.activePresentationId
      };
    default:
      return state;
  }
}


const PRESENTATION_IMPORT_DEFAULT_STATE = {
  importCandidate: undefined,
  importStatus: undefined,
  importError: undefined
};
function presentationImport(state = PRESENTATION_IMPORT_DEFAULT_STATE, action) {
  switch (action.type) {
    case IMPORT_RESET:
      return PRESENTATION_IMPORT_DEFAULT_STATE;
    case IMPORT_FAIL:
      return {
        ...state,
        importStatus: 'failure',
        importError: action.error
      };
    case IMPORT_SUCCESS:
      return {
        ...PRESENTATIONS_DEFAULT_STATE,
        importStatus: 'success'
      };
    case IMPORT_OVERRIDE_PROMPT:
      return {
        ...state,
        importCandidate: action.candidate
      };
    default:
      return state;
  }
}

export default persistentReducer(
  combineReducers({
      presentations,
      presentationsUi,
      presentationImport
  }),
  'bulgur'
);

/*
 * Selectors
 */

const activePresentation = state => state.presentations.presentations[state.presentations.activePresentationId];
const activePresentationId = state => state.presentations.activePresentationId;
const presentationsList = state => Object.keys(state.presentations.presentations).map(key => state.presentations.presentations[key]);
const promptedToDeleteId = state => state.presentationsUi.promptedToDelete;

const importStatus = state => state.presentationImport.importStatus;
const importError = state => state.presentationImport.importError;
const importCandidate = state => state.presentationImport.importCandidate;

export const selector = createStructuredSelector({
  activePresentation,
  activePresentationId,
  promptedToDeleteId,
  presentationsList,

  importStatus,
  importError,
  importCandidate
});

