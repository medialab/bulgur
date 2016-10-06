import React from 'react';
import FileDrop from 'react-file-drop';

import './NewStoryDialog.scss';

const NewStoryDialogLayout = (props) => (
  <div className="new-story-dialog">
      <h1>I want to tell a story of ...</h1>

      <form className="visualization-type-choice">
        <input type="radio" id="time" name="time" value="type" onChange={()=> console.log('lol')} checked={true} />
        <label id="vistype-checked" htmlFor="time">
          <img src={require('../assets/bulgur-vistype-time.png')}/>
          <h3>time</h3>
        </label>
        <input type="radio" id="space" name="space" value="space" onChange={()=> console.log('lol')} checked={false} />
        <label htmlFor="space">
          <img src={require('../assets/bulgur-vistype-space.png')}/>
          <h3>space</h3>
        </label>
        <input type="radio" id="relations" name="relations" value="relations" onChange={()=> console.log('lol')} checked={false} />
        <label htmlFor="relations">
          <img src={require('../assets/bulgur-vistype-relations.png')}/>
          <h3>relations</h3>
        </label>
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



