/**
 * Bulgor Reducers Endpoint
 * ===================================
 *
 * Combining the app's reducers.
 */
import uiState from './ui';
import {combineReducers} from 'redux';

export default combineReducers({
  uiState
});
