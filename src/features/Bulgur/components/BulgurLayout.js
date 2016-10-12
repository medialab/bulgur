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
  actions: {
    openNewStoryModal
  },
  closeAndResetDialog,
  visualizationData: {
    visualizationType,
    dataMap = [],
    data = []
  },
  slideParameters
}) => (
  <div id={id} className={className}>
    {visualizationType ? <AsideViewLayout openNewStoryModal={openNewStoryModal} /> : ''}
    <MainViewLayout
      openNewStoryModal={openNewStoryModal}
      visualizationType={visualizationType}
      dataMap={dataMap}
      slideParameters={slideParameters}
      data={data} />
    <Modal
      onRequestClose={closeAndResetDialog}
      isOpen={isNewStoryModalOpen}>
      <NewStoryDialog />
    </Modal>
  </div>
);

export default InterfaceManagerLayout;
