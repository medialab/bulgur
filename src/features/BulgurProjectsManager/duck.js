import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {persistentReducer} from 'redux-pouchdb';

/*
 * Action names
 */
const CREATE_PRESENTATION = 'CREATE_PRESENTATION';
const PROMPT_DELETE_PRESENTATION = 'PROMPT_DELETE_PRESENTATION';
const UNPROMPT_DELETE_PRESENTATION = 'UNPROMPT_DELETE_PRESENTATION';
const DELETE_PRESENTATION = 'DELETE_PRESENTATION';
const UPDATE_PRESENTATION = 'UPDATE_PRESENTATION';
const SET_ACTIVE_PRESENTATION_ID = 'SET_ACTIVE_PRESENTATION_ID';

/*
 * Action creators
 */

export const createPresentation = (id, presentation, setActive = true) => ({
  type: CREATE_PRESENTATION,
  presentation,
  setActive,
  id
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

const testPresentation = {
  id: 'f1ddbb99-4922-4148-bdb3-5cc862c4aec6',
  metadata: {
    title: 'Ma présentation',
  }
}

/*
 * Reducers
 */
const PRESENTATIONS_DEFAULT_STATE = {
  presentations: {
    'f1ddbb99-4922-4148-bdb3-5cc862c4aec6': testPresentation
  }
};
function presentations(state = PRESENTATIONS_DEFAULT_STATE, action) {
  switch (action.type) {
    case CREATE_PRESENTATION:
      const id = action.id
      const presentation = {
        ...action.presentation,
        id
      }
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
    case CREATE_PRESENTATION:
      const id = action.id;
      const presentation = {
        ...action.presentation,
        id
      }
      return {
        ...state,
        activePresentationId: action.setActive ? id : state.activePresentationId
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
    case SET_ACTIVE_PRESENTATION_ID:
      return {
        ...state,
        activePresentationId: action.id
      };
    default:
      return state;
  }
}

export default persistentReducer(
  combineReducers({
      presentations,
      presentationsUi
  })
);

/*
 * Selectors
 */

const activePresentation = state => state.presentations.presentations[state.presentationsUi.activePresentationId];
const activePresentationId = state => state.presentationsUi.activePresentationId;
const presentationsList = state => Object.keys(state.presentations.presentations).map(key => state.presentations.presentations[key]);
const promptedToDeleteId = state => state.presentationsUi.promptedToDelete;

export const selector = createStructuredSelector({
  activePresentation,
  activePresentationId,
  promptedToDeleteId,
  presentationsList
});

