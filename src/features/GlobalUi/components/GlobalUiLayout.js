/**
 * This module exports a stateless component rendering the layout of the editor feature interface
 * @module bulgur/features/GlobalUi
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import './GlobalUiLayout.scss';

import {translateNameSpacer} from '../../../helpers/translateUtils';

import Footer from '../../../components/Footer/Footer';
import PresentationEditorContainer from '../../PresentationEditor/components/PresentationEditorContainer';
import PresentationSettingsManagerContainer from '../../PresentationSettingsManager/components/PresentationSettingsManagerContainer';

import PresentationsManagerContainer from '../../PresentationsManager/components/PresentationsManagerContainer';
import ConfigurationDialog from '../../ConfigurationDialog/components/ConfigurationDialogContainer';
import TakeAwayDialog from '../../TakeAwayDialog/components/TakeAwayDialogContainer';

// import DraftGlobalUi from '../../../components/DraftGlobalUi/DraftGlobalUi';

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
 * @param {function} props.openSettings
 * @param {function} props.closeAndResetDialog
 * @return {ReactElement} markup
 */
const GlobalUiLayout = ({
  lang,
  // setup related
  id,
  className,

  // global ui related
  isPresentationCandidateModalOpen,
  globalUiMode,
  asideUiMode,
  isTakeAwayModalOpen,
  activeSectionId,
  // edited presentation state
  activePresentationId,
  activePresentation,
  editorStates,
  editorFocus,
  assetRequestState,
  assetRequested,

  // actions
  returnToLanding,
  actions: {
    openTakeAwayModal,
    closeTakeAwayModal,
    setUiMode,
    setLanguage,
    // updatePresentationContent,
    updatePresentationMetadataField,
    promptAssetEmbed,
    unpromptAssetEmbed,
    updateAsset,
    setAsideUiMode,
    // embedAsset,
    updateSection,
    setGlobalUiFocus,
    updateDraftGlobalUiState,
    updateDraftGlobalUisStates,

    updateContextualizer,
    updateResource,
    deleteContextualization,
    deleteContextualizer,
    setActiveSectionId,
  },
  // custom functions
  openSettings,
  closeAndResetDialog,
  updatePresentationContent,
  embedAsset,
  onCreateNewSection,
  summonAsset,
}, context) => {

  // callback for takeaway modal tweaking
  const closeModal = () => {
    if (isPresentationCandidateModalOpen) {
      closeAndResetDialog();
    }
    else {
      closeTakeAwayModal();
    }
  };

  // callback for preview mode tweaking
  const togglePreview = () => {
    if (globalUiMode === 'edition') {
      setUiMode('preview');
    }
   else {
      setUiMode('edition');
    }
  };
  // namespacing the translation keys
  const translate = translateNameSpacer(context.t, 'Features.GlobalUi');
  return (
    <div id={id} className={'bulgur-GlobalUiLayout ' + className}>
      {activePresentationId && activePresentation ?
        <div className="presentation-editor-container">
          <section className="bulgur-main-row">
            {
            globalUiMode === 'edition' ?
              <PresentationEditorContainer /> :
              <PresentationSettingsManagerContainer />
            }
          </section>
          <Footer
            returnToLanding={returnToLanding}
            openTakeAwayModal={openTakeAwayModal}
            togglePreview={togglePreview}
            lang={lang}
            setLanguage={setLanguage}
            uiMode={globalUiMode} />
        </div>
        : <PresentationsManagerContainer />
      }
      <Modal
        onRequestClose={closeModal}
        contentLabel={translate('edit-presentation')}
        isOpen={isPresentationCandidateModalOpen || isTakeAwayModalOpen}>
        {
          isPresentationCandidateModalOpen ?
            <ConfigurationDialog /> :
            <TakeAwayDialog />
        }
      </Modal>
    </div>);
};

GlobalUiLayout.contextTypes = {
  t: PropTypes.func.isRequired
};


export default GlobalUiLayout;
