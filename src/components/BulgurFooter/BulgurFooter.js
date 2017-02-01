import React from 'react';

import './BulgurFooter.scss';

const BulgurFooter = ({
  openTakeAwayModal,
  togglePreview,
  returnToLanding,
  uiMode
}) => (
  <footer className="bulgur-footer">
    <div className="left-group">
      <span><button onClick={returnToLanding}>Bulgur</button> | by <a href="http://www.medialab.sciences-po.fr/fr/" target="blank">médialab</a></span>
    </div>
    <div className="right-group">
      <button onClick={togglePreview}>{uiMode === 'edition' ? 'Preview' : 'Edit'}</button>
      <button onClick={openTakeAwayModal}><img className="bulgur-icon-image" src={require('./assets/take-away.svg')} />Take away</button>
    </div>
  </footer>
);

export default BulgurFooter;
