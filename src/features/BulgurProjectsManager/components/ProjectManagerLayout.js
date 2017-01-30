import React from 'react';
import Modal from 'react-modal';
import Dropzone from 'react-dropzone';

import './ProjectManagerLayout.scss';

const ProjectManagerLayout = ({
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
    deletePresentation,
    createPresentation,
    importReset
  }
}) => {
  const onCreatePresentation = () => {
    createPresentation('f1ddbb99-4922-4148-bdb3-5cc862c4aec6', {
      id: 'f1ddbb99-4922-4148-bdb3-5cc862c4aec6',
      metadata: {
        title: 'Ma présentation',
      }
    });
  };
  return (
    <section className="project-manager-layout">
      <section>
        <h1>Bulgur</h1>
        <p>
        Bulgur lets you make data presentations through commented maps, graphs or timelines, then export your presentation wherever you want on the web.
      </p>
        <p>
        Bulgur is part of the sciencespo’s médialab tools ecosystem :
      </p>
        <ul>
          <li>
          table2net
        </li>
          <li>
          bulgur
        </li>
          <li>
          fonio
        </li>
        </ul>
      </section>

      <section>
        <button onClick={onCreatePresentation}>Start a new presentation</button>
        <div />
      </section>

      <section>
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

      <section>
        <ul>
          {presentationsList.map((presentation, index) => {
          const onClickPrompt = () => promptDeletePresentation(presentation.id);
          const onClickDelete = () => deletePresentation(presentation.id);
          return (
            <li key={index}>
              <span>{presentation.metadata.title}</span>
              <span>{promptedToDeleteId === presentation.id ? 'Sure ?' : ''}</span>
              {promptedToDeleteId === presentation.id ? <button onClick={onClickDelete}>Delete sure</button> : <button onClick={onClickPrompt}>Delete</button>}
            </li>
          );
        })
        }
        </ul>
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

export default ProjectManagerLayout;
