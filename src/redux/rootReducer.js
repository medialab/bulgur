/**
 * Bulgur Reducers Endpoint
 * ===================================
 *
 * Combining the app's reducers.
 */
import {combineReducers} from 'redux';

import {i18nState} from 'redux-i18n';

import {persistentReducer} from 'redux-pouchdb';


import presentations from './../features/PresentationsManager/duck';
import presentationEditor from './../features/PresentationEditor/duck';
import presentationCandidate from './../features/ConfigurationDialog/duck';
import takeAway from './../features/TakeAwayDialog/duck';
import globalUi from './../features/GlobalUi/duck';
import presentationSettingsManager from './../features/PresentationSettingsManager/duck';

import * as modelsModels from './../models';

const models = (state = modelsModels) => state;

export default combineReducers({
  presentations,
  presentationEditor,
  presentationCandidate,
  globalUi,
  takeAway,
  presentationSettingsManager,
  models,
  i18nState: persistentReducer(i18nState, 'i18n')
});
