import React from 'react';

import './AsideViewLayout.scss';

import {EditorComponent} from '../../../helpers/configQuinoa';

import 'codemirror/lib/codemirror.css';
import '../../../lib/code-mirror-theme.scss';

const AsideViewLayout = ({
  openNewStoryModal,
  openTakeAwayModal,
  returnToLanding,
  isReadOnly
}) => (
  <aside className="bulgur-aside-view">
    {isReadOnly ? <h1>Bulgur</h1> : ''}
    {isReadOnly ? '' : <button onClick={returnToLanding} type="button"><img className="bulgur-icon-image" src={require('../assets/landing.svg')} />New story / import</button>}
    {isReadOnly ? '' : <button onClick={openNewStoryModal} type="button"><img className="bulgur-icon-image" src={require('../assets/settings.svg')} /> Story settings</button>}
    <EditorComponent />
    {isReadOnly ? '' : <button type="button" onClick={openTakeAwayModal}><img className="bulgur-icon-image" src={require('../assets/take-away.svg')} /> Take away</button>}
  </aside>
);

export default AsideViewLayout;
