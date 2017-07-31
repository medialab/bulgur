/**
 * Bulgur Application Component
 * =======================================
 *
 * Root component of the application.
 * @module bulgur
 */
import React from 'react';

import './core.scss';
import './Application.scss';

import GlobalUi from './features/GlobalUi/components/GlobalUiContainer.js';


/**
 * Renders the whole bulgur application
 * @return {ReactComponent} component
 */
const Application = ({}) => (
  <GlobalUi
    id="wrapper"
    className="bulgur" />
);

export default Application;
