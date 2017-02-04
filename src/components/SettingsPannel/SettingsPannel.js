import React from 'react';

import './SettingsPannel.scss';

const SettingsPannel = ({
  isOpen = false,
  togglePannel
}) => {
  return (
    <aside className={'bulgur-settings-pannel ' + (isOpen ? 'open' : '')}>
      <div className="colors-map-picker-wrapper">
        <div className="colors-map-picker-container">
          Légende
          <button onClick={togglePannel}>{isOpen ? 'Close pannel' : 'Edit this view settings'}</button>
        </div>
      </div>
      <div className="slide-parameters-container">
        Coucou
      </div>
    </aside>
  );
};

export default SettingsPannel;
