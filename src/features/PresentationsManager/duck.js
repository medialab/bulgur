/**
 * This module exports logic-related elements for the management of (locally stored) bulgur presentations
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module bulgur/features/PresentationsManager
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {persistentReducer} from 'redux-pouchdb';
import {v4 as uuid} from 'uuid';

import {serverUrl} from '../../../secrets';
/*
 * Action names
 */
import {
  START_CANDIDATE_PRESENTATION_CONFIGURATION,
  APPLY_PRESENTATION_CANDIDATE_CONFIGURATION,
  UNSET_ACTIVE_PRESENTATION,
  SET_ACTIVE_PRESENTATION,
  ADD_SLIDE,
  REMOVE_SLIDE,
  UPDATE_SLIDE,
  MOVE_SLIDE
} from '../Editor/duck';

import {
  EXPORT_TO_GIST,
  EXPORT_TO_SERVER
} from '../TakeAwayDialog/duck';

const CREATE_PRESENTATION = '§Bulgur/PresentationsManager/CREATE_PRESENTATION';
const DELETE_PRESENTATION = '§Bulgur/PresentationsManager/DELETE_PRESENTATION';
const UPDATE_PRESENTATION = '§Bulgur/PresentationsManager/UPDATE_PRESENTATION';
const COPY_PRESENTATION = '§Bulgur/PresentationsManager/COPY_PRESENTATION';

const PROMPT_DELETE_PRESENTATION = '§Bulgur/PresentationsManager/PROMPT_DELETE_PRESENTATION';
const UNPROMPT_DELETE_PRESENTATION = '§Bulgur/PresentationsManager/UNPROMPT_DELETE_PRESENTATION';

const IMPORT_ABORD = '§Bulgur/PresentationsManager/IMPORT_ABORD';
const IMPORT_OVERRIDE_PROMPT = '§Bulgur/PresentationsManager/IMPORT_OVERRIDE_PROMPT';
const IMPORT_FAIL = '§Bulgur/PresentationsManager/IMPORT_FAIL';
const IMPORT_SUCCESS = '§Bulgur/PresentationsManager/IMPORT_SUCCESS';
const IMPORT_RESET = '§Bulgur/PresentationsManager/IMPORT_RESET';
const SET_IMPORT_FROM_URL_CANDIDATE = '§Bulgur/PresentationsManager/SET_IMPORT_FROM_URL_CANDIDATE';

/*
 * Action creators
 */
/**
 * @param {string} id - the uuid of the presentation to create
 * @param {object} presentation - the data of the presentation to create
 * @param {boolean} setActive - whether to set the presentation as active (edited) presentation in app
 */
export const createPresentation = (id, presentation, setActive = true) => ({
  type: CREATE_PRESENTATION,
  presentation,
  setActive,
  id
});
/**
 * @param {object} presentation - the data of the presentation to copy
 */
export const copyPresentation = (presentation) => ({
  type: COPY_PRESENTATION,
  presentation
});
/**
 * @param {string} id - the uuid of the presentation to query for deletion
 */
export const promptDeletePresentation = (id) => ({
  type: PROMPT_DELETE_PRESENTATION,
  id
});
/**
 *
 */
export const unpromptDeletePresentation = () => ({
  type: UNPROMPT_DELETE_PRESENTATION
});
/**
 * @param {string} id - the uuid of the presentation to delete
 */
export const deletePresentation = (id) => ({
  type: DELETE_PRESENTATION,
  id
});
/**
 * @param {string} id - the uuid of the presentation to update
 * @param {object} presentation - the data of the presentation to update
 */
export const updatePresentation = (id, presentation) => ({
  type: UPDATE_PRESENTATION,
  id,
  presentation
});
/**
 *
 */
export const importReset = () => ({
  type: IMPORT_RESET
});
/**
 *
 */
export const abordImport = () => ({
  type: IMPORT_ABORD
});
/**
 * @param {object} candidate - the data of the presentation waiting to be imported or not instead of existing one
 */
export const promptOverrideImport = (candidate) => ({
  type: IMPORT_OVERRIDE_PROMPT,
  candidate
});
/**
 * @param {object} data - the data of the imported presentation
 */
export const importSuccess = (data) => (dispatch) => {
  dispatch({
    type: IMPORT_SUCCESS,
    data
  });
  // resets import state after a while
  setTimeout(() => dispatch(importReset()), 5000);
};
/**
 * @param {string} error - the error type for the import failure
 */
export const importFail = (error) => (dispatch) => {
  dispatch({
    type: IMPORT_FAIL,
    error
  });
  // resets import state after a while
  setTimeout(() => dispatch(importReset()), 5000);
};
/**
 * @param {string}  value - the new value to set for import from url candidate
 */
 export const setImportFromUrlCandidate = (value) => ({
  type: SET_IMPORT_FROM_URL_CANDIDATE,
  value
 });

/*
 * Reducers
 */
