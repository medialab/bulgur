import React from 'react';

import Dropzone from 'react-dropzone';

import './Landing.scss';

const Landing = ({
  onClickOnNewStory,
  onDropInput
}) => (
  <div className="bulgur-landing-wrapper">
    <div className="bulgur-landing-container">
      <h1>Codename bulgur</h1>
      <div className="bulgur-landing-options-container">
        <button className="new-story-option" onClick={onClickOnNewStory}>Tell a new story</button>
        <Dropzone
          className="drop-zone"
          activeClassName="drop-zone-active"
          onDrop={onDropInput}>
          <div>Or import an existing story's project (drop a file here)</div>
        </Dropzone>
      </div>
    </div>
  </div>
);

export default Landing;
