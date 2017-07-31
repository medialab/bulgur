
/**
 * This module exports logic-related elements for configuring the settings of a presentation
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux).
 * @module bulgur/features/PresentationsManager
 */
import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {v4 as uuid} from 'uuid';
import {persistentReducer} from 'redux-pouchdb';

import {
  loadExampleFile,
  getFileAsText
} from '../../helpers/fileLoader';

import analyzeDataset from '../../helpers/analyzeDataset';
import {generateColorsMap} from '../../helpers/colorHelpers';

import visualizationTypesModels from '../../models/visualizationTypes';

import {maxDataFileSizeInBytes, timers} from '../../../config';

import {
  parseNetworkData,
  parseMapData,
  parseTimelineData
} from 'quinoa-vis-modules';

/*
 * Action names
 */
import {
  RESET_APP,
  START_PRESENTATION_CANDIDATE_CONFIGURATION,
  APPLY_PRESENTATION_CANDIDATE_CONFIGURATION,
  CLOSE_PRESENTATION_CANDIDATE_MODAL,
} from '../GlobalUi/duck';

const FETCH_EXAMPLE_FILE = '§Bulgur/FETCH_EXAMPLE_FILE';
const FETCH_USER_FILE = '§Bulgur/ConfigurationDialog/FETCH_USER_FILE';

const RESET_PRESENTATION_CANDIDATE_SETTINGS = '§Bulgur/ConfigurationDialog/RESET_PRESENTATION_CANDIDATE_SETTINGS';

const SET_PRESENTATION_CANDIDATE_METADATA = '§Bulgur/ConfigurationDialog/SET_PRESENTATION_CANDIDATE_METADATA';
const SET_PRESENTATION_CANDIDATE_DATASET = '§Bulgur/ConfigurationDialog/SET_PRESENTATION_CANDIDATE_DATASET';
const SET_PRESENTATION_CANDIDATE_DATASET_METADATA = '§Bulgur/ConfigurationDialog/SET_PRESENTATION_CANDIDATE_DATASET_METADATA';
const SET_PRESENTATION_CANDIDATE_DATASET_DATA = '§Bulgur/ConfigurationDialog/SET_PRESENTATION_CANDIDATE_DATASET_DATA';
const UNSET_PRESENTATION_CANDIDATE_DATASET = 'UNSET_PRESENTATION_CANDIDATE_DATASET';
const SET_PRESENTATION_CANDIDATE_VISUALIZATION_TYPE = '§Bulgur/ConfigurationDialog/SET_PRESENTATION_CANDIDATE_VISUALIZATION_TYPE';
const SET_PRESENTATION_CANDIDATE_DATAMAP_ITEM = '§Bulgur/ConfigurationDialog/SET_PRESENTATION_CANDIDATE_DATAMAP_ITEM';
const SET_PRESENTATION_CANDIDATE_VIEW_OPTION = '§Bulgur/ConfigurationDialog/SET_PRESENTATION_CANDIDATE_VIEW_OPTION';

const SET_PREVIEW_VIEW_PARAMETERS = '§Bulgur/ConfigurationDialog/SET_PREVIEW_VIEW_PARAMETERS';
const SET_PRESENTATION_CANDIDATE_COLOR = '§Bulgur/ConfigurationDialog/SET_PRESENTATION_CANDIDATE_COLOR';
const TOGGLE_CANDIDATE_COLOR_EDITION = '§Bulgur/ConfigurationDialog/TOGGLE_CANDIDATE_COLOR_EDITION';
const SET_DATA_SOURCE_TAB = '§Bulgur/ConfigurationDialog/SET_DATA_SOURCE_TAB';
const SET_VISUALIZATION_IS_SPATIALIZING = '§Bulgur/ConfigurationDialog/SET_VISUALIZATION_IS_SPATIALIZING';
const SET_VISUALIZATION_NODES_POSITIONS = '§Bulgur/ConfigurationDialog/SET_VISUALIZATION_NODES_POSITIONS';
/*
 * Action creators
 */


