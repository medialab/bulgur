import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import BulgurLayout from './BulgurLayout';
import * as duck from '../duck';

import {createDefaultSlideParameters} from '../../../models/visualizationTypes';

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

import validateProject from '../../../helpers/validateProject';

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
      const newSlide = newProps.quinoaState.slideParameters;
      let paramsToUpdate = newSlide;
      if (Object.keys(newSlide).length === 0) {
        this.updateSlide(this.props.visualizationData.viewParameters);
        paramsToUpdate = this.props.visualizationData.viewParameters;
      }
      this.props.actions.setQuinoaSlideParameters(paramsToUpdate);
      this.props.actions.updateView(paramsToUpdate);
    }
  }

  shouldComponentUpdate(newProps) {
    return newProps.isNewStoryModalOpen !== this.props.isNewStoryModalOpen ||
           newProps.isTakeAwayModalOpen !== this.props.isTakeAwayModalOpen ||
           newProps.currentSlide !== this.props.currentSlide ||
           JSON.stringify(newProps.visualizationData.viewParameters) !== JSON.stringify(this.props.visualizationData.viewParameters) ||
           JSON.stringify(newProps.quinoaSlideParameters) !== JSON.stringify(this.props.quinoaSlideParameters) ||
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
    const slideDefault = createDefaultSlideParameters(type);
    // populate slide data with default where needed
    const slideParameters = Object.assign(slideDefault, inputParameters);
    // dispatch quinoa action to update slide
    this.props.quinoaActions.updateSlide(this.props.quinoaState.currentSlide, {meta: slideParameters});
    this.props.actions.setQuinoaSlideParameters(slideParameters);
  }

  onProjectImport (files) {
    getFileAsText(files[0], (err, str) => {
      if (err) {
        // todo : handle import error
        // console.log('error while loading project', err);
      }
      else {
        const project = convertRawStrToJson(str, 'json');
        const valid = validateProject(project);
        if (valid) {
          this.props.actions.setupNewStory([], project.globalParameters.visualizationType, project.data);
          project.story.order.forEach(id => {
            quinoaActions.addSlide(project.story.slides[id]);
            // workaround on the fact that addSlide seems not to work
            // todo : fix this upstream
            const list = quinoa.getState().editor.order;
            const generatedId = list[list.length - 1];
            quinoaActions.updateSlide(generatedId, Object.assign(project.story.slides[id], {id: undefined}));
          });
        }
        else {
          // console.error('you tried to input an invalid project');
        }
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
