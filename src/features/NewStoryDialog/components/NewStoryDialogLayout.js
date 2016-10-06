import React from 'react';
import FileDrop from 'react-file-drop';

import './NewStoryDialog.scss';

const NewStoryDialogLayout = ({
  getVisualizationType,
  actions: {
    setVisualizationType
  }
}) => (
  <div className="new-story-dialog">
      <h1>I want to tell a story of ...</h1>
      <form className="visualization-type-choice">
        {['time', 
          'space', 
          'relations'
          ].map((visType, key) => 
            (<div className="visualization-type-item"
                id={getVisualizationType === visType ? 'visualization-type-checked' : ''}
                onClick={()=> setVisualizationType(visType)}
                key={key}
            >
              <input 
                type="radio" 
                id={visType} 
                name={visType} 
                value="type" 
                onChange={() => setVisualizationType(visType)} 
                checked={getVisualizationType === visType} 
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

      <h1>I want to use data from ...</h1>

      <section className="data-source-choice">
        <section className="data-source-file">
          <h2>A file from my computer</h2>
          <FileDrop frame={document} onDrop={(e)=>console.log('file dropped', e)}>
            Drop a file here
          </FileDrop>
          <i>Drop a file on the frame</i>
        </section>
        <section className="data-source-example">
          <h2>A sample file</h2>
          <select>
            <option>Choose a sample file</option>
            <option>My sample file 1</option>
            <option>My sample file 2</option>
          </select>
        </section>
      </section>

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
          <li>
            <h4>Events dates</h4>
            <select name="Select date format" id="dateformat-select">
              <option value="dd/mm/yyyy">dd/mm/yyyy</option>
              <option value="yyyy">yyyy</option>
            </select>
          </li>
          <li>
            <h4>
              Events names
            </h4>
          </li>
          <li>
            <h4>
              Events texts
            </h4>
          </li>
          <li>
            <h4>
              Events images (urls)
            </h4>
          </li> 
          <li>
            <h4>
              Events categories
            </h4>
          </li> 
        </ul>
      </section>

      <section className="modal-footer">
        <button>Start telling the story</button>
        <button>Cancel</button>
      </section>
    </div>
);

export default NewStoryDialogLayout;



