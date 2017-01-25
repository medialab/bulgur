/**
 * Bulgor Reducers Endpoint
 * ===================================
 *
 * Combining the app's reducers.
 */
import {combineReducers} from 'redux';

import presentations from './../features/BulgurProjectsManager/duck';
import activePresentation from './../features/Bulgur/duck';
import newPresentation from './../features/NewPresentationDialog/duck';
import takeAway from './../features/TakeAwayDialog/duck';
import * as modelsModels from './../models';

const models = (state = modelsModels) => state;

export default combineReducers({
  presentations,
  activePresentation,
  newPresentation,
  takeAway,
  models,
});