/**
 * Sets a metadata value in the presentation candidate data
 * @param {string} field - the name of the metadata field to modify
 * @param {string} value - the value to set to the field to modify
 * @return {object} action - the redux action to dispatch
 */
export const setCandidatePresentationMetadata = (field, value) => ({
  type: SET_PRESENTATION_CANDIDATE_METADATA,
  field,
  value
});


/**
 * Sets a metadata value in one of the datasets of the presentation candidate
 * @param {string} datasetId - the id of the dataset to modify
 * @param {string} field - the name of the dataset's metadata field to modify
 * @param {string} value - the value to set to the field to modify
 * @return {object} action - the redux action to dispatch
 */
export const setCandidatePresentationDatasetMetadata = (datasetId, field, value) => ({
  type: SET_PRESENTATION_CANDIDATE_DATASET_METADATA,
  datasetId,
  field,
  value
});


/**
 * Sets the raw data of a given dataset in the presentation candidate
 * @param {string} datasetId - the id of the dataset to update
 * @param {string} rawData - the non-transformated raw data representing the dataset
 * @return {object} action - the redux action to dispatch
 */
export const setCandidatePresentationDatasetData = (datasetId, rawData) => ({
  type: SET_PRESENTATION_CANDIDATE_DATASET_DATA,
  datasetId,
  rawData
});


/**
 * Unsets a dataset of the presentation candidate candidate
 * @param {string} datasetId - the id of the dataset to unset
 * @return {object} action - the redux action to dispatch
 */
export const unsetPresentationCandidateDataset = (datasetId) => ({
  type: UNSET_PRESENTATION_CANDIDATE_DATASET,
  datasetId
});


/**
 * Sets a new/existing dataset in the preseentation candidate data
 * @param {object} dataset - the data of the new dataset to add
 * @param {string} id - the id of the new dataset to add
 * @return {object} action - the redux action to dispatch
 */
export const setCandidatePresentationDataset = (dataset = {metadata: {}, rawData: ''}, id) => ({
  type: SET_PRESENTATION_CANDIDATE_DATASET,
  dataset,
  id: id || uuid()
});


/**
 * Fetches an example file in the samples proposed to user
 * @param {object} sample - the data of the sample to load ({title, description, fileName})
 * @return {object} action - the redux action to dispatch
 */
export const fetchExampleFile = (sample) => ({
  type: FETCH_EXAMPLE_FILE,
  promise: (dispatch) => {
    return new Promise((resolve, reject) => {
      try {
        const fileName = sample.fileName;
        const str = loadExampleFile(fileName);
        const format = fileName.split('.').pop();
        dispatch(setCandidatePresentationDataset({
          metadata: {
            format,
            fileName,
            title: sample.title,
            description: sample.description,
            url: sample.url
          },
          rawData: str
        }));
      }
      catch (e) {
        return reject(e);
      }
    });
  }
});


/**
 * Fetches a file provided by the user
 * @param {object} file - the file representation of user file to fetch from his drive
 * @param {string} datasetId - the id of the dataset to update
 * @param {boolean} update - whether to update an existing dataset or create a new one
 * @return {object} action - the redux action to dispatch
 */
