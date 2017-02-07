/**
 * This module exports logic-related elements for the bulgur editor feature
 * This module follows the ducks convention for putting in the same place actions, action types, 
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module bulgur/editor
 */

import { combineReducers } from 'redux';
import { createStructuredSelector } from 'reselect';
import { v4 as uuid } from 'uuid';
import { persistentReducer } from 'redux-pouchdb';

import {
  mapMapData,
  mapTimelineData,
  mapNetworkData
} from 'quinoa-vis-modules';

import { bootstrapColorsMap } from '../../helpers/colorHelpers';

import models from '../../models/visualizationTypes';

/*
 * Action names
 */
export const RESET_APP = 'RESET_APP';
/*
 * actions related to global presentations management in ui
 */
export const START_PRESENTATION_CANDIDATE_CONFIGURATION = 'START_PRESENTATION_CANDIDATE_CONFIGURATION';
export const APPLY_PRESENTATION_CANDIDATE_CONFIGURATION = 'APPLY_PRESENTATION_CANDIDATE_CONFIGURATION';
export const SET_ACTIVE_PRESENTATION = 'SET_ACTIVE_PRESENTATION';
export const UNSET_ACTIVE_PRESENTATION = 'UNSET_ACTIVE_PRESENTATION';
/*
 * actions related to active presentation's slides
 */
export const ADD_SLIDE = 'ADD_SLIDE';
export const REMOVE_SLIDE = 'REMOVE_SLIDE';
export const SET_ACTIVE_SLIDE = 'SET_ACTIVE_SLIDE';
export const UPDATE_SLIDE = 'UPDATE_SLIDE';
/*
 * actions related to global ui
 */
const OPEN_PRESENTATION_CANDIDATE_MODAL = 'OPEN_PRESENTATION_CANDIDATE_MODAL';
const CLOSE_PRESENTATION_CANDIDATE_MODAL = 'CLOSE_PRESENTATION_CANDIDATE_MODAL';
const OPEN_TAKE_AWAY_MODAL = 'OPEN_TAKE_AWAY_MODAL';
const CLOSE_TAKE_AWAY_MODAL = 'CLOSE_TAKE_AWAY_MODAL';
const SET_UI_MODE = 'SET_UI_MODE';
const TOGGLE_SLIDE_SETTINGS_PANNEL = 'TOGGLE_SLIDE_SETTINGS_PANNEL';
/*
 * actions related to active view
 */
export const CHANGE_VIEW_BY_USER = 'CHANGE_VIEW_BY_USER';
export const SET_VIEW_COLOR = 'SET_VIEW_COLOR';
const TOGGLE_VIEW_COLOR_EDITION = 'TOGGLE_VIEW_COLOR_EDITION';
export const SET_VIEW_DATAMAP_ITEM = 'SET_VIEW_DATAMAP_ITEM';

/*
 * Action creators
 */

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
 * @param {string} id - the id of the view that has been changed
 * @param {object} event - the event object representing the interaction (contains two keys: lastEventType and viewParameters)
 */
export const changeViewByUser = (id, event) => ({
  type: CHANGE_VIEW_BY_USER,
  event,
  id
});
/**
 * @param {string} id - the id of the slide to add
 * @param {object} slide - the content of the slide to add
 */
export const addSlide = (id, slide = {}) => ({
  type: ADD_SLIDE,
  slide,
  id
});
/**
 * @param {string} id - the id of the slide to update
 * @param {object} slide - the content of the slide to update
 */
export const updateSlide = (id, slide = {}) => ({
  type: UPDATE_SLIDE,
  slide,
  id
});
/**
 * @param {string} id - the id of the slide to remove
 */
export const removeSlide = (id) => ({
  type: REMOVE_SLIDE,
  id
});
/**
 * @param {string} id - the id of the slide to set as active
 * @param {object} slide - the content of the slide to set as active (because related reducers may not have it)
 */
