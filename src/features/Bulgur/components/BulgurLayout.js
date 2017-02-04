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
  onProjectImport,
  returnToLanding,
  actions: {
    openTakeAwayModal,
    closeTakeAwayModal,
    changeViewByUser,
    setUiMode,
    removeSlide,
    setActiveSlide,
    updateSlide,
    toggleSlideSettingsPannel
  },

  slideSettingsPannelIsOpen,

  activeViews,
  addSlide,
  activeSlideId,

  openSettings,
  closeAndResetDialog,
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
              activeSlideId={activeSlideId}
              onProjectImport={onProjectImport}
              updateSlide={updateSlide}
              setActiveSlide={setActiveSlide}
              slideSettingsPannelIsOpen={slideSettingsPannelIsOpen}
              toggleSlideSettingsPannel={toggleSlideSettingsPannel}
              returnToLanding={returnToLanding}
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