export const fetchUserFile = (file, datasetId, update = false) => ({
  type: FETCH_USER_FILE,
  promise: (dispatch) => {
    return new Promise((resolve, reject) => {
      // verify the file has a size under the max size handled by the app
      if (file.size > maxDataFileSizeInBytes) {
        // display an error state
        // the state will be toasted out after some time
        setTimeout(() => dispatch({type: FETCH_USER_FILE}), timers.ultraLong);
        // rejection should be handled as the display of the error in the ui
        return reject('File is too big (maximum allowed : ' + maxDataFileSizeInBytes / 1000 + ' kb)');
      }
      // get the file (note: at this point file type is supposed to have been checked so that is is correct)
      getFileAsText(file, (err, str) => {
        if (err) {
          reject(err);
        }
        else {
          // todo: put a validation hook for the data here
          // before integrating in the state ?
          const fileName = file.name;
          const format = fileName.split('.').pop();
          // dataset id is provided and update is authorized
          if (datasetId && update) {
            dispatch(setCandidatePresentationDatasetData(datasetId, str));
            dispatch(setCandidatePresentationDatasetMetadata(datasetId, 'format', format));
            dispatch(setCandidatePresentationDatasetMetadata(datasetId, 'fileName', fileName));
          }
          // new dataset (todo: does this make sense ?)
          else {
            dispatch(setCandidatePresentationDataset({
              metadata: {
                format,
                fileName,
                title: fileName,
                description: '',
                url: ''
              },
              rawData: str
            }));
          }
        }
      });
    });
  }
});


/**
 * Sets the visualization type of one of the presentation candidate's dataset
 * (reminder: the app is prepared to evolve to a multi-visualization version
 * even if not handled in the current version, so there are possibly multiple visualizations)
 * @param {string} visualizationId - the id of the presentation's visualization that changes of visualization type
 * @param {string} visualizationId - the type of the presentation's visualization that changes of visualization type
 * @return {object} action - the redux action to dispatch
 */
export const setPresentationCandidateVisualizationType = (visualizationId, visualizationType) => ({
  type: SET_PRESENTATION_CANDIDATE_VISUALIZATION_TYPE,
  visualizationType,
  visualizationId
});


/**
 * Sets one of the datamap items of one of the visualizations of the presentation candidate data
 * (reminder: the app is prepared to evolve to a multi-visualization version
 * even if not handled in the current version, so there are possibly multiple visualizations)
 * @param {string} visualizationId - the uuid of the presentation's visualization for the datamap to change
 * @param {string} parameterId - the uuid of the parameter for the datamap to change
 * @param {string} collectionId - the uuid of the data's collection concerned by the datamap change
 * @param {string} propertyName - the original data's property name to attribute to the given datamap item
 * @return {object} action - the redux action to dispatch
 */
export const setPresentationCandidateDatamapItem = (visualizationId, parameterId, collectionId, propertyName) => ({
  type: SET_PRESENTATION_CANDIDATE_DATAMAP_ITEM,
  visualizationId,
  parameterId,
  collectionId,
  propertyName
});


/**
 * Sets a view option in one of the visualizations of the presentation candidate data
 * (reminder: the app is prepared to evolve to a multi-visualization version
 * even if not handled in the current version, so there are possibly multiple visualizations)
 * @param {string} visualizationId - the uuid of the visualization to parameter
 * @param {string} parameterKey - the name of the parameter to set
 * @param {string} parameterValue - the value ot set
 * @return {object} action - the redux action to dispatch
 */
export const setPresentationCandidateViewOption = (visualizationId, parameterKey, parameterValue) => ({
  type: SET_PRESENTATION_CANDIDATE_VIEW_OPTION,
  visualizationId,
  parameterKey,
  parameterValue
});


/**
 * Sets a new color for a given category in one of the visualizations of presentation candidate data
 * (reminder: the app is prepared to evolve to a multi-visualization version
 * even if not handled in the current version, so there are possibly multiple visualizations)
 * @param {string} visualizationId - the uuid of the presentation's visualization for the color to change
 * @param {string} collectionId - the uuid of the data's collection concerned by the color change
 * @param {string} category - the categorical value that has to change its color mapping
 * @param {string} color - the color (name, #hex, rgb()) to attribute
 * @return {object} action - the redux action to dispatch
 */
export const setPresentationCandidateColor = (visualizationId, collectionId, category, color) => ({
  type: SET_PRESENTATION_CANDIDATE_COLOR,
  visualizationId,
  collectionId,
  category,
  color
});


/**
 * Sets the view parameters for the preview of one of the presentations
 * (reminder: the app is prepared to evolve to a multi-visualization version
 * even if not handled in the current version, so there are possibly multiple visualizations)
 * @param {string} visualizationId - the uuid of the presentation's visualization for the color to change
 * @param {object} viewParameters - the view parameters representing the preview state
 * @return {object} action - the redux action to dispatch
 */
