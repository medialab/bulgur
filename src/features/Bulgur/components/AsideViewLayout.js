import React from 'react';

import './AsideViewLayout.scss';

import {EditorComponent} from '../../../helpers/configQuinoa';

import 'codemirror/lib/codemirror.css';
import '../../../lib/code-mirror-theme.scss';

const AsideViewLayout = ({
  openNewStoryModal,
  openTakeAwayModal,
  isReadOnly
}) => (
  <aside className="bulgur-aside-view">
    {isReadOnly ? '' : <button onClick={openNewStoryModal} type="button">🛠 Story settings</button>}
    <EditorComponent />
    <button type="button" onClick={openTakeAwayModal}>🚀 Take away</button>
  </aside>
);

export default AsideViewLayout;
