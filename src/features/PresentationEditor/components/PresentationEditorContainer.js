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
import * as globalUiDuck from '../../GlobalUi/duck';
import * as managerDuck from '../../PresentationsManager/duck';

import {
  resetPresentationCandidateSettings,
  setupPresentationCandidate,
} from '../../ConfigurationDialog/duck';


/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.presentationEditor),
    ...managerDuck.selector(state.presentations),
    ...globalUiDuck.selector(state.globalUi),
    lang: state.i18nState.lang
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      ...globalUiDuck,
      resetPresentationCandidateSettings,
      setupPresentationCandidate,
      setLanguage
    }, dispatch)
  })
)
class PresentationEditorContainer extends Component {

  /**
   * Context data used by the component
   */
  static contextTypes = {
    t: React.PropTypes.func.isRequired,
    store: PropTypes.object.isRequired
  }

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
    this.closeAndResetDialog = this.closeAndResetDialog.bind(this);
    this.returnToLanding = this.returnToLanding.bind(this);
    this.openSettings = this.openSettings.bind(this);

    this.addSlide = this.addSlide.bind(this);
    this.duplicateSlide = this.duplicateSlide.bind(this);
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
   * Closes and reset the presentation settings view
   */
  closeAndResetDialog() {
    this.props.actions.resetPresentationCandidateSettings();
    this.props.actions.closePresentationCandidateModal();
  }


  /**
   * Unsets current presentation therefore falling back
   * to the home view
   */
  returnToLanding() {
    this.props.actions.unsetActivePresentation();
  }


  /**
   * Opens settings with an existing presentation
   */
  openSettings () {
    this.props.actions.startPresentationCandidateConfiguration(this.props.activePresentation);
  }


  /**
   * adds a new slide to the current presentation
   */
  addSlide () {
    // build slide
    // todo: wrap this in a createDefaultSlide helper ?
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


  /**
   * Duplicates an existing slide
   * @param {object} slide - the slide to duplicate
   * @param {number} slideIndex - the index of the slide to duplicate in slides order
   */
  duplicateSlide (slide, slideIndex) {
    const id = uuid();
    const newSlide = {
      ...slide
    };
    const position = slideIndex + 1;
    this.props.actions.addSlide(id, newSlide, position);
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
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
