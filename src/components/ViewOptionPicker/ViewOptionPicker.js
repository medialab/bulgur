/**
 * This module provides a reusable view option picker component.
 * The component decides whether to display the option picker
 * as a slider or as a select regarding its option type.
 * @module bulgur/components/ViewOptionPicker
 */

import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import Slider from 'react-slider';

import './ViewOptionPicker.scss';


/**
 * Renders the OptionSelect component as a pure function
 * @param {object} props - used props (see prop types below)
 * @return {ReactElement} component - the resulting component
 */
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


/**
 * Component's properties types
 */
OptionSelect.propTypes = {

  /**
   * option representing the current option
   */
  option: PropTypes.shape({
    optionType: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.array,
  }),

  /**
   * value to pick in the option
   */
  activeValue: PropTypes.string,

  /**
   * id of the targeted visualization
   */
  visualizationId: PropTypes.string,

  /**
   * callback when option is changed
   */
  onChange: PropTypes.func,
};


/**
 * Renders the SliderWrapper component as a pure function
 * @param {object} props - used props (see prop types below)
 * @return {ReactElement} component - the resulting component
 */
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


/**
 * Component's properties types
 */
SliderWrapper.propTypes = {

  /**
   * option representing the current option
   */
  option: PropTypes.shape({
    optionType: PropTypes.string,
    label: PropTypes.string,
    minimum: PropTypes.number,
    maximum: PropTypes.number,
    defaultValue: PropTypes.number,
  }),

  /**
   * value to pick in the option
   */
  activeValue: PropTypes.string,

  /**
   * id of the targeted visualization
   */
  visualizationId: PropTypes.string,

  /**
   * callback when option is changed
   */
  onChange: PropTypes.func,
};


/**
 * Renders the ViewOptionPicker component as a pure function
 * @param {object} props - used props (see prop types below)
 * @return {ReactElement} component - the resulting component
 */
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


/**
 * Component's properties types
 */
ViewOptionPicker.propTypes = {

  /**
   * option representing the current option
   */
  option: PropTypes.shape({
    optionType: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.oneOfType([
      // case select
      PropTypes.array,
      // case slider
      PropTypes.object,
    ]),
  }),

  /**
   * value to pick in the option
   */
  activeValue: PropTypes.string,

  /**
   * id of the targeted visualization
   */
  visualizationId: PropTypes.string,

  /**
   * callback when option is changed
   */
  onChange: PropTypes.func.isRequired,
};

export default ViewOptionPicker;
