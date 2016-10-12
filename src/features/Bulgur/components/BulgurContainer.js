import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import BulgurLayout from './BulgurLayout';
import * as duck from '../duck';

import {resetNewStorySettings} from '../../NewStoryDialog/duck';

import {
  actions as quinoaActions,
  selector as quinoaSelector,
  state as quinoaState
} from '../../../helpers/configQuinoa';

@connect(
  state => ({
    ...duck.selector(state.ui),
    ...quinoaSelector(quinoaState)
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
  }

  shouldComponentUpdate(newProps) {
    return newProps.isNewStoryModalOpen !== this.props.isNewStoryModalOpen ||
           newProps.currentSlide !== this.props.currentSlide ||
           newProps.slideParameters !== this.props.slideParameters;
  }

  closeAndResetDialog() {
    this.props.actions.resetNewStorySettings();
    this.props.actions.closeNewStoryModal();
  }

  render() {
    console.log(quinoaActions);
    return (
      <BulgurLayout
        {...this.props}
        closeAndResetDialog={this.closeAndResetDialog} />
    );
  }
}

export default BulgurContainer;
