import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {v4 as uuid} from 'uuid';

import BulgurLayout from './BulgurLayout';
import * as duck from '../duck';
import * as managerDuck from '../../BulgurProjectsManager/duck';

import {
  resetPresentationCandidateSettings,
  setupPresentationCandidate
} from '../../PresentationCandidateDialog/duck';

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
class BulgurContainer extends Component {

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
      title: 'Slide title',
      markdown: 'my text'
    };
    const id = uuid();
    this.props.actions.addSlide(id, slide);
  }

  render() {
    return (
      <BulgurLayout
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

export default BulgurContainer;
