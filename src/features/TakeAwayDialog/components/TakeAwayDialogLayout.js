/**
 * This module exports a stateless component rendering the layout of the takeway dialog feature interface
 * @module bulgur/features/TakeAwayDialog
 */
import React from 'react';

import 'react-select/dist/react-select.css';

import './TakeAwayDialog.scss';

/**
 * Renders the options for takeaway mode choice
 * @param {object} props - the props to render
 * @param {function} takeAway - callback
 * @param {boolean} serverAvailable - whether app is implemented with a distant server connection
 * @param {boolean} gistAvailable - whether app is implemented with a gistAvailable connection
 * @return {ReactElement} markup
 */
export const ChooseTakeAwayStep = ({
  takeAway,
  serverAvailable,
  gistAvailable
}) => (
  <section className="new-presentation-dialog-step">
    <h1>I want to take away my presentation as ...</h1>
    <form className="take-away-type-choice">
      {
        // todo : put this data in a model file
        [{
          id: 'project',
          label: 'a project file (for reworking on this presentation on another browser/computer)',
          active: true
        },
        {
          id: 'html',
          label: 'an html file to upload to the website of my choice',
          active: serverAvailable === true
        },
        {
          id: 'github',
          label: 'a gist+bl.ocks online website',
          active: serverAvailable === true && gistAvailable === true
        },
        {
          id: 'server',
          label: 'a sciences po\'s quinoa server powered website',
          active: serverAvailable === true
        }
        ]
        .filter(option => option.active === true)
        .map((takeAwayType, key) => {
          const onOptionClick = (evt) => {
            evt.stopPropagation();
            takeAway(takeAwayType);
          };
          return (
            <div className="take-away-type-item"
              key={key}>
              <input
                type="radio"
                id={takeAwayType}
                name={takeAwayType}
                value="type"
                checked={false} />
              <label
                onClick={onOptionClick}
                htmlFor={takeAwayType}>
                <img className="bulgur-icon-image" src={require('../assets/bulgur-take-away-type-' + takeAwayType.id + '.svg')} />
                <h3>{takeAwayType.label}</h3>
              </label>
            </div>);
      })}
    </form>
  </section>
);

/**
 * Renders the layout of the take away dialog
 * @param {object} props - the props to render
 * @param {object} props.activePresentation - the presentation to take away
 * @param {string} props.takeAwayGistLog
 * @param {string} props.takeAwayGistLogStatus
 * @param {string} props.takeAwayServerLog
 * @param {string} props.takeAwayServerLogStatus
 * @param {boolean} props.serverAvailable - whether app is connected to a distant server
 * @param {boolean} props.gistAvailable - whether app is connected to gist
 * @param {function} props.takeAway - main callback function for container
 * @param {object} props.actions - actions passed by redux logic
 * @return {ReactElement} markup
 */
const TakeAwayDialogLayout = ({
  activePresentation,
  takeAwayGistLog,
  takeAwayGistLogStatus,
  takeAwayServerLog,
  takeAwayServerLogStatus,
  serverAvailable,
  gistAvailable,
  // actions
  takeAway,
  actions: {
    closeTakeAwayModal
  },
}) => (
  <div className="bulgur-take-away-dialog-layout">
    <ChooseTakeAwayStep 
      takeAway={takeAway} 
      serverAvailable={serverAvailable}
      gistAvailable={gistAvailable}
    />
    <section className="take-away-dialog-step pub-links">
      {
        takeAwayGistLog ? <p className="take-away-log" style={{background: takeAwayGistLogStatus === 'success' ? 'lightgreen' : 'lightblue'}}>{takeAwayGistLog}</p> : ''
      }
      {
        takeAwayServerLog ? <p className="take-away-log" style={{background: takeAwayServerLogStatus === 'success' ? 'lightgreen' : 'lightblue'}}>{takeAwayServerLog}</p> : ''
      }
      {
        activePresentation && activePresentation.metadata && activePresentation.metadata.blocksUrl ?
          <h2 className="pub-link">
            <a target="blank" href={activePresentation.metadata.blocksUrl}>Go to the bl.ocks webpage of your presentation</a>
          </h2> : ''
      }
      {
        activePresentation && activePresentation.metadata && activePresentation.metadata.gistUrl ?
          <h2 className="pub-link">
            <a target="blank" href={activePresentation.metadata.gistUrl}>Go to the gist source code of your presentation</a>
          </h2>
        : ''
      }
      {
        activePresentation && activePresentation.metadata && activePresentation.metadata.serverHTMLUrl ?
          <h2 className="pub-link">
            <a target="blank" href={activePresentation.metadata.serverHTMLUrl}>Go to the quinoa server's webpage of your presentation</a>
          </h2> : ''
      }
    </section>
    <section className="take-away-dialog-step">
      <button
        onClick={closeTakeAwayModal}>
        Cancel
      </button>
    </section>
  </div>
);

export default TakeAwayDialogLayout;
