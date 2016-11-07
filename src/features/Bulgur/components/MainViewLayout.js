import React from 'react';

import Landing from './Landing';
import Timeline from '../../../components/Timeline/Timeline';
import Map from '../../../components/Map/Map';
import Graph from '../../../components/Graph/Graph';
import {DraftComponent} from '../../../helpers/configQuinoa';

import './MainViewLayout.scss';

const MainViewLayout = ({
  isReadOnly,
  visualizationType,
  data,
  openNewStoryModal,
  onProjectImport,
  viewParameters,
  updateView,
  updateSlide,
  resetView,
  doesViewEqualsSlideParameters
}) => {
  const setVisualization = () => {
    const visProps = {data, viewParameters, updateView};
    switch (visualizationType) {
      case 'space':
        return <Map {...visProps} />;
      case 'relations':
        return <Graph {...visProps} />;
      case 'time':
        return <Timeline {...visProps} />;
      default:
        return <Landing onDropInput={onProjectImport} onClickOnNewStory={openNewStoryModal} />;
    }
  };

  const clickOnRecord = () => updateSlide();
  const clickOnReset = () => resetView();

  return (<figure className="bulgur-main-view">
    <section className="visualization-container">
      {setVisualization()}
    </section>
    {visualizationType && !isReadOnly ?
      <figcaption className="caption-container">
        {doesViewEqualsSlideParameters ?
          '' :
            <div className="view-operations">
              <button onClick={clickOnRecord}><img className='bulgur-icon-image' src={require('../assets/snapshot.svg')} /> Take snapshot</button>
              <button onClick={clickOnReset}><img className='bulgur-icon-image' src={require('../assets/reset.svg')} /> Reset</button>
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
      </figcaption> : ''
    }
  </figure>);
};

export default MainViewLayout;
