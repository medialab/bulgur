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

const SET_VISUALIZATION_TYPE = 'SET_VISUALIZATION_TYPE';

const FETCH_EXAMPLE_FILE = 'FETCH_EXAMPLE_FILE';
const FETCH_USER_FILE = 'FETCH_USER_FILE';

const SHOW_INVALID_FILE_TYPE = 'SHOW_INVALID_FILE_TYPE';
const HIDE_INVALID_FILE_TYPE = 'HIDE_INVALID_FILE_TYPE';
const SET_ACTIVE_DATA_FILE_FORMAT = 'SET_ACTIVE_DATA_FILE_FORMAT';
const SET_ACTIVE_DATA_FIELDS_INFO = 'SET_ACTIVE_DATA_FIELDS_INFO';

const RESET_NEW_STORY_SETTINGS = 'RESET_NEW_STORY_SETTINGS';

const MAP_FIELD_TO_INVARIANT_PARAMETER = 'MAP_FIELD_TO_INVARIANT_PARAMETER';
const INIT_INVARIANT_PARAMETERS = 'INIT_INVARIANT_PARAMETERS';
const GUESS_INVARIANT_PARAMETERS = 'GUESS_INVARIANT_PARAMETERS';

export const SETUP_NEW_STORY = 'SETUP_NEW_STORY';


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
    const visType = state.newStory.newStorySettings.visualizationType;
    const model = state.models.visualizationTypes[visType];
    const parameters = model.invariantParameters.slice(0);
    dispatch({
      type: INIT_INVARIANT_PARAMETERS,
      parameters
    });

    try {
      const data = convertRawStrToJson(str, activeDataFileFormat);
      const fields = setDataFields(data);
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

export const resetNewStorySettings = () => ({
  type: RESET_NEW_STORY_SETTINGS
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

export const setupNewStory = (invariantParameters, visualizationType, data) => ({
  type: SETUP_NEW_STORY,
  data,
  invariantParameters,
  visualizationType
});


/*
 * Reducers
 */

const DEFAULT_NEW_STORY_SETTINGS = {
    visualizationType: undefined
};
function newStorySettings(state = DEFAULT_NEW_STORY_SETTINGS, action) {
  switch (action.type) {
    case SET_VISUALIZATION_TYPE:
      return {
        ...state,
        visualizationType: action.visualizationType
      };
    case RESET_NEW_STORY_SETTINGS:
      return DEFAULT_NEW_STORY_SETTINGS;
    default:
      return state;
  }
}

const DEFAULT_NEW_STORY_DATA = {
  activeData: undefined,
  loadingStatus: undefined,
  invalidFileType: undefined,
  activeDataFileFormat: undefined
};

function newStoryData(state = DEFAULT_NEW_STORY_DATA, action) {
  switch (action.type) {
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
        invariantParameters: action.parameters.slice().map(parameter => Object.assign({}, {...parameter}))
      };
    case MAP_FIELD_TO_INVARIANT_PARAMETER:
      let invariantParameters = state.invariantParameters.map(parameter => {
        if (parameter.id === action.parameterId) {
          parameter.mappedField = action.fieldName;
        }
        return parameter;
      });
      return {
        ...state,
        invariantParameters
      };
    case GUESS_INVARIANT_PARAMETERS:
      invariantParameters = state.invariantParameters.map(parameter => {
        const homonym = state.activeDataFields.find(field => field.name.toLowerCase() === parameter.id.toLowerCase());
        if (homonym) {
          parameter.mappedField = homonym.name;
        }
        return parameter;
      });
      return {
        ...state,
        invariantParameters
      };
    case RESET_NEW_STORY_SETTINGS:
      return DEFAULT_NEW_STORY_DATA;
    default:
      return state;
  }
}

export default combineReducers({
  newStorySettings,
  newStoryData
});

/*
 * Selectors
 */

const activeVisualizationType = state => state.newStorySettings &&
  state.newStorySettings.visualizationType;

const activeData = state => state.newStoryData &&
  state.newStoryData.data;

const activeDataStatus = state => state.newStoryData &&
  state.newStoryData.loadingStatus;

const invalidFileType = state => state.newStoryData &&
  state.newStoryData.invalidFileType;

const activeDataFileFormat = state => state.newStoryData &&
  state.newStoryData.activeDataFileFormat;

const activeDataFields = state => state.newStoryData &&
  state.newStoryData.activeDataFields;

const invariantParameters = state => state.newStoryData &&
  state.newStoryData.invariantParameters;

export const selector = createStructuredSelector({
  activeVisualizationType,
  activeData,
  activeDataStatus,
  activeDataFileFormat,
  activeDataFields,
  invalidFileType,
  invariantParameters
});

