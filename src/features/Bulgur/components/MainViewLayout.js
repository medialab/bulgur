import React from 'react';

import {
  Timeline,
  Network,
  Map
} from 'quinoa-vis-modules';

import DraftEditor from '../../../components/DraftEditor/DraftEditor';

import './MainViewLayout.scss';

const MainViewLayout = ({
  activePresentation = {},
  activeSlideId,
  updateSlide,
  activeViews,
  onUserViewChange,
  setActiveSlide
}) => {

  const setVisualization = (view, id) => {
    const onChange = (event) => onUserViewChange(id, event);
    // todo : improve code to have no need to do that ugly hack
    try {
      switch (view.metadata.visualizationType) {
        case 'space':
          return (<Map
            allowUserViewChange
            data={view.data}
            onUserViewChange={onChange}
            viewParameters={view.viewParameters} />);
        case 'relations':
          return (<Network
            allowUserViewChange
            data={view.data}
            onUserViewChange={onChange}
            viewParameters={view.viewParameters} />);
        case 'time':
          return (<Timeline
            allowUserViewChange
            data={view.data}
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
  const viewsEqualActiveSlideViews = activeSlide &&
                                JSON.stringify(activeViews) === JSON.stringify(activeSlide.views);

  const clickOnRecord = () => {
    updateSlide(activeSlideId, {
      ...activeSlide,
      views: activeViews
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
      <figcaption className="caption-container">
        {viewsEqualActiveSlideViews ?
          '' :
          <div className="view-operations">
            <button onClick={clickOnRecord}><img className="bulgur-icon-image" src={require('../assets/snapshot.svg')} /> Take snapshot</button>
            <button onClick={clickOnReset}><img className="bulgur-icon-image" src={require('../assets/reset.svg')} /> Reset</button>
          </div>
        }
        <div className="caption-editor">
          {activeSlide ?
            <div className="editor-areas-container">
              <h1>
                <input type="text" value={activeSlide.title} />
              </h1>
              <DraftEditor
                slide={activeSlide}
                update={updateDraft} />
            </div>
          : null}
        </div>
      </figcaption>
    </figure>
  );
};

export default MainViewLayout;
