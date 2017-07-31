/**
 * This module exports logic-related elements for the bulgur presentation editor feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module bulgur/features/PresentationEditor
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {persistentReducer} from 'redux-pouchdb';

import {
  mapMapData,
  mapTimelineData,
  mapNetworkData
} from 'quinoa-vis-modules';

import {generateColorsMap} from '../../helpers/colorHelpers';

import models from '../../models/visualizationTypes';

/*
 * Action names
 */
import {
  RESET_APP,
  SET_ACTIVE_PRESENTATION,
  APPLY_PRESENTATION_CANDIDATE_CONFIGURATION,
} from '../GlobalUi/duck';
/*
 * actions related to active presentation's slides
 */
export const ADD_SLIDE = '$Bulgur/PresentationEditor/ADD_SLIDE';
export const REMOVE_SLIDE = '$Bulgur/PresentationEditor/REMOVE_SLIDE';
export const SET_ACTIVE_SLIDE = '$Bulgur/PresentationEditor/SET_ACTIVE_SLIDE';
export const UPDATE_SLIDE = '$Bulgur/PresentationEditor/UPDATE_SLIDE';
export const MOVE_SLIDE = '$Bulgur/PresentationEditor/MOVE_SLIDE';
/*
 * actions related to active view
 */
export const SET_SLIDE_SETTINGS_PANNEL_STATE = '$Bulgur/PresentationEditor/SET_SLIDE_SETTINGS_PANNEL_STATE';
export const CHANGE_VIEW_BY_USER = '$Bulgur/PresentationEditor/CHANGE_VIEW_BY_USER';
export const SET_VIEW_COLOR = '$Bulgur/PresentationEditor/SET_VIEW_COLOR';
const TOGGLE_VIEW_COLOR_EDITION = '$Bulgur/PresentationEditor/TOGGLE_VIEW_COLOR_EDITION';
export const SET_VIEW_DATAMAP_ITEM = '$Bulgur/PresentationEditor/SET_VIEW_DATAMAP_ITEM';
export const SET_SHOWN_CATEGORIES = '$Bulgur/PresentationEditor/SET_SHOWN_CATEGORIES';

/*
 * Action creators
 */


/**
 * Sets new view parameters for one of the visualizations of the editor
 * (reminder: there can be several visualizations for a presentation, even
 * if not allowed in the editor for now)
 * @param {string} id - the id of the view that has been changed
 * @param {object} event - the event object representing the interaction (contains two keys: lastEventType and viewParameters)
 * @return {object} action - the redux action to dispatch
 */
export const changeViewByUser = (id, event) => ({
  type: CHANGE_VIEW_BY_USER,
  event,
  id
});

/**
 * Adds a new slide to the current presentation being edited
 * @param {string} id - the id of the slide to add
 * @param {object} slide - the content of the slide to add
 * @param {object} order - the position in slides list in which to add the slide
 * @return {object} action - the redux action to dispatch
 */
export const addSlide = (id, slide = {}, order) => ({
  type: ADD_SLIDE,
  slide,
  id,
  order
});

/**
 * Updates a slide in the current presentation
 * @param {string} id - the id of the slide to update
 * @param {object} slide - the content of the slide to update
 * @return {object} action - the redux action to dispatch
 */
export const updateSlide = (id, slide = {}) => ({
  type: UPDATE_SLIDE,
  slide,
  id
});

/**
 * Moves a slide in the current presentation
 * @param {number} fromIndex - the original index of the slide to move
 * @param {number} toIndex - the target index of the slide to move
 * @return {object} action - the redux action to dispatch
 */
export const moveSlide = (fromIndex, toIndex) => ({
  type: MOVE_SLIDE,
  fromIndex,
  toIndex
});

/**
 * Removes a slide in the current presentation
 * @param {string} id - the id of the slide to remove
 * @return {object} action - the redux action to dispatch
 */
export const removeSlide = (id) => ({
  type: REMOVE_SLIDE,
  id
});

/**
 * Sets the active slide in the editor
 * @param {string} id - the id of the slide to set as active
 * @param {object} slide - the content of the slide to set as active (because related reducers may not have it)
 * @return {object} action - the redux action to dispatch
 */
export const setActiveSlide = (id, slide) => ({
  type: SET_ACTIVE_SLIDE,
  slide,
  id
});

