import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {debounce} from 'lodash';

import * as duck from '../duck';
import {
  closeTakeAwayModal,
  selector as bulgurSelector
} from '../../Editor/duck';

import {
  selector as presentationsSelector
} from '../../PresentationsManager/duck';

import downloadFile from '../../../helpers/fileDownloader';
import {
  bundleProjectAsHtml,
  // bundleProjectAsJSON,
  cleanPresentationForExport
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
    const JSONbundle = cleanPresentationForExport(this.props.activePresentation); // bundleProjectAsJSON(this.props.activePresentation);
    const title = this.props.activePresentation.metadata.title;
    switch (takeAwayType.id) {
      case 'project':
        downloadFile(JSON.stringify(JSONbundle, null, 2), 'json', title);
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
        this.props.actions.exportToServer(JSONbundle);
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
