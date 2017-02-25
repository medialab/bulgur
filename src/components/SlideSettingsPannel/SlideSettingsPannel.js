/**
 * This module provides a reusable slide settings pannel for the editor
 * @module bulgur/components/SlideSettingsPannel
 */
import React from 'react';

import './SlideSettingsPannel.scss';

import ColorsMapPicker from '../ColorsMapPicker/ColorsMapPicker';
import DatamapPicker from '../DatamapPicker/DatamapPicker';

const SlideSettingsPannel = ({
  state,
  setPannelState,
  setViewDatamapItem,

  views = {},
  toggleViewColorEdition,
  setViewColor,
  editedColor,
  setShownCategories,
  presentation
}) => {
  const isOpen = state !== undefined;
  const togglePannel = () => {
    if (isOpen) {
      setPannelState(undefined);
    }
 else {
      setPannelState('categories');
    }
  };
  const setTabToCategories = () => {
    if (state !== 'categories') {
      setPannelState('categories');
    }
  };
  const setTabToParameters = () => {
    if (state !== 'parameters') {
      setPannelState('parameters');
    }
  };

  return (
    <aside className={'bulgur-settings-pannel ' + (isOpen ? 'open' : '')}>
      <div className="settings-wrapper">
        <div className="settings-container">
          <div className={'settings-contents ' + (isOpen ? 'visible' : '')}>
            <ul className="settings-type-toggler">
              <li onClick={setTabToCategories} className={state === 'categories' ? 'active' : ''}>
                  Categories
                </li>
              <li onClick={setTabToParameters} className={state === 'parameters' ? 'active' : ''}>
                  Vis Parameters
                </li>
            </ul>

            <div className={'tab-contents ' + state + '-active'}>
              <div className="tab categories">
                {
                    Object.keys(views)
                    .map(viewKey => (
                      <ColorsMapPicker
                        key={viewKey}
                        colorsMap={views[viewKey].viewParameters.colorsMap}
                        shownCategories={views[viewKey].viewParameters.shownCategories}
                        setShownCategories={setShownCategories}
                        visualizationId={viewKey}
                        toggleColorEdition={toggleViewColorEdition}
                        changeColor={setViewColor}
                        editedColor={editedColor} />
                    ))
                  }
              </div>
              <div className="tab parameters">
                {
                  Object.keys(views)
                  .map(viewKey => {
                    const view = views[viewKey];
                    return (
                      <div key={viewKey} className="datamap-wrapper">
                        {
                        Object.keys(view.dataMap)
                        .map(collectionId => {
                          const collection = view.dataMap[collectionId];
                          return (
                            <div key={collectionId} className="datamap-container">
                              {Object.keys(view.dataMap).length > 1 ? <h4>{collectionId.charAt(0).toUpperCase() + collectionId.slice(1)} parameters</h4> : null}
                              <ul>
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
                              </ul>
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
          </div>
        </div>
        <button className={'open-pannel ' + (isOpen ? 'active' : '')}
          onClick={togglePannel}>
          {isOpen ?
            <span><img className="bulgur-icon-image" src={require('./assets/close.svg')} />Close slide settings</span>
              :
            <span><img className="bulgur-icon-image" src={require('./assets/settings.svg')} />Open slide settings</span>
          }</button>
      </div>
    </aside>
  );
};

export default SlideSettingsPannel;
