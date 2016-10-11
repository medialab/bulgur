import React from 'react';


import Timeline from '../../../components/Timeline/Timeline';
import Map from '../../../components/Map/Map';
import Graph from '../../../components/Graph/Graph';

import './MainViewLayout.scss';

const MainViewLayout = ({
  visualizationType,
  data,
  invariantParameters,
  openNewStoryModal
}) => {
  const setVisualization = () => {
    const visProps = {data, invariantParameters};
    switch (visualizationType) {
      case 'space':
        return <Map {...visProps} />;
      case 'relations':
        return <Graph {...visProps} />;
      case 'time':
        return <Timeline {...visProps} />;
      default:
        return <button onClick={openNewStoryModal}>Tell a new story</button>;
    }
  };
  return (<figure className="bulgur-main-view">
    <section className="visualization-container">
      {setVisualization()}
    </section>
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
          <input placeholder="slide title" className="editor-title-input" />
          <textarea placeholder="slide content" className="editor-content-input" />
        </div>
      </div>
    </figcaption>
  </figure>);
};

export default MainViewLayout;
