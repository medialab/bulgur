/**
 * This module provides a reusable toaster element component
 * @module bulgur/components/Toaster
 */
import React from 'react';

import './Toaster.scss';

const Toaster = ({
  status,
  log
}) => {
  return (
    <p className={'bulgur-toaster ' + status}>
      {log}
    </p>
  );
};

export default Toaster;
