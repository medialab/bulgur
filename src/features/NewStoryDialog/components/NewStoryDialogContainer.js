import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as duck from '../duck';
import {closeNewStoryModal} from '../../InterfaceManager/duck';

import NewStoryDialogLayout from './NewStoryDialogLayout';


@connect(
  state => ({
    ...duck.selector(state.newStory),
    visualizationTypesModels: state.models.visualizationTypes
  }), 
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      closeNewStoryModal
    }, dispatch)
  })
)
class NewStoryDialogContainer extends Component {
  render() {
    return (
      <NewStoryDialogLayout
        { ...this.props }
      />
    )
  }
}

export default NewStoryDialogContainer;