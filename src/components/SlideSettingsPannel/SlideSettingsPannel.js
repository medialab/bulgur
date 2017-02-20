/**
 * This module provides a reusable slide settings pannel for the editor
 * @module bulgur/components/SlideSettingsPannel
 */
import React from 'react';

import './SlideSettingsPannel.scss';

import ColorsMapPicker from '../ColorsMapPicker/ColorsMapPicker';
import DatamapPicker from '../DatamapPicker/DatamapPicker';

const SlideSettingsPannel = ({
  isOpen = false,
  togglePannel,
  setViewDatamapItem,

  views = {},
  toggleViewColorEdition,
  setViewColor,
  editedColor,
  presentation
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
          <button className={'open-pannel ' + (isOpen ? 'active' : '')} onClick={togglePannel}>{isOpen ? '✕ Close pannel' : '⚙ Slide settings'}</button>
        </div>
      </div>
      <div className="slide-parameters-wrapper">
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
                        {Object.keys(view.dataMap).length > 1 ? <h4>{collectionId}</h4> : null}
                        {
                          Object.keys(collection).map((parameterKey) => {
                            const setChange = (visualizationId, parameterId, thatCollectionId, propertyName) => 
                              setViewDatamapItem(presentation.visualizations, visualizationId, parameterId, thatCollectionId, propertyName);
                            return (
                              <DatamapPicker
                                key={parameterKey}
                                parameter={collection[parameterKey]}
                                parameterKey={parameterKey}
                                visualization={view}
                                visualizationKey={viewKey}
                                collectionId={collectionId}
                                onMappingChange={setChange} />
                            );
                          })
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
      </div>
    </aside>
  );
};

export default SlideSettingsPannel;
