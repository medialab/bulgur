import React from 'react';


import Timeline from '../../../components/Timeline/Timeline';
import Map from '../../../components/Map/Map';
import Graph from '../../../components/Graph/Graph';
import {DraftComponent} from '../../../helpers/configQuinoa';

import './MainViewLayout.scss';

const MainViewLayout = ({
  visualizationType,
  data,
  invariantParameters,
  openNewStoryModal,
  slideParameters
}) => {
  const setVisualization = () => {
    const visProps = {data, invariantParameters, slideParameters};
    switch (visualizationType) {
      case 'space':
        return <Map {...visProps} />;
      case 'relations':
        return <Graph {...visProps} />;
      case 'time':
        return <Timeline {...visProps} />;
      default:
        return <button id="new-story-button" onClick={openNewStoryModal}>Tell a new story</button>;
    }
  };
  return (<figure className="bulgur-main-view">
    <section className="visualization-container">
      {setVisualization()}
    </section>
    {visualizationType ?
      <figcaption className="caption-container">
        <div className="view-operations">
          <button>Reset</button>
          <button>Record</button>
        </div>
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
      </figcaption> : ''
    }
  </figure>);
};

export default MainViewLayout;
