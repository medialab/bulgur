/**
 * Bulgur Application Component
 * =======================================
 *
 * Root component of the application.
 */
import React from 'react';

import './Application.scss';

import InterfaceManager from './features/InterfaceManager/components/InterfaceManagerContainer.js';

const Application = (props) => (
  <InterfaceManager id="wrapper" className="bulgur"/>
);

export default Application;