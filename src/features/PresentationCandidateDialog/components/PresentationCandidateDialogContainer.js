import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as duck from '../duck';
import {
  closePresentationCandidateModal,
  applyPresentationCandidateConfiguration,
  setActivePresentationId
} from '../../Bulgur/duck';

import PresentationCandidateDialogLayout from './PresentationCandidateDialogLayout';

@connect(
  state => ({
    ...duck.selector(state.presentationCandidate),
    visualizationTypesModels: state.models.visualizationTypes,
    hasActiveVisualization: state.activePresentation.visualization.data && state.activePresentation.visualization.data.length > 0
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
class PresentationCandidateDialogContainer extends Component {

  constructor(props) {
    super(props);
    this.closePresentationCandidate = this.closePresentationCandidate.bind(this);
    this.onFileDrop = this.onFileDrop.bind(this);
    this.closeAndSetupPresentationCandidate = this.closeAndSetupPresentationCandidate.bind(this);
    this.changeVisualizationType = this.changeVisualizationType.bind(this);
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

   onFileDrop(file) {
    // todo : validate entering file
    // const fileName = file.name;
    // const model = this.props.visualizationTypesModels[this.props.activeVisualizationType];
    // const valid = validateFileExtension(fileName, model);
    this.props.actions.fetchUserFile(file);
  }

  render() {
    const activeVisualizationTypes = [
    {
      id: 'time',
      name: 'timeline'
    },
    {
      id: 'space',
      name: 'map'
    },
    {
      id: 'relations',
      name: 'network'
    }
    ];
    return (
      <PresentationCandidateDialogLayout
        {...this.props}
        activeVisualizationTypes={activeVisualizationTypes}
        closePresentationCandidate={this.closePresentationCandidate}
        closeAndSetupPresentationCandidate={this.closeAndSetupPresentationCandidate}
        changeVisualizationType={this.changeVisualizationType}
        onFileDrop={this.onFileDrop} />
    );
  }
}

export default PresentationCandidateDialogContainer;
