import React from 'react';

import './AsideViewLayout.scss';

import {EditorComponent} from '../../../helpers/configQuinoa';

import 'codemirror/lib/codemirror.css';
import '../../../lib/code-mirror-theme.scss';

// import {quinoaCreateComponents} from 'quinoa';
// const EditorComponent = quinoaCreateComponents().editor;

const AsideViewLayout = ({
  openNewStoryModal,
  openTakeAwayModal,
  returnToLanding
}) => (
  <aside className="bulgur-aside-view">

    <button onClick={returnToLanding} type="button"><img className="bulgur-icon-image" src={require('../assets/landing.svg')} />New story / import</button>
    <button onClick={openNewStoryModal} type="button"><img className="bulgur-icon-image" src={require('../assets/settings.svg')} /> Story settings</button>
    <EditorComponent />
    <button type="button" onClick={openTakeAwayModal}><img className="bulgur-icon-image" src={require('../assets/take-away.svg')} /> Take away</button>
  </aside>
);


export default AsideViewLayout;
