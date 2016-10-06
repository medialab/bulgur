import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import InterfaceManagerLayout from './InterfaceManagerLayout';
import * as duck from '../duck';

@connect(
  state => duck.selector(state.ui), 
  dispatch => ({
    actions: bindActionCreators(duck, dispatch)
  })
)
class InterfaceManagerContainer extends Component {
  render() {
    const {id, className} = this.props;
    return (
      <InterfaceManagerLayout {...this.props} />
    )
  }
}

export default InterfaceManagerContainer;