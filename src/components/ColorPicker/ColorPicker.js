/* eslint react/no-set-state: 0 */
/**
 * This module provides a reusable color picker component
 * @module bulgur/components/ColorPicker
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {SliderPicker} from 'react-color';

import {translateNameSpacer} from '../../helpers/translateUtils';
import './ColorPicker.scss';

/**
 * ColorPicker class for building react component instances
 */
class ColorPicker extends Component {

  /**
   * Component's context used properties
   */
  static contextTypes = {
    t: PropTypes.func.isRequired
  }

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
    this.state = {
      color: props.color,
      initialColor: props.color
    };
    this.onColorChange = this.onColorChange.bind(this);
  }


  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */
  componentWillReceiveProps(nextProps) {
    if (this.state.color !== nextProps.color) {
      this.setState({
        color: nextProps.color
      });
    }
  }


  /**
   * Handles color change by calling back and updating state
   * @param {object} color - the color object to update to
   */
  onColorChange(color) {
    this.props.onChange(color);
    this.setState({
      color
    });
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const translate = translateNameSpacer(this.context.t, 'Components.ColorPicker');
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
            ? <button id="save-color" onClick={onValidate}>{translate('save-color')}</button> : null }
          <button id="cancel" onClick={onCancel}>{translate('cancel')}</button>
        </div>
        <SliderPicker
          color={color}
          onChangeComplete={this.onColorChange} />
      </div>
    );
  }
}


/**
 * Component's properties types
 */
ColorPicker.propTypes = {

  /**
   * color object or string representing the current color
   */
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      hex: PropTypes.string,
      hsl: PropTypes.object,
      hsv: PropTypes.object,
      oldHue: PropTypes.number,
      rgb: PropTypes.object,
    }),
  ]),

  /**
   * callbacks when the color is changed
   */
  onChange: PropTypes.func
};

export default ColorPicker;
