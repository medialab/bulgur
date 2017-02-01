import React from 'react';

import './BulgurFooter.scss';

const BulgurFooter = ({
  openTakeAwayModal
}) => (
  <footer className="bulgur-footer">
    <div className="left-group">
      <span>Bulgur | by <a href="http://www.medialab.sciences-po.fr/fr/" target="blank">médialab</a></span>
    </div>
    <div className="right-group">
      <button>Preview</button>
      <button onClick={openTakeAwayModal}><img className="bulgur-icon-image" src={require('./assets/take-away.svg')} />Take away</button>
    </div>
  </footer>
);

export default BulgurFooter;
