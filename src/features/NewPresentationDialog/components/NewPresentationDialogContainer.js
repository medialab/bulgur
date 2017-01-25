import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as duck from '../duck';
import {closeNewPresentationModal} from '../../Bulgur/duck';
import {validateFileExtension} from '../../../helpers/fileLoader';

import NewPresentationDialogLayout from './NewPresentationDialogLayout';

@connect(
  state => ({
    ...duck.selector(state.newPresentation),
    visualizationTypesModels: state.models.visualizationTypes,
    hasActiveVisualization: state.activePresentation.visualization.data && state.activePresentation.visualization.data.length > 0
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      closeNewPresentationModal
    }, dispatch)
  })
)
class NewPresentationDialogContainer extends Component {

  constructor(props) {
    super(props);
    this.closeAndResetDialog = this.closeAndResetDialog.bind(this);
    this.onFileDrop = this.onFileDrop.bind(this);
    this.closeAndSetupNewPresentation = this.closeAndSetupNewPresentation.bind(this);
    this.changeVisualizationType = this.changeVisualizationType.bind(this);
  }

  shouldComponentUpdate(newProps) {
    return newProps.activeVisualizationType !== this.props.activeVisualizationType ||
          newProps.activeDataStatus !== this.props.activeDataStatus ||
          newProps.activeData !== this.props.activeData ||
          newProps.invalidFileType !== this.props.invalidFileType ||
          this.props.dataMap !== newProps.dataMap;
  }

  closeAndResetDialog() {
    this.props.actions.resetNewPresentationSettings();
    this.props.actions.closeNewPresentationModal();
  }

  changeVisualizationType (type) {
    this.props.actions.resetNewPresentationSettings();
    this.props.actions.setVisualizationType(type);
  }

  closeAndSetupNewPresentation() {
    this.props.actions.setupNewPresentation(this.props.dataMap, this.props.activeVisualizationType, this.props.activeData);
    this.props.actions.closeNewPresentationModal();
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
      <NewPresentationDialogLayout
        {...this.props}
        closeAndResetDialog={this.closeAndResetDialog}
        closeAndSetupNewPresentation={this.closeAndSetupNewPresentation}
        changeVisualizationType={this.changeVisualizationType}
        grassrootsMode={!this.props.hasActiveVisualization}
        onFileDrop={this.onFileDrop} />
    );
  }
}

export default NewPresentationDialogContainer;
