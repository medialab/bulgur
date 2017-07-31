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
  setActivePresentationId,
  applyPresentationCandidateConfiguration,
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
    lang: state.i18nState.lang,
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      applyPresentationCandidateConfiguration,
      closePresentationCandidateModal,
      setActivePresentationId,
    }, dispatch)
  })
)
class ConfigurationDialogContainer extends Component {

  /**
   * constructor
   * @param {object} props - properties provided to component at instanciation
   */
  constructor(props) {
    super(props);
    this.closePresentationCandidate = this.closePresentationCandidate.bind(this);
    this.onFileDrop = this.onFileDrop.bind(this);
    this.closeAndSetupPresentationCandidate = this.closeAndSetupPresentationCandidate.bind(this);
    this.changeVisualizationType = this.changeVisualizationType.bind(this);
  }


  /**
   * Defines whether the component should re-render
   * @param {object} nextProps - the props to come
   * @param {object} nextState - the state to come
   * @return {boolean} shouldUpdate - whether to update or not
   */
  shouldComponentUpdate() {
    // todo: optimize component when stabilized
    return true;
  }


  /**
   * Closes the presentation configuration view
   * and resets the presentation candidate data.
   */
  closePresentationCandidate() {
    this.props.actions.resetPresentationCandidateSettings();
    this.props.actions.closePresentationCandidateModal();
  }


  /**
   * Handle visualization type change
   * by resetting presentation settings and setting the right visualization type
   */
  changeVisualizationType (type) {
    this.props.actions.resetPresentationCandidateSettings();
    this.props.actions.setVisualizationType(type);
  }


  /**
   * Closes presentation candidate view
   * and saves the changes made
   */
  closeAndSetupPresentationCandidate() {
    this.props.actions.setupPresentationCandidate(this.props.dataMap, this.props.activeVisualizationType, this.props.activeData);
    this.props.actions.closePresentationCandidateModal();
  }


  /**
   * Handles the drop of a possible dataset
   * @param {File} file - the file that was dropped
   */
  onFileDrop(file) {
    const validExtension = validateFileExtension(file, this.props.visualizationTypesModels);
    if (validExtension) {
      this.props.actions.fetchUserFile(file);
      // case of svg automatically set vis type to svg
      // todo: this is dirty a better way should be found
      if (file.name.indexOf('.svg') === file.name.length - 4) {
        const firstVisualizationId = Object.keys(this.props.presentationCandidate.visualizations)[0];
        this.props.actions.setPresentationCandidateVisualizationType(firstVisualizationId, 'svg');
      }
    }
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    // todo: move this to a conf file
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
