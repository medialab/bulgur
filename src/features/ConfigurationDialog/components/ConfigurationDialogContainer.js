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
} from '../../PresentationEditor/duck';

import {
  setActivePresentationId,
} from '../../GlobalUi/duck';

import {
  validateFileExtension
} from '../../../helpers/fileLoader';

import ConfigurationDialogLayout from './ConfigurationDialogLayout';

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.presentationCandidate),
    visualizationTypesModels: state.models.visualizationTypes,
    lang: state.i18nState.lang
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
  }

  shouldComponentUpdate() {
    return true;
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

   onFileDrop(file) {
    const validExtension = validateFileExtension(file, this.props.visualizationTypesModels);
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

    const onValidateFileExtension = (file) => {
      return validateFileExtension(file, this.props.visualizationTypesModels);
    };
    return (
      <ConfigurationDialogLayout
        {...this.props}
        activeVisualizationTypes={activeVisualizationTypes}
        closePresentationCandidate={this.closePresentationCandidate}
        closeAndSetupPresentationCandidate={this.closeAndSetupPresentationCandidate}
        changeVisualizationType={this.changeVisualizationType}
        validateFileExtension={onValidateFileExtension}
        onFileDrop={this.onFileDrop} />
    );
  }
}

export default ConfigurationDialogContainer;
