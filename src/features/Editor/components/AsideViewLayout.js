/**
 * This module exports a stateless component rendering the aside contents of the editor feature interface
 * @module bulgur/features/Editor
 */
import React from 'react';
import PropTypes from 'prop-types';

import './AsideViewLayout.scss';

import SlidesContainer from '../../../components/SlidesContainer/SlidesContainer';
import {translateNameSpacer} from '../../../helpers/translateUtils';


/**
 * Renders the aside view of the editor
 * @param {object} props - the props to render
 * @param {function} props.openSettings
 * @param {object} props.activePresentation - the presentation being edited in the editor
 * @param {function} props.addSlide
 * @param {function} props.updateSlide
 * @param {function} props.moveSlide
 * @param {function} props.removeSlide
 * @param {function} props.duplicateSlide
 * @param {function} props.setActiveSlide
 * @param {function} props.returnToLanding
 * @param {string} props.activeSlideId
 * @return {ReactElement} markup
 */
const AsideViewLayout = ({
  openSettings,
  activePresentation = {},
  addSlide,
  updateSlide,
  moveSlide,
  removeSlide,
  duplicateSlide,
  setActiveSlide,
  returnToLanding,
  activeSlideId,
}, context) => {
  const translate = translateNameSpacer(context.t, 'Features.Editor');
  const onRemoveSlide = id => {
    // determining new active slide
    const newActive = activePresentation.order && activePresentation.order.length > 1 ?
      activePresentation.order[activePresentation.order.indexOf(id) - 1]
      : undefined;
    removeSlide(id);
    if (newActive && activeSlideId === id) {
      setActiveSlide(newActive, activePresentation.slides[newActive]);
    }
  };
  return (<aside className="bulgur-aside-view">
    <div className="aside-header">
      <button className="returnToLanding-btn" onClick={returnToLanding} type="button"><span className="bulgur-icon">☰</span> {translate('back-to-home')}</button>
      <button
        className="settings-btn"
        onClick={openSettings}
        type="button">
        <img
          className="bulgur-icon-image"
          src={require('../assets/settings.svg')} />
        {activePresentation.metadata &&
            activePresentation.metadata.title &&
            activePresentation.metadata.title.length ?
              activePresentation.metadata.title
              : translate('untitled-presentation')} - <i>
                {translate('settings')}</i>
      </button>
    </div>
    {
      activePresentation.order ?
        <SlidesContainer
          activePresentation={activePresentation}
          activeSlideId={activeSlideId}
          setActiveSlide={setActiveSlide}
          addSlide={addSlide}
          updateSlide={updateSlide}
          moveSlide={moveSlide}
          removeSlide={onRemoveSlide}
          duplicateSlide={duplicateSlide} /> : null}
  </aside>);
};

AsideViewLayout.contextTypes = {
  t: PropTypes.func.isRequired
};

export default AsideViewLayout;
