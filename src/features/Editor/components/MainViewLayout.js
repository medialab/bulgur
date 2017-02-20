/**
 * This module exports a stateless component rendering the main view contents of the editor feature interface
 * @module bulgur/features/Editor
 */
import React from 'react';

import VisualizationManager from '../../../components/VisualizationManager/VisualizationManager';
import DraftEditor from '../../../components/DraftEditor/DraftEditor';
import SlideSettingsPannel from '../../../components/SlideSettingsPannel/SlideSettingsPannel';

import './MainViewLayout.scss';

/**
 * Renders the layout of the main view of editor
 * @param {object} props - the props to render
 * @param {object} props.activePresentation
 * @param {string} props.activeSlideId
 * @param {object} props.activeViews
 * @param {object} props.editedColor
 * @param {function} props.slideSettingsPannelIsOpen
 * @param {boolean} props.isTakeAwayModalOpen
 * @param {function} props.updateSlide
 * @param {function} props.onUserViewChange
 * @param {function} props.setActiveSlide
 * @param {function} props.setViwDatamapItem
 * @param {function} props.toggleSlideSettingsPannel
 * @param {function} props.toggleViewColorEdition
 * @param {function} props.setViewColor
 * @return {ReactElement} markup
 */
const MainViewLayout = ({
  // content related
  activePresentation = {},
  activeSlideId,
  activeViews = {},

  // ui related
  editedColor,
  // isTakeAwayModalOpen,
  slideSettingsPannelIsOpen,
  // actions
  updateSlide,
  onUserViewChange,
  setActiveSlide,
  setViewDatamapItem,
  toggleSlideSettingsPannel,
  toggleViewColorEdition,
  setViewColor,
}) => {

  const setVisualization = (view, id) => {
    const onChange = (event) => onUserViewChange(id, event);
    const data = activePresentation.visualizations[id].data;
    // flatten datamap fields (todo: refactor as helper)
    const dataMap = Object.keys(view.dataMap).reduce((result, collectionId) => ({
      ...result,
      [collectionId]: Object.keys(view.dataMap[collectionId]).reduce((propsMap, parameterId) => {
        const parameter = view.dataMap[collectionId][parameterId];
        if (parameter.mappedField) {
          return {
            ...propsMap,
            [parameterId]: parameter.mappedField
          };
        }
        return propsMap;
      }, {})
    }), {});
    return (
      <VisualizationManager
        visualizationType={view.metadata.visualizationType}
        data={data}
        dataMap={dataMap}
        viewParameters={view.viewParameters}
        onUserChange={onChange} />
    );
  };

  const activeSlide = activePresentation.slides && activeSlideId && activePresentation.slides[activeSlideId];

  // todo : factorize that
  const activeViewsAsSlides = Object.keys(activeViews).reduce((views, id) => ({
    ...views,
    [id]: {
      viewParameters: activeViews[id].viewParameters,
      dataMap: activeViews[id].dataMap
    }
  }), {});
  const viewsEqualActiveSlideViews = activeSlide &&
                                JSON.stringify(activeViewsAsSlides) === JSON.stringify(activeSlide.views);

  const clickOnRecord = () => {
    updateSlide(activeSlideId, {
      ...activeSlide,
      // todo : factorize that
      views: Object.keys(activeViews).reduce((views, id) => ({
        ...views,
        [id]: {
          viewParameters: activeViews[id].viewParameters,
          dataMap: activeViews[id].dataMap
        }
      }), {})
    });
  };
  const clickOnReset = () => setActiveSlide(activeSlideId, activeSlide);

  const updateTitle = (e) => {
    updateSlide(activeSlideId, {
      ...activeSlide,
      title: e.target.value
    });
  };

  const updateDraft = (markdown) => {
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
        {activeSlide ?
          <SlideSettingsPannel
            isOpen={slideSettingsPannelIsOpen}
            togglePannel={toggleSlideSettingsPannel}
            views={activeViews}
            setViewDatamapItem={setViewDatamapItem}
            toggleViewColorEdition={toggleViewColorEdition}
            setViewColor={setViewColor}
            editedColor={editedColor}
            presentation={activePresentation} /> : null }
      </section>
      <figcaption className="caption-container">
        {activeSlide ? <section className="caption-header">
          <h1>
            <input
              type="text"
              value={activeSlide.title}
              onChange={updateTitle}
              placeholder="Write your slide title here" />
          </h1>
          {!activeSlide ?
            '' :
            <div className={'view-operations ' + (viewsEqualActiveSlideViews ? '' : 'visible')}>
              <button id="take-snapshot-btn" className={viewsEqualActiveSlideViews ? 'inactive' : 'active'} onClick={clickOnRecord}><img className="bulgur-icon-image" src={require('../assets/snapshot.svg')} /> Take snapshot</button>
              <button id="reset-view-btn" onClick={clickOnReset}><img className="bulgur-icon-image" src={require('../assets/reset.svg')} /> Reset view</button>
            </div>
          }
        </section> : null}
        <div className="caption-editor">
          <div className="editor-areas-container">
            {activeSlide ? <DraftEditor
              slide={activeSlide}
              update={updateDraft} /> : null}
          </div>
        </div>
      </figcaption>
    </figure>
  );
};

export default MainViewLayout;
