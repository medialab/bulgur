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
  actions: {
    openPresentationCandidateModal,
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
  },
  // todo : wire this to something
  activePresentationId
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
        {visualizationType ?
          <AsideViewLayout
            openPresentationCandidateModal={openPresentationCandidateModal}
            openTakeAwayModal={openTakeAwayModal} /> :
      ''}
        <MainViewLayout
          openPresentationCandidateModal={openPresentationCandidateModal}
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
