/**
 * This module provides a reusable dropzone component
 * @module bulgur/components/DropZone
 */
import React from 'react';
import PropTypes from 'prop-types';

import Dropzone from 'react-dropzone';

import './DropZone.scss';


/**
 * Renders the DropZone component as a pure function
 * @param {object} props - used props (see prop types below)
 * @return {ReactElement} component - the resulting component
 */
const DropZone = ({
  onDrop,
  children,
  accept
}) => (
  <Dropzone
    className="bulgur-DropZone"
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


/**
 * Component's properties types
 */
DropZone.propTypes = {

  /**
   * accepted file extensions
   */
  accept: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),

  /**
   * callbacks when a file is dropped on the component
   */
  onDrop: PropTypes.func,
};

export default DropZone;
