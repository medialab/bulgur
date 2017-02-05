import React from 'react';

import './SettingsPannel.scss';

import ColorsMapPicker from '../ColorsMapPicker/ColorsMapPicker';
import DatamapPicker from '../DatamapPicker/DatamapPicker';

const SettingsPannel = ({
  isOpen = false,
  togglePannel,
  setViewDatamapItem,

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
        <h3>View Settings</h3>
        {
          Object.keys(views)
          .map(viewKey => {
            const view = views[viewKey];
            return (
              <div key={viewKey}>
                {
                Object.keys(view.dataMap)
                .map(collectionId => {
                  const collection = view.dataMap[collectionId];
                  return (
                    <div key={collectionId}>
                      <h4>{collectionId}</h4>
                      {
                        Object.keys(collection).map((parameterKey) => (
                          <DatamapPicker
                            key={parameterKey}
                            parameter={collection[parameterKey]}
                            parameterKey={parameterKey}
                            visualization={view}
                            visualizationKey={viewKey}
                            collectionId={collectionId}
                            onMappingChange={setViewDatamapItem} />
                        ))
                      }
                    </div>
                  );
                })
              }
              </div>
              );
          })
        }
      </div>
    </aside>
  );
};

export default SettingsPannel;