export const setPreviewViewParameters = (visualizationId, viewParameters) => ({
  type: SET_PREVIEW_VIEW_PARAMETERS,
  visualizationId,
  viewParameters
});


/**
 * Resets the presentation candidate settings
 * @return {object} action - the redux action to dispatch
 */
export const resetPresentationCandidateSettings = () => ({
  type: RESET_PRESENTATION_CANDIDATE_SETTINGS
});


/**
 * Opens or closes the color edition state of a given category of objects
 * @param {string} visualizationId - the uuid of the presentation's visualization for the color to edit
 * @param {string} collectionId - the uuid of the data's collection concerned by the color edition change
 * @param {string} category - the categorical value that has to change its color mapping
 * @return {object} action - the redux action to dispatch
 */
export const toggleCandidateColorEdition = (visualizationId, collectionId, category) => ({
  type: TOGGLE_CANDIDATE_COLOR_EDITION,
  visualizationId,
  collectionId,
  category
});


/**
 * Sets the spatialization mode of one of the visualizations being previewed (used for network only for now)
 * @param {string} visualizationId - the uuid of the presentation's visualization for the isSpatializing toggling
 * @param {boolean} isSpatializing - the value to set
 * @return {object} action - the redux action to dispatch
 */
export const setVisualizationIsSpatializing = (visualizationId, isSpatializing) => ({
  type: SET_VISUALIZATION_IS_SPATIALIZING,
  visualizationId,
  isSpatializing
});


/**
 * Updates the data used by one of the visualizations with specific node positions (for network visualizations)
 * @param {string} visualizationId - the uuid of the presentation's visualization for the isSpatializing toggling
 * @param {array} nodes - the nodes to set
 * @return {object} action - the redux action to dispatch
 */
export const setVisualizationNodesPosition = (visualizationId, nodes) => ({
  type: SET_VISUALIZATION_NODES_POSITIONS,
  visualizationId,
  nodes
});


/**
 * Sets the tab to display for choosing a datasource (user input or samples)
 * @param {string} tab - the tab to set as active
 * @return {object} action - the redux action to dispatch
 */
export const setDataSourceTab = (tab) => ({
  type: SET_DATA_SOURCE_TAB,
  tab
});


/**
 * Representation of a basic, empty presentation
 * @type {object}
 */
const EMPTY_PRESENTATION = {
  type: 'presentation',
  metadata: {
    title: undefined,
    authors: [],
    description: '',
    gistId: undefined
  },
  datasets: {},
  visualizations: {
    [uuid()]: {}
  },
  slides: {},
  order: []
};


/**
 * Default state of the presentation candidate (used
 * to modify presentation data in a modal without affecting
 * the actual presentation data)
 */
const DEFAULT_PRESENTATION_CANDIDATE_DATA = {


  /**
   * Representation of the to-update/to-create presentation data
   * @type {object}
   */
  presentationCandidate: {
    metadata: {}
  }
};


