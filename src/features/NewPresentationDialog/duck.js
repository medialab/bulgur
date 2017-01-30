import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

import {
  loadExampleFile,
  getFileAsText,
  convertRawStrToJson,
  setDataFields
} from '../../helpers/fileLoader';

/*
 * Action names
 */
import {RESET_APP} from '../Bulgur/duck';
const SET_VISUALIZATION_TYPE = 'SET_VISUALIZATION_TYPE';

const FETCH_EXAMPLE_FILE = 'FETCH_EXAMPLE_FILE';
const FETCH_USER_FILE = 'FETCH_USER_FILE';

const SHOW_INVALID_FILE_TYPE = 'SHOW_INVALID_FILE_TYPE';
const HIDE_INVALID_FILE_TYPE = 'HIDE_INVALID_FILE_TYPE';
const SET_ACTIVE_DATA_FILE_FORMAT = 'SET_ACTIVE_DATA_FILE_FORMAT';
const SET_ACTIVE_DATA_FIELDS_INFO = 'SET_ACTIVE_DATA_FIELDS_INFO';

const RESET_NEW_PRESENTATION_SETTINGS = 'RESET_NEW_PRESENTATION_SETTINGS';

const MAP_FIELD_TO_INVARIANT_PARAMETER = 'MAP_FIELD_TO_INVARIANT_PARAMETER';
const INIT_INVARIANT_PARAMETERS = 'INIT_INVARIANT_PARAMETERS';
const GUESS_INVARIANT_PARAMETERS = 'GUESS_INVARIANT_PARAMETERS';

export const SETUP_NEW_PRESENTATION = 'SETUP_NEW_PRESENTATION';

/*
 * Action creators
 */

const parseDataFile = (str, fileName, dispatch, getState, resolve, reject) => {
  const activeDataFileFormat = fileName.split('.').pop();
  dispatch({
    type: SET_ACTIVE_DATA_FILE_FORMAT,
    activeDataFileFormat
  });
  // (re) load invariant parameters of the vis
  const state = getState();
  const visType = state.newPresentation.newPresentationSettings.visualizationType;
  const model = state.models.visualizationTypes[visType];
  const parameters = model.dataMap.slice(0);
  dispatch({
    type: INIT_INVARIANT_PARAMETERS,
    parameters
  });
  try {
    const data = convertRawStrToJson(str, activeDataFileFormat);
    // this is bad and done just temporarily
    // TODO : find a way to handle non-tabular files
    const fields = (activeDataFileFormat === 'gexf') ? [{name: 'gexf', type: 'string'}] : setDataFields(data);
    dispatch({
      type: SET_ACTIVE_DATA_FIELDS_INFO,
      fields
    });
    dispatch({
      type: GUESS_INVARIANT_PARAMETERS
    });
    resolve(data);
  }
  catch (error) {
    reject(error);
  }
};

export const fetchExampleFile = (fileName) => ({
  type: FETCH_EXAMPLE_FILE,
  promise: (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      try {
        const str = loadExampleFile(fileName);
        parseDataFile(str, fileName, dispatch, getState, resolve, reject);
      }
      catch (e) {
        return reject(e);
      }
    });
  }
});

export const fetchUserFile = (file) => ({
  type: FETCH_USER_FILE,
  promise: (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      getFileAsText(file, (err, str) => {
        if (err) {
          reject(err);
        }
        else {
          const fileName = file.name;
          parseDataFile(str, fileName, dispatch, getState, resolve, reject);
        }
      });
    });
  }
});

export const setVisualizationType = (visualizationType) => ({
  type: SET_VISUALIZATION_TYPE,
  visualizationType
});

export const resetNewPresentationSettings = () => ({
  type: RESET_NEW_PRESENTATION_SETTINGS
});

export const showInvalidFileTypeWarning = () => ({
  type: SHOW_INVALID_FILE_TYPE
});

export const hideInvalidFileTypeWarning = () => ({
  type: HIDE_INVALID_FILE_TYPE
});

export const setActiveDataFileFormat = (activeDataFileFormat) => ({
  type: SET_ACTIVE_DATA_FILE_FORMAT,
  activeDataFileFormat
});

export const mapFieldToInvariantParameter = (fieldName, parameterId) => ({
  type: MAP_FIELD_TO_INVARIANT_PARAMETER,
  fieldName,
  parameterId
});

