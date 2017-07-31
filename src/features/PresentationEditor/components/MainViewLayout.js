/**
 * This module exports a stateless component rendering the main view contents of the editor feature interface
 * @module bulgur/features/PresentationEditor
 */
import React from 'react';
import PropTypes from 'prop-types';

import './MainViewLayout.scss';

import VisualizationManager from '../../../components/VisualizationManager/VisualizationManager';
import DraftEditor from '../../../components/DraftEditor/DraftEditor';
import DebouncedInput from '../../../components/DebouncedInput/DebouncedInput';
import SlideSettingsPannel from '../../../components/SlideSettingsPannel/SlideSettingsPannel';
import {translateNameSpacer} from '../../../helpers/translateUtils';


/**
 * Renders the layout of the main view of editor
 * @param {object} props - the props to render
 * @param {object} props.activePresentation
 * @param {string} props.activeSlideId
 * @param {object} props.activeViews
 * @param {object} props.editedColor
 * @param {function} props.slideSettingsPannelState
 * @param {boolean} props.isTakeAwayModalOpen
 * @param {function} props.updateSlide
 * @param {function} props.onUserViewChange
 * @param {function} props.setActiveSlide
 * @param {function} props.setViwDatamapItem
 * @param {function} props.setSlideSettingsPannelState
 * @param {function} props.toggleViewColorEdition
 * @param {function} props.setViewColor
 * @param {function} props.setShownCategories
 * @return {ReactElement} markup
 */
const MainViewLayout = ({
  // content related
  activePresentation = {},
  activeSlideId,
  activeViews = {},

  // ui related
  editedColor,
  slideSettingsPannelState,
  // actions
  updateSlide,
  onUserViewChange,
  setActiveSlide,
  setViewDatamapItem,
  setSlideSettingsPannelState,
  toggleViewColorEdition,
  setViewColor,
  setShownCategories
}, context) => {

  // namespacing the translation keys with feature id
  const translate = translateNameSpacer(context.t, 'Features.PresentationEditor');


  /**
   * Preparing data for rendering
   */
  const viewsToSlides = (inputViews) =>
    Object.keys(inputViews).reduce((views, id) => ({
      ...views,
      [id]: {
        viewParameters: activeViews[id].viewParameters
      }
    }), {});

  const activeSlide = activePresentation.slides && activeSlideId && activePresentation.slides[activeSlideId];

  const activeViewsAsSlides = viewsToSlides(activeViews);
  const viewsEqualActiveSlideViews = activeSlide &&
                                JSON.stringify(activeViewsAsSlides) === JSON.stringify(activeSlide.views);


  /**
   * Callbacks
   */
  const setVisualization = (view, id) => {
    const onChange = (event) => onUserViewChange(id, event);
    const data = activePresentation.visualizations[id].data;
    return (
      <VisualizationManager
        visualizationType={view.metadata.visualizationType}
        data={data}
        viewParameters={view.viewParameters}
        onUserChange={onChange} />
    );
  };
  const clickOnRecord = () => {
    updateSlide(activeSlideId, {
      ...activeSlide,
      views: viewsToSlides(activeViews)
    });
  };
  const clickOnReset = () => setActiveSlide(activeSlideId, activeSlide);

  const updateTitle = title => {
    updateSlide(activeSlideId, {
      ...activeSlide,
      title,
    });
  };

  const updateDraft = markdown => {
    updateSlide(activeSlideId, {
      ...activeSlide,
      markdown
    });
  };
  return (
    <figure className="bulgur-main-view">
      <section className="visualizations-row">
        <section className="visualizations-container">
          {
          activeViews &&
          Object.keys(activeViews)
          .map(visualizationId => (
            <section key={visualizationId} className="visualization-container">
              {setVisualization(activeViews[visualizationId], visualizationId)}
            </section>
          ))
        }
        </section>
        {activeSlide &&
          activeViews &&
          activeViews[Object.keys(activeViews)[0]].metadata.visualizationType !== 'svg'
         ?
           <SlideSettingsPannel
             state={slideSettingsPannelState}
             setPannelState={setSlideSettingsPannelState}
             views={activeViews}
             setViewDatamapItem={setViewDatamapItem}
             setShownCategories={setShownCategories}
             toggleViewColorEdition={toggleViewColorEdition}
             setViewColor={setViewColor}
             editedColor={editedColor}
             presentation={activePresentation} /> : null }
      </section>
      {activeSlide ? <figcaption className="caption-container">
        <section className="caption-header">
          <h1>
            <DebouncedInput
              type="text"
              value={activeSlide.title}
              onChange={updateTitle}
              placeholder={translate('write-your-slide-title-here')} />
          </h1>
          <div className={'view-operations ' + (viewsEqualActiveSlideViews ? '' : 'visible')}>
            <button id="take-snapshot-btn" className={viewsEqualActiveSlideViews ? 'inactive' : 'active'} onClick={clickOnRecord}><img className="bulgur-icon-image" src={require('../assets/snapshot.svg')} />
              {translate('take-snapshot')}
            </button>
            <button id="reset-view-btn" onClick={clickOnReset}><img className="bulgur-icon-image" src={require('../assets/reset.svg')} />
              {translate('reset-view')}
            </button>
          </div>
        </section>
        <div className="caption-editor">
          <div className="editor-areas-container">
            <DraftEditor
              slide={activeSlide}
              onUpdate={updateDraft} />
          </div>
        </div>
      </figcaption> : null}
    </figure>
  );
};

MainViewLayout.contextTypes = {
  t: PropTypes.func.isRequired
};

export default MainViewLayout;
