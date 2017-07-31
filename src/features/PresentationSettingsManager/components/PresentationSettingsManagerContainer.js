/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the story settings manager interface
 * @module fonio/features/StorySettingsManager
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PresentationSettingsManagerLayout from './PresentationSettingsManagerLayout';
import * as duck from '../duck';
import * as presentationsManagerDuck from '../../PresentationsManager/duck';
import * as editorDuck from '../../PresentationEditor/duck';
import * as globalUiDuck from '../../GlobalUi/duck';


/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.presentationSettingsManager),
    ...presentationsManagerDuck.selector(state.presentations),
    ...editorDuck.selector(state.presentationEditor),
    ...globalUiDuck.selector(state.globalUi),
    lang: state.i18nState.lang,
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
class PresentationSettingsManagerContainer extends Component {


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
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    return (
      <PresentationSettingsManagerLayout
        {...this.props} />
    );
  }
}

export default PresentationSettingsManagerContainer;
