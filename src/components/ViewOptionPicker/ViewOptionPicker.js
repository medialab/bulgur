/**
 * This module provides a reusable view option picker component
 * @module bulgur/components/ViewOptionPicker
 */

import React from 'react';
import Select from 'react-select';

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

const ViewOptionPicker = ({
  option,
  activeValue,
  visualizationId,
  onChange
}) => {

  let OptionComponent;
  switch (option.optionType) {
    case 'select':
    default:
      OptionComponent = OptionSelect;
  }

  return (
    <div className="bulgur-view-option-picker">
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
