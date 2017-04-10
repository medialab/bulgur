/**
 * This module provides a reusable presentation card component
 * @module bulgur/components/PresentationCard
 */
import React, {PropTypes} from 'react';

import {translateNameSpacer} from '../../helpers/translateUtils';

import './PresentationCard.scss';

const computeVisIcons = (presentation) => {
  if (presentation.visualizations && Object.keys(presentation.visualizations).length) {
    return (
      <span className="icons-container">
        {
          Object.keys(presentation.visualizations)
          .map(k => presentation.visualizations[k])
          .map((visualization, index) => {
            const type = visualization.metadata.visualizationType;
            switch (type) {
              case 'map':
                return (<img key={index} src={require('./assets/bulgur-vistype-map.svg')} />);
              case 'network':
                return (<img key={index} src={require('./assets/bulgur-vistype-network.svg')} />);
              case 'timeline':
                return (<img key={index} src={require('./assets/bulgur-vistype-timeline.svg')} />);
              default:
                return (<img key={index} src={require('./assets/bulgur-vistype-network.svg')} />);
            }
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
}, context) => {

  const translate = translateNameSpacer(context.t, 'Components.PresentationCard');
  return (
    <li className="bulgur-presentation-card">
      <div className="card-body">
        <div className="info-column">
          <h5 onClick={setToActive}>
            {computeVisIcons(presentation)}
            <span className="title">{presentation.metadata && presentation.metadata.title && presentation.metadata.title.length ? presentation.metadata.title : translate('untitled_presentation')}</span>
          </h5>
          <p className="description">
            {presentation.metadata && presentation.metadata.description && presentation.metadata.description.length ? presentation.metadata.description : translate('no_description')}
          </p>
        </div>
        <div className="buttons-column">
          <button className="edit-btn" onClick={setToActive}>
            <img src={require('./assets/edit.svg')} className="bulgur-icon-image" />
            {translate('edit')}
          </button>
          <button className="settings-btn" onClick={configure}>
            <img src={require('./assets/settings.svg')} className="bulgur-icon-image" />
            {translate('settings')}
          </button>
          <button className={'delete-btn ' + (promptedToDelete ? 'inactive' : '')} onClick={onClickPrompt}>
            <img src={require('./assets/close.svg')} className="bulgur-icon-image" />
            {translate('delete')}
          </button>
        </div>
      </div>
      <div className="card-footer">
        {promptedToDelete ?
          <div className="delete-prompt-container">
            {promptedToDelete ? <p>{translate('sure_delete')}</p> : null}
            <div className="button-row">
              <button className="delete-btn" onClick={onClickDelete}>
                {translate('delete_confirm')}
              </button>
              <button onClick={onClickUnprompt}>{translate('cancel')}</button>
            </div>
          </div> : <button onClick={onClickCopy}>⎘ {translate('duplicate')}</button> }
      </div>
    </li>
  );
};

PresentationCard.contextTypes = {
  t: PropTypes.func.isRequired
};

export default PresentationCard;
