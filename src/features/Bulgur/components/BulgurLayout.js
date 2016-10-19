import React from 'react';
import Modal from 'react-modal';

import AsideViewLayout from './AsideViewLayout';
import MainViewLayout from './MainViewLayout';
import NewStoryDialog from '../../NewStoryDialog/components/NewStoryDialogContainer.js';
import TakeAwayDialog from '../../TakeAwayDialog/components/TakeAwayDialogContainer.js';

import './BulgurLayout.scss';

const InterfaceManagerLayout = ({
  id,
  className,
  isNewStoryModalOpen,
  isTakeAwayModalOpen,
  updateSlide,
  resetView,
  onProjectImport,
  actions: {
    openNewStoryModal,
    openTakeAwayModal,
    closeTakeAwayModal,
    updateView
  },
  closeAndResetDialog,
  doesViewEqualsSlideParameters,
  visualizationData: {
    visualizationType,
    viewParameters,
    dataMap = [],
    data = []
  }
}) => {
  const closeModal = () => {
    if (isNewStoryModalOpen) {
      closeAndResetDialog();
    }
    else {
      closeTakeAwayModal();
    }
  };

  return (<div id={id} className={className}>
    {visualizationType ?
      <AsideViewLayout
        openNewStoryModal={openNewStoryModal}
        openTakeAwayModal={openTakeAwayModal} /> :
    ''}
    <MainViewLayout
      openNewStoryModal={openNewStoryModal}
      visualizationType={visualizationType}
      onProjectImport={onProjectImport}
      dataMap={dataMap}
      viewParameters={viewParameters}
      updateSlide={updateSlide}
      doesViewEqualsSlideParameters={doesViewEqualsSlideParameters}
      updateView={updateView}
      resetView={resetView}
      data={data} />
    <Modal
      onRequestClose={closeModal}
      isOpen={isNewStoryModalOpen || isTakeAwayModalOpen}>
      {
        isNewStoryModalOpen ?
          <NewStoryDialog /> :
            <TakeAwayDialog />
      }
    </Modal>
  </div>);
};

export default InterfaceManagerLayout;
