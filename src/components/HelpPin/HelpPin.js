/**
 * This module provides a reusable pin that points to a tooltip
 * @module bulgur/components/HelpPin
 */
import React from 'react';
import PropTypes from 'prop-types';

import './HelpPin.scss';


/**
 * Renders the HelpPin component as a pure function
 * @param {object} props - used props (see prop types below)
 * @return {ReactElement} component - the resulting component
 */
const HelpPin = ({
  children,
  position
}) => (
  <span
    className={'bulgur-HelpPin ' + (position || '')}>
    <span className="pin-icon">
      ?
    </span>

    <div className="pin-content-container">
      {children}
    </div>
  </span>
);


/**
 * Component's properties types
 */
HelpPin.propTypes = {

  /**
   * position of the component ('top', 'left', 'bottom', 'right')
   */
  position: PropTypes.string,
};

export default HelpPin;
