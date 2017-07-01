/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the editor feature interface
 * @module bulgur/features/PresentationEditor
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {v4 as uuid} from 'uuid';
import {setLanguage} from 'redux-i18n';

import PresentationEditorLayout from './PresentationEditorLayout';
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
    ...duck.selector(state.presentationEditor),
    ...managerDuck.selector(state.presentations),
    lang: state.i18nState.lang
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      // ...quinoaActions,
      resetPresentationCandidateSettings,
      setupPresentationCandidate,
      setLanguage
    }, dispatch)
  })
)
class PresentationEditorContainer extends Component {

  static contextTypes = {
    t: React.PropTypes.func.isRequired,
    store: PropTypes.object.isRequired
  }

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
      <PresentationEditorLayout
        {...this.props}
        openSettings={this.openSettings}
        closeAndResetDialog={this.closeAndResetDialog}
        duplicateSlide={this.duplicateSlide}
        returnToLanding={this.returnToLanding}
        addSlide={this.addSlide}
        resetView={this.resetView} />
    );
  }
}

export default PresentationEditorContainer;
