/* eslint react/no-set-state: 0 */

import React, {Component, PropTypes} from 'react';

import {SliderPicker} from 'react-color';

import {translateNameSpacer} from '../../helpers/translateUtils';
import './ColorPicker.scss';

class ColorPicker extends Component {

  static contextTypes = {
    t: PropTypes.func.isRequired
  }

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
      <div className="bulgur-color-picker">
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

export default ColorPicker;
