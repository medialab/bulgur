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
          ].map((visType, key) => 
            (<div className="visualization-type-item"
                id={activeVisualizationType === visType ? 'visualization-type-checked' : ''}
                onClick={()=> setVisualizationType(visType)}
                key={key}
            >
              <input 
                type="radio" 
                id={visType} 
                name={visType} 
                value="type" 
                onChange={() => setVisualizationType(visType)} 
                checked={activeVisualizationType === visType} 
              />
              <label 
                htmlFor={visType}
              >
                <img src={require('../assets/bulgur-vistype-' + visType + '.png')}/>
                <h3>{visType}</h3>
              </label>
            </div>)
        )}
      </form>
    </section>
);

const SetVisualizationDataSourceStep = ({
  visualizationTypeModel
}) => (
  <section className="new-story-dialog-step">
    <h1>I want to use data from ...</h1>
    <section className="data-source-choice">
      <section className="data-source-file">
        <h2>A file from my computer</h2>
        <FileDrop frame={document} onDrop={(files, e)=>console.log('file dropped', e)}>
          Drop a file here
        </FileDrop>
        <i>Drop a file on the frame</i>
      </section>
      <section className="data-source-example">
        {visualizationTypeModel.samples.map((sample, key) => (
          <div key={key} className="sample-file">
            <h2>A sample file</h2>
            <div>
              <h3>{sample.title}</h3>
              <p>{sample.description}</p>
            </div>
          </div>
        ))}
      </section>
    </section>
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
  visualizationTypesModels,
  actions: {
    setVisualizationType,
    resetNewStorySettings,
    closeNewStoryModal
  }
}) => (
  <div className="new-story-dialog">
    <ChooseVisualizationTypeStep 
      activeVisualizationType={activeVisualizationType} 
      setVisualizationType={setVisualizationType} 
    />

    {activeVisualizationType && visualizationTypesModels[activeVisualizationType] ? 
      <SetVisualizationDataSourceStep 
        visualizationTypeModel={visualizationTypesModels[activeVisualizationType]}
      /> :
       ''
    }
    {activeVisualizationType && visualizationTypesModels[activeVisualizationType] ? 
      <SetVisualizationParamsStep 
        visualizationTypeModel={visualizationTypesModels[activeVisualizationType]}
      /> : 
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
          onClick={() => resetNewStorySettings() && closeNewStoryModal()}
        >Cancel</button>
    </section>
    </div>
);

export default NewStoryDialogLayout;



