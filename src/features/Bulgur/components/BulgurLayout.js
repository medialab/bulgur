import React from 'react';
import Modal from 'react-modal';

import AsideViewLayout from './AsideViewLayout';
import MainViewLayout from './MainViewLayout';
import NewStoryDialog from '../../NewStoryDialog/components/NewStoryDialogContainer.js';

import './BulgurLayout.scss';

const InterfaceManagerLayout = ({
  id,
  className,
  isNewStoryModalOpen,
  updateSlide,
  resetView,
  actions: {
    openNewStoryModal,
    updateView
  },
  closeAndResetDialog,
  visualizationData: {
    visualizationType,
    viewParameters,
    dataMap = [],
    data = []
  }
}) => (
  <div id={id} className={className}>
    {visualizationType ? <AsideViewLayout openNewStoryModal={openNewStoryModal} /> : ''}
    <MainViewLayout
      openNewStoryModal={openNewStoryModal}
      visualizationType={visualizationType}
      dataMap={dataMap}
      viewParameters={viewParameters}
      updateSlide={updateSlide}
      updateView={updateView}
      resetView={resetView}
      data={data} />
    <Modal
      onRequestClose={closeAndResetDialog}
      isOpen={isNewStoryModalOpen}>
      <NewStoryDialog />
    </Modal>
  </div>
);

export default InterfaceManagerLayout;
