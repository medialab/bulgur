/**
 * This module exports a stateless component rendering the layout of the presentations manager interface
 * @module bulgur/features/PresentationsManager
 */
import React from 'react';
import Modal from 'react-modal';
import Dropzone from 'react-dropzone';

import './PresentationsManagerLayout.scss';
/**
 * Renders the layout component of the feature
 * @param {object} props - the props to render
 * @param {array} props.presentaiontsList - the list of locally stored presentations
 * @param {object} props.importCandidate - cached presentation waiting to be imported or not
 * @param {string} props.importStatus
 * @param {string} props.importError
 * @param {string} props.promptedToDeleteId
 * @param {number} props.maxNumberOfLocalPresentations
 * @param {string} props.importFromUrlCandidate
 * @param {function} props.onDropInput
 * @param {function} props.overrideImportWithCandidate
 * @param {function} props.importFromDistantJSON
 * @param {function} props.actions - actions passed by redux logic
 * @return {ReactElement} markup
 */
const PresentationsManagerLayout = ({
  // content-related
  presentationsList = [],
  importCandidate,
  // ui-related
  importStatus,
  importError,
  promptedToDeleteId,
  maxNumberOfLocalPresentations,
  importFromUrlCandidate,
  // actions
  onDropInput,
  overrideImportWithCandidate,
  importFromDistantJSON,
  actions: {
    promptDeletePresentation,
    unpromptDeletePresentation,
    deletePresentation,
    copyPresentation,
    startPresentationCandidateConfiguration,
    setActivePresentation,
    importReset,
    setImportFromUrlCandidate
  }
}) => {
  const onCreatePresentation = () => {
    startPresentationCandidateConfiguration();
  };

  const onImportFromUrlChange = (e) => setImportFromUrlCandidate(e.target.value);
  const allowNewPresentations = presentationsList.length < maxNumberOfLocalPresentations;
  return (
    <section className="bulgur-presentations-manager-layout">
      <section className="landing-group">
        <h1>Bulgur</h1>
        <p>
          Bulgur is a tool dedicated to the making of guided tours into data visualizations, called <i>data presentations</i>.
        </p>
        <p>
          Import a data file from your computer, choose a visualization technique, build your presentation. Then export it to a static html file or to a web publication.
        </p>
        <p>
          Bulgur is part of the <a target="blank" href="http://www.medialab.sciences-po.fr/">sciencespo’s médialab</a> tools.
        </p>
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/VsnhrYjP02M"
          frameBorder="0"
          allowFullScreen />
      </section>

      <section className="landing-group">
        {allowNewPresentations ? <button className="new-presentation" onClick={onCreatePresentation}>Start a new presentation</button> : null }
        {allowNewPresentations ?
          <div>
            <h3>... or import a project from your computer</h3>
            <Dropzone
              className="drop-zone"
              activeClassName="drop-zone-active"
              onDrop={onDropInput}>
              <div>drop the .json file here</div>
            </Dropzone>
          </div>
        : 'You have reached the maximum number of local presentations. You have to make a bit of room before creating new ones. Remember you can save your presentations to the web and import them later !'}


        {allowNewPresentations ?
          <div className="import-from-url">
            <h3>...or fetch an existant project from a distant server</h3>
            <form onSubmit={importFromDistantJSON}>
              <input
                value={importFromUrlCandidate}
                onChange={onImportFromUrlChange} type="text"
                placeholder="copy-paste the URL of the project" />
              <input
                type="submit"
                value="Import" />
            </form>
            <p>
              <i>You can import a project from the forccast server or from a <a target="blank" href="https://gist.github.com">gist</a> repository.</i>
            </p>
          </div> : null}
        <div className="import-status-display">
          {importStatus}
        </div>
        <div className="import-error-display">
          {importError === 'badJSON' ? 'Your file is badly formatted' : ''}
          {importError === 'invalidProject' ? 'Your file is not a valid quinoa presentation' : ''}
          {importError === 'invalidUrl' ? 'The url did not point to a valid presentation' : ''}
          {importError === 'invalidGist' ? 'The gist is not properly formatted as a quinoa presentation' : ''}
          {importError === 'fetchError' ? 'The fetch process of the file failed' : ''}
        </div>

        <div className="presentations-group">
          {presentationsList.length > 0 ? <h4>... or continue one of your locally stored presentations</h4> : null}
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
                  <button onClick={setToActive}>✏ edit</button>
                  <button onClick={configure}>⚙ settings</button>
                  {promptedToDeleteId !== presentation.id ? <button onClick={onClickCopy}>⎘ duplicate</button> : ''}
                  {promptedToDeleteId !== presentation.id ? <button onClick={onClickPrompt}>⌫ delete</button> : null}
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
