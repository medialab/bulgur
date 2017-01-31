import React from 'react';

import './AsideViewLayout.scss';

import {EditorComponent} from '../../../helpers/configQuinoa';

import 'codemirror/lib/codemirror.css';
import '../../../lib/code-mirror-theme.scss';

// import {quinoaCreateComponents} from 'quinoa';
// const EditorComponent = quinoaCreateComponents().editor;

const AsideViewLayout = ({
  openPresentationCandidateModal,
  openTakeAwayModal
}) => (
  <aside className="bulgur-aside-view">
    {/* <button onClick={returnToLanding} type="button"><img className="bulgur-icon-image" src={require('../assets/landing.svg')} />New presentation / import</button> */}
    <button onClick={openPresentationCandidateModal} type="button"><img className="bulgur-icon-image" src={require('../assets/settings.svg')} /> Presentation settings</button>
    <EditorComponent />
    <button type="button" onClick={openTakeAwayModal}><img className="bulgur-icon-image" src={require('../assets/take-away.svg')} /> Take away</button>
  </aside>
);

export default AsideViewLayout;