/**
 * Sets the state of the settings pannel (in [undefined, 'categories', 'parameters'])
 * @param {string | undefined} to - the state to move the slide settings pannel to
 * @return {object} action - the redux action to dispatch
 */
export const setSlideSettingsPannelState = (to) => ({
  type: SET_SLIDE_SETTINGS_PANNEL_STATE,
  to
});

/**
 * Toogles the color edition interface of a category in a specific visualization
 * @param {string} visualizationId - the uuid of the categoric value's color's visualisation id to toggle
 * @param {string} collectionId - the uuid of the categoric value's color's collection id (e.g. : "nodes", "edges", "main") to toggle
 * @param {string} category - the name of the categoric value to edit
 * @return {object} action - the redux action to dispatch
 */
export const toggleViewColorEdition = (visualizationId, collectionId, category) => ({
  type: TOGGLE_VIEW_COLOR_EDITION,
  visualizationId,
  collectionId,
  category
});

/**
 * Sets the color for a specific category of a specific visualization of the edited view
 * @param {string} visualizationId - the categoric value's color's visualisation id to toggle
 * @param {string} collectionId - the categoric value's color's collection id (e.g. : "nodes", "edges", "main") to toggle
 * @param {string} category - the name of the categoric value to set to edition
 * @param {string} color - the color (hex, color name, rgb) to set to the given category
 * @return {object} action - the redux action to dispatch
 */
export const setViewColor = (visualizationId, collectionId, category, color) => ({
  type: SET_VIEW_COLOR,
  visualizationId,
  collectionId,
  category,
  color
});

/**
 * Sets the data map value of current view for a specific visualization & datamap item
 * @param {object} visualizations - the visualizations of the active presentation to use for data mapping
 * @param {string} visualizationId - the changed parameter's visualisation id to change
 * @param {string} parameterId - the id of the visualization's parameter to changed
 * @param {string} collectionId - the changed parameter's collection id to change
 * @param {string} propertyName - the property name to set for the new data map parameter
 * @return {object} action - the redux action to dispatch
 */
export const setViewDatamapItem = (visualizations, visualizationId, parameterId, collectionId, propertyName) => ({
  type: SET_VIEW_DATAMAP_ITEM,
  visualizationId,
  parameterId,
  collectionId,
  propertyName,
  visualizations
});

/**
 * Sets the list of categories to show for a given data collection in a given visualization
 * @param {string} visualizationId - the changed parameter's visualisation id to change
 * @param {string} collectionId - the changed parameter's collection id to change
 * @param {string} shownCategories - the array of new categories to set
 * @return {object} action - the redux action to dispatch
 */
export const setShownCategories = (visualizationId, collectionId, shownCategories) => ({
  type: SET_SHOWN_CATEGORIES,
  visualizationId,
  collectionId,
  shownCategories
});

/*
 * Reducers
 */


/**
 * Default state of the presentation editor
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
    editedColor: undefined,

    /**
     * Represents the state of the advanced options pannel
     * (in [undefined, 'categories', 'parameters'])
     */
    slideSettingsPannelState: undefined,
};

