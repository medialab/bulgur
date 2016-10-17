import React from 'react';

import Dropzone from 'react-dropzone';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './NewStoryDialog.scss';

export const ChooseVisualizationTypeStep = ({
  activeVisualizationType,
  setVisualizationType
}) => (
  <section className="new-story-dialog-step">
    <h1>I want to tell a story of ...</h1>
    <form className="visualization-type-choice">
      {['time',
        'space',
        'relations'
        ].map((visType, key) => {
          const switchType = () => setVisualizationType(visType);
          return (<div className="visualization-type-item"
            id={activeVisualizationType === visType ? 'visualization-type-checked' : ''}
            onClick={switchType}
            key={key}>
            <input
              type="radio"
              id={visType}
              name={visType}
              value="type"
              onChange={switchType}
              checked={activeVisualizationType === visType} />
            <label
              htmlFor={visType}>
              <img src={require('../assets/bulgur-vistype-' + visType + '.png')} />
              <h3>{visType}</h3>
            </label>
          </div>);
      })}
    </form>
  </section>
);

const SetVisualizationDataSourceStep = ({
  visualizationTypeModel,
  fetchExampleFile,
  activeDataStatus,
  invalidFileType,
  onFileDrop
}) => {
  const onDropInput = (files) => onFileDrop(files[0]);
  return (
    <section className="new-story-dialog-step">
      <h1>I want to use data from ...</h1>
      <section className="data-source-choice">
        <section className="data-source-file">
          <h2>A file from my computer</h2>
          <Dropzone
            className="drop-zone"
            activeClassName="drop-zone-active"
            onDrop={onDropInput}>
            <div>Drop a file there ({visualizationTypeModel.acceptedFileExtensions.join(', ')})</div>
          </Dropzone>
        </section>
        <section className="data-source-examples">
          <h2>A sample file</h2>
          {visualizationTypeModel.samples.map((sample, key) => {
            const fetchFile = () => fetchExampleFile(sample.fileName);
            return (
              <div key={key} onClick={fetchFile} className="sample-file">
                <h3>{sample.title}</h3>
                <p>{sample.description}</p>
              </div>
            );
          })}
        </section>
      </section>
      {invalidFileType !== undefined ?
        <section className={'data-source-status error'}>
          Invalid file type
        </section> : ''
      }
      {activeDataStatus !== undefined ?
        <section className={'data-source-status ' + activeDataStatus}>
          data {activeDataStatus}
        </section> : ''
      }
    </section>
);};

const SetVisualizationParamsStep = ({
  activeDataFields,
  mapFieldToInvariantParameter,
  dataMap
}) => (
  <section className="new-story-dialog-step">
    <h1>I want to use fields ...</h1>
    <section className="data-fields-choice">
      <ul className="parameters-endpoints">
        {dataMap.map((parameter, key) => {
          const onChange = (selected) => mapFieldToInvariantParameter(selected && selected.value, parameter.id);
          return (
            <li style={{background: parameter.mappedField ? 'lightgreen' : 'lightgrey'}} key={key}>
              <h4>
                <b>{parameter.id}</b> - <i>{parameter.acceptedValueTypes.join(', ')}</i>
              </h4>
              <Select
                name="form-field-name"
                value={parameter.mappedField}
                options={
                  activeDataFields.filter(field => {
                    return parameter.acceptedValueTypes.indexOf(field.type) > -1;
                  }).map(field => (
                    {
                      value: field.name,
                      label: field.name
                    }
                  ))
                }
                onChange={onChange} />
            </li>
        );})}
      </ul>
    </section>
  </section>
);

const NewStoryDialogLayout = ({
  activeVisualizationType,
  activeData,
  activeDataStatus,
  activeDataFields,
  invalidFileType,
  visualizationTypesModels,
  dataMap,
  actions: {
    fetchExampleFile,
    mapFieldToInvariantParameter,
  },
  closeAndResetDialog,
  closeAndSetupNewStory,
  changeVisualizationType,
  onFileDrop
}) => (
  <div className="new-story-dialog">
    <ChooseVisualizationTypeStep
      activeVisualizationType={activeVisualizationType}
      setVisualizationType={changeVisualizationType} />

    {activeVisualizationType && visualizationTypesModels[activeVisualizationType] ?
      <SetVisualizationDataSourceStep
        fetchExampleFile={fetchExampleFile}
        visualizationTypeModel={visualizationTypesModels[activeVisualizationType]}
        activeDataStatus={activeDataStatus}
        invalidFileType={invalidFileType}
        onFileDrop={onFileDrop} /> :
       ''
    }
    {activeVisualizationType && visualizationTypesModels[activeVisualizationType] && activeData ?
      <SetVisualizationParamsStep
        activeDataFields={activeDataFields}
        visualizationTypeModel={visualizationTypesModels[activeVisualizationType]}
        mapFieldToInvariantParameter={mapFieldToInvariantParameter}
        dataMap={dataMap} /> :
      ''
    }
    <section className="new-story-dialog-step">
      {
        activeVisualizationType &&
        activeData
        ?
          <button onClick={closeAndSetupNewStory}>Tell the story</button>
        : ''
      }
      <button
        onClick={closeAndResetDialog}>
        Cancel
      </button>
    </section>
  </div>
);

export default NewStoryDialogLayout;
