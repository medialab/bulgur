import React from 'react';
import FileDrop from 'react-file-drop';

import './NewStoryDialog.scss';

const ChooseVisualizationTypeStep = ({
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
  activeDataStatus
}) => (
  <section className="new-story-dialog-step">
    <h1>I want to use data from ...</h1>
    <section className="data-source-choice">
      <section className="data-source-file">
        <h2>A file from my computer</h2>
        <FileDrop frame={document}>
          Drop a file here
        </FileDrop>
        <i>Drop a file on the frame</i>
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
    {activeDataStatus !== undefined ?
      <section className={'data-source-status ' + activeDataStatus}>
        data {activeDataStatus}
      </section> : ''
    }
  </section>
);

const SetVisualizationParamsStep = ({
  visualizationTypeModel
}) => (
  <section className="new-story-dialog-step">
    <h1>I want to use fields ...</h1>
    <section className="data-fields-choice">
      <ul className="data-fields-available">
        <li>Data field 1</li>
        <li>Data field 2</li>
        <li>Data field 3</li>
        <li>Data field 4</li>
        <li>Data field 5</li>
        <li>Data field 6</li>
      </ul>

      <ul className="data-fields-to-parse">
        {visualizationTypeModel.invariantParameters.map((parameter, key) => (
          <li key={key}>
            <h4>
              {parameter.label}
            </h4>
            {parameter.acceptedValueTypes.indexOf('date') > -1 ?
              <select name="Select date format" id="dateformat-select">
                <option value="dd/mm/yyyy">dd/mm/yyyy</option>
                <option value="yyyy">yyyy</option>
              </select>
              : ''}
          </li>
        ))}
      </ul>
    </section>
  </section>
);

const NewStoryDialogLayout = ({
  activeVisualizationType,
  activeData,
  activeDataStatus,
  visualizationTypesModels,
  actions: {
    setVisualizationType,
    fetchExampleFile
  },
  closeAndResetDialog
}) => (
  <div className="new-story-dialog">
    <ChooseVisualizationTypeStep
      activeVisualizationType={activeVisualizationType}
      setVisualizationType={setVisualizationType} />

    {activeVisualizationType && visualizationTypesModels[activeVisualizationType] ?
      <SetVisualizationDataSourceStep
        fetchExampleFile={fetchExampleFile}
        visualizationTypeModel={visualizationTypesModels[activeVisualizationType]}
        activeDataStatus={activeDataStatus} /> :
       ''
    }
    {activeVisualizationType && visualizationTypesModels[activeVisualizationType] && activeData ?
      <SetVisualizationParamsStep
        visualizationTypeModel={visualizationTypesModels[activeVisualizationType]} /> :
      ''
    }
    <section className="new-story-dialog-step">
      {
        activeVisualizationType
        ?
          <button>Start telling the story</button>
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

