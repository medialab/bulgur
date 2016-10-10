import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

import {SETUP_NEW_STORY} from '../NewStoryDialog/duck';

/*
 * Action names
 */

const OPEN_NEW_STORY_MODAL = 'OPEN_NEW_STORY_MODAL';
const CLOSE_NEW_STORY_MODAL = 'CLOSE_NEW_STORY_MODAL';

/*
 * Action creators
 */

export const openNewStoryModal = () => ({
  type: OPEN_NEW_STORY_MODAL
});

export const closeNewStoryModal = () => ({
  type: CLOSE_NEW_STORY_MODAL
});

/*
 * Reducers
 */

const VISUALIZATION_DEFAULT_STATE = {
    data: undefined,
    invariantParameters: undefined
};

function visualization(state = VISUALIZATION_DEFAULT_STATE, action) {
  switch (action.type) {
    case SETUP_NEW_STORY:
      return {
        ...state,
        data: action.data,
        invariantParameters: action.invariantParameters
      };
    default:
      return state;
  }
}

const NEW_STORY_MODAL_DEFAULT_STATE = {
    newStoryModalOpen: false,
    data: undefined,
    invariantParameters: undefined
};
function newStoryModal(state = NEW_STORY_MODAL_DEFAULT_STATE, action) {
  switch (action.type) {
    case OPEN_NEW_STORY_MODAL:
      return {
        ...state,
        newStoryModalOpen: true
      };
    case CLOSE_NEW_STORY_MODAL:
      return {
        ...state,
        newStoryModalOpen: false
      };
    default:
      return state;
  }
}

export default combineReducers({
  newStoryModal,
  visualization
});

/*
 * Selectors
 */

const isNewStoryModalOpen = state => state.newStoryModal.newStoryModalOpen;

export const selector = createStructuredSelector({
  isNewStoryModalOpen
});
