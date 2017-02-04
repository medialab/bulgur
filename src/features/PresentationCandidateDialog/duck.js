import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {v4 as uuid} from 'uuid';

import {
  loadExampleFile,
  getFileAsText
} from '../../helpers/fileLoader';

import analyzeDataset from '../../helpers/analyzeDataset';
import {bootstrapColorsMap} from '../../helpers/colorHelpers';

import visualizationTypesModels from '../../models/visualizationTypes';

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
  START_PRESENTATION_CANDIDATE_CONFIGURATION
} from '../Bulgur/duck';

const FETCH_EXAMPLE_FILE = 'FETCH_EXAMPLE_FILE';
const FETCH_USER_FILE = 'FETCH_USER_FILE';

const RESET_PRESENTATION_CANDIDATE_SETTINGS = 'RESET_PRESENTATION_CANDIDATE_SETTINGS';

export const SETUP_PRESENTATION_CANDIDATE = 'SETUP_PRESENTATION_CANDIDATE';

const SET_PRESENTATION_CANDIDATE_METADATA = 'SET_PRESENTATION_CANDIDATE_METADATA';
const SET_PRESENTATION_CANDIDATE_DATASET = 'SET_PRESENTATION_CANDIDATE_DATASET';
const SET_PRESENTATION_CANDIDATE_DATASET_METADATA = 'SET_PRESENTATION_CANDIDATE_DATASET_METADATA';
const SET_PRESENTATION_CANDIDATE_DATASET_DATA = 'SET_PRESENTATION_CANDIDATE_DATASET_DATA';
const UNSET_PRESENTATION_CANDIDATE_DATASET = 'UNSET_PRESENTATION_CANDIDATE_DATASET';

const SET_PRESENTATION_CANDIDATE_VISUALIZATION_TYPE = 'SET_PRESENTATION_CANDIDATE_VISUALIZATION_TYPE';
const SET_PRESENTATION_CANDIDATE_DATAMAP_ITEM = 'SET_PRESENTATION_CANDIDATE_DATAMAP_ITEM';

const SET_PRESENTATION_CANDIDATE_COLOR = 'SET_PRESENTATION_CANDIDATE_COLOR';

const TOGGLE_CANDIDATE_COLOR_EDITION = 'TOGGLE_CANDIDATE_COLOR_EDITION';
/*
 * Action creators
 */
export const setCandidatePresentationMetadata = (field, value) => ({
  type: SET_PRESENTATION_CANDIDATE_METADATA,
  field,
  value
});

export const setCandidatePresentationDatasetMetadata = (datasetId, field, value) => ({
  type: SET_PRESENTATION_CANDIDATE_DATASET_METADATA,
  datasetId,
  field,
  value
});

export const setCandidatePresentationDatasetData = (datasetId, rawData) => ({
  type: SET_PRESENTATION_CANDIDATE_DATASET_DATA,
  datasetId,
  rawData
});

export const unsetPresentationCandidateDataset = (datasetId) => ({
  type: UNSET_PRESENTATION_CANDIDATE_DATASET,
  datasetId
});

export const setCandidatePresentationDataset = (dataset = {metadata: {}, rawData: ''}, id) => ({
  type: SET_PRESENTATION_CANDIDATE_DATASET,
  dataset,
  id: id || uuid()
});

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

