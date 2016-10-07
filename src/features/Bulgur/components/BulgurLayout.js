import React from 'react';
import Modal from 'react-modal';

import AsideViewLayout from './AsideViewLayout';
import MainViewLayout from './MainViewLayout';
import NewStoryDialog from '../../NewStoryDialog/components/NewStoryDialogContainer.js';

import './BulgurLayout.scss';

const InterfaceManagerLayout = ({
  id,
  className,
  isNewStoryModalOpen,
  actions: {
    openNewStoryModal
  },
  closeAndResetDialog
}) => (
  <div id={id} className={className}>
    <AsideViewLayout openNewStoryModal={openNewStoryModal} />
    <MainViewLayout />
    <Modal
      onRequestClose={closeAndResetDialog}
      isOpen={isNewStoryModalOpen}>
      <NewStoryDialog />
    </Modal>
  </div>
);

export default InterfaceManagerLayout;
