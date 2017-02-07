import React from 'react';
import Modal from 'react-modal';
import Dropzone from 'react-dropzone';

import './PresentationsManagerLayout.scss';

const PresentationsManagerLayout = ({
  // activePresentation,
  // activePresentationId,
  importStatus,
  importError,
  onDropInput,
  promptedToDeleteId,
  presentationsList = [],
  importCandidate,
  overrideImportWithCandidate,
  actions: {
    promptDeletePresentation,
    unpromptDeletePresentation,
    deletePresentation,
    copyPresentation,
    startPresentationCandidateConfiguration,
    setActivePresentation,
    importReset
  }
}) => {
  const onCreatePresentation = () => {
    startPresentationCandidateConfiguration();
  };
  return (
    <section className="bulgur-presentations-manager-layout">
      <section className="landing-group">
        <h1>Bulgur</h1>
        <p>
          Bulgur lets you make data presentations by walking readers through a visualization, then export your presentation to a file or the web.
        </p>
        <p>
          Bulgur is part of the <a href="http://www.medialab.sciences-po.fr/fr/">sciencespo’s médialab</a> tools.
        </p>
        <button className="new-presentation" onClick={onCreatePresentation}>Start a new presentation</button>
        <div className="presentations-group">
          <h4>Your locally stored presentations</h4>
          <ul className="local-presentations-list">
            {presentationsList.map((presentation, index) => {
            const onClickPrompt = () => promptDeletePresentation(presentation.id);
            const onClickUnprompt = () => unpromptDeletePresentation(presentation.id);
            const onClickDelete = () => deletePresentation(presentation.id);
            const onClickCopy = () => copyPresentation(presentation);
            const setToActive = () => setActivePresentation(presentation);
            const configure = () => startPresentationCandidateConfiguration(presentation);
            return (
              <li key={index} className="local-presentation">
                <h5 onClick={setToActive}>{presentation.metadata && presentation.metadata.title && presentation.metadata.title.length ? presentation.metadata.title : 'untitled presentation'}</h5>
                <div className="local-presentation-buttons">
                  <button onClick={setToActive}>edit</button>
                  <button onClick={configure}>settings</button>
                  {promptedToDeleteId !== presentation.id ? <button onClick={onClickCopy}>copy</button> : ''}
                  {promptedToDeleteId !== presentation.id ? <button onClick={onClickPrompt}>delete</button> : null}
                </div>
                {promptedToDeleteId === presentation.id ? <p>Sure ?</p> : null}
                {promptedToDeleteId === presentation.id ?
                  <div className="local-presentation-buttons">
                    <button onClick={onClickDelete}>Yes, delete this presentation</button>
                    <button onClick={onClickUnprompt}>Cancel</button>
                  </div> : null }
              </li>
            );
          })
          }
          </ul>
        </div>
      </section>

      <section className="landing-group">
        <Dropzone
          className="drop-zone"
          activeClassName="drop-zone-active"
          onDrop={onDropInput}>
          <div>Import an existing presentation's project (drop a file here)</div>
        </Dropzone>
        <div className="import-status-display">
          {importStatus}
        </div>
        <div className="import-error-display">
          {importError === 'badJSON' ? 'Your file is badly formatted' : ''}
          {importError === 'invalidProject' ? 'Your file is not a valid quinoa presentation' : ''}
        </div>
      </section>

      <Modal
        onRequestClose={importReset}
        contentLabel="Override the existing presentation"
        isOpen={importCandidate !== undefined}>
        <div>
        You seem to have a working version of the presentation you are trying to import stored on your computer.
        Do you wish to override the local version of the presentation ?
        </div>
        <div>
          <button onClick={overrideImportWithCandidate}>
            Yes, override the local version
          </button>
          <button onClick={importReset}>
            Cancel
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default PresentationsManagerLayout;
