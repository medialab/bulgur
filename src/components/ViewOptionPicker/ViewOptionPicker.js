/**
 * This module provides a reusable view option picker component
 * @module bulgur/components/ViewOptionPicker
 */

import React from 'react';
import Select from 'react-select';
import Slider from 'react-slider';

import './ViewOptionPicker.scss';

const OptionSelect = ({
  option,
  activeValue,
  visualizationId,
  onChange
}) => {
  const onSelectChange = (opt) => onChange(visualizationId, option.viewParameter, opt.value);
  return (
    <Select
      name="form-field-name"
      value={activeValue}
      searchable={false}
      clearable={false}
      options={option.options}
      onChange={onSelectChange} />
  );
};

const SliderWrapper = ({
  option,
  activeValue,
  visualizationId,
  onChange
}) => {
  const onSliderChange = (newValue) => onChange(visualizationId, option.viewParameter, newValue);
  return (
    <div className="slider-wrapper">
      <Slider
        min={option.options.minimum}
        max={option.options.maximum}
        defaultValue={option.options.defaultValue}
        value={activeValue}
        onChange={onSliderChange}
        pearling />
      <span
        className="active-value">{activeValue}</span>
    </div>
  );
};

const ViewOptionPicker = ({
  option,
  activeValue,
  visualizationId,
  onChange
}) => {

  let OptionComponent;
  switch (option.optionType) {
    case 'slider':
      OptionComponent = SliderWrapper;
      break;
    case 'select':
    default:
      OptionComponent = OptionSelect;
      break;
  }

  return (
    <div className="bulgur-ViewOptionPicker">
      <h5>{option.label}</h5>
      <div>
        <OptionComponent
          option={option}
          activeValue={activeValue}
          visualizationId={visualizationId}
          onChange={onChange} />
      </div>
    </div>);
};

export default ViewOptionPicker;
