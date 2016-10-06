import { combineReducers } from 'redux';
import { createStructuredSelector } from 'reselect';

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
 * Feature Default state
 */

const DEFAULT_STATE = {
    newStoryModalOpen: false
};

/*
 * Reducers
 */

function newStoryModal(state=DEFAULT_STATE, action) {
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
  newStoryModal
});

/*
 * Selectors
 */

const isNewStoryModalOpen = state => state.newStoryModal.newStoryModalOpen;

export const selector = createStructuredSelector({
  isNewStoryModalOpen
});