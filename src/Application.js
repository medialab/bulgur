/**
 * Bulgur Application Component
 * =======================================
 *
 * Root component of the application.
 */
import React from 'react';

import './Application.scss';

import Bulgur from './features/Bulgur/components/BulgurContainer.js';

const Application = (props) => (
  <Bulgur id="wrapper" className="bulgur"/>
);

export default Application;