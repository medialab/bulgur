import React from 'react';

import './AsideViewLayout.scss';

const AsideViewLayout = ({
  openNewStoryModal
}) => (
  <aside className="bulgur-aside-view">
    <button onClick={openNewStoryModal} type="button">↓ Import data</button>
    <ul>
      <li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li><li>My slide</li>
      <li>New slide</li>
    </ul>
    <button type="button">↑ Take away</button>
  </aside>
);

export default AsideViewLayout;
