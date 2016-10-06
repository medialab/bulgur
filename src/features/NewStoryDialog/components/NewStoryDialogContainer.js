import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as duck from '../duck';
import NewStoryDialogLayout from './NewStoryDialogLayout';

class NewStoryDialogContainer extends Component {
  render() {
    return (
      <NewStoryDialogLayout
        {...this.props}
      />
    )
  }
}

export default NewStoryDialogContainer;