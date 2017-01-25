import React from 'react';
import Modal from 'react-modal';

import AsideViewLayout from './AsideViewLayout';
import MainViewLayout from './MainViewLayout';
import NewPresentationDialog from '../../NewPresentationDialog/components/NewPresentationDialogContainer.js';
import TakeAwayDialog from '../../TakeAwayDialog/components/TakeAwayDialogContainer.js';

import './BulgurLayout.scss';

const InterfaceManagerLayout = ({
  id,
  className,
  isNewPresentationModalOpen,
  isTakeAwayModalOpen,
  updateSlide,
  resetView,
  onProjectImport,
  returnToLanding,
  actions: {
    openNewPresentationModal,
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
    if (isNewPresentationModalOpen) {
      closeAndResetDialog();
    }
    else {
      closeTakeAwayModal();
    }
  };

  return (<div id={id} className={className}>
    {visualizationType ?
      <AsideViewLayout
        returnToLanding={returnToLanding}
        openNewPresentationModal={openNewPresentationModal}
        openTakeAwayModal={openTakeAwayModal} /> :
    ''}
    <MainViewLayout
      openNewPresentationModal={openNewPresentationModal}
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
      contentLabel="new presentation"
      isOpen={isNewPresentationModalOpen || isTakeAwayModalOpen}>
      {
        isNewPresentationModalOpen ?
          <NewPresentationDialog /> :
          <TakeAwayDialog />
      }
    </Modal>
  </div>);
};

export default InterfaceManagerLayout;
