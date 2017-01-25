import React from 'react';

import Dropzone from 'react-dropzone';

import './Landing.scss';

const Landing = ({
  onClickOnNewPresentation,
  onDropInput
}) => (
  <div className="bulgur-landing-wrapper">
    <div className="bulgur-landing-container">
      <h1>Codename bulgur</h1>
      <div className="bulgur-landing-options-container">
        <button className="new-presentation-option" onClick={onClickOnNewPresentation}>Tell a new presentation</button>
        <Dropzone
          className="drop-zone"
          activeClassName="drop-zone-active"
          onDrop={onDropInput}>
          <div>Or import an existing presentation's project (drop a file here)</div>
        </Dropzone>
      </div>
    </div>
  </div>
);

export default Landing;
