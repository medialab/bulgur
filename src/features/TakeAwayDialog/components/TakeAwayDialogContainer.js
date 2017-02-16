/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the takeway dialog feature interface
 * @module bulgur/features/TakeAwayDialog
 */
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

import {
  githubTokenProviderUrl,
  githubAPIClientId,
  serverUrl
} from '../../../../secrets';

import TakeAwayDialogLayout from './TakeAwayDialogLayout';

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
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
        this.props.actions.setBundleHtmlStatus('ongoing', 'Asking the server to bundle a custom html file');
        bundleProjectAsHtml(this.props.activePresentation, (err, html) => {
          if (err === null) {
            downloadFile(html, 'html', title);
            this.props.actions.setBundleHtmlStatus('success', 'Bundling is a success !');
          }
          else {
            this.props.actions.setBundleHtmlStatus('failure', 'Bundling failed, somehow ...');
          }
        });

        break;
      case 'github':
        this.props.actions.setBundleHtmlStatus('ongoing', 'Asking the server to bundle a custom html file');
        bundleProjectAsHtml(this.props.activePresentation, (err, html) => {
          if (err === null) {
            this.props.actions.exportToGist(html, JSONbundle, this.props.activePresentation.metadata.gistId);
            this.props.actions.setBundleHtmlStatus('success', 'Bundling is a success !');
          }
          else {
            this.props.actions.setBundleHtmlStatus('failure', 'Bundling failed, somehow ...');
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
    const serverAvailable = serverUrl !== undefined;
    const gistAvailable = githubTokenProviderUrl !== undefined && githubAPIClientId !== undefined;
    return (
      <TakeAwayDialogLayout
        {...this.props}
        serverAvailable={serverAvailable}
        serverUrl={serverUrl}
        gistAvailable={gistAvailable}
        takeAway={this.takeAway} />
    );
  }
}

export default TakeAwayDialogContainer;
