import React from 'react';

import {
  Timeline,
  Network,
  Map
} from 'quinoa-vis-modules';

import DraftEditor from '../../../components/DraftEditor/DraftEditor';
import SettingsPannel from '../../../components/SettingsPannel/SettingsPannel';

import './MainViewLayout.scss';

const MainViewLayout = ({
  activePresentation = {},
  activeSlideId,
  updateSlide,
  activeViews,
  onUserViewChange,
  setActiveSlide,
  slideSettingsPannelIsOpen,
  toggleSlideSettingsPannel,
  toggleViewColorEdition,
  setViewColor,
  editedColor,
  isTakeAwayModalOpen
}) => {

  const setVisualization = (view, id) => {
    const onChange = (event) => onUserViewChange(id, event);
    // todo : improve code to have no need to do that ugly hack
    try {
      const data = activeViews[id].data;
      switch (view.metadata.visualizationType) {
        case 'map':
          return (<Map
            allowUserViewChange
            data={data}
            onUserViewChange={onChange}
            viewParameters={view.viewParameters} />);
        case 'network':
          return (<Network
            allowUserViewChange
            data={data}
            onUserViewChange={onChange}
            viewParameters={view.viewParameters} />);
        case 'timeline':
          return (<Timeline
            allowUserViewChange
            data={data}
            onUserViewChange={onChange}
            viewParameters={view.viewParameters} />);
        default:
          return null;
      }
    }
 catch (e) {
      return null;
    }
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

  const updateDraft = ({draft}) => {
    updateSlide(activeSlideId, {
      ...activeSlide,
      draft,
      markdown: undefined
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
          <SettingsPannel
            isOpen={slideSettingsPannelIsOpen}
            togglePannel={toggleSlideSettingsPannel}
            views={activeViews}
            toggleViewColorEdition={toggleViewColorEdition}
            setViewColor={setViewColor}
            editedColor={editedColor} /> : null }
      </section>
      <figcaption className="caption-container">
        {!activeSlide || viewsEqualActiveSlideViews ?
          '' :
          <div className="view-operations">
            <button onClick={clickOnRecord}><img className="bulgur-icon-image" src={require('../assets/snapshot.svg')} /> Take snapshot</button>
            <button onClick={clickOnReset}><img className="bulgur-icon-image" src={require('../assets/reset.svg')} /> Reset</button>
          </div>
        }
        {activeSlide && !isTakeAwayModalOpen ?
          <div className="caption-editor">
            <div className="editor-areas-container">
              <h1>
                <input type="text" value={activeSlide.title} />
              </h1>
              <DraftEditor
                slide={activeSlide}
                update={updateDraft} />
            </div>
          </div>
        : null}
      </figcaption>
    </figure>
  );
};

export default MainViewLayout;
