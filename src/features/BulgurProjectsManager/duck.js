import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {v4} from 'uuid';

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

export const createPresentation = (presentation, setActive = true) => ({
  type: CREATE_PRESENTATION,
  presentation,
  setActive
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

/*
 * Reducers
 */
const PRESENTATIONS_DEFAULT_STATE = {
  presentations: {
  },
  activePresentationId: undefined,
  promptedToDelete: undefined
};

function presentations(state = PRESENTATIONS_DEFAULT_STATE, action) {
  switch (action.type) {
    case CREATE_PRESENTATION:
      const id = v4();
      return {
        ...state,
        presentations: {
          ...state.presentations,
          [id]: action.presentation
        },
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
      const newState = Object.assign({}, state);
      delete newState.presentations[action.id];
      return {
        ...newState,
        promptedToDelete: undefined,
        activePresentationId: newState.activePresentationId === action.id ? undefined : newState.activePresentationId
      };
    case UPDATE_PRESENTATION:
      return {
        ...state,
        presentations: {
          ...state.presentations,
          [action.id]: action.presentation
        }
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

export default combineReducers({
  presentations
});

/*
 * Selectors
 */

const activePresentation = state => state.presentations.presentations[state.presentations.activePresentationId];
const activePresentationId = state => state.presentations.presentations.activePresentationId;
const presentationsList = state => Object.keys(state.presentations.presentations).map(key => state.presentations.presentations[key]);
const promptedToDelete = state => state.presentations.presentations[state.presentations.promptedToDelete];

export const selector = createStructuredSelector({
  activePresentation,
  activePresentationId,
  promptedToDelete,
  presentationsList
});

