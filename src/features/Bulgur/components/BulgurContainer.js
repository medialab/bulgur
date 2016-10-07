import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import BulgurLayout from './BulgurLayout';
import * as duck from '../duck';

import {resetNewStorySettings} from '../../NewStoryDialog/duck';

@connect(
  state => duck.selector(state.ui),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      resetNewStorySettings
    }, dispatch)
  })
)
class BulgurContainer extends Component {

  constructor(props) {
    super(props);
    this.closeAndResetDialog = this.closeAndResetDialog.bind(this);
  }

  shouldComponentUpdate(newProps) {
    return newProps.isNewStoryModalOpen !== this.props.isNewStoryModalOpen;
  }

  closeAndResetDialog() {
    this.props.actions.resetNewStorySettings();
    this.props.actions.closeNewStoryModal();
  }

  render() {
    return (
      <BulgurLayout
        {...this.props}
        closeAndResetDialog={this.closeAndResetDialog} />
    );
  }
}

export default BulgurContainer;
