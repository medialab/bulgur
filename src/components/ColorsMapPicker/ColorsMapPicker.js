/**
 * This module provides a reusable colorsmap picker component
 * @module bulgur/components/ColorMapPicker
 */
import React from 'react';

import {TwitterPicker} from 'react-color';

import './ColorsMapPicker.scss';

const ColorsMapPicker = ({
  colorsMap,
  visualizationId,
  editedColor,
  changeColor,
  toggleColorEdition,

  shownCategories,
  setShownCategories
}) => (
  <section className="bulgur-colors-map-picker">
    {Object.keys(colorsMap)
    .filter(id => id !== 'default')
    .map(colorCollectionId => {
    const collectionMap = colorsMap[colorCollectionId];
    let activeColor;
    const onColorChange = (color) => changeColor(visualizationId, editedColor.collectionId, editedColor.category, color.hex);

    const showAll = () => {
      const list = Object.keys(collectionMap);
      setShownCategories(visualizationId, colorCollectionId, list);
    };
    const hideAll = () => {
      setShownCategories(visualizationId, colorCollectionId, []);
    };
    return (
      <div className="colors-map-group" key={colorCollectionId}>
        {Object.keys(colorsMap).length > 2 ? <h4>{colorCollectionId.charAt(0).toUpperCase() + colorCollectionId.slice(1)} categories</h4> : null}
        {shownCategories && Object.keys(collectionMap).length > 1 ?
          <div className="global-operations">
            <button onClick={showAll} className={shownCategories[colorCollectionId].length !== Object.keys(collectionMap).length ? 'active' : 'inactive'}>
              <img className="bulgur-icon-image" src={require('./assets/show.svg')} />
            Show all
          </button>
            <button onClick={hideAll} className={shownCategories[colorCollectionId].length ? 'active' : 'inactive'}>
              <img className="bulgur-icon-image" src={require('./assets/hide.svg')} />
            Hide all
          </button>
          </div> : null}
        {
        Object.keys(collectionMap)
        .map((category, index) => {
          const active = editedColor && editedColor.collectionId === colorCollectionId && editedColor.category === category;
          const color = collectionMap[category];
          if (active) {
            activeColor = color;
          }
          const onClick = () => toggleColorEdition(visualizationId, colorCollectionId, category);
          const shown = shownCategories && shownCategories[colorCollectionId] ? shownCategories[colorCollectionId].indexOf(category) > -1 : true;
          const onFilterClick = (e) => {
            e.stopPropagation();
            if (shownCategories && typeof setShownCategories === 'function') {
              let newList;
              // remove from list
              if (shown) {
                const itsIndex = shownCategories[colorCollectionId].indexOf(category);
                newList = [...shownCategories[colorCollectionId].slice(0, itsIndex), ...shownCategories[colorCollectionId].slice(itsIndex + 1)];
              // add to list
              }
              else {
                newList = [...shownCategories[colorCollectionId], category];
              }
              setShownCategories(visualizationId, colorCollectionId, newList);
            }
          };
          return (
            <div onClick={onClick} key={index} className={'colors-map-item ' + (shown ? 'shown' : 'hidden')}>
              <div className={'color-card ' + (editedColor &&
                  editedColor.visualizationId === visualizationId &&
                  editedColor.collectionId === colorCollectionId &&
                  editedColor.category === category ? ' active' : '')}>
                <span
                  className="color"
                  style={{
                    background: color,
                  }} />
                <span className="category">{category}</span>
                {shownCategories ?
                  <button title={shown ? 'Hide' : 'Show'} onClick={onFilterClick} className="filter">
                    {shown ?
                      <img className="bulgur-icon-image" src={require('./assets/hide.svg')} />
                      :
                      <img className="bulgur-icon-image" src={require('./assets/show.svg')} />
                  }
                  </button>
                : null}
              </div>
              {
                  editedColor &&
                  editedColor.visualizationId === visualizationId &&
                  editedColor.collectionId === colorCollectionId &&
                  editedColor.category === category ?
                    <TwitterPicker color={activeColor} onChangeComplete={onColorChange} />
                    : null
                }
            </div>
          );
        })
      }
      </div>
  );
  })}
  </section>
);

export default ColorsMapPicker;
