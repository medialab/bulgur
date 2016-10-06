/**
 * Bulgor Reducers Endpoint
 * ===================================
 *
 * Combining the app's reducers.
 */
import {combineReducers} from 'redux';

import ui from './features/InterfaceManager/duck';

export default combineReducers({
  ui
});
