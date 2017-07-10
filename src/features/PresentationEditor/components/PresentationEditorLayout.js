/**
 * This module exports a stateless component rendering the layout of the presentation editor feature interface
 * @module bulgur/features/PresentationEditor
 */
import React from 'react';
import PropTypes from 'prop-types';
// import Modal from 'react-modal';
import Helmet from 'react-helmet';

import './PresentationEditorLayout.scss';

// import QuinoaPresentationPlayer from 'quinoa-presentation-player';

import AsideViewLayout from './AsideViewLayout';
import MainViewLayout from './MainViewLayout';
// import Footer from '../../../components/Footer/Footer';
import {translateNameSpacer} from '../../../helpers/translateUtils';

// import PresentationsManagerContainer from '../../PresentationsManager/components/PresentationsManagerContainer';

// import ConfigurationDialog from '../../ConfigurationDialog/components/ConfigurationDialogContainer.js';
// import TakeAwayDialog from '../../TakeAwayDialog/components/TakeAwayDialogContainer.js';

/**
 * Renders the main layout component of the editor
 * @param {object} props - the props to render
 * @param {string} props.lang - the active language
 * @param {string} props.id
 * @param {string} props.className
 * @param {boolean} props.isPresentationCandidateModalOpen
 * @param {string} props.globalUiMode
 * @param {boolean} props.isTakeAwayModalOpen
 * @param {string} props.slideSettingsPannelState
 * @param {object} props.activeViews - object containing the views being displayed in the editor
 * @param {string} props.activeSlideId
 * @param {object} props.editedColor
 * @param {string} props.activePresentationId
 * @param {object} props.activePresentation
 * @param {function} props.onProjectImport
 * @param {function} props.returnToLanding
 * @param {object} props.actions - actions passed by redux logic
 * @param {function} props.addSlide
 * @param {function} props.duplicateSlide
 * @param {function} props.openSettings
 * @param {function} props.closeAndResetDialog
 * @return {ReactElement} markup
 */
const PresentationEditorLayout = ({
  // setup related
  id,
  className,

  // global ui related
  isTakeAwayModalOpen,
  slideSettingsPannelState,
  // edited presentation state
  activeViews,
  activeSlideId,
  editedColor,
  activePresentation,

  // actions
  onProjectImport,
  returnToLanding,
  actions: {
    changeViewByUser,
    removeSlide,
    setActiveSlide,
    updateSlide,
    moveSlide,
    setSlideSettingsPannelState,
    toggleViewColorEdition,
    setViewColor,
    setViewDatamapItem,
    setShownCategories,
  },
  addSlide,
  duplicateSlide,
  openSettings,
}, context) => {

  const translate = translateNameSpacer(context.t, 'Features.PresentationEditor');

  return (
    <div id={id} className={'bulgur-PresentationEditorLayout ' + (className || '')}>
      <Helmet>
        <title>Bulgur - {activePresentation.metadata.title || translate('untitled-presentation')}</title>
      </Helmet>
      <AsideViewLayout
        activePresentation={activePresentation}
        openSettings={openSettings}
        returnToLanding={returnToLanding}
        addSlide={addSlide}
        duplicateSlide={duplicateSlide}
        removeSlide={removeSlide}
        setActiveSlide={setActiveSlide}
        activeSlideId={activeSlideId}
        updateSlide={updateSlide}
        moveSlide={moveSlide} />
      <MainViewLayout
        activePresentation={activePresentation}
        isTakeAwayModalOpen={isTakeAwayModalOpen}
        activeSlideId={activeSlideId}
        onProjectImport={onProjectImport}
        updateSlide={updateSlide}
        setActiveSlide={setActiveSlide}
        setViewDatamapItem={setViewDatamapItem}
        slideSettingsPannelState={slideSettingsPannelState}
        setSlideSettingsPannelState={setSlideSettingsPannelState}
        returnToLanding={returnToLanding}
        activeViews={activeViews}
        onUserViewChange={changeViewByUser}
        toggleViewColorEdition={toggleViewColorEdition}
        setViewColor={setViewColor}
        setShownCategories={setShownCategories}
        editedColor={editedColor} />
    </div>
  );
};

PresentationEditorLayout.contextTypes = {
  t: PropTypes.func.isRequired
};

export default PresentationEditorLayout;
