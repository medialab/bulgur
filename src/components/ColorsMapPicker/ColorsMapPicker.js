/* eslint react/no-set-state: 0 */
/**
 * This module provides a reusable colors map picker component
 * @module bulgur/components/ColorMapPicker
 */
import React from 'react';
import PropTypes from 'prop-types';

import {translateNameSpacer} from '../../helpers/translateUtils';

import ColorPicker from '../ColorPicker/ColorPicker';

import './ColorsMapPicker.scss';


/**
 * Renders the ColorsMapPicker component as a pure function
 * @param {object} props - used props (see prop types below)
 * @param {object} context - used context data (see context types below)
 * @return {ReactElement} component - the resulting component
 */
const ColorsMapPicker = ({
  colorsMap,
  visualizationId,
  editedColor,
  allowColorChange = true,

  changeColor,
  toggleColorEdition,
  shownCategories,
  setShownCategories,
}, context) => {
  const translate = translateNameSpacer(context.t, 'Components.ColorsMapPicker');
  return (
    <section className="bulgur-ColorsMapPicker">
      {Object.keys(colorsMap)
      .filter(id => id !== 'default')
      .map(colorCollectionId => {
      const collectionMap = colorsMap[colorCollectionId];
      let activeColor;
      const onColorChange = (color) => {
        changeColor(visualizationId, editedColor.collectionId, editedColor.category, color.hex);
      };

      const showAll = () => {
        const list = Object.keys(collectionMap);
        setShownCategories(visualizationId, colorCollectionId, list);
      };
      const hideAll = () => {
        setShownCategories(visualizationId, colorCollectionId, []);
      };
      return (
        <div className="colors-map-group" key={colorCollectionId}>
          {Object.keys(colorsMap).length > 1 ?
            <h5>
              {translate('categories-title', {categories: colorCollectionId})}</h5>
            : null}
          {shownCategories && Object.keys(collectionMap).length > 1 ?
            <div className="global-operations">
              <button onClick={showAll} className={shownCategories[colorCollectionId].length !== Object.keys(collectionMap).length ? 'active' : 'inactive'}>
                <img className="bulgur-icon-image" src={require('../../sharedAssets/show-black.svg')} />
                {translate('show-all')}
              </button>
              <button onClick={hideAll} className={shownCategories[colorCollectionId].length ? 'active' : 'inactive'}>
                <img className="bulgur-icon-image" src={require('../../sharedAssets/hide-black.svg')} />
                {translate('hide-all')}
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
            const onValidate = (thatColor) => {
              const finalColor = typeof thatColor === 'string' ? thatColor : thatColor.hex;
              changeColor(visualizationId, editedColor.collectionId, editedColor.category, finalColor);
              toggleColorEdition(visualizationId, colorCollectionId, category);
            };
            const onCancel = (thatColor) => {
              const finalColor = typeof thatColor === 'string' ? thatColor : thatColor.hex;
              changeColor(visualizationId, editedColor.collectionId, editedColor.category, finalColor);
              toggleColorEdition(visualizationId, colorCollectionId, category);
            };
            const shown = shownCategories && shownCategories[colorCollectionId] ? shownCategories[colorCollectionId].find(cat => cat === category) !== undefined : true;
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
            const onClick = e => {
              if (!active) {
                if (allowColorChange) {
                  toggleColorEdition(visualizationId, colorCollectionId, category);
                }
                else {
                  onFilterClick(e);
                }
              }
            };
            return (
              <div onClick={onClick} key={index} className={'colors-map-item ' + (shown ? 'shown' : 'hidden')}>
                <div className={'color-card ' + (active ? ' active' : '')}>
                  <span
                    className="color"
                    style={{
                      background: color,
                    }} />
                  <span className="category">{category}</span>
                  {shownCategories ?
                    <button title={shown ? translate('hide') : translate('show')} onClick={onFilterClick} className="filter">
                      {shown ?
                        <img className="bulgur-icon-image" src={require('../../sharedAssets/hide-black.svg')} />
                        :
                        <img className="bulgur-icon-image" src={require('../../sharedAssets/show-black.svg')} />
                    }
                    </button>
                  : null}
                </div>
                {
                    editedColor &&
                    editedColor.visualizationId === visualizationId &&
                    editedColor.collectionId === colorCollectionId &&
                    editedColor.category === category ?
                      <ColorPicker
                        onCancel={onCancel}
                        onValidate={onValidate}
                        onChange={onColorChange}
                        color={activeColor} />
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
};


/**
 * Component's properties types
 */
ColorsMapPicker.propTypes = {

  /**
   * representation of the current color map (keys are data collection ids)
   */
  colorsMap: PropTypes.object,

  /**
   * id of the visualization being edited
   */
  visualizationId: PropTypes.string,

  /**
   * representation of the color being edited currently
   */
  editedColor: PropTypes.object,

  /**
   * whether to allow to open colors edition module
   */
  allowColorChange: PropTypes.bool,

  /**
   * callbacks when a color is changed
   */
  changeColor: PropTypes.func,

  /**
   * callbacks for opening or closing the color edition ui of an item
   */
  toggleColorEdition: PropTypes.func,

  /**
   * representation of the items to filter-in (keys are data collections, e.g. 'main')
   */
  shownCategories: PropTypes.object,

  /**
   * callbacks for updating the list of filtered-in elements
   */
  setShownCategories: PropTypes.func,
};

/**
 * Component's context used properties
 */
ColorsMapPicker.contextTypes = {
  t: PropTypes.func.isRequired
};

export default ColorsMapPicker;
