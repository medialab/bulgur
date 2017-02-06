import React from 'react';

import {TwitterPicker} from 'react-color';

import './ColorsMapPicker.scss';

const ColorsMapPicker = ({
  colorsMap,
  visualizationKey,
  editedColor,
  changeColor,
  toggleColorEdition
}) => (
  <section className="bulgur-colors-map-picker">
    {Object.keys(colorsMap)
    .filter(id => id !== 'default')
    .map(colorCollectionId => {
    const collectionMap = colorsMap[colorCollectionId];
    let activeColor;
    const onColorChange = (color) => changeColor(visualizationKey, editedColor.collectionId, editedColor.category, color.hex);
    return (<div className="colors-map-group" key={colorCollectionId}>
      {Object.keys(colorsMap).length > 2 ? <h4>{colorCollectionId}</h4> : null}
      {
        Object.keys(collectionMap)
        .map((category, index) => {
          const active = editedColor && editedColor.collectionId === colorCollectionId && editedColor.category === category;
          const color = collectionMap[category];
          if (active) {
            activeColor = color;
          }
          const onClick = () => toggleColorEdition(visualizationKey, colorCollectionId, category);
          return (
            <div onClick={onClick} key={index} className={'colors-map-item'}>
              <div className={'color-card ' + (editedColor &&
                  editedColor.visualizationId === visualizationKey &&
                  editedColor.collectionId === colorCollectionId &&
                  editedColor.category === category ? ' active' : '')}>
                <span
                  className="color"
                  style={{
                    background: color,
                  }} />
                <span className="category">{category}</span>
              </div>
              {
                  editedColor &&
                  editedColor.visualizationId === visualizationKey &&
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