export const setActiveSlide = (id, slide) => ({
  type: SET_ACTIVE_SLIDE,
  slide,
  id
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
/**
 * @param {boolean} to - the state to move the slide settings pannel to
 */
export const toggleSlideSettingsPannel = (to) => ({
  type: TOGGLE_SLIDE_SETTINGS_PANNEL,
  to
});
/**
 * @param {string} visualizationId - the uuid of the categoric value's color's visualisation id to toggle
 * @param {string} collectionId - the uuid of the categoric value's color's collection id (e.g. : "nodes", "edges", "main") to toggle
 * @param {string} category - the name of the categoric value to edit
 */
export const toggleViewColorEdition = (visualizationId, collectionId, category) => ({
  type: TOGGLE_VIEW_COLOR_EDITION,
  visualizationId,
  collectionId,
  category
});
/**
 * @param {string} visualizationId - the categoric value's color's visualisation id to toggle
 * @param {string} collectionId - the categoric value's color's collection id (e.g. : "nodes", "edges", "main") to toggle
 * @param {string} category - the name of the categoric value to set to edition
 * @param {string} color - the color (hex, color name, rgb) to set to the given category
 */
export const setViewColor = (visualizationId, collectionId, category, color) => ({
  type: SET_VIEW_COLOR,
  visualizationId,
  collectionId,
  category,
  color
});
/**
 * @param {string} visualizationId - the changed parameter's visualisation id to change
 * @param {string} parameterId - the id of the visualization's parameter to changed
 * @param {string} collectionId - the changed parameter's collection id to change
 * @param {string} propertyName - the property name to set for the new data map parameter
 */
export const setViewDatamapItem = (visualizationId, parameterId, collectionId, propertyName) => ({
  type: SET_VIEW_DATAMAP_ITEM,
  visualizationId,
  parameterId,
  collectionId,
  propertyName
});
/**
 *
 */
export const resetApp = () => ({
  type: RESET_APP
});

/*
 * Reducers
 */

const EDITOR_DEFAULT_STATE = {
    /**
     * Representation of all the editor's active views (should contain anything necessary to render the views)
     * @type {object}
     */
    activeViews: undefined,
    /**
     * uuid of the slide being edited in editor
     * @type {string}
     */
    activeSlideId: undefined,
    /**
     * Representation of the legend's color being edited in the editor
     * @type {object}
     */
    editedColor: undefined
};
/**
 * This redux reducer handles the modification of the active presentation edited by user and related ui states
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 */
function editor(state = EDITOR_DEFAULT_STATE, action) {
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
        // flatten datamap fields (#todo: refactor as helper)
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
          case 'map':
            data = mapMapData(visualization.data, dataMap);
            break;
          case 'timeline':
            data = mapTimelineData(visualization.data, dataMap);
            break;
          case 'network':
            data = mapNetworkData(visualization.data, dataMap);
            break;
          default:
            data = visualization.data;
            break;
        }
        const colorsMap = visualization.colorsMap;
        // delete visualization.colorsMap;
        return {
          ...result,
          [visualizationKey]: {
            ...visualization,
            viewParameters: {
              ...viewParameters,
              colorsMap
            },
            data
          }
        };
      }, {});
      return {
        ...state,
        activeViews: {
          ...defaultViews
        },
        activeSlideId: action.presentation.order && action.presentation.order.length ?
          action.presentation.order[0]
          : state.activeSlideId
      };
    case CHANGE_VIEW_BY_USER:
      return {
        ...state,
        activeViews: {
          ...state.activeViews,
          [action.id]: {
            ...state.activeViews[action.id],
            viewParameters: {
              ...state.activeViews[action.id].viewParameters,
              ...action.event.viewParameters
            }
          }
        }
      };


    case ADD_SLIDE:
    case SET_ACTIVE_SLIDE:
      return {
        ...state,
        activeSlideId: action.id,
        activeViews: Object.keys(state.activeViews).reduce((activeViews, id) => ({
          ...activeViews,
          [id]: {
            ...state.activeViews[id],
            // update data map
            dataMap: action.slide.views[id].dataMap,
            // updated view parameters
            viewParameters: action.slide.views[id].viewParameters
          }
        }), {})
      };

    case TOGGLE_VIEW_COLOR_EDITION:
      const {collectionId, category, visualizationId} = action;
      if (state.editedColor === undefined || state.editedColor.collectionId !== collectionId || state.editedColor.category !== category) {
        return {
          ...state,
          editedColor: {
            visualizationId,
            collectionId,
            category
          }
        };
      }
      return {
        ...state,
        editedColor: undefined
      };
    case SET_VIEW_COLOR:
      const {color} = action;
      return {
        ...state,
        editedColor: undefined,
        activeViews: {
          ...state.activeViews,
          [action.visualizationId]: {
            ...state.activeViews[action.visualizationId],
            viewParameters: {
              ...state.activeViews[action.visualizationId].viewParameters,
              colorsMap: {
                ...state.activeViews[action.visualizationId].viewParameters.colorsMap,
                [action.collectionId]: {
                  ...state.activeViews[action.visualizationId].viewParameters.colorsMap[action.collectionId],
                  [action.category]: color
                }
              }
            }
          }
        }
      };
    case SET_VIEW_DATAMAP_ITEM:
      let newcolorsMap;
      if (action.parameterId === 'category') {
        newcolorsMap = {...state.activeViews[action.visualizationId].viewParameters.colorsMap} || {};
        const dataset = state.activeViews[action.visualizationId].data[action.collectionId];
        newcolorsMap[action.collectionId] = bootstrapColorsMap(dataset, action.propertyName);
      }
      return {
        ...state,
        editedColor: undefined,
        activeViews: {
          ...state.activeViews,
          [action.visualizationId]: {
            ...state.activeViews[action.visualizationId],
            // update colorsMap
            colorsMap: newcolorsMap || state.activeViews[action.visualizationId].viewParameters.colorsMap,
            // updatedatamap
            dataMap: {
              ...state.activeViews[action.visualizationId].dataMap,
              [action.collectionId]: {
                ...state.activeViews[action.visualizationId].dataMap[action.collectionId],
                [action.parameterId]: {
                  ...state.activeViews[action.visualizationId].dataMap[action.collectionId][action.parameterId],
                  mappedField: action.propertyName
                }
              }
            }
          }
        }
      };

    default:
      return state;
  }
}

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
     * Represent a state machine for the ui screens
     * @type {string}
     */
    uiMode: 'edition' // in ['edition', 'preview']
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
    case TOGGLE_SLIDE_SETTINGS_PANNEL:
      return {
        ...state,
        slideSettingsPannelOpen: typeof action.to === 'boolean' ? action.to : !state.slideSettingsPannelOpen
      };
    default:
      return state;
  }
}
/**
 * The module exports a reducer connected to pouchdb thanks to redux-pouchdb
 */
export default persistentReducer(combineReducers({
  globalUi,
  editor
}), 'bulgur-editor');

/*
 * Selectors
 */
/*
 * Selectors related to global ui
 */
const activePresentationId = state => state.globalUi.activePresentationId;
const isPresentationCandidateModalOpen = state => state.globalUi.presentationCandidateModalOpen;
const isTakeAwayModalOpen = state => state.globalUi.takeAwayModalOpen;
const slideSettingsPannelIsOpen = state => state.globalUi.slideSettingsPannelOpen;
const globalUiMode = state => state.globalUi.uiMode;
/*
 * Selectors related to presentation edition ui management
 */
const editedColor = state => state.editor.editedColor;
const activeViews = state => state.editor.activeViews;
const activeSlideId = state => state.editor.activeSlideId;
/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  activePresentationId,
  activeSlideId,
  activeViews,
  editedColor,
  globalUiMode,
  isPresentationCandidateModalOpen,
  isTakeAwayModalOpen,
  slideSettingsPannelIsOpen,
});
