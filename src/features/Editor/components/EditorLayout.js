import React from 'react';
import Modal from 'react-modal';

import QuinoaPresentationPlayer from 'quinoa-presentation-player';

import AsideViewLayout from './AsideViewLayout';
import MainViewLayout from './MainViewLayout';
import Footer from '../../../components/Footer/Footer';

import PresentationsManagerContainer from '../../PresentationsManager/components/PresentationsManagerContainer';

import ConfigurationDialog from '../../ConfigurationDialog/components/ConfigurationDialogContainer.js';
import TakeAwayDialog from '../../TakeAwayDialog/components/TakeAwayDialogContainer.js';

import './EditorLayout.scss';

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
    toggleSlideSettingsPannel,
    toggleViewColorEdition,
    setViewColor,
    setViewDatamapItem
  },

  slideSettingsPannelIsOpen,

  activeViews,
  addSlide,
  activeSlideId,
  editedColor,

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
              isTakeAwayModalOpen={isTakeAwayModalOpen}
              activeSlideId={activeSlideId}
              onProjectImport={onProjectImport}
              updateSlide={updateSlide}
              setActiveSlide={setActiveSlide}
              setViewDatamapItem={setViewDatamapItem}
              slideSettingsPannelIsOpen={slideSettingsPannelIsOpen}
              toggleSlideSettingsPannel={toggleSlideSettingsPannel}
              returnToLanding={returnToLanding}
              activeViews={activeViews}
              onUserViewChange={changeViewByUser}
              toggleViewColorEdition={toggleViewColorEdition}
              setViewColor={setViewColor}
              editedColor={editedColor} />
          </section>
        :
          <section className="bulgur-main-row">
            <QuinoaPresentationPlayer presentation={activePresentation} />
          </section>}
        <Footer
          returnToLanding={returnToLanding}
          openTakeAwayModal={openTakeAwayModal}
          togglePreview={togglePreview}
          uiMode={globalUiMode} />
      </div>
      : <PresentationsManagerContainer />}
    <Modal
      onRequestClose={closeModal}
      contentLabel="new presentation"
      isOpen={isPresentationCandidateModalOpen || isTakeAwayModalOpen}>
      {
        isPresentationCandidateModalOpen ?
          <ConfigurationDialog /> :
          <TakeAwayDialog />
      }
    </Modal>
  </div>);
};

export default InterfaceManagerLayout;
