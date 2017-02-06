import React from 'react';

import './AsideViewLayout.scss';

import Slides from '../../../components/BulgurSlides/BulgurSlideContainer';

const AsideViewLayout = ({
  openSettings,
  activePresentation = {},
  returnToLanding,
  addSlide,
  removeSlide,
  setActiveSlide,
  activeSlideId,
  updateSlide
}) => (
  <aside className="bulgur-aside-view">
    <button onClick={openSettings} type="button"><img className="bulgur-icon-image" src={require('../assets/settings.svg')} /> {activePresentation.metadata && activePresentation.metadata.title && activePresentation.metadata.title.length ? activePresentation.metadata.title : 'untitled presentation'}</button>
    {
      activePresentation.order ?
        <Slides
          activePresentation={activePresentation}
          activeSlideId={activeSlideId}
          setActiveSlide={setActiveSlide}
          addSlide={addSlide}
          updateSlide={updateSlide}
          removeSlide={removeSlide} /> : null}
    <button type="button" onClick={returnToLanding}>← Home</button>
  </aside>
);

export default AsideViewLayout;
