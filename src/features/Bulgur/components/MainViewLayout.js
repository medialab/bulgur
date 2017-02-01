import React from 'react';

import {
  Timeline,
  Network,
  Map
} from 'quinoa-vis-modules';

import {DraftComponent} from '../../../helpers/configQuinoa';

import './MainViewLayout.scss';

const MainViewLayout = ({
  // activePresentation,
  // viewParameters,
  updateSlide,
  resetView,
  doesViewEqualsSlideParameters,
  activeViews,
  onUserViewChange
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

  const clickOnRecord = () => updateSlide();
  const clickOnReset = () => resetView();

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
        {doesViewEqualsSlideParameters ?
          '' :
          <div className="view-operations">
            <button onClick={clickOnRecord}><img className="bulgur-icon-image" src={require('../assets/snapshot.svg')} /> Take snapshot</button>
            <button onClick={clickOnReset}><img className="bulgur-icon-image" src={require('../assets/reset.svg')} /> Reset</button>
          </div>
        }
        <div className="caption-editor">
          <div className="editor-helpers-container">
            <ul className="editor-helpers">
              <li><button>title</button></li>
              <li><button>bold</button></li>
              <li><button>italic</button></li>
              <li><button>underline</button></li>
              <li><button>list</button></li>
            </ul>
          </div>
          <div className="editor-areas-container">
            <DraftComponent />
          </div>
        </div>
      </figcaption>
    </figure>
  );
};

export default MainViewLayout;
