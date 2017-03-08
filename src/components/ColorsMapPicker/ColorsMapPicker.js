/* eslint react/no-set-state: 0 */

/**
 * This module provides a reusable colorsmap picker component
 * @module bulgur/components/ColorMapPicker
 */
import React, {Component} from 'react';

import {SliderPicker} from 'react-color';

import './ColorsMapPicker.scss';

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: props.color,
      initialColor: props.color
    };
    this.onColorChange = this.onColorChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.color !== nextProps.color) {
      this.setState({
        color: nextProps.color
      });
    }
  }

  onColorChange(color) {
    this.props.onChange(color);
    this.setState({
      color
    });
  }

  render() {
    const {
      color
    } = this.state;
    const onValidate = () => {
      this.props.onValidate(this.state.color);
    };
    const onCancel = () => {
      this.props.onCancel(this.state.initialColor);
    };
    return (
      <div className="bulgur-ColorPicker">
        <div className="buttons-container">
          {this.state.color.hex !== this.state.initialColor
            ? <button id="save-color" onClick={onValidate}>Save color</button> : null }
          <button id="cancel" onClick={onCancel}>Cancel</button>
        </div>
        <SliderPicker
          color={color}
          onChangeComplete={this.onColorChange} />
      </div>
    );
  }
}

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
          const onClick = () => {
            if (!active) {
              toggleColorEdition(visualizationId, colorCollectionId, category);
            }
          };
          const onValidate = (thatColor) => {
            changeColor(visualizationId, editedColor.collectionId, editedColor.category, thatColor);
            toggleColorEdition(visualizationId, colorCollectionId, category);
          };
          const onCancel = (thatColor) => {
            changeColor(visualizationId, editedColor.collectionId, editedColor.category, thatColor);
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

export default ColorsMapPicker;
