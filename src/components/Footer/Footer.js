/**
 * This module provides a reusable Footer picker component for bulgur
 * @module bulgur/components/Footer
 */
import React from 'react';
import PropTypes from 'prop-types';

import LangToggler from '../LangToggler/LangToggler';

import './Footer.scss';
import {translateNameSpacer} from '../../helpers/translateUtils';


/**
 * Renders the Footer component as a pure function
 * @param {object} props - used props (see prop types below)
 * @param {object} context - used context data (see context types below)
 * @return {ReactElement} component - the resulting component
 */
const Footer = ({
  lang,
  uiMode,
  openTakeAwayModal,
  togglePreview,
  returnToLanding,
  setLanguage
}, context) => {
  const translate = translateNameSpacer(context.t, 'Components.Footer');
  return (
    <footer className="bulgur-Footer">
      <div className="left-group">
        <span className="mini-brand"><button onClick={returnToLanding}>Bulgur</button>| {translate('by')} <a href="http://www.medialab.sciences-po.fr/fr/" target="blank">médialab</a></span>
        <LangToggler
          lang={lang}
          onChange={setLanguage} />
      </div>
      <div className="right-group">
        <button className="mode-btn" onClick={togglePreview}>{
          uiMode === 'edition' ?
            <span>
              <img className="bulgur-icon-image" src={require('../../sharedAssets/preview-white.svg')} />{translate('preview')}
            </span>
          :
            <span>
              <img className="bulgur-icon-image" src={require('../../sharedAssets/edit-white.svg')} />{translate('edit')}
            </span>
        }</button>
        <button className="takeaway-btn" onClick={openTakeAwayModal}><img className="bulgur-icon-image" src={require('../../sharedAssets/take-away-white.svg')} />{translate('take-away')}</button>
      </div>
    </footer>
  );
};


/**
 * Component's properties types
 */
Footer.propTypes = {

  /**
   * the current language
   */
  lang: PropTypes.string,

  /**
   * whether app is in 'edit' or 'preview' mode
   */
  uiMode: PropTypes.string,

  /**
   * callbacks for opening the take away view
   */
  openTakeAwayModal: PropTypes.func,

  /**
   * callbacks for switching between edit and preview modes
   */
  togglePreview: PropTypes.func,

  /**
   * callbacks to return to the home view
   */
  returnToLanding: PropTypes.func,

  /**
   * callbacks to set new active language
   */
  setLanguage: PropTypes.func,
};

/**
 * Component's context used properties
 */
Footer.contextTypes = {
  t: PropTypes.func.isRequired
};

export default Footer;
