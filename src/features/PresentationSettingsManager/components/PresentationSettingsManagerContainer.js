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

  static contextTypes = {
    t: React.PropTypes.func.isRequired,
    store: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return true;
  }
  render() {
    return (
      <PresentationSettingsManagerLayout
        {...this.props} />
    );
  }
}

export default PresentationSettingsManagerContainer;
