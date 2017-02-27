/**
 * This module provides a reusable pin that points to a tooltip
 * @module bulgur/components/HelpPin
 */
import React from 'react';


import './HelpPin.scss';

const HelpPin = ({
  children,
  position
}) => (
  <span
    className={'bulgur-help-pin ' + (position || '')}>
    <span className="pin-icon">
      ?
    </span>

    <div className="pin-content-container">
      {children}
    </div>
  </span>
);

export default HelpPin;
