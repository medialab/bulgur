/**
 * This module exports logic-related elements for the bulgur global ui
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module bulgur/features/GlobalUi
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {v4 as uuid} from 'uuid';
import {persistentReducer} from 'redux-pouchdb';

/*
 * Action names
 */
export const RESET_APP = 'RESET_APP';
/*
 * actions related to global stories management in ui
 */
export const START_PRESENTATION_CANDIDATE_CONFIGURATION = '$Bulgur/PresentationEditor/START_PRESENTATION_CANDIDATE_CONFIGURATION';
export const APPLY_PRESENTATION_CANDIDATE_CONFIGURATION = '$Bulgur/PresentationEditor/APPLY_PRESENTATION_CANDIDATE_CONFIGURATION';
export const SET_ACTIVE_PRESENTATION = '$Bulgur/PresentationEditor/SET_ACTIVE_PRESENTATION';
export const UNSET_ACTIVE_PRESENTATION = '$Bulgur/PresentationEditor/UNSET_ACTIVE_PRESENTATION';
/*
 * actions related to global ui
 */
export const OPEN_PRESENTATION_CANDIDATE_MODAL = '$Bulgur/PresentationEditor/OPEN_PRESENTATION_CANDIDATE_MODAL';
export const CLOSE_PRESENTATION_CANDIDATE_MODAL = '$Bulgur/PresentationEditor/CLOSE_PRESENTATION_CANDIDATE_MODAL';
export const OPEN_TAKE_AWAY_MODAL = '$Bulgur/PresentationEditor/OPEN_TAKE_AWAY_MODAL';
export const CLOSE_TAKE_AWAY_MODAL = '$Bulgur/PresentationEditor/CLOSE_TAKE_AWAY_MODAL';
export const SET_UI_MODE = '$Bulgur/PresentationEditor/SET_UI_MODE';
export const SET_ASIDE_UI_MODE = '$Bulgur/PresentationEditor/SET_ASIDE_UI_MODE';

/**
 * @param {object} presentation - the data to use for bootstrapping presentation configuration
 */
export const startPresentationCandidateConfiguration = (presentation) => ({
  type: START_PRESENTATION_CANDIDATE_CONFIGURATION,
  presentation,
  id: presentation !== undefined && presentation.id ? presentation.id : uuid()
});
/**
 * @param {object} presentation - the data to use for merging back presentation data from presentation configuration state
 */
export const applyPresentationCandidateConfiguration = (presentation) => ({
  type: APPLY_PRESENTATION_CANDIDATE_CONFIGURATION,
  presentation
});
/**
 * @param {object} presentation - the presentation to set as editor's edited presentation
 */
export const setActivePresentation = (presentation) => ({
  type: SET_ACTIVE_PRESENTATION,
  presentation
});
/**
 * @param {object} presentation - the presentation to unset as editor's edited presentation
 */
export const unsetActivePresentation = () => ({
  type: UNSET_ACTIVE_PRESENTATION
});
/**
 *
 */
export const openPresentationCandidateModal = () => ({
  type: OPEN_PRESENTATION_CANDIDATE_MODAL
});
/**
 *
 */
export const closePresentationCandidateModal = () => ({
  type: CLOSE_PRESENTATION_CANDIDATE_MODAL
});
/**
 *
 */
export const openTakeAwayModal = () => ({
  type: OPEN_TAKE_AWAY_MODAL
});
/**
 *
 */
export const closeTakeAwayModal = () => ({
  type: CLOSE_TAKE_AWAY_MODAL
});
/**
 *
 */
export const setUiMode = (mode = 'edition') => ({
  type: SET_UI_MODE,
  mode
});

export const setAsideUiMode = (mode = 'sections') => ({
  type: SET_ASIDE_UI_MODE,
  mode
});

const GLOBAL_UI_DEFAULT_STATE = {
    /**
     * Represents whether configuration/new presentation modal is open
     * @type {boolean}
     */
    presentationCandidateModalOpen: false,
    /**
     * Represents whether take away / export modal is open
     * @type {boolean}
     */
    takeAwayModalOpen: false,
    /**
     * Represents  the uuid of the presentation being edited
     * @type {string}
     */
    activePresentationId: undefined,
    /**
     * Represents whether settings are visible for selected slide
     * @type {boolean}
     */
    slideSettingsPannelOpen: false,
    /**
     * Represents a state machine for the ui screens
     * @type {string}
     */
    uiMode: 'edition', // in ['edition', 'preview'],
    /**
     * Represents the state of the aside column
     * @type {string}
     */
    asideUiMode: 'resources', // in ['sections', 'resources'],
};
/**
 * This redux reducer handles the global ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 */
function globalUi(state = GLOBAL_UI_DEFAULT_STATE, action) {
  switch (action.type) {
    case RESET_APP:
      return GLOBAL_UI_DEFAULT_STATE;
    case APPLY_PRESENTATION_CANDIDATE_CONFIGURATION:
      return {
        ...state,
        presentationCandidateModalOpen: false,
        activePresentationId: action.presentation.id,
      };
    case SET_ACTIVE_PRESENTATION:
      return {
        ...state,
        activePresentationId: action.presentation.id,
      };
    case UNSET_ACTIVE_PRESENTATION:
      return {
        ...state,
        activePresentationId: undefined,
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
    case SET_ASIDE_UI_MODE:
      return {
        ...state,
        asideUiMode: action.mode
      };
    default:
      return state;
  }
}

/**
 * The module exports a reducer connected to pouchdb thanks to redux-pouchdb
 */
export default combineReducers({
  globalUi: persistentReducer(globalUi, 'bulgur-globalUi')
});

/**
 * Selectors related to global ui
 */
const activePresentationId = state => state.globalUi.activePresentationId;
const isPresentationCandidateModalOpen = state => state.globalUi.presentationCandidateModalOpen;
const isTakeAwayModalOpen = state => state.globalUi.takeAwayModalOpen;
const slideSettingsPannelState = state => state.globalUi.slideSettingsPannelState;
const globalUiMode = state => state.globalUi.uiMode;
const asideUiMode = state => state.globalUi.asideUiMode;
/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  activePresentationId,
  globalUiMode,
  asideUiMode,
  isPresentationCandidateModalOpen,
  isTakeAwayModalOpen,
  slideSettingsPannelState,
});
