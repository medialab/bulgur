/**
 * This module exports a stateless component rendering the layout of the presentations manager interface
 * @module bulgur/features/PresentationsManager
 */
import React, {PropTypes} from 'react';
import Modal from 'react-modal';

import './PresentationsManagerLayout.scss';

import DropZone from '../../../components/DropZone/DropZone';
import PresentationCard from '../../../components/PresentationCard/PresentationCard';
import LangToggler from '../../../components/LangToggler/LangToggler';
import {translateNameSpacer} from '../../../helpers/translateUtils';

/**
 * Renders the layout component of the feature
 * @param {object} props - the props to render
 * @param {string} props.lang - the active language
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
  lang,
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
    setImportFromUrlCandidate,
    setLanguage
  }
}, context) => {
  const translate = translateNameSpacer(context.t, 'Features.PresentationManager');
  const onCreatePresentation = () => {
    startPresentationCandidateConfiguration();
  };
  const onImportFromUrlChange = (e) => setImportFromUrlCandidate(e.target.value);
  const allowNewPresentations = presentationsList.length < maxNumberOfLocalPresentations;
  return (
    <section className="bulgur-presentations-manager-layout">
      <section className="landing-group">
        <h1>Bulgur</h1>
        <div className="row-section">
          <p>
            <LangToggler lang={lang} onChange={setLanguage} />
          </p>
          <p>
            {translate('description-$1-goal')}
          </p>
          <p>
            {translate('description-$2-flow')}
          </p>
        </div>
        <div className="row-section">
          <iframe
            width="100%"
            height="300"
            src="https://www.youtube.com/embed/VsnhrYjP02M"
            frameBorder="0"
            allowFullScreen />
        </div>
        <div className="row-section about">
          <p>
            {translate('about-forccast')}
          </p>
          <p>
            {translate('about-medialab')}
          </p>
          <p>
            <a className="medialab" target="blank" href="http://www.medialab.sciences-po.fr/">
              <img src={require('../assets/logo-medialab.png')} />
            </a>
          </p>
        </div>
      </section>

      <section className="landing-group">

        {allowNewPresentations ?
          <div className="row-section">
            <button className="new-presentation" onClick={onCreatePresentation}>
              {translate('start-a-new-presentation')}
            </button>
          </div> :
          <p>
            {translate('maximum-presentations-reached')}
          </p>
          }

        <div className="row-section presentations-group">
          {presentationsList.length > 0 ?
            <h4>
              {translate('or-continue-locally-stored-presentation')}
            </h4>
            : null}
          <ul className="local-presentations-list">
            {presentationsList.map((presentation, index) => {
            const onClickPrompt = () => promptDeletePresentation(presentation.id);
            const onClickUnprompt = () => unpromptDeletePresentation(presentation.id);
            const onClickDelete = () => deletePresentation(presentation.id);
            const onClickCopy = () => copyPresentation(presentation);
            const setToActive = () => setActivePresentation(presentation);
            const configure = () => startPresentationCandidateConfiguration(presentation);
            const promptedToDelete = promptedToDeleteId === presentation.id;
            return (
              <PresentationCard
                key={index}
                presentation={presentation}
                promptedToDelete={promptedToDelete}
                setToActive={setToActive}
                configure={configure}
                onClickDelete={onClickDelete}
                onClickPrompt={onClickPrompt}
                onClickUnprompt={onClickUnprompt}
                onClickCopy={onClickCopy} />
            );
          })
          }
          </ul>
        </div>
        {allowNewPresentations ?
          <div className="row-section">
            <h3>
              {translate('import-project-from-computer')}

            </h3>
            <DropZone
              accept="application/json"
              onDrop={onDropInput}>
              {translate('drop-a-json-file-here')}
            </DropZone>
          </div>
        : null}
        {allowNewPresentations ?
          <div className="row-section import-from-url">
            <h3>
              {translate('fetch-an-existant-project-from-distant-server')}
            </h3>
            <form onSubmit={importFromDistantJSON}>
              <input
                value={importFromUrlCandidate}
                onChange={onImportFromUrlChange} type="text"
                placeholder={translate('copy-paste-url-of-the-project')} />
              <input
                type="submit"
                value={translate('import')} />
            </form>
          </div> : null}
        <div className="import-status-display">
          {importStatus}
        </div>
        <div className="import-error-display">
          {
            importError === 'badJSON' ?
            translate('your-file-is-badly-formatted')
            : ''
          }
          {importError === 'invalidProject' ?
            translate('your-file-is-not-a-valid-presentation')
            : ''}
          {importError === 'invalidUrl' ?
            translate('the-url-did-not-point-to-a-valid-presentation')
            : ''}
          {importError === 'invalidGist' ?
            translate('the-gist-is-not-properly-formatted')
            : ''}
          {importError === 'fetchError' ?
            translate('the-fetching-process-failed')
            : ''}
        </div>
      </section>

      <Modal
        onRequestClose={importReset}
        contentLabel="Override the existing presentation"
        isOpen={importCandidate !== undefined}>
        <h1 className="modal-header">
          {translate('presentation-already-exists')}
        </h1>
        <div className="modal-content">
          <div className="modal-row">
            {translate('you-seem-to-have-already-this-presentation')}
            <br /><br />
            {translate('do-you-wish-to-override-presentation')}
          </div>
        </div>
        <div className="modal-footer override-modal-footer">
          <button onClick={overrideImportWithCandidate}>
            {translate('override-existing-version-of-presentation')}
          </button>
          <button onClick={importReset}>
            {translate('cancel')}
          </button>
        </div>
      </Modal>
    </section>
  );
};

PresentationsManagerLayout.contextTypes = {
  t: PropTypes.func.isRequired
};

export default PresentationsManagerLayout;
