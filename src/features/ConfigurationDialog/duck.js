/**
 * This module exports logic-related elements for configuring the settings of a presentation
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
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

import {maxDataFileSizeInBytes} from '../../../config';

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
  CLOSE_PRESENTATION_CANDIDATE_MODAL
} from '../Editor/duck';

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
 * @param {string} field - the name of the metadata field to modify
 * @param {string} value - the value to set to the field to modify
 */
export const setCandidatePresentationMetadata = (field, value) => ({
  type: SET_PRESENTATION_CANDIDATE_METADATA,
  field,
  value
});
/**
 * @param {string} datasetId - the id of the dataset to modify
 * @param {string} field - the name of the dataset's metadata field to modify
 * @param {string} value - the value to set to the field to modify
 */
export const setCandidatePresentationDatasetMetadata = (datasetId, field, value) => ({
  type: SET_PRESENTATION_CANDIDATE_DATASET_METADATA,
  datasetId,
  field,
  value
});
/**
 * @param {string} datasetId - the id of the dataset to update
 * @param {string} rawData - the non-transformated raw data representing the dataset
 */
export const setCandidatePresentationDatasetData = (datasetId, rawData) => ({
  type: SET_PRESENTATION_CANDIDATE_DATASET_DATA,
  datasetId,
  rawData
});
/**
 * @param {string} datasetId - the id of the dataset to unset
 */
export const unsetPresentationCandidateDataset = (datasetId) => ({
  type: UNSET_PRESENTATION_CANDIDATE_DATASET,
  datasetId
});
/**
 * @param {object} dataset - the data of the new dataset to add
 * @param {string} id - the id of the new dataset to add
 */
export const setCandidatePresentationDataset = (dataset = {metadata: {}, rawData: ''}, id) => ({
  type: SET_PRESENTATION_CANDIDATE_DATASET,
  dataset,
  id: id || uuid()
});
/**
 * @param {object} sample - the data of the sample to load
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
 * @param {object} file - the file representation of user file to fetch from his drive
 * @param {string} datasetId - the id of the dataset to update
 * @param {boolean} update - whether to update an existing dataset or create a new one
 */
