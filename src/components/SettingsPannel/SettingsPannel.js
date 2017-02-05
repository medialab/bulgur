import React from 'react';

import './SettingsPannel.scss';

import ColorsMapPicker from '../ColorsMapPicker/ColorsMapPicker';
// import DatamapPicker from '../DatamapPicker/DatamapPicker';

const SettingsPannel = ({
  isOpen = false,
  togglePannel,

  views = {},
  toggleViewColorEdition,
  setViewColor,
  editedColor
}) => {
  return (
    <aside className={'bulgur-settings-pannel ' + (isOpen ? 'open' : '')}>
      <div className="colors-map-picker-wrapper">
        <div className="colors-map-picker-container">
          {
            Object.keys(views)
            .map(viewKey => (
              <ColorsMapPicker
                key={viewKey}
                colorsMap={views[viewKey].viewParameters.colorsMap}
                visualizationKey={viewKey}
                toggleColorEdition={toggleViewColorEdition}
                changeColor={setViewColor}
                editedColor={editedColor} />
            ))
          }
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
