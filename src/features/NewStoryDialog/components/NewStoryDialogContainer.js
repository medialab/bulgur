import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as duck from '../duck';
import { closeNewStoryModal } from '../../Bulgur/duck';
import { validateFileExtension } from '../../../helpers/fileLoader';

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
    this.onFileDrop = this.onFileDrop.bind(this);
  }

  shouldComponentUpdate(newProps) {
    return newProps.activeVisualizationType !== this.props.activeVisualizationType ||
          newProps.activeDataStatus !== this.props.activeDataStatus ||
          newProps.activeData !== this.props.activeData ||
          newProps.invalidFileType !== this.props.invalidFileType;
  }

  closeAndResetDialog() {
    this.props.actions.resetNewStorySettings();
    this.props.actions.closeNewStoryModal();
  }

   onFileDrop(file) {
    const fileName = file.name;
    const model = this.props.visualizationTypesModels[this.props.activeVisualizationType];
    const valid = validateFileExtension(fileName, model);
    if (valid) {
      this.props.actions.fetchUserFile(file);
    }
    else {
      this.props.actions.showInvalidFileTypeWarning();
      setTimeout(() => {
        this.props.actions.hideInvalidFileTypeWarning();
      }, 2000);
    }
  }

  render() {
    return (
      <NewStoryDialogLayout
        {...this.props}
        closeAndResetDialog={this.closeAndResetDialog}
        onFileDrop={this.onFileDrop} />
    );
  }
}

export default NewStoryDialogContainer;