export const fetchUserFile = (file, datasetId, update = false) => ({
  type: FETCH_USER_FILE,
  promise: (dispatch) => {
    return new Promise((resolve, reject) => {
      if (file.size > maxDataFileSizeInBytes) {
        // fading the message away
        setTimeout(() => dispatch({type: FETCH_USER_FILE}), 5000);
        return reject('File is too big (maximum allowed : ' + maxDataFileSizeInBytes / 1000 + ' kb)');
      }
      getFileAsText(file, (err, str) => {
        if (err) {
          reject(err);
        }
        else {
          const fileName = file.name;
          const format = fileName.split('.').pop();
          if (datasetId && update) {
            dispatch(setCandidatePresentationDatasetData(datasetId, str));
            dispatch(setCandidatePresentationDatasetMetadata(datasetId, 'format', format));
            dispatch(setCandidatePresentationDatasetMetadata(datasetId, 'fileName', fileName));
          }
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
 * @param {string} visualizationId - the id of the presentation's visualization that changes of visualization type
 * @param {string} visualizationId - the type of the presentation's visualization that changes of visualization type
 */
export const setPresentationCandidateVisualizationType = (visualizationId, visualizationType) => ({
  type: SET_PRESENTATION_CANDIDATE_VISUALIZATION_TYPE,
  visualizationType,
  visualizationId
});
/**
 * @param {string} visualizationId - the uuid of the presentation's visualization for the datamap to change
 * @param {string} parameterId - the uuid of the parameter for the datamap to change
 * @param {string} collectionId - the uuid of the data's collection concerned by the datamap change
 * @param {string} propertyName - the original data's property name to attribute to the given datamap item
 */
export const setPresentationCandidateDatamapItem = (visualizationId, parameterId, collectionId, propertyName) => ({
  type: SET_PRESENTATION_CANDIDATE_DATAMAP_ITEM,
  visualizationId,
  parameterId,
  collectionId,
  propertyName
});
/**
 * @param {string} visualizationId - the uuid of the visualization to parameter
 * @param {string} parameterKey - the name of the parameter to set
 * @param {string} parameterValue - the value ot set
 */
export const setPresentationCandidateViewOption = (visualizationId, parameterKey, parameterValue) => ({
  type: SET_PRESENTATION_CANDIDATE_VIEW_OPTION,
  visualizationId,
  parameterKey,
  parameterValue
});
/**
 * @param {string} visualizationId - the uuid of the presentation's visualization for the color to change
 * @param {string} collectionId - the uuid of the data's collection concerned by the color change
 * @param {string} category - the categorical value that has to change its color mapping
 * @param {string} color - the color (name, #hex, rgb()) to attribute
 */
export const setPresentationCandidateColor = (visualizationId, collectionId, category, color) => ({
  type: SET_PRESENTATION_CANDIDATE_COLOR,
  visualizationId,
  collectionId,
  category,
  color
});
/**
 * @param {string} visualizationId - the uuid of the presentation's visualization for the color to change
 * @param {object} viewParameters - the view parameters representing the preview state
 */
export const setPreviewViewParameters = (visualizationId, viewParameters) => ({
  type: SET_PREVIEW_VIEW_PARAMETERS,
  visualizationId,
  viewParameters
});
/**
 *
 */
export const resetPresentationCandidateSettings = () => ({
  type: RESET_PRESENTATION_CANDIDATE_SETTINGS
});
/**
 * @param {string} visualizationId - the uuid of the presentation's visualization for the color to edit
 * @param {string} collectionId - the uuid of the data's collection concerned by the color edition change
 * @param {string} category - the categorical value that has to change its color mapping
 */
export const toggleCandidateColorEdition = (visualizationId, collectionId, category) => ({
  type: TOGGLE_CANDIDATE_COLOR_EDITION,
  visualizationId,
  collectionId,
  category
});
/**
 * @param {string} visualizationId - the uuid of the presentation's visualization for the isSpatializing toggling
 * @param {boolean} isSpatializing - the value to set
 */
export const setVisualizationIsSpatializing = (visualizationId, isSpatializing) => ({
  type: SET_VISUALIZATION_IS_SPATIALIZING,
  visualizationId,
  isSpatializing
});
/**
 * @param {string} visualizationId - the uuid of the presentation's visualization for the isSpatializing toggling
 * @param {array} nodes - the nodes to set
 */
export const setVisualizationNodesPosition = (visualizationId, nodes) => ({
  type: SET_VISUALIZATION_NODES_POSITIONS,
  visualizationId,
  nodes
});
/**
 * @param {string} tab - the tab to set as active
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
 */
function presentationCandidateData(state = DEFAULT_PRESENTATION_CANDIDATE_DATA, action) {
  switch (action.type) {
    case RESET_APP:
    case CLOSE_PRESENTATION_CANDIDATE_MODAL:
    case APPLY_PRESENTATION_CANDIDATE_CONFIGURATION:
      return DEFAULT_PRESENTATION_CANDIDATE_DATA;
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
      // todo : here the fact of choosing by default the first dataset is temp - dataset picking should be allowed
      // when multi-datasets use cases appear
      const firstDatasetId = state.presentationCandidate && state.presentationCandidate.datasets ? Object.keys(state.presentationCandidate.datasets)[0] : undefined;
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
          default:
            break;
        }
      }
      let dataMap = {...visualizationTypesModels[visualizationType].dataMap};
      const viewOptions = visualizationTypesModels[visualizationType].viewOptions && [...visualizationTypesModels[visualizationType].viewOptions];

      // analyze the data to produce a datamap for the visualization
      let dataProfile;
      let newcolorsMap = {default: '#d8d8d8'};
      if (data) {
        dataProfile = analyzeDataset(data);
        dataMap = Object.keys(dataMap).reduce((finDataMap, collectionId) => {
          const newCollection = Object.keys(dataMap[collectionId]).reduce((finCollection, parameterId) => {
            const parameter = {...dataMap[collectionId][parameterId]};
            // guessing some datamap associations from data prop names
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
                [collectionId]: generateColorsMap(dataset, dataMap[collectionId].category.mappedField)
              };
            }
            return {
              ...colorsMap,
              [collectionId]: {
                default: '#d8d8d8'
              }
            };
          }, newcolorsMap);
      }
      // flatten datamap fields (todo: refactor as helper)
      const flattenedDataMap = Object.keys(dataMap).reduce((result, collectionId) => ({
                ...result,
                [collectionId]: Object.keys(dataMap[collectionId]).reduce((propsMap, parameterId) => {
                  const parameter = dataMap[collectionId][parameterId];
                  if (parameter.mappedField) {
                    return {
                      ...propsMap,
                      [parameterId]: parameter.mappedField
                    };
                  }
                  return propsMap;
                }, {})
              }), {});
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
        newcolorsMap = {...state.presentationCandidate.visualizations[action.visualizationId].colorsMap} || {};
        const dataset = state.presentationCandidate.visualizations[action.visualizationId].data[action.collectionId];
        newcolorsMap[action.collectionId] = generateColorsMap(dataset, action.propertyName);
      }
     const visualizationChanges = {
        // update colorsMap
        colorsMap: newcolorsMap || state.presentationCandidate.visualizations[action.visualizationId].colorsMap,
        // updatedatamap
        dataMap: {
          ...state.presentationCandidate.visualizations[action.visualizationId].dataMap,
          [action.collectionId]: {
            ...state.presentationCandidate.visualizations[action.visualizationId].dataMap[action.collectionId],
            [action.parameterId]: {
              ...state.presentationCandidate.visualizations[action.visualizationId].dataMap[action.collectionId][action.parameterId],
              mappedField: action.propertyName
            }
          }
        },
        flattenedDataMap: {
          ...state.presentationCandidate.visualizations[action.visualizationId].flattenedDataMap,
          [action.collectionId]: {
            ...state.presentationCandidate.visualizations[action.visualizationId].flattenedDataMap[action.collectionId],
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
              ...visualizationChanges,
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
    case SET_PREVIEW_VIEW_PARAMETERS:
      const {viewParameters} = action;
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

    case RESET_PRESENTATION_CANDIDATE_SETTINGS:
      return DEFAULT_PRESENTATION_CANDIDATE_DATA;
    default:
      return state;
  }
}

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
 */
function presentationCandidateUi (state = PRESENTATION_CANDIDATE_UI_DEFAULT_STATE, action) {
  switch (action.type) {
    case RESET_APP:
    case CLOSE_PRESENTATION_CANDIDATE_MODAL:
    case APPLY_PRESENTATION_CANDIDATE_CONFIGURATION:
      return PRESENTATION_CANDIDATE_UI_DEFAULT_STATE;
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
    case FETCH_USER_FILE:
      return {
        ...state,
        fetchUserFileStatus: undefined
      };
    case FETCH_USER_FILE + '_FAIL':
      return {
        ...state,
        fetchUserFileStatus: action.errorMessage
      };
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

