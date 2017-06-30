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

import PresentationEditor from './features/PresentationEditor/components/PresentationEditorContainer.js';

/**
 * Renders the whole bulgur application
 * @return {ReactComponent} component
 */
const Application = ({}) => (
  <PresentationEditor
    id="wrapper"
  />
);

export default Application;
