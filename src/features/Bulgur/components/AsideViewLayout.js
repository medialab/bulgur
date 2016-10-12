import React from 'react';

import './AsideViewLayout.scss';

import {EditorComponent} from '../../../helpers/configQuinoa';
import '../../../lib/code-mirror.scss';

const AsideViewLayout = ({
  openNewStoryModal
}) => (
  <aside className="bulgur-aside-view">
    <button onClick={openNewStoryModal} type="button">🛠 Story settings</button>
    <EditorComponent />
    <button type="button">🚀 Take away</button>
  </aside>
);

export default AsideViewLayout;
