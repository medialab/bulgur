import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import BulgurLayout from './BulgurLayout';
import * as duck from '../duck';

import {visualizationTypes} from '../../../models';

import {
  resetNewStorySettings,
  setupNewStory
} from '../../NewStoryDialog/duck';

import {
  getFileAsText,
  convertRawStrToJson
} from '../../../helpers/fileLoader';

import {
  default as quinoa,
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
      setupNewStory
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
    this.onProjectImport = this.onProjectImport.bind(this);
  }

  componentWillMount() {
    this.updateSlideIfEmpty();
  }

  componentWillReceiveProps(newProps) {
    // question : is it bad to do this ?
    if (newProps.quinoaState.currentSlide !== this.props.quinoaState.currentSlide) {
      this.props.actions.updateView(newProps.quinoaState.slideParameters);
      if (Object.keys(newProps.quinoaState.slideParameters).length === 0) {
        this.updateSlide(this.props.quinoaState.slideParameters);
      }
    }
    // view/params equality will be assed during next loop
    const viewEqualsParameters = JSON.stringify(this.props.activeViewParameters) === JSON.stringify(this.props.quinoaState.slideParameters);
    if (viewEqualsParameters &&
        !this.props.doesViewEqualsSlideParameters) {
      this.props.actions.viewEqualsSlideParameters(true);
    }
    else if (!viewEqualsParameters &&
              this.props.doesViewEqualsSlideParameters) {
      this.props.actions.viewEqualsSlideParameters(false);
    }
  }

  shouldComponentUpdate(newProps) {
    return newProps.isNewStoryModalOpen !== this.props.isNewStoryModalOpen ||
           newProps.isTakeAwayModalOpen !== this.props.isTakeAwayModalOpen ||
           newProps.currentSlide !== this.props.currentSlide ||
           JSON.stringify(newProps.activeViewParameters) !== JSON.stringify(this.props.activeViewParameters) ||
           JSON.stringify(newProps.visualizationData) !== JSON.stringify(this.props.visualizationData) ||
           newProps.doesViewEqualsSlideParameters !== this.props.doesViewEqualsSlideParameters;
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

  onProjectImport (files) {
    getFileAsText(files[0], (err, str) => {
      if (err) {
        // todo : handle import error
        // console.log('error while loading project', err);
      }
      else {
        // todo : validate json against project model (must have props story, data, ...)
        const project = convertRawStrToJson(str, 'json');
        this.props.actions.setupNewStory([], project.globalParameters.visualizationType, project.data);
        project.story.order.forEach(id => {
          quinoaActions.addSlide(project.story.slides[id]);
          // work-around on the fact that addSlide seems not to work
          // todo : fix this upstream
          const list = quinoa.getState().editor.order;
          const generatedId = list[list.length - 1];
          quinoaActions.updateSlide(generatedId, Object.assign(project.story.slides[id], {id: undefined}));
        });
      }
    });
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
        onProjectImport={this.onProjectImport}
        resetView={this.resetView} />
    );
  }
}

export default BulgurContainer;
