/**
 * This module provides a reusable presentation card component
 * @module bulgur/components/PresentationCard
 */
import React from 'react';
import PropTypes from 'prop-types';

import {translateNameSpacer} from '../../helpers/translateUtils';

import './PresentationCard.scss';


/**
 * Picks the proper presentation icon regarding the type
 * of the visualizations featured in the presentation
 * @param {object} presentation - the presentation to parse
 * @return {ReactElement} icon - the proper icon(s)
 */
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
                return (<img key={index} src={require('../../sharedAssets/bulgur-vistype-map.svg')} />);
              case 'network':
                return (<img key={index} src={require('../../sharedAssets/bulgur-vistype-network.svg')} />);
              case 'timeline':
                return (<img key={index} src={require('../../sharedAssets/bulgur-vistype-timeline.svg')} />);
              default:
                return (<img key={index} src={require('../../sharedAssets/bulgur-vistype-network.svg')} />);
            }
          })
        }
      </span>
    );
  }
  return null;
};

/**
 * Renders the PresentationCard component as a pure function
 * @param {object} props - used props (see prop types below)
 * @param {object} context - used context data (see context types below)
 * @return {ReactElement} component - the resulting component
 */
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
    <li className="bulgur-PresentationCard">
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
            <img src={require('../../sharedAssets/edit-white.svg')} className="bulgur-icon-image" />
            {translate('edit')}
          </button>
          <button className="settings-btn" onClick={configure}>
            <img src={require('../../sharedAssets/settings-black.svg')} className="bulgur-icon-image" />
            {translate('settings')}
          </button>
          <button className={'delete-btn ' + (promptedToDelete ? 'inactive' : '')} onClick={onClickPrompt}>
            <img src={require('../../sharedAssets/close-white.svg')} className="bulgur-icon-image" />
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


/**
 * Component's properties types
 */
PresentationCard.propTypes = {

  /**
   * presentation to display
   */
  presentation: PropTypes.object,

  /**
   * represents whether presentation is asked to be deleted ("are you sure ...")
   */
  promptedToDelete: PropTypes.bool,
  // actions

  /**
   * callbacks when slide is set to active
   */
  setToActive: PropTypes.func,

  /**
   * callbacks when slide is asked to be configured
   */
  configure: PropTypes.func,

  /**
   * callbacks when slide asks to be deleted
   */
  onClickDelete: PropTypes.func,

  /**
   * callbacks when user opens the delete prompt
   */
  onClickPrompt: PropTypes.func,

  /**
   * callbacks when user dismisses the delete prompt
   */
  onClickUnprompt: PropTypes.func,

  /**
   * callbacks when slide asks to be duplicated
   */
  onClickCopy: PropTypes.func
};

/**
 * Component's context used properties
 */
PresentationCard.contextTypes = {
  t: PropTypes.func.isRequired
};

export default PresentationCard;
