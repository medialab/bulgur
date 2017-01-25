import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {debounce} from 'lodash';

import * as duck from '../duck';
import {
  closeTakeAwayModal,
  selector as bulgurSelector
} from '../../Bulgur/duck';

import quinoa from '../../../helpers/configQuinoa';
import downloadFile from '../../../helpers/fileDownloader';
import {
  bundleProjectAsJson,
  bundleProjectAsHtml
} from '../../../helpers/projectBundler';

import TakeAwayDialogLayout from './TakeAwayDialogLayout';

@connect(
  state => ({
    ...duck.selector(state.takeAway),
    ...bulgurSelector(state.activePresentation)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      closeTakeAwayModal
    }, dispatch)
  })
)
class TakeAwayDialogContainer extends Component {

  constructor(props) {
    super(props);
    this.takeAway = debounce(this.takeAway.bind(this), 300);
  }

  shouldComponentUpdate() {
    return true;
  }

  takeAway(takeAwayType) {
    const quinoaPresentation = quinoa.getState().editor;
    const remoteUrls = {
      gistUrl: this.props.gistUrl,
      blocksUrl: this.props.blocksUrl,
      gistId: this.props.gistId
    };
    const project = bundleProjectAsJson(this.props.visualizationData, quinoaPresentation, remoteUrls);
    let html;
    switch (takeAwayType.id) {
      case 'project':
        downloadFile(JSON.stringify(project, null, 2), 'json');
        break;
      case 'html':
        html = bundleProjectAsHtml(project);
        downloadFile(html, 'html');
        break;
      case 'github':
        html = bundleProjectAsHtml(project);
        this.props.actions.exportToGithub(html, this.props.gistId);
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <TakeAwayDialogLayout
        {...this.props}
        takeAway={this.takeAway} />
    );
  }
}

export default TakeAwayDialogContainer;
