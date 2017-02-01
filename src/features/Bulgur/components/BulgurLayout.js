import React from 'react';
import Modal from 'react-modal';

import QuinoaPresentationPlayer from 'quinoa-presentation-player';

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
  globalUiMode,
  isTakeAwayModalOpen,
  // updateSlide,
  resetView,
  onProjectImport,
  returnToLanding,
  actions: {
    openTakeAwayModal,
    closeTakeAwayModal,
    changeViewByUser,
    setUiMode,
    updateView,
    removeSlide,
    setActiveSlide,
    updateSlide
  },

  activeViews,
  addSlide,
  activeSlideId,

  openSettings,
  closeAndResetDialog,
  doesViewEqualsSlideParameters,
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

  const togglePreview = () => {
    if (globalUiMode === 'edition') {
      setUiMode('preview');
    }
   else {
      setUiMode('edition');
    }
  };

  return (<div id={id} className={className}>
    {activePresentationId ?
      <div className={className}>
        {globalUiMode === 'edition' ?
          <section className="bulgur-main-row">
            <AsideViewLayout
              activePresentation={activePresentation}
              openSettings={openSettings}
              returnToLanding={returnToLanding}
              addSlide={addSlide}
              removeSlide={removeSlide}
              setActiveSlide={setActiveSlide}
              activeSlideId={activeSlideId}
              updateSlide={updateSlide} />
            <MainViewLayout
              activePresentation={activePresentation}
              onProjectImport={onProjectImport}
              updateSlide={updateSlide}
              doesViewEqualsSlideParameters={doesViewEqualsSlideParameters}
              returnToLanding={returnToLanding}
              updateView={updateView}
              resetView={resetView}
              activeViews={activeViews}
              onUserViewChange={changeViewByUser} />
          </section>
        :
          <section className="bulgur-main-row">
            <QuinoaPresentationPlayer presentation={activePresentation} />
          </section>}
        <BulgurFooter
          returnToLanding={returnToLanding}
          openTakeAwayModal={openTakeAwayModal}
          togglePreview={togglePreview}
          uiMode={globalUiMode} />
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
