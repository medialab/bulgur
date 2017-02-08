/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the editor feature interface
 * @module bulgur/features/Editor
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {v4 as uuid} from 'uuid';

import EditorLayout from './EditorLayout';
import * as duck from '../duck';
import * as managerDuck from '../../PresentationsManager/duck';

import {
  resetPresentationCandidateSettings,
  setupPresentationCandidate
} from '../../ConfigurationDialog/duck';

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.bulgurEditor),
    ...managerDuck.selector(state.presentations)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      // ...quinoaActions,
      resetPresentationCandidateSettings,
      setupPresentationCandidate
    }, dispatch)
  })
)
class EditorContainer extends Component {

  constructor(props) {
    super(props);
    this.closeAndResetDialog = this.closeAndResetDialog.bind(this);
    this.returnToLanding = this.returnToLanding.bind(this);
    this.openSettings = this.openSettings.bind(this);

    this.addSlide = this.addSlide.bind(this);
  }

  shouldComponentUpdate() {
    return true;
    // return newProps.isPresentationCandidateModalOpen !== this.props.isPresentationCandidateModalOpen ||
    //        newProps.isTakeAwayModalOpen !== this.props.isTakeAwayModalOpen ||
    //        newProps.currentSlide !== this.props.currentSlide ||
    //        JSON.stringify(newProps.visualizationData.viewParameters) !== JSON.stringify(this.props.visualizationData.viewParameters) ||
    //        JSON.stringify(newProps.quinoaSlideParameters) !== JSON.stringify(this.props.quinoaSlideParameters) ||
    //        newProps.doesViewEqualsSlideParameters !== this.props.doesViewEqualsSlideParameters;
  }


  closeAndResetDialog() {
    this.props.actions.resetPresentationCandidateSettings();
    this.props.actions.closePresentationCandidateModal();
  }

  returnToLanding() {
    this.props.actions.unsetActivePresentation();
  }

  openSettings () {
    this.props.actions.startPresentationCandidateConfiguration(this.props.activePresentation);
  }

  addSlide () {
    // build slide
    // todo : factorize that
    const slide = {
      views: Object.keys(this.props.activeViews).reduce((views, id) => ({
        ...views,
        [id]: {
          viewParameters: this.props.activeViews[id].viewParameters,
          dataMap: this.props.activeViews[id].dataMap
        }
      }), {}),
      title: '',
      markdown: ''
    };
    const id = uuid();
    this.props.actions.addSlide(id, slide);
  }

  render() {
    return (
      <EditorLayout
        {...this.props}
        openSettings={this.openSettings}
        closeAndResetDialog={this.closeAndResetDialog}
        updateSlide={this.updateSlide}
        returnToLanding={this.returnToLanding}
        addSlide={this.addSlide}
        resetView={this.resetView} />
    );
  }
}

export default EditorContainer;
