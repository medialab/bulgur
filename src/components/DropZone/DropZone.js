/**
 * This module provides a reusable dropzone component
 * @module bulgur/components/DropZone
 */
import React from 'react';
import Dropzone from 'react-dropzone';

import './DropZone.scss';

const DropZone = ({
  onDrop,
  children,
  accept
}) => (
  <Dropzone
    className="bulgur-drop-zone"
    activeClassName="active"
    accept={accept}
    onDrop={onDrop}>
    {({isDragActive, isDragReject}) => (
      <div className={'caption-wrapper ' + (isDragActive ? 'active ' : ' ') + (isDragReject ? 'reject' : '')}>
        <div className="caption-container">{children}</div>
      </div>
    )}
  </Dropzone>
);

export default DropZone;
