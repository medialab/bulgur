import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import ProjectManagerLayout from './ProjectManagerLayout';
import * as duck from '../duck';

@connect(
  state => ({
    ...duck.selector(state.presentations)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck
    }, dispatch)
  })
)
export default class ProjectManagerContainer extends Component {
  /**
   * constructor
   */
  constructor (props) {
    super(props);
  }

  shouldComponentUpdate() {
    return true;
  }

  render () {
    return (<ProjectManagerLayout />);
  }
}
