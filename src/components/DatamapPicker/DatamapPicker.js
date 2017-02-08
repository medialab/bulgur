/**
 * This module provides a reusable colorsmap picker component
 * @module bulgur/components/DatamapPicker
 */
import React from 'react';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './DatamapPicker.scss';

const DatamapPicker = ({
  parameter,
  parameterKey,
  visualization,
  visualizationKey,
  collectionId,
  onMappingChange
}) => {
  const onChange = (e) => {
    if (e) {
      onMappingChange(visualizationKey, parameter.id, collectionId, e.value);
    }
  };
  const currentParameter = parameter.mappedField;
  return (
    <li
      key={parameterKey}
      className={'bulgur-datamap-picker ' + (parameter.mappedField ? 'active' : '')}>
      <h4>
        <b>{parameter.id}</b>{/* - <i>{parameter.acceptedValueTypes.join(', ')}</i>*/}
      </h4>
      <Select
        name="form-field-name"
        value={currentParameter}
        options={
            visualization.dataProfile[collectionId]
            // filter fields correct value type
            .filter(field => {
              return parameter.acceptedValueTypes.find(acceptedValue => {
                if (field.propertiesTypes[acceptedValue]) {
                  return true;
                }
              }) !== undefined;
            }).map(field => (
              {
                value: field.propertyName,
                label: field.propertyName
              }
            ))
          }
        onChange={onChange} />
    </li>
  );
};

export default DatamapPicker;
