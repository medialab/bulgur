import React from 'react';
import Modal from 'react-modal';

import AsideViewLayout from './AsideViewLayout';
import MainViewLayout from './MainViewLayout';
import BulgurFooter from '../../../components/BulgurFooter/BulgurFooter';

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
        <section className="bulgur-main-row">
          <AsideViewLayout
            activePresentation={activePresentation}
            openSettings={openSettings}
            returnToLanding={returnToLanding} />
          <MainViewLayout
            activePresentation={activePresentation}
            onProjectImport={onProjectImport}
            updateSlide={updateSlide}
            doesViewEqualsSlideParameters={doesViewEqualsSlideParameters}
            returnToLanding={returnToLanding}
            updateView={updateView}
            resetView={resetView}
            data={data} />
        </section>
        <BulgurFooter
          openTakeAwayModal={openTakeAwayModal} />
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
