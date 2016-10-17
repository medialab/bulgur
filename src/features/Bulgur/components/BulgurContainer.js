import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import BulgurLayout from './BulgurLayout';
import * as duck from '../duck';

import {visualizationTypes} from '../../../models';

import {resetNewStorySettings} from '../../NewStoryDialog/duck';

import {
  actions as quinoaActions,
} from '../../../helpers/configQuinoa';

@connect(
  state => ({
    ...duck.selector(state.activeStory)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      ...quinoaActions,
      resetNewStorySettings,
    }, dispatch)
  })
)
class BulgurContainer extends Component {

  constructor(props) {
    super(props);
    this.closeAndResetDialog = this.closeAndResetDialog.bind(this);
    this.updateSlide = this.updateSlide.bind(this);
    this.resetView = this.resetView.bind(this);
    this.updateSlideIfEmpty = this.updateSlideIfEmpty.bind(this);
  }

  componentWillMount() {
    this.updateSlideIfEmpty();
  }

  shouldComponentUpdate(newProps) {
    // question : is it bad to do this ?
    if (newProps.quinoaState.currentSlide !== this.props.quinoaState.currentSlide) {
      this.props.actions.updateView(newProps.quinoaState.slideParameters);
      if (Object.keys(newProps.quinoaState.slideParameters).length === 0) {
        this.updateSlide(this.props.quinoaState.slideParameters);
      }
    }
    // temp / todo : update that test
    return true;
    // return newProps.isNewStoryModalOpen !== this.props.isNewStoryModalOpen ||
    //        newProps.currentSlide !== this.props.currentSlide ||
    //        newProps.slideParameters !== this.props.slideParameters;
  }

  componentWillUpdate() {
    this.updateSlideIfEmpty();
  }

  updateSlideIfEmpty() {
    if (Object.keys(this.props.quinoaState.slideParameters).length === 0
      && this.props.visualizationData.visualizationType !== undefined
    ) {
      this.updateSlide();
    }
  }

  closeAndResetDialog() {
    this.props.actions.resetNewStorySettings();
    this.props.actions.closeNewStoryModal();
  }

  updateSlide(params) {
    // retrieve current view
    const inputParameters = params || this.props.visualizationData.viewParameters;
    // retrieve visualization-specific slide's meta property schema
    const type = this.props.visualizationData.visualizationType;
    const slideModel = visualizationTypes[type].slideParameters;
    // populate slide data with default where needed
    const slideParameters = slideModel.reduce((output, parameterModel) => {
      if (inputParameters === undefined ||
        inputParameters[parameterModel.id] === undefined
      ) {
        output[parameterModel.id] = parameterModel.default;
      }
      else {
        output[parameterModel.id] = inputParameters[parameterModel.id];
      }
      return output;
    }, {});
    // dispatch quinoa action to update slide
    this.props.quinoaActions.updateSlide(this.props.quinoaState.currentSlide, {meta: slideParameters});
    // dispatch app action to update view accordingly
    this.props.actions.updateView(slideParameters);
  }

  resetView() {
    this.props.actions.updateView(this.props.quinoaState.slideParameters);
  }

  render() {
    return (
      <BulgurLayout
        {...this.props}
        closeAndResetDialog={this.closeAndResetDialog}
        updateSlide={this.updateSlide}
        resetView={this.resetView} />
    );
  }
}

export default BulgurContainer;
