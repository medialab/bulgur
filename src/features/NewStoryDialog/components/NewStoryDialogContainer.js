import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as duck from '../duck';
import {closeNewStoryModal} from '../../Bulgur/duck';

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

  constructor(props) {
    super(props);
    this.closeAndResetDialog = this.closeAndResetDialog.bind(this);
  }

  shouldComponentUpdate(newProps) {
    return newProps.activeVisualizationType !== this.props.activeVisualizationType;
  }

  closeAndResetDialog() {
    this.props.actions.resetNewStorySettings();
    this.props.actions.closeNewStoryModal();
  }

  render() {
    return (
      <NewStoryDialogLayout
        {...this.props}
        closeAndResetDialog={this.closeAndResetDialog} />
    );
  }
}

export default NewStoryDialogContainer;
