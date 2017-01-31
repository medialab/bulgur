import React from 'react';

import './AsideViewLayout.scss';

import {EditorComponent} from '../../../helpers/configQuinoa';

import 'codemirror/lib/codemirror.css';
import '../../../lib/code-mirror-theme.scss';

// import {quinoaCreateComponents} from 'quinoa';
// const EditorComponent = quinoaCreateComponents().editor;

const AsideViewLayout = ({
  openSettings,
  activePresentation,
  openTakeAwayModal,
  returnToLanding
}) => (
  <aside className="bulgur-aside-view">
    <h1>
      <button onClick={returnToLanding}>←</button>
      {activePresentation.metadata && activePresentation.metadata.title && activePresentation.metadata.title.length ? activePresentation.metadata.title : 'untitled presentation'}
    </h1>
    {/* <button onClick={returnToLanding} type="button"><img className="bulgur-icon-image" src={require('../assets/landing.svg')} />New presentation / import</button> */}
    <button onClick={openSettings} type="button"><img className="bulgur-icon-image" src={require('../assets/settings.svg')} /> Settings</button>
    <EditorComponent />
    <button type="button" onClick={openTakeAwayModal}><img className="bulgur-icon-image" src={require('../assets/take-away.svg')} /> Take away</button>
  </aside>
);

export default AsideViewLayout;
