/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the configuration dialog feature interface
 * @module bulgur/features/ConfigurationDialog
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as duck from '../duck';
import {
  closePresentationCandidateModal,
  applyPresentationCandidateConfiguration,
  setActivePresentationId
} from '../../Editor/duck';

import ConfigurationDialogLayout from './ConfigurationDialogLayout';

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.presentationCandidate),
    visualizationTypesModels: state.models.visualizationTypes
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      applyPresentationCandidateConfiguration,
      closePresentationCandidateModal,
      setActivePresentationId
    }, dispatch)
  })
)
class ConfigurationDialogContainer extends Component {
  /**
   * constructor
   */
  constructor(props) {
    super(props);
    this.closePresentationCandidate = this.closePresentationCandidate.bind(this);
    this.onFileDrop = this.onFileDrop.bind(this);
    this.closeAndSetupPresentationCandidate = this.closeAndSetupPresentationCandidate.bind(this);
    this.changeVisualizationType = this.changeVisualizationType.bind(this);
    this.validateFileExtension = this.validateFileExtension.bind(this);
  }

  shouldComponentUpdate() {
    return true;
    // return newProps.activeVisualizationType !== this.props.activeVisualizationType ||
    //       newProps.activeDataStatus !== this.props.activeDataStatus ||
    //       newProps.activeData !== this.props.activeData ||
    //       newProps.invalidFileType !== this.props.invalidFileType ||
    //       this.props.dataMap !== newProps.dataMap;
  }

  closePresentationCandidate() {
    this.props.actions.resetPresentationCandidateSettings();
    this.props.actions.closePresentationCandidateModal();
  }

  changeVisualizationType (type) {
    this.props.actions.resetPresentationCandidateSettings();
    this.props.actions.setVisualizationType(type);
  }

  closeAndSetupPresentationCandidate() {
    this.props.actions.setupPresentationCandidate(this.props.dataMap, this.props.activeVisualizationType, this.props.activeData);
    this.props.actions.closePresentationCandidateModal();
  }

  // todo : put in fileLoader helper
  validateFileExtension (file = {name: ''}) {
    const fileName = typeof file === 'string' ? file : file.name;
    const extension = fileName.split('.').pop();
    const acceptedExtensions = Object.keys(this.props.visualizationTypesModels)
                      .map(k => this.props.visualizationTypesModels[k])
                      .reduce((total, t) => [...total, ...t.acceptedFileExtensions], []);
    return acceptedExtensions.indexOf(extension) > -1;
  }

   onFileDrop(file) {
    const validExtension = this.validateFileExtension(file);
    if (validExtension) {
      this.props.actions.fetchUserFile(file);
    }
  }

  render() {
    const activeVisualizationTypes = [
    {
      id: 'timeline',
      name: 'timeline'
    },
    {
      id: 'map',
      name: 'map'
    },
    {
      id: 'network',
      name: 'network'
    }
    ];
    return (
      <ConfigurationDialogLayout
        {...this.props}
        activeVisualizationTypes={activeVisualizationTypes}
        closePresentationCandidate={this.closePresentationCandidate}
        closeAndSetupPresentationCandidate={this.closeAndSetupPresentationCandidate}
        changeVisualizationType={this.changeVisualizationType}
        validateFileExtension={this.validateFileExtension}
        onFileDrop={this.onFileDrop} />
    );
  }
}

export default ConfigurationDialogContainer;
