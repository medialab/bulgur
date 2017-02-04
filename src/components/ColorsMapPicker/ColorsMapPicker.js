import React from 'react';

import {TwitterPicker} from 'react-color';

const ColorsMapPicker = ({
  colorsMap,
  visualizationKey,
  editedColor,
  changeColor,
  toggleColorEdition
}) => (
  <section style={{
    minHeight: '30rem',
    width: '45%',
    display: 'inline-block',
    position: 'relative',
    float: 'left'
  }}>
    <h3>How to color your categories ?</h3>
    {Object.keys(colorsMap)
    .filter(id => id !== 'default')
    .map(colorCollectionId => {
    const collectionMap = colorsMap[colorCollectionId];
    let activeColor;
    const onColorChange = (color) => changeColor(visualizationKey, editedColor.collectionId, editedColor.category, color.hex);
    return (<div className="colorsMap-group" key={colorCollectionId}>
      {Object.keys(collectionMap).length > 0 ? <h4>{colorCollectionId}</h4> : null}
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
            <div onClick={onClick} key={index}>
              <span
                style={{
                  width: '1rem',
                  height: '1rem',
                  background: color,
                  display: 'inline-block'
                }} /> {category} {active ? ' edited' : null}
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
