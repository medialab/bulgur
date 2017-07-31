/**
 * This module provides a reusable data map picker component
 * @module bulgur/components/DatamapPicker
 */
import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';

import 'react-select/dist/react-select.css';
import './DatamapPicker.scss';


/**
 * DatamapPicker class for building react component instances
 */
class DatamapPicker extends React.Component {

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);

    this.openSelect = () => this.select.focus();
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
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


/**
 * Component's properties types
 */
DatamapPicker.propTypes = {

  /**
   * data of the parameter being edited
   */
  parameter: PropTypes.shape({
    mappedField: PropTypes.string,
    acceptedValueTypes: PropTypes.array,
    id: PropTypes.string,
  }),

  /**
   * key/id of the parameter being edited
   */
  parameterKey: PropTypes.string,

  /**
   * target visualization data
   */
  visualization: PropTypes.object,

  /**
   * target visualization id
   */
  visualizationKey: PropTypes.string,

  /**
   * target data collection id (e.g. 'main')
   */
  collectionId: PropTypes.string,

  /**
   * callbacks when mapped field is changed
   */
  onMappingChange: PropTypes.func,
};

export default DatamapPicker;
