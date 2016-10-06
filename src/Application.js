/**
 * Bulgur Application Component
 * =======================================
 *
 * Root component of the application.
 */
import React from 'react';
import Modal from 'react-modal';

import './Application.scss';

import AsideContainer from './components/AsideContainer';
import MainContainer from './components/MainContainer';
import NewStoryDialog from './features/NewStoryDialog/components/NewStoryDialogContainer.js';

const Application = (props) => (
  <div id="wrapper" className="bulgur">
    <AsideContainer/>
    <MainContainer/>
    <Modal 
      // onAfterOpen={afterOpenFn}
      // onRequestClose={requestCloseFn}
      // closeTimeoutMS={n}
      // style={customStyle}
      isOpen={true}
    >
      <NewStoryDialog/>
    </Modal>
  </div>
);

export default Application;