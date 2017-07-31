/**
 * This module provides a reusable toaster element component
 * @module bulgur/components/Toaster
 */
import React from 'react';
import PropTypes from 'prop-types';

import './Toaster.scss';


/**
 * Renders the Toaster component as a pure function
 * @param {object} props - used props (see prop types below)
 * @return {ReactElement} component - the resulting component
 */
const Toaster = ({
  status,
  log
}) => {
  return (
    <p className={'bulgur-Toaster ' + status}>
      {log}
    </p>
  );
};


/**
 * Component's properties types
 */
Toaster.propTypes = {

  /**
   * Status class of the toaster ('success', 'processing', 'error')
   */
  status: PropTypes.string,

  /**
   * Message to display within the toaster
   */
  log: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default Toaster;
