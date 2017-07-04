/**
 * This module provides a reusable slide settings pannel for the editor
 * @module bulgur/components/SlideSettingsPannel
 */
import React from 'react';
import PropTypes from 'prop-types';

import './SlideSettingsPannel.scss';

import {translateNameSpacer} from '../../helpers/translateUtils';

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
}, context) => {
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

  const translate = translateNameSpacer(context.t, 'Components.SlidesSettingsPannel');
  return (
    <aside className={'bulgur-SlideSettingsPannel ' + (isOpen ? 'open' : '')}>
      <div className="settings-wrapper">
        <div className="settings-container">
          <div className={'settings-contents ' + (isOpen ? 'visible' : '')}>
            <ul className="settings-type-toggler">
              <li onClick={setTabToCategories} className={state === 'categories' ? 'active' : ''}>
                {translate('Filters')}
              </li>
              <li onClick={setTabToParameters} className={state === 'parameters' ? 'active' : ''}>
                {translate('Parameters')}
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
                        allowColorChange={false}
                        changeColor={setViewColor}
                        editedColor={editedColor} />
                    ))
                  }
              </div>
              <div className="tab parameters">
                <h3>
                  {translate('parameters-header')}
                </h3>
                {
                  Object.keys(views)
                  .map(viewKey => {
                    const view = views[viewKey];
                    return (
                      <div key={viewKey} className="datamap-wrapper">
                        {
                        Object.keys(view.viewParameters.dataMap)
                        .map(collectionId => {
                          const collection = view.viewParameters.dataMap[collectionId];
                          return (
                            <div key={collectionId} className="datamap-container">
                              {Object.keys(view.viewParameters.dataMap).length > 1 ?
                                <h4>
                                  {translate('parameters-title', {parameters: collectionId})}
                                </h4>
                                  : null}
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
                <h3>
                  {translate('colors-mapping-header')}
                  {
                    Object.keys(views)
                    .map(viewKey => (
                      <ColorsMapPicker
                        key={viewKey}
                        colorsMap={views[viewKey].viewParameters.colorsMap}
                        visualizationId={viewKey}
                        toggleColorEdition={toggleViewColorEdition}
                        allowColorChange
                        changeColor={setViewColor}
                        editedColor={editedColor} />
                    ))
                  }
                </h3>
              </div>
            </div>
          </div>
        </div>
        <button className={'open-pannel ' + (isOpen ? 'active' : '')}
          onClick={togglePannel}>
          {isOpen ?
            <span><img className="bulgur-icon-image" src={require('../../sharedAssets/close-white.svg')} />{translate('close-advanced-options')}</span>
              :
            <span><img className="bulgur-icon-image" src={require('../../sharedAssets/settings-black.svg')} />{translate('open-advanced-options')}</span>
          }</button>
      </div>
    </aside>
  );
};

SlideSettingsPannel.contextTypes = {
  t: PropTypes.func.isRequired
};

export default SlideSettingsPannel;
