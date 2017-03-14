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
import bulgurEditor from './../features/Editor/duck';
import presentationCandidate from './../features/ConfigurationDialog/duck';
import takeAway from './../features/TakeAwayDialog/duck';

import * as modelsModels from './../models';

const models = (state = modelsModels) => state;

export default combineReducers({
  presentations,
  bulgurEditor,
  presentationCandidate,
  takeAway,
  models,
  i18nState: persistentReducer(i18nState, 'i18n')
});
