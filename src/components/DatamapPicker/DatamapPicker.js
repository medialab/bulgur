/**
 * This module provides a reusable colorsmap picker component
 * @module bulgur/components/DatamapPicker
 */
import React from 'react';

import Select from 'react-select';

import 'react-select/dist/react-select.css';
import './DatamapPicker.scss';

class DatamapPicker extends React.Component {

  constructor(props) {
    super(props);

    this.openSelect = () => this.select.focus();
  }

  render() {
    const {
    parameter,
    parameterKey,
    visualization,
    visualizationKey,
    collectionId,
    onMappingChange
    } = this.props;
    const onChange = (e) => {
      if (e) {
        onMappingChange(visualizationKey, parameter.id, collectionId, e.value);
      }
    };
    const currentParameter = parameter.mappedField;
    const bindSelect = select => {
      this.select = select;
    };
    if (!visualization.dataProfile) {
      return null;
    }
    return (
      <li
        key={parameterKey}
        onClick={this.openSelect}
        className={'bulgur-DatamapPicker ' + (parameter.mappedField ? 'active' : '')}>
        <h5>
          <b>{parameter.id}</b>
          <span>►</span>{/* - <i>{parameter.acceptedValueTypes.join(', ')}</i>*/}
        </h5>

        <div className="select-container">
          <Select
            name="form-field-name"
            value={currentParameter}
            searchable={false}
            clearable={false}
            ref={bindSelect}
            options={
              (visualization &&
              visualization.dataProfile[collectionId] &&
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
                  label: (<span>{field.propertyName} <span className="data-field-coverage" title="data field coverage">({field.coverage.covered}/{field.coverage.total})</span></span>)
                }
              ))
              ) || []
            }
            onChange={onChange} />
        </div>
      </li>
    );
  }
}

export default DatamapPicker;
