/**
 * This module provides a reusable presentation card component
 * @module bulgur/components/PresentationCard
 */
import React from 'react';

import './PresentationCard.scss';

const computeVisIcons = (presentation) => {
  if (presentation.visualizations && Object.keys(presentation.visualizations).length) {
    return (
      <span className="icons-container">
        {
          Object.keys(presentation.visualizations)
          .map(k => presentation.visualizations[k])
          .map((visualization, index) => {
            let icon = '';
            const type = visualization.metadata.visualizationType;
            switch (type) {
              case 'map':
                icon = './assets/bulgur-vistype-map.svg';
                break;
              case 'network':
                icon = './assets/bulgur-vistype-network.svg';
                break;
              case 'timeline':
                icon = './assets/bulgur-vistype-timeline.svg';
                break;
              default:
                icon = './assets/bulgur-vistype-network.svg';
                break;
            }
            return (<img key={index} src={require(icon)} />);
          })
        }
      </span>
    );
  }
  return null;
};

const PresentationCard = ({
  presentation,
  promptedToDelete,
  // actions
  setToActive,
  configure,
  onClickDelete,
  onClickPrompt,
  onClickUnprompt,
  onClickCopy
}) => (
  <li className="bulgur-presentation-card">
    <div className="card-header">
      <h5 onClick={setToActive}>
        {computeVisIcons(presentation)}
        <span className="title">{presentation.metadata && presentation.metadata.title && presentation.metadata.title.length ? presentation.metadata.title : 'untitled presentation'}</span>
      </h5>
    </div>
    <div className="card-body">
      <p className="description">
        {presentation.metadata && presentation.metadata.description && presentation.metadata.description.length ? presentation.metadata.description : 'No description'}
      </p>
      <div className="buttons-column">
        <button className="edit-btn" onClick={setToActive}>edit</button>
        <button className="settings-btn" onClick={configure}>settings</button>
        <button className={'delete-btn ' + (promptedToDelete ? 'inactive' : '')} onClick={onClickPrompt}>delete</button>
      </div>
    </div>
    <div className="card-footer">
      {promptedToDelete ?
        <div className="delete-prompt-container">
          {promptedToDelete ? <p>Are you sure you want to delete this presentation ?</p> : null}
          <div className="button-row">
            <button className="delete-btn" onClick={onClickDelete}>Yes, delete this presentation</button>
            <button onClick={onClickUnprompt}>Cancel</button>
          </div>
        </div> : <button onClick={onClickCopy}>⎘ duplicate</button> }
    </div>
  </li>
);

export default PresentationCard;
