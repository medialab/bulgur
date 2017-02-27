/**
 * This module exports a stateless component rendering the layout of the takeway dialog feature interface
 * @module bulgur/features/TakeAwayDialog
 */
import React from 'react';

import './TakeAwayDialog.scss';

import BigSelect from '../../../components/BigSelect/BigSelect';
import Toaster from '../../../components/Toaster/Toaster';
import HelpPin from '../../../components/HelpPin/HelpPin';
/**
 * Renders the options for takeaway mode choice
 * @param {object} props - the props to render
 * @param {function} takeAway - callback
 * @param {function} setTakeAwayType - callback
 * @param {string} takeAwayType - the active takeawayType
 * @param {boolean} serverAvailable - whether app is implemented with a distant server connection
 * @param {boolean} gistAvailable - whether app is implemented with a gistAvailable connection
 * @return {ReactElement} markup
 */
export const ChooseTakeAwayStep = ({
  takeAway,
  setTakeAwayType,
  takeAwayType,
  serverAvailable,
  gistAvailable,
  serverHtmlUrl,
  gistId
}) => {
  const optionSelect = (option) => {
    switch (option.id) {
      case 'server':
        if (!serverHtmlUrl) {
          takeAway(option);
        }
        return setTakeAwayType(option.id);

      case 'github':
        if (!gistId) {
          takeAway(option);
        }
        return setTakeAwayType(option.id);
      default:
        return takeAway(option);
    }
  };
 // todo : put this data in a model file ? to decide
  const options = [{
          id: 'project',
          icon: require('../assets/bulgur-take-away-type-project.svg'),
          label: <span>project file <HelpPin>a backup of your presentation that can be imported elsewhere</HelpPin></span>,
          possible: true
        },
        {
          id: 'html',
          icon: require('../assets/bulgur-take-away-type-html.svg'),
          label: <span>html file <HelpPin>a webpage file ready to upload wherever you want</HelpPin></span>,
          possible: serverAvailable === true
        },
        {
          id: 'github',
          icon: require('../assets/bulgur-take-away-type-github.svg'),
          label: <span>gist-powered website <HelpPin>the presentation will be publicly available</HelpPin></span>,
          possible: serverAvailable === true && gistAvailable === true
        },
        {
          id: 'server',
          icon: require('../assets/bulgur-take-away-type-server.svg'),
          label: <span>forccast-powered website <HelpPin position="left">the presentation will be stored on the server and publicly available</HelpPin></span>,
          possible: serverAvailable === true
        }
        ]
        .filter(option => option.possible === true);
  return (
    <BigSelect
      options={options}
      activeOptionId={takeAwayType}
      onOptionSelect={optionSelect} />
  );
};

/**
 * Renders the layout of the take away dialog
 * @param {object} props - the props to render
 * @param {object} props.activePresentation - the presentation to take away
 * @param {string} props.takeAwayType - the active takeaway type
 * @param {string} props.takeAwayGistLog
 * @param {string} props.takeAwayGistLogStatus
 * @param {string} props.takeAwayServerLog
 * @param {string} props.takeAwayServerLogStatus
 * @param {string} props.bundleToHtmlLog
 * @param {string} props.bundleToHtmlLogStatus
 * @param {boolean} props.serverAvailable - whether app is connected to a distant server
 * @param {string} props.serverUrl - the url base of the distant server
 * @param {boolean} props.gistAvailable - whether app is connected to gist
 * @param {function} props.takeAway - main callback function for container
 * @param {function} props.updateActivePresentationFromGist -
 * @param {function} props.updateActivePresentationFromServer -
 * @param {object} props.actions - actions passed by redux logic
 * @return {ReactElement} markup
 */