/**
 * This redux reducer handles the modification of the data state of a presentation configuration dialog
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function presentationCandidateData(state = DEFAULT_PRESENTATION_CANDIDATE_DATA, action) {
  switch (action.type) {
    // cases state must be reset
    case RESET_APP:
    case CLOSE_PRESENTATION_CANDIDATE_MODAL:
    case APPLY_PRESENTATION_CANDIDATE_CONFIGURATION:
      return DEFAULT_PRESENTATION_CANDIDATE_DATA;
    // case a presentation candidate view is opened
    case START_PRESENTATION_CANDIDATE_CONFIGURATION:
      // configure existing presentation or setup new ?
      const candidateBeginingState = action.presentation ? JSON.parse(JSON.stringify(action.presentation)) : EMPTY_PRESENTATION;
      return {
        ...state,
        presentationCandidate: {
          ...candidateBeginingState,
          id: action.id
        }
      };
    // cases presentation candidate update
    case SET_PRESENTATION_CANDIDATE_METADATA:
      const value = action.field === 'authors' ? action.value.split(',') : action.value;
      return {
        ...state,
        presentationCandidate: {
          ...state.presentationCandidate,
          metadata: {
            ...state.presentationCandidate.metadata,
            [action.field]: value
          }
        }
      };
    case SET_PRESENTATION_CANDIDATE_DATASET:
      return {
        ...state,
        presentationCandidate: {
          ...state.presentationCandidate,
          datasets: {
            ...state.presentationCandidate.datasets,
            [action.id]: action.dataset
          }
        }
      };
    case UNSET_PRESENTATION_CANDIDATE_DATASET:
      const presentationCandidate = {
        ...state.presentationCandidate
      };
      delete state.presentationCandidate.datasets[action.datasetId];
      if (state.presentationCandidate.visualizations) {
        Object.keys(state.presentationCandidate.visualizations).forEach(visualizationKey => {
          state.presentationCandidate.visualizations[visualizationKey] = {};
        });
      }
      return {
        ...state,
        presentationCandidate
      };
    case SET_PRESENTATION_CANDIDATE_DATASET_DATA:
      return {
        ...state,
        presentationCandidate: {
          ...state.presentationCandidate,
          datasets: {
            ...state.presentationCandidate.datasets,
            [action.datasetId]: {
              ...state.presentationCandidate.datasets[action.datasetId],
              rawData: action.rawData
            }
          }
        }
      };
    case SET_PRESENTATION_CANDIDATE_DATASET_METADATA:
      return {
        ...state,
        presentationCandidate: {
          ...state.presentationCandidate,
          datasets: {
            ...state.presentationCandidate.datasets,
            [action.datasetId]: {
              ...state.presentationCandidate.datasets[action.datasetId],
              metadata: {
                ...state.presentationCandidate.datasets[action.datasetId].metadata,
                [action.field]: action.value
              }
            }
          }
        }
      };

    case SET_PRESENTATION_CANDIDATE_VISUALIZATION_TYPE:
      const visId = action.visualizationId;
      const visualizationType = action.visualizationType;
      let data;
      // concerning the following : here the fact 
      // of choosing by default the first dataset is temporary.
      // When/if we allow multiple datasets for a 
      // specific visualization type or several visualizations 
      // in a presentation this should be changed.

      // choose the first dataset in order 
      // to assess for data-compatible visualization types
      const firstDatasetId = state.presentationCandidate
        && state.presentationCandidate.datasets ?
          Object.keys(state.presentationCandidate.datasets)[0]
          : undefined;
      // normalize the data before analyzing it
      if (firstDatasetId) {
        const firstDataset = state.presentationCandidate.datasets[firstDatasetId];
        const str = firstDataset.rawData;
        const dataFormat = firstDataset.metadata.format;
        // parse data
        switch (visualizationType) {
          case 'map':
            data = parseMapData(str, dataFormat);
            break;
          case 'network':
            data = parseNetworkData(str, dataFormat);
            break;
          case 'timeline':
            data = parseTimelineData(str, dataFormat);
            break;
          case 'svg':
            data = str;
            break;
          default:
            break;
        }
      }
      // the datamap specifies how to map the datapoint of parsed data
      // to actually usable data points for the visualizations.
      // example of data mapping: "'color' dimension of input data points
      // should be mapped to 'category' dimension for visualization-ready output data"
      let dataMap = {...visualizationTypesModels[visualizationType].dataMap};
      const viewOptions = visualizationTypesModels[visualizationType].viewOptions && [...visualizationTypesModels[visualizationType].viewOptions];

      // analyze the data to produce a datamap for the visualization
      let dataProfile;
      let newcolorsMap = {
      };
      let flattenedDataMap;

      // todo: here avoiding this hook for svg would be better.
      // we avoid visualization type svg because it does not
      // need a data map (svg data is just xml).
      // This exception is dirty.
      // it should be handled in visualization types models
      // what visualization types need a data map
      // and what visualization types (like svg) do not.
      if (data && visualizationType !== 'svg') {
        dataProfile = analyzeDataset(data);
        // building the data map aimed at allowing datamap editing
        // shape of each datamap item: {acceptedValueTypes: <array>, id: <string>, mappedField: <string>}
        dataMap = Object.keys(dataMap).reduce((finDataMap, collectionId) => {
          const newCollection = Object.keys(dataMap[collectionId]).reduce((finCollection, parameterId) => {
            const parameter = {...dataMap[collectionId][parameterId]};
            // guessing some datamap associations from data prop names
            // example: if we have objects with a 'category' dimension in input data
            // and need to map it to a 'category' in output data
            // we do automatically the data mapping between this two
            const homonym = dataProfile[collectionId].find(field => field.propertyName.toLowerCase() === parameter.id.toLowerCase());
            if (homonym) {
              parameter.mappedField = homonym.propertyName;
            }
            return {
              ...finCollection,
              [parameterId]: parameter
            };
          }, {});
          return {
            ...finDataMap,
            [collectionId]: newCollection
          };
        }, {});

        // guessing color map if applicable
        newcolorsMap = Object.keys(dataMap)
          .reduce((colorsMap, collectionId) => {
            if (dataMap[collectionId].category.mappedField) {
              const dataset = data[collectionId];
              return {
                ...colorsMap,
                // automatic palete generation is handled by a helper
                [collectionId]: generateColorsMap(dataset, dataMap[collectionId].category.mappedField)
              };
            }
            return {
              ...colorsMap,
              [collectionId]: {
                default: '#d8d8d8'// todo: store that in a conf file
              }
            };
          }, newcolorsMap);

          // flatten datamap fields (to obtain a flat map like {'initialPropName': 'mappedPropName'})
          // for a more operationalized version of the datamap
          // todo: we have two times the same data formatted differently
          // (dataMap for use when editing the data map,
          // and flattenedDataMap for use when consuming it for visualization).
          // It might be handled in a smarter way
          flattenedDataMap = Object.keys(dataMap).reduce(
            (result, collectionId) => ({
              ...result,
              [collectionId]: Object.keys(dataMap[collectionId])
                .reduce(
                  (propsMap, parameterId) => {
                    const parameter = dataMap[collectionId][parameterId];
                    if (parameter.mappedField) {
                      return {
                        ...propsMap,
                        [parameterId]: parameter.mappedField
                      };
                    }
                    return propsMap;
                  },
                {})
            }),
            {}
          );
      }
      return {
        ...state,
        presentationCandidate: {
          ...state.presentationCandidate,
          visualizations: {
            ...state.presentationCandidate.visualizations,
            [visId]: {
              metadata: {
                visualizationType
              },
              data,
              dataProfile,
              flattenedDataMap,
              datasets: [firstDatasetId],
              viewParameters: {
                ...visualizationTypesModels[visualizationType].defaultViewParameters,
                colorsMap: newcolorsMap,
                dataMap,
                flattenedDataMap
              },
              viewOptions
            }
          }
        }
      };
    case SET_PRESENTATION_CANDIDATE_DATAMAP_ITEM:
      if (action.parameterId === 'category') {
        newcolorsMap = {...state.presentationCandidate.visualizations[action.visualizationId].viewParameters.colorsMap} || {};
        const dataset = state.presentationCandidate.visualizations[action.visualizationId].data[action.collectionId];
        newcolorsMap[action.collectionId] = generateColorsMap(dataset, action.propertyName);
      }
     const visualizationChanges = {
        // update colorsMap
        colorsMap: newcolorsMap || state.presentationCandidate.visualizations[action.visualizationId].viewParameters.colorsMap,
        // update datamap (editable data map)
        dataMap: {
          ...state.presentationCandidate.visualizations[action.visualizationId].viewParameters.dataMap,
          [action.collectionId]: {
            ...state.presentationCandidate.visualizations[action.visualizationId].viewParameters.dataMap[action.collectionId],
            [action.parameterId]: {
              ...state.presentationCandidate.visualizations[action.visualizationId].viewParameters.dataMap[action.collectionId][action.parameterId],
              mappedField: action.propertyName
            }
          }
        },
        // update flattened data map (operationalizable data map)
        flattenedDataMap: {
          ...state.presentationCandidate.visualizations[action.visualizationId].viewParameters.flattenedDataMap,
          [action.collectionId]: {
            ...state.presentationCandidate.visualizations[action.visualizationId].viewParameters.flattenedDataMap[action.collectionId],
            [action.parameterId]: action.propertyName
          }
        }
      };
     return {
        ...state,
        presentationCandidate: {
          ...state.presentationCandidate,
          visualizations: {
            ...state.presentationCandidate.visualizations,
            [action.visualizationId]: {
              ...state.presentationCandidate.visualizations[action.visualizationId],
              viewParameters: {
                ...state.presentationCandidate.visualizations[action.visualizationId].viewParameters,
                ...visualizationChanges
              }
            }
          }
        }
      };
    case SET_PRESENTATION_CANDIDATE_VIEW_OPTION:
      return {
        ...state,
        presentationCandidate: {
          ...state.presentationCandidate,
          visualizations: {
            ...state.presentationCandidate.visualizations,
            [action.visualizationId]: {
              ...state.presentationCandidate.visualizations[action.visualizationId],
              viewParameters: {
                ...state.presentationCandidate.visualizations[action.visualizationId].viewParameters,
                [action.parameterKey]: action.parameterValue
              }
            }
          }
        }
      };
    case SET_PRESENTATION_CANDIDATE_COLOR:
      const {collectionId, category, color} = action;
      const finalColor = color.hex || color;
      return {
        ...state,
        presentationCandidate: {
          ...state.presentationCandidate,
          visualizations: {
            ...state.presentationCandidate.visualizations,
            [action.visualizationId]: {
              ...state.presentationCandidate.visualizations[action.visualizationId],
              viewParameters: {
                ...state.presentationCandidate.visualizations[action.visualizationId].viewParameters,
                // update colorsMap
                colorsMap: {
                  ...state.presentationCandidate.visualizations[action.visualizationId].viewParameters.colorsMap,
                  [collectionId]: {
                    ...state.presentationCandidate.visualizations[action.visualizationId].viewParameters.colorsMap[collectionId],
                    [category]: finalColor
                  }
                }
              }
            }
          }
        }
      };
    // a visualization preview is changed by user
    case SET_PREVIEW_VIEW_PARAMETERS:
      const {viewParameters} = action;
      if (state.presentationCandidate && state.presentationCandidate.visualizations) {
        return {
          ...state,
          presentationCandidate: {
            ...state.presentationCandidate,
            visualizations: {
              ...state.presentationCandidate.visualizations,
              [action.visualizationId]: {
                ...state.presentationCandidate.visualizations[action.visualizationId],
                viewParameters
              }
            }
          }
        };
      }
      return state;
    // user changes the spatialization mode of a previewed network visualization
    case SET_VISUALIZATION_IS_SPATIALIZING:
      return {
        ...state,
        presentationCandidate: {
          ...state.presentationCandidate,
          visualizations: {
            ...state.presentationCandidate.visualizations,
            [action.visualizationId]: {
              ...state.presentationCandidate.visualizations[action.visualizationId],
              isSpatializing: action.isSpatializing !== undefined ? action.isSpatializing : (!state.presentationCandidate.visualizations[action.visualizationId].isSpatializing || false)
            }
          }
        }
      };
    // user saves the position of the nodes in a previewed networ visualization
    case SET_VISUALIZATION_NODES_POSITIONS:
      const nodes = action.nodes;
      return {
        ...state,
        presentationCandidate: {
          ...state.presentationCandidate,
          visualizations: {
            ...state.presentationCandidate.visualizations,
            [action.visualizationId]: {
              ...state.presentationCandidate.visualizations[action.visualizationId],
              isSpatializing: undefined,
              // note: for now this is the only case
              // where bulgur allows to modify the data
              // provided in a visualization.
              // In all other cases it is directly copied
              // from one of the presentation's datasets
              data: {
                ...state.presentationCandidate.visualizations[action.visualizationId].data,
                nodes: state.presentationCandidate.visualizations[action.visualizationId].data.nodes.map(node => {
                  const nodeChanges = nodes.find(n2 => n2.id === node.id);
                  return {
                    ...node,
                    ...nodeChanges
                  };
                })
              }
            }
          }
        }
      };
    // the presentation candidate settings are reset
    case RESET_PRESENTATION_CANDIDATE_SETTINGS:
      return DEFAULT_PRESENTATION_CANDIDATE_DATA;
    default:
      return state;
  }
}


/**
 * Default state of the presentation candidate ui
 */
const PRESENTATION_CANDIDATE_UI_DEFAULT_STATE = {


  /**
   * Representation of the color being edited in the editor
   * @type {object}
   */
  editedColor: undefined,


  /**
   * Representation of the previews states
   * @type {object}
   */
  previewsParameters: {},


   /**
    * Representation of the status of file fetching status
    * @type {string}
    */
  fetchUserFileStatus: undefined,


   /**
    * Representation of the datasource tab
    * @type {string}
    */
  dataSourceTab: 'computer'
};


/**
 * This redux reducer handles the modification of the ui state of a presentation configuration dialog
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function presentationCandidateUi (state = PRESENTATION_CANDIDATE_UI_DEFAULT_STATE, action) {
  switch (action.type) {
    // cases the state is reset
    case RESET_APP:
    case CLOSE_PRESENTATION_CANDIDATE_MODAL:
    case APPLY_PRESENTATION_CANDIDATE_CONFIGURATION:
      return PRESENTATION_CANDIDATE_UI_DEFAULT_STATE;

    // user opens or closes the color edition of a given category of data points
    case TOGGLE_CANDIDATE_COLOR_EDITION:
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
      else {
        return {
          ...state,
          editedColor: undefined
        };
      }
    // user begins to input a data file
    case FETCH_USER_FILE:
      return {
        ...state,
        fetchUserFileStatus: undefined
      };
    // user data file fails to load
    case FETCH_USER_FILE + '_FAIL':
      return {
        ...state,
        fetchUserFileStatus: action.errorMessage
      };
    // user changes the tab allowing to change data source
    // (between samples and user inputs)
    case SET_DATA_SOURCE_TAB :
      return {
        ...state,
        dataSourceTab: action.tab
      };
    default:
      return state;
  }
}


/**
 * The module exports a reducer connected to pouchdb thanks to redux-pouchdb
 */
export default persistentReducer(combineReducers({
  presentationCandidateData,
  presentationCandidateUi
}), 'bulgur-configuration');

/*
 * Selectors
 */
const presentationCandidate = state => state.presentationCandidateData &&
  state.presentationCandidateData.presentationCandidate;
const activeVisualizationType = state => state.presentationCandidateSettings &&
  state.presentationCandidateSettings.visualizationType;
const activeData = state => state.presentationCandidateData &&
  state.presentationCandidateData.data;
const invalidFileType = state => state.presentationCandidateData &&
  state.presentationCandidateData.invalidFileType;
const editedColor = state => state.presentationCandidateUi &&
  state.presentationCandidateUi.editedColor;
const fetchUserFileStatus = state => state.presentationCandidateUi &&
  state.presentationCandidateUi.fetchUserFileStatus;
const dataSourceTab = state => state.presentationCandidateUi &&
  state.presentationCandidateUi.dataSourceTab;


/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  activeData,
  activeVisualizationType,
  editedColor,
  invalidFileType,
  presentationCandidate,
  fetchUserFileStatus,
  dataSourceTab
});