export const setupNewPresentation = (dataMap = [], visualizationType, data, remoteUrls) => ({
  type: SETUP_NEW_PRESENTATION,
  data,
  dataMap,
  visualizationType,
  remoteUrls
});


/*
 * Reducers
 */

const DEFAULT_NEW_PRESENTATION_SETTINGS = {
    visualizationType: undefined
};
function newPresentationSettings(state = DEFAULT_NEW_PRESENTATION_SETTINGS, action) {
  switch (action.type) {
    case RESET_APP:
      return DEFAULT_NEW_PRESENTATION_SETTINGS;
    case SET_VISUALIZATION_TYPE:
      return {
        ...state,
        visualizationType: action.visualizationType
      };
    case RESET_NEW_PRESENTATION_SETTINGS:
      return DEFAULT_NEW_PRESENTATION_SETTINGS;
    default:
      return state;
  }
}

const DEFAULT_NEW_PRESENTATION_DATA = {
  activeData: undefined,
  loadingStatus: undefined,
  invalidFileType: undefined,
  activeDataFileFormat: undefined
};

function newPresentationData(state = DEFAULT_NEW_PRESENTATION_DATA, action) {
  switch (action.type) {
    case RESET_APP:
      return DEFAULT_NEW_PRESENTATION_DATA;
    case FETCH_EXAMPLE_FILE:
    case FETCH_USER_FILE:
      return {
        ...state,
        loadingStatus: 'loading'
      };
    case FETCH_EXAMPLE_FILE + '_SUCCESS':
    case FETCH_USER_FILE + '_SUCCESS':
      return {
        ...state,
        loadingStatus: 'loaded',
        data: action.result
      };
    case FETCH_EXAMPLE_FILE + '_FAILURE':
    case FETCH_USER_FILE + '_FAILURE':
      return {
        ...state,
        loadingStatus: 'error'
      };
    case SHOW_INVALID_FILE_TYPE:
      return {
        ...state,
        invalidFileType: true
      };
    case HIDE_INVALID_FILE_TYPE:
      return {
        ...state,
        invalidFileType: undefined,
        loadingStatus: undefined
      };
    case SET_ACTIVE_DATA_FILE_FORMAT:
      return {
        ...state,
        activeDataFileFormat: action.activeDataFileFormat
      };
    case SET_ACTIVE_DATA_FIELDS_INFO:
      return {
        ...state,
        activeDataFields: action.fields
      };
    case INIT_INVARIANT_PARAMETERS:
      return {
        ...state,
        dataMap: action.parameters.slice().map(parameter => Object.assign({}, {...parameter}))
      };
    case MAP_FIELD_TO_INVARIANT_PARAMETER:
      let dataMap = state.dataMap.map(parameter => {
        if (parameter.id === action.parameterId) {
          parameter.mappedField = action.fieldName;
        }
        return parameter;
      });
      return {
        ...state,
        dataMap
      };
    case GUESS_INVARIANT_PARAMETERS:
      dataMap = state.dataMap.map(parameter => {
        const homonym = state.activeDataFields.find(field => field.name.toLowerCase() === parameter.id.toLowerCase());
        if (homonym) {
          parameter.mappedField = homonym.name;
        }
        return parameter;
      });
      return {
        ...state,
        dataMap
      };
    case RESET_NEW_PRESENTATION_SETTINGS:
      return DEFAULT_NEW_PRESENTATION_DATA;
    default:
      return state;
  }
}

export default combineReducers({
  newPresentationSettings,
  newPresentationData
});

/*
 * Selectors
 */

const activeVisualizationType = state => state.newPresentationSettings &&
  state.newPresentationSettings.visualizationType;

const activeData = state => state.newPresentationData &&
  state.newPresentationData.data;

const activeDataStatus = state => state.newPresentationData &&
  state.newPresentationData.loadingStatus;

const invalidFileType = state => state.newPresentationData &&
  state.newPresentationData.invalidFileType;

const activeDataFileFormat = state => state.newPresentationData &&
  state.newPresentationData.activeDataFileFormat;

const activeDataFields = state => state.newPresentationData &&
  state.newPresentationData.activeDataFields;

const dataMap = state => state.newPresentationData &&
  state.newPresentationData.dataMap;

export const selector = createStructuredSelector({
  activeVisualizationType,
  activeData,
  activeDataStatus,
  activeDataFileFormat,
  activeDataFields,
  invalidFileType,
  dataMap
});
