import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {debounce} from 'lodash';

import * as duck from '../duck';
import {
  closeTakeAwayModal,
  selector as bulgurSelector
} from '../../Bulgur/duck';

import {
  selector as presentationsSelector
} from '../../BulgurProjectsManager/duck';

// import quinoa from '../../../helpers/configQuinoa';
import downloadFile from '../../../helpers/fileDownloader';
import {
  bundleProjectAsHtml,
  bundleProjectAsJSON
} from '../../../helpers/projectBundler';

import TakeAwayDialogLayout from './TakeAwayDialogLayout';

@connect(
  state => ({
    ...duck.selector(state.takeAway),
    ...bulgurSelector(state.bulgurEditor),
    ...presentationsSelector(state.presentations)
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
    const JSONbundle = bundleProjectAsJSON(this.props.activePresentation);
    const title = this.props.activePresentation.metadata.title;
    switch (takeAwayType.id) {
      case 'project':
        downloadFile(JSONbundle, 'json', title);
        break;
      case 'html':
        bundleProjectAsHtml(this.props.activePresentation, (err, html) => {
          if (err === null) {
            downloadFile(html, 'html', title);
          }
          else {
            // todo : handle error display in redux logic ?
          }
        });

        break;
      case 'github':
        bundleProjectAsHtml(this.props.activePresentation, (err, html) => {
          if (err === null) {
            this.props.actions.exportToGist(html, JSONbundle, this.props.activePresentation.metadata.gistId);
          }
          else {
            // todo : handle error display in redux logic ?
          }
        });
        break;
      case 'server':
        this.props.actions.exportToServer(this.props.activePresentation);
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
