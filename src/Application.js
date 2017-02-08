/**
 * Bulgur Application Component
 * =======================================
 *
 * Root component of the application.
 */
import React from 'react';

import './Application.scss';

import Editor from './features/Editor/components/EditorContainer.js';

const Application = ({}) => (
  <Editor
    id="wrapper"
    className="bulgur-editor" />
);


export default Application;
