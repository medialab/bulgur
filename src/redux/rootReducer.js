/**
 * Bulgor Reducers Endpoint
 * ===================================
 *
 * Combining the app's reducers.
 */
import {combineReducers} from 'redux';

import activeStory from './../features/Bulgur/duck';
import newStory from './../features/NewStoryDialog/duck';
import * as modelsModels from './../models';

const models = (state = modelsModels) => state;

export default combineReducers({
  activeStory,
  newStory,
  models
});
