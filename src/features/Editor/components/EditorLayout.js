/**
 * This module exports a stateless component rendering the layout of the editor feature interface
 * @module bulgur/features/Editor
 */
import React from 'react';
import Modal from 'react-modal';

import './EditorLayout.scss';

import QuinoaPresentationPlayer from 'quinoa-presentation-player';

import AsideViewLayout from './AsideViewLayout';
import MainViewLayout from './MainViewLayout';
import Footer from '../../../components/Footer/Footer';

import PresentationsManagerContainer from '../../PresentationsManager/components/PresentationsManagerContainer';

import ConfigurationDialog from '../../ConfigurationDialog/components/ConfigurationDialogContainer.js';
import TakeAwayDialog from '../../TakeAwayDialog/components/TakeAwayDialogContainer.js';

/**
 * Renders the main layout component of the editor
 * @param {object} props - the props to render
 * @param {string} props.id
 * @param {string} props.className
 * @param {boolean} props.isPresentationCandidateModalOpen
 * @param {string} props.globalUiMode
 * @param {boolean} props.isTakeAwayModalOpen
 * @param {boolean} props.slideSettingsPannelIsOpen
 * @param {object} props.activeViews - object containing the views being displayed in the editor
 * @param {string} props.activeSlideId
 * @param {object} props.editedColor
 * @param {string} props.activePresentationId
 * @param {object} props.activePresentation
 * @param {function} props.onProjectImport
 * @param {function} props.returnToLanding
 * @param {object} props.actions - actions passed by redux logic
 * @param {function} props.addSlide
 * @param {function} props.openSettings
 * @param {function} props.closeAndResetDialog
 * @return {ReactElement} markup
 */
const EditorLayout = ({
  // setup related
  id,
  className,

  // global ui related
  isPresentationCandidateModalOpen,
  globalUiMode,
  isTakeAwayModalOpen,
  slideSettingsPannelIsOpen,
  // edited presentation state
  activeViews,
  activeSlideId,
  editedColor,
  activePresentationId,
  activePresentation,

  // actions
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
  addSlide,
  openSettings,
  closeAndResetDialog,
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

export default EditorLayout;
