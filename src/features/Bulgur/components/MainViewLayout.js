import React from 'react';

import {
  Timeline,
  Network,
  Map,
  mapMapData,
  mapTimelineData,
  mapNetworkData
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
  setViewDatamapItem,
  slideSettingsPannelIsOpen,
  toggleSlideSettingsPannel,
  toggleViewColorEdition,
  setViewColor,
  editedColor,
  isTakeAwayModalOpen
}) => {

  const setVisualization = (view, id) => {
    const onChange = (event) => onUserViewChange(id, event);
    let data = activePresentation.visualizations[id].data;
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
    // todo : improve code to have no need to do that ugly hack
    try {
      // let data = activeViews[id].data;
      switch (view.metadata.visualizationType) {
        case 'map':
          data = mapMapData(data, dataMap);
          return (<Map
            allowUserViewChange
            data={data}
            onUserViewChange={onChange}
            viewParameters={view.viewParameters} />);
        case 'network':
          data = mapNetworkData(data, dataMap);
          return (<Network
            allowUserViewChange
            data={data}
            onUserViewChange={onChange}
            viewParameters={view.viewParameters} />);
        case 'timeline':
          data = mapTimelineData(data, dataMap);
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
            setViewDatamapItem={setViewDatamapItem}
            toggleViewColorEdition={toggleViewColorEdition}
            setViewColor={setViewColor}
            editedColor={editedColor} /> : null }
      </section>
      <figcaption className="caption-container">
        {activeSlide ? <section className="caption-header">
          <h1>
            <input type="text" value={activeSlide.title} />
          </h1>
          {!activeSlide || viewsEqualActiveSlideViews ?
            '' :
            <div className="view-operations">
              <button onClick={clickOnRecord}><img className="bulgur-icon-image" src={require('../assets/snapshot.svg')} /> Take snapshot</button>
              <button onClick={clickOnReset}><img className="bulgur-icon-image" src={require('../assets/reset.svg')} /> Reset</button>
            </div>
          }
        </section> : null}
        {activeSlide && !isTakeAwayModalOpen && activeSlide.draft ?
          <div className="caption-editor">
            <div className="editor-areas-container">
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
