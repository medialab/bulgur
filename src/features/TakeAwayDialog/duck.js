import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

/*
 * Action names
 */

const SET_TAKE_AWAY_TYPE = 'SET_TAKE_AWAY_TYPE';

export const TAKE_AWAY = 'TAKE_AWAY';

/*
 * Action creators
 */

/*
 * Reducers
 */

const DEFAULT_TAKE_AWAY_SETTINGS = {
    takeAwayType: undefined
};
function ui(state = DEFAULT_TAKE_AWAY_SETTINGS, action) {
  switch (action.type) {
    case SET_TAKE_AWAY_TYPE:
      return {
        ...state,
        takeAwayType: action.takeAwayType
      };
    default:
      return state;
  }
}

export default combineReducers({
  ui
});

/*
 * Selectors
 */

const takeAwayType = state => state.ui &&
  state.ui.takeAwayType;

export const selector = createStructuredSelector({
  takeAwayType
});