/**
 * This redux reducer handles the modification of the active presentation edited by user and related ui states
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function editor(state = EDITOR_DEFAULT_STATE, action) {
  let newcolorsMap;
  let data;
  let shownCategories;
  switch (action.type) {

    // cases application is reset
    case RESET_APP:
      return EDITOR_DEFAULT_STATE;

    // a new presentation is set
    // reducer builds the proper data for displaying current views
    // according with the presentation data
    case APPLY_PRESENTATION_CANDIDATE_CONFIGURATION:
    case SET_ACTIVE_PRESENTATION:
      const defaultViews = Object.keys(action.presentation.visualizations).reduce((result, visualizationKey) => {
        const visualization = action.presentation.visualizations[visualizationKey];
        shownCategories = Object.keys(visualization.viewParameters.colorsMap).reduce((currentObject, collectionId) => ({
          ...currentObject,
          [collectionId]: Object.keys(visualization.viewParameters.colorsMap[collectionId])
        }), {});
        const viewParameters = {
          ...models[visualization.metadata.visualizationType].defaultViewParameters,
          ...visualization.viewParameters,
          shownCategories
        };
        switch (visualization.metadata.visualizationType) {
          case 'map':
            data = mapMapData(visualization.data, viewParameters.flattenedDataMap);
            break;
          case 'timeline':
            data = mapTimelineData(visualization.data, viewParameters.flattenedDataMap);
            break;
          case 'network':
            data = mapNetworkData(visualization.data, viewParameters.flattenedDataMap);
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
        },
        activeSlideId: action.presentation.order && action.presentation.order.length ?
          action.presentation.order[0]
          : state.activeSlideId
      };
    // user changes the view parameters of one of the views
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

    // user adds a new slide or set one as active
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
            dataMap: action.slide.views[id].viewParameters.dataMap,
            flattenedDataMap: action.slide.views[id].viewParameters.flattenedDataMap,
            // updated view parameters
            viewParameters: action.slide.views[id].viewParameters
          }
        }), {})
      };

    // a category color is edited
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
    // a category color is set
    case SET_VIEW_COLOR:
      const {color} = action;
      return {
        ...state,
        // editedColor: undefined,
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
    // a datamap dimension is changed
    case SET_VIEW_DATAMAP_ITEM:
      // in case datamap is "category" we have to update colors map
      // as it is built on top of the "category" unique values of data points
      // todo: this is a bit dirty
      if (action.parameterId === 'category') {
        const visualization = state.activeViews[action.visualizationId];
        newcolorsMap = {...visualization.viewParameters.colorsMap} || {};
        const dataset = action.visualizations[action.visualizationId].data[action.collectionId];
        newcolorsMap[action.collectionId] = generateColorsMap(dataset, action.propertyName);
        shownCategories = Object.keys(newcolorsMap).reduce((result, thatCollectionId) => ({
          ...result,
          [thatCollectionId]: Object.keys(newcolorsMap[thatCollectionId])
        }), {});
      }
      return {
        ...state,
        editedColor: undefined,
        activeViews: {
          ...state.activeViews,
          [action.visualizationId]: {
            ...state.activeViews[action.visualizationId],
            viewParameters: {
              ...state.activeViews[action.visualizationId].viewParameters,
              // update colorsMap
              colorsMap: newcolorsMap || state.activeViews[action.visualizationId].viewParameters.colorsMap,
              shownCategories: shownCategories || state.activeViews[action.visualizationId].viewParameters.shownCategories,
              // update datamap
              dataMap: {
                ...state.activeViews[action.visualizationId].viewParameters.dataMap,
                [action.collectionId]: {
                  ...state.activeViews[action.visualizationId].viewParameters.dataMap[action.collectionId],
                  [action.parameterId]: {
                    ...state.activeViews[action.visualizationId].viewParameters.dataMap[action.collectionId][action.parameterId],
                    mappedField: action.propertyName
                  }
                }
              },
              flattenedDataMap: {
                ...state.activeViews[action.visualizationId].flattenedDataMap,
                [action.collectionId]: {
                  ...state.activeViews[action.visualizationId].flattenedDataMap[action.collectionId],
                  [action.parameterId]: action.propertyName
                }
              }
            }
          }
        }
      };
    // filters are changed
    case SET_SHOWN_CATEGORIES:
      return {
        ...state,
        editedColor: undefined,
        activeViews: {
          ...state.activeViews,
          [action.visualizationId]: {
            ...state.activeViews[action.visualizationId],
            viewParameters: {
              ...state.activeViews[action.visualizationId].viewParameters,
              shownCategories: {
                ...state.activeViews[action.visualizationId].viewParameters.shownCategories,
                [action.collectionId]: action.shownCategories
              }
            }
          }
        }
      };
    // view's advanced settings pannel is changed ([undefined, 'categories', 'parameters'])
    case SET_SLIDE_SETTINGS_PANNEL_STATE:
      return {
        ...state,
        slideSettingsPannelState: action.to
      };

    default:
      return state;
  }
}


/**
 * The module exports a reducer connected to pouchdb thanks to redux-pouchdb
 */
export default persistentReducer(combineReducers({
  editor
}), 'bulgur-editor');

/*
 * Selectors
 */
/*
 * Selectors related to presentation edition ui management
 */
const editedColor = state => state.editor.editedColor;
const activeViews = state => state.editor.activeViews;
const activeSlideId = state => state.editor.activeSlideId;
const slideSettingsPannelState = state => state.editor.slideSettingsPannelState;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  activeSlideId,
  activeViews,
  editedColor,
  slideSettingsPannelState,
});
