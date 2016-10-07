import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
  render() {
    const {id, className} = this.props;
    return (
      <BulgurLayout {...this.props} />
    )
  }
}

export default BulgurContainer;