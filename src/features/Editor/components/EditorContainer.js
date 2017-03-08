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
    this.duplicateSlide = this.duplicateSlide.bind(this);
  }

  shouldComponentUpdate() {
    return true;
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
          viewParameters: this.props.activeViews[id].viewParameters
        }
      }), {}),
      title: '',
      markdown: ''
    };
    const id = uuid();
    this.props.actions.addSlide(id, slide);
  }

  duplicateSlide (slide, slideIndex) {
    const id = uuid();
    const newSlide = {
      ...slide
    };
    const position = slideIndex + 1;
    this.props.actions.addSlide(id, newSlide, position);
  }

  render() {
    return (
      <EditorLayout
        {...this.props}
        openSettings={this.openSettings}
        closeAndResetDialog={this.closeAndResetDialog}
        updateSlide={this.updateSlide}
        duplicateSlide={this.duplicateSlide}
        returnToLanding={this.returnToLanding}
        addSlide={this.addSlide}
        resetView={this.resetView} />
    );
  }
}

export default EditorContainer;
