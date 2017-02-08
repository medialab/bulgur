/**
 * Bulgur Application Component
 * =======================================
 *
 * Root component of the application.
 * @module bulgur
 */
import React from 'react';

import './Application.scss';

import Editor from './features/Editor/components/EditorContainer.js';

/**
 * Renders the whole bulgur application
 * @return {ReactComponent} component
 */
const Application = ({}) => (
  <Editor
    id="wrapper"
    className="bulgur-editor" />
);

export default Application;
