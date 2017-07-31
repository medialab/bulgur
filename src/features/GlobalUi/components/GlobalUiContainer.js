/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the interface container
 * @module fonio/features/GlobalUi
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setLanguage} from 'redux-i18n';

import GlobalUiLayout from './GlobalUiLayout';
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
    ...duck.selector(state.globalUi),
    ...managerDuck.selector(state.presentations),
    lang: state.i18nState.lang,
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      resetPresentationCandidateSettings,
      setupPresentationCandidate,
      setLanguage,
    }, dispatch)
  })
)
class GlobalUiContainer extends Component {

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
   * Closes and resets the candidate view
   */
  closeAndResetDialog() {
    this.props.actions.resetPresentationCandidateSettings();
    this.props.actions.closePresentationCandidateModal();
  }


  /**
   * Unsets current presentation,
   * therefore falling back to the dashboard view
   */
  returnToLanding() {
    this.props.actions.unsetActivePresentation();
  }


  /**
   * Opens candidate view with existing presentation
   */
  openSettings () {
    this.props.actions.startPresentationCandidateConfiguration(this.props.activePresentation);
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    return (
      <GlobalUiLayout
        {...this.props}
        openSettings={this.openSettings}
        closeAndResetDialog={this.closeAndResetDialog}
        returnToLanding={this.returnToLanding}
        updatePresentationContent={this.updatePresentationContent} />
    );
  }
}

export default GlobalUiContainer;
