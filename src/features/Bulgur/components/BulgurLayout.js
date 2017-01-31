import React from 'react';
import Modal from 'react-modal';

import AsideViewLayout from './AsideViewLayout';
import MainViewLayout from './MainViewLayout';

import ProjectsManagerContainer from '../../BulgurProjectsManager/components/ProjectManagerContainer';

import PresentationCandidateDialog from '../../PresentationCandidateDialog/components/PresentationCandidateDialogContainer.js';
import TakeAwayDialog from '../../TakeAwayDialog/components/TakeAwayDialogContainer.js';

import './BulgurLayout.scss';

const InterfaceManagerLayout = ({
  id,
  className,
  isPresentationCandidateModalOpen,
  isTakeAwayModalOpen,
  updateSlide,
  resetView,
  onProjectImport,
  returnToLanding,
  actions: {
    openTakeAwayModal,
    closeTakeAwayModal,
    updateView
  },
  openSettings,
  closeAndResetDialog,
  doesViewEqualsSlideParameters,
  visualizationData: {
    visualizationType,
    viewParameters,
    dataMap = [],
    data = []
  },
  activePresentationId,
  activePresentation
}) => {

  const closeModal = () => {
    if (isPresentationCandidateModalOpen) {
      closeAndResetDialog();
    }
    else {
      closeTakeAwayModal();
    }
  };

  return (<div id={id} className={className}>
    {activePresentationId ?
      <div className={className}>
        <AsideViewLayout
          activePresentation={activePresentation}
          openSettings={openSettings}
          openTakeAwayModal={openTakeAwayModal}
          returnToLanding={returnToLanding} />
        <MainViewLayout
          visualizationType={visualizationType}
          onProjectImport={onProjectImport}
          dataMap={dataMap}
          viewParameters={viewParameters}
          updateSlide={updateSlide}
          doesViewEqualsSlideParameters={doesViewEqualsSlideParameters}
          updateView={updateView}
          resetView={resetView}
          data={data} />
      </div>
      : <ProjectsManagerContainer />}
    <Modal
      onRequestClose={closeModal}
      contentLabel="new presentation"
      isOpen={isPresentationCandidateModalOpen || isTakeAwayModalOpen}>
      {
        isPresentationCandidateModalOpen ?
          <PresentationCandidateDialog /> :
          <TakeAwayDialog />
      }
    </Modal>
  </div>);
};

export default InterfaceManagerLayout;