const TakeAwayDialogLayout = ({
  activePresentation,
  takeAwayType,
  takeAwayGistLog,
  takeAwayGistLogStatus,
  takeAwayServerLog,
  takeAwayServerLogStatus,
  bundleToHtmlLog,
  bundleToHtmlLogStatus,
  serverAvailable,
  serverUrl,
  gistAvailable,
  // actions
  takeAway,
  updateActivePresentationFromGist,
  updateActivePresentationFromServer,
  actions: {
    closeTakeAwayModal,
    setTakeAwayType
  },
}) => {
  const updateActivePresentationToServer = () => takeAway({id: 'server'});
  const updateActivePresentationToGist = () => takeAway({id: 'github'});
  return (
    <div className="bulgur-take-away-dialog-layout">
      <h1 className="modal-header">
        Take away your presentation
      </h1>
      <section className="modal-content">
        <section className="modal-row">
          <ChooseTakeAwayStep
            takeAway={takeAway}
            setTakeAwayType={setTakeAwayType}
            serverAvailable={serverAvailable}
            takeAwayType={takeAwayType}
            gistAvailable={gistAvailable}
            serverHtmlUrl={activePresentation && activePresentation.metadata && activePresentation.metadata.serverHTMLUrl}
            gistId={activePresentation && activePresentation.metadata && activePresentation.metadata.gistId} />
        </section>
        <section className={'modal-row ' + (bundleToHtmlLogStatus || takeAwayGistLogStatus || takeAwayServerLogStatus ? '' : 'empty')}>
          <Toaster status={bundleToHtmlLogStatus} log={bundleToHtmlLog} />
          <Toaster status={takeAwayGistLogStatus} log={takeAwayGistLog} />
          <Toaster status={takeAwayServerLogStatus} log={takeAwayServerLog} />
        </section>
        <section className="modal-row">
          {
          takeAwayType === 'github' &&
          activePresentation && activePresentation.metadata && activePresentation.metadata.gistId ?
            <div className="sync-section-container">
              <h2><img src={require('../assets/bulgur-take-away-type-github.svg')} />Your presentation is online on the gist platform</h2>
              <div className="sync-section">
                <div className="column">
                  <p>
                    <a target="blank" href={activePresentation.metadata.gistUrl}>
                      → Go to the gist source code of your presentation
                    </a>
                    <a target="blank" href={serverUrl + '/gist-presentation/' + activePresentation.metadata.gistId}>
                      → Go to the gist-based webpage of your presentation
                    </a>
                  </p>
                  <p>Embed inside an html webpage :</p>
                  <pre>
                    <code>
                      {`<iframe allowfullscreen src="${serverUrl + '/gist-presentation/' + activePresentation.metadata.gistId}" width="1000" height="500" frameborder=0></iframe>`}
                    </code>
                  </pre>
                </div>
                <div className="column">
                  <div className="operations">
                    <button onClick={updateActivePresentationToGist}>↑ Update local version to the online repository</button>
                    <button onClick={updateActivePresentationFromGist}>↓ Update local version from the online repository</button>
                  </div>
                </div>
              </div>
            </div>
            : null
        }
          {
          takeAwayType === 'server' &&
          activePresentation && activePresentation.metadata && activePresentation.metadata.serverHTMLUrl ?
            <div className="sync-section-container">
              <h2><img src={require('../assets/bulgur-take-away-type-server.svg')} />Your presentation is online on the forccast server</h2>
              <div className="sync-section">
                <div className="column">
                  <p>
                    <a target="blank" href={activePresentation.metadata.serverHTMLUrl}>
                    → Go to the forccast server's webpage of your presentation
                    </a>
                  </p>
                  <p>Embed inside an html webpage :</p>
                  <pre>
                    <code>
                      {`<iframe allowfullscreen src="${activePresentation.metadata.serverHTMLUrl}" width="1000" height="500" frameborder=0></iframe>`}
                    </code>
                  </pre>
                </div>
                <div className="column">
                  <div className="operations">
                    <button onClick={updateActivePresentationToServer}>↑ Update local version to the online repository</button>
                    <button onClick={updateActivePresentationFromServer}>↓ Update local version from the online repository</button>
                  </div>
                </div>
              </div>
            </div>
            : ''
        }
        </section>
      </section>
      <section className="modal-footer">
        <button
          onClick={closeTakeAwayModal}>
        Close
      </button>
      </section>
    </div>);
};

export default TakeAwayDialogLayout;
