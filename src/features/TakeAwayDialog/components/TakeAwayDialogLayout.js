import React from 'react';

import 'react-select/dist/react-select.css';

import './TakeAwayDialog.scss';

export const ChooseTakeAwayStep = ({
  takeAway,
}) => (
  <section className="new-story-dialog-step">
    <h1>I want to take away my story as ...</h1>
    <form className="take-away-type-choice">
      {
        // todo : put this data in a model file
        [{
          id: 'project',
          label: 'a project file (for reworking on this story later)'
        },
        {
          id: 'html',
          label: 'an all-in-one html file to upload to the website of my choice'
        },
        {
          id: 'github',
          label: 'a github.io online website'
        },
        ].map((takeAwayType, key) => {
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
                <img src={require('../assets/bulgur-take-away-' + takeAwayType.id + '.png')} />
                <h3>{takeAwayType.label}</h3>
              </label>
            </div>);
      })}
    </form>
  </section>
);


const NewStoryDialogLayout = ({
  actions: {
    closeTakeAwayModal
  },
  takeAway
}) => (
  <div className="take-away-dialog">
    <ChooseTakeAwayStep takeAway={takeAway} />
    <section className="take-away-dialog-step">
      <button
        onClick={closeTakeAwayModal}>
        Cancel
      </button>
    </section>
  </div>
);

export default NewStoryDialogLayout;