export const fetchUserFile = (file, datasetId, update = false) => ({
  type: FETCH_USER_FILE,
  promise: (dispatch) => {
    return new Promise((resolve, reject) => {
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

export const setPresentationCandidateVisualizationType = (visualizationId, visualizationType) => ({
  type: SET_PRESENTATION_CANDIDATE_VISUALIZATION_TYPE,
  visualizationType,
  visualizationId
});

export const setPresentationCandidateDatamapItem = (visualizationId, parameterId, collectionId, propertyName) => ({
  type: SET_PRESENTATION_CANDIDATE_DATAMAP_ITEM,
  visualizationId,
  parameterId,
  collectionId,
  propertyName
});

export const setPresentationCandidateColor = (visualizationId, collectionId, category, color) => ({
  type: SET_PRESENTATION_CANDIDATE_COLOR,
  visualizationId,
  collectionId,
  category,
  color
});

export const resetPresentationCandidateSettings = () => ({
  type: RESET_PRESENTATION_CANDIDATE_SETTINGS
});

export const toggleCandidateColorEdition = (collectionId, category) => ({
  type: TOGGLE_CANDIDATE_COLOR_EDITION,
  collectionId,
  category
});

export const setupPresentationCandidate = (dataMap = [], visualizationType, data, remoteUrls) => ({
  type: SETUP_PRESENTATION_CANDIDATE,
  data,
  dataMap,
  visualizationType,
  remoteUrls
});


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
  presentationCandidate: {
    metadata: {}
  }
};
function presentationCandidateData(state = DEFAULT_PRESENTATION_CANDIDATE_DATA, action) {
  switch (action.type) {
    case RESET_APP:
      return DEFAULT_PRESENTATION_CANDIDATE_DATA;
    case START_PRESENTATION_CANDIDATE_CONFIGURATION:
      // configure existing presentation or setup new ?
      const candidateBeginingState = action.presentation || EMPTY_PRESENTATION;
      return {
        ...state,
        presentationCandidate: {
          ...candidateBeginingState,
          id: action.id
        }
      };
    case SET_PRESENTATION_CANDIDATE_METADATA:
      const value = action.field === 'authors' ? action.value.split(',').map(a => a.trim()) : action.value;
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

      // analyze the data to produce a datamap for the visualization
      let dataProfile;
      let newcolorsMap = {default: 'brown'};
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
                [collectionId]: bootstrapColorsMap(dataset, dataMap[collectionId].category.mappedField)
              };
            }
            return {
              ...colorsMap,
              [collectionId]: {
                default: 'brown'
              }
            };
          }, newcolorsMap);
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
              dataMap,
              datasets: [firstDatasetId],
              colorsMap: newcolorsMap
            }
          }
        }
      };
    case SET_PRESENTATION_CANDIDATE_DATAMAP_ITEM:
      if (action.parameterId === 'category') {
        newcolorsMap = {...state.presentationCandidate.visualizations[action.visualizationId].colorsMap} || {};
        const dataset = state.presentationCandidate.visualizations[action.visualizationId].data[action.collectionId];
        newcolorsMap[action.collectionId] = bootstrapColorsMap(dataset, action.propertyName);
      }
     return {
        ...state,
        presentationCandidate: {
          ...state.presentationCandidate,
          visualizations: {
            ...state.presentationCandidate.visualizations,
            [action.visualizationId]: {
              ...state.presentationCandidate.visualizations[action.visualizationId],
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
              }
            }
          }
        }
      };
    case SET_PRESENTATION_CANDIDATE_COLOR:
      const {visualizationId, collectionId, category, color} = action;
      return {
        ...state,
        presentationCandidate: {
          ...state.presentationCandidate,
          visualizations: {
            ...state.presentationCandidate.visualizations,
            [visualizationId]: {
              ...state.presentationCandidate.visualizations[action.visualizationId],
              // update colorsMap
              colorsMap: {
                ...state.presentationCandidate.visualizations[action.visualizationId].colorsMap,
                [collectionId]: {
                  ...state.presentationCandidate.visualizations[action.visualizationId].colorsMap[collectionId],
                  [category]: color
                }
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
  editedColor: undefined
};
function presentationCandidateUi (state = PRESENTATION_CANDIDATE_UI_DEFAULT_STATE, action) {
  switch (action.type) {
    case TOGGLE_CANDIDATE_COLOR_EDITION:
      const {collectionId, category} = action;
      if (state.editedColor === undefined || state.editedColor.collectionId !== collectionId || state.editedColor.category !== category) {
        return {
          ...state,
          editedColor: {
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
    case SET_PRESENTATION_CANDIDATE_COLOR:
      return {
        ...state,
        editedColor: undefined
      };
    default:
      return state;
  }
}

export default combineReducers({
  presentationCandidateData,
  presentationCandidateUi
});

/*
 * Selectors
 */

const presentationCandidate = state => state.presentationCandidateData && state.presentationCandidateData.presentationCandidate;

const activeVisualizationType = state => state.presentationCandidateSettings &&
  state.presentationCandidateSettings.visualizationType;

const activeData = state => state.presentationCandidateData &&
  state.presentationCandidateData.data;

const invalidFileType = state => state.presentationCandidateData &&
  state.presentationCandidateData.invalidFileType;

const editedColor = state => state.presentationCandidateUi &&
  state.presentationCandidateUi.editedColor;

export const selector = createStructuredSelector({
  editedColor,
  presentationCandidate,
  activeVisualizationType,
  activeData,
  invalidFileType
});