const PRESENTATIONS_DEFAULT_STATE = {
  /**
   * Representation of all the presentations stored in application's state
   * @type {object}
   */
  presentations: {},
  /**
   * Representation of the id of the presentation being edited in editor
   * @type {string}
   */
  activePresentationId: undefined
};
/**
 * This redux reducer handles the modification of the data state for the presentations stored in the application's state
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 */
function presentations(state = PRESENTATIONS_DEFAULT_STATE, action) {
  let position;
  let order;
  let newOrder;
  let slideId;
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
      let newState = Object.assign({}, state);
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
          [presentation.id]: {
            ...presentation
          }
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
    /*
     * EDITOR-RELATED
     */
    case ADD_SLIDE:
      const newSlideId = action.id;
      position = action.order || state.presentations[state.activePresentationId].order.length;
      newOrder = [
        ...state.presentations[state.activePresentationId].order.slice(0, position),
        newSlideId,
        ...state.presentations[state.activePresentationId].order.slice(position)
      ];
      return {
        ...state,
        presentations: {
          ...state.presentations,
          [state.activePresentationId]: {
            ...state.presentations[state.activePresentationId],
            slides: {
              ...state.presentations[state.activePresentationId].slides,
              [newSlideId]: {
                ...action.slide,
              }
            },
            order: newOrder
          }
        }
      };
    case UPDATE_SLIDE:
      slideId = action.id;
      return {
        ...state,
        presentations: {
          ...state.presentations,
          [state.activePresentationId]: {
            ...state.presentations[state.activePresentationId],
            slides: {
              ...state.presentations[state.activePresentationId].slides,
              [slideId]: {
                ...state.presentations[state.activePresentationId].slides[slideId],
                ...action.slide
              }
            }
          }
        }
      };
    case MOVE_SLIDE:
      slideId = state.presentations[state.activePresentationId].order[action.fromIndex];
      order = state.presentations[state.activePresentationId].order.slice();
      order.splice(action.fromIndex, 1);
      order.splice(action.toIndex, 0, slideId);
      return {
        ...state,
        presentations: {
          ...state.presentations,
          [state.activePresentationId]: {
            ...state.presentations[state.activePresentationId],
            order
          }
        }
      };
    case REMOVE_SLIDE:
      newState = {...state};
      delete newState.presentations[state.activePresentationId].slides[action.id];
      order = newState.presentations[state.activePresentationId].order;
      position = order.indexOf(action.id);
      newOrder = [...order.slice(0, position), ...order.slice(position + 1)];
      newState.presentations[state.activePresentationId].order = newOrder;
      return newState;
    /*
     * EXPORT-RELATED
     */
    case EXPORT_TO_GIST + '_SUCCESS':
      return {
        ...state,
        presentations: {
          ...state.presentations,
          [state.activePresentationId]: {
            ...state.presentations[state.activePresentationId],
            metadata: {
              ...state.presentations[state.activePresentationId].metadata,
              gistUrl: action.result.gistUrl,
              gistId: action.result.gistId
            }
          }
        }
      };
    case EXPORT_TO_SERVER + '_SUCCESS':
      return {
        ...state,
        presentations: {
          ...state.presentations,
          [state.activePresentationId]: {
            ...state.presentations[state.activePresentationId],
            metadata: {
              ...state.presentations[state.activePresentationId].metadata,
              serverJSONUrl: serverUrl + '/presentations/' + state.presentations[state.activePresentationId].id,
              serverHTMLUrl: serverUrl + '/presentations/' + state.presentations[state.activePresentationId].id + '?format=html'
            }
          }
        }
      };
    default:
      return state;
  }
}

const PRESENTATIONS_UI_DEFAULT_STATE = {
  /**
   * Representation of the id of the presentation being edited in editor
   * @type {string}
   */
  activePresentationId: undefined,
  /**
   * Representation of the id of the item being prompted to delete
   * @type {string}
   */
  promptedToDelete: undefined
};
/**
 * This redux reducer handles the modification of the ui state for presentations management
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 */
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
  /**
   * Representation of a presentation waiting to be imported or not
   * @type {object}
   */
  importCandidate: undefined,
  /**
   * Representation of the import state
   * @type {object}
   */
  importStatus: undefined,
  /**
   * Representation of the import error occured after an import failed
   * @type {string}
   */
  importError: undefined,
  /**
   * Representation of the content of import from url input
   * @type {string}
   */
  importFromUrlCandidate: ''
};
/**
 * This redux reducer handles the modifications related to importing presentations in application's state
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 */
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
    case SET_IMPORT_FROM_URL_CANDIDATE:
      return {
        ...state,
        importFromUrlCandidate: action.value
      };
    default:
      return state;
  }
}
/**
 * The module exports a reducer connected to pouchdb thanks to redux-pouchdb
 */
export default persistentReducer(
  combineReducers({
      presentations,
      presentationsUi,
      presentationImport
  }),
  'bulgur-presentations'
);

/*
 * Selectors
 */
const presentationsList = state => Object.keys(state.presentations.presentations).map(key => state.presentations.presentations[key]);
const activePresentation = state => state.presentations.presentations[state.presentations.activePresentationId];
const activePresentationId = state => state.presentations.activePresentationId;

const promptedToDeleteId = state => state.presentationsUi.promptedToDelete;
const importStatus = state => state.presentationImport.importStatus;
const importError = state => state.presentationImport.importError;
const importCandidate = state => state.presentationImport.importCandidate;
const importFromUrlCandidate = state => state.presentationImport.importFromUrlCandidate;
/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  activePresentation,
  activePresentationId,

  importCandidate,
  importError,
  importStatus,
  importFromUrlCandidate,

  presentationsList,
  promptedToDeleteId,
});

