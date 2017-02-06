import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {persistentReducer} from 'redux-pouchdb';
import {v4 as uuid} from 'uuid';

import {EditorState} from 'draft-js';
import {stateFromMarkdown} from 'draft-js-import-markdown';
import {stateToMarkdown} from 'draft-js-export-markdown';

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
  UPDATE_SLIDE
} from '../Editor/duck';

import {
  EXPORT_TO_GIST,
  EXPORT_TO_SERVER
} from '../TakeAwayDialog/duck';

const CREATE_PRESENTATION = 'CREATE_PRESENTATION';

const PROMPT_DELETE_PRESENTATION = 'PROMPT_DELETE_PRESENTATION';
const UNPROMPT_DELETE_PRESENTATION = 'UNPROMPT_DELETE_PRESENTATION';

const DELETE_PRESENTATION = 'DELETE_PRESENTATION';
const UPDATE_PRESENTATION = 'UPDATE_PRESENTATION';

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
            ...presentation,
            slides: Object.keys(presentation.slides).reduce((slides, slideKey) => ({
              ...slides,
              [slideKey]: {
                ...presentation.slides[slideKey],
                draft: EditorState.createWithContent(stateFromMarkdown(presentation.slides[slideKey].markdown))
              }
            }), {})
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
                draft: EditorState.createWithContent(stateFromMarkdown(action.slide.markdown || ''))
              }
            },
            order: [
              ...state.presentations[state.activePresentationId].order,
              newSlideId
            ]
          }
        }
      };
    case UPDATE_SLIDE:
      const slideId = action.id;
      return {
        ...state,
        presentations: {
          ...state.presentations,
          [state.activePresentationId]: {
            ...state.presentations[state.activePresentationId],
            slides: {
              ...state.presentations[state.activePresentationId].slides,
              [slideId]: {
                ...action.slide,
                // if no markdown in action payload, infer new markdown
                markdown: action.slide.markdown ? action.slide.markdown : stateToMarkdown(action.slide.draft.getCurrentContent()),
                // if not draft in action payload, infer new draft
                draft: action.slide.draft ? action.slide.draft : EditorState.createWithContent(stateFromMarkdown(action.slide.markdown)),
              }
            }
          }
        }
      };
    case 'redux-pouchdb/SET_REDUCER':
      if (action.reducer === 'bulgur-presentations') {
        // setting up draft-js instances from serialized state
        return {
          ...state,
          presentations: Object.keys(state.presentations).reduce((thesePresentations, presentationId) => ({
            ...thesePresentations,
            [presentationId]: {
              ...state.presentations[presentationId],
              slides: Object.keys(state.presentations[presentationId].slides).reduce((slides, thatSlideId) => ({
                  ...slides,
                  [thatSlideId]: {
                    ...state.presentations[presentationId].slides[thatSlideId],
                    draft: EditorState.createWithContent(stateFromMarkdown(state.presentations[presentationId].slides[thatSlideId].markdown || ''))
                  }
              }), {})
            }
          }), {})
        };
      }
      return state;
    case REMOVE_SLIDE:
      newState = {...state};
      delete newState.presentations[state.activePresentationId].slides[action.id];
      const order = newState.presentations[state.activePresentationId].order;
      const position = order.indexOf(action.id);
      const newOrder = [...order.slice(0, position), ...order.slice(position + 1)];
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
              gistId: action.result.gistId,
              blocksUrl: action.result.blocksUrl
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
  'bulgur-presentations'
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

