import React from 'react';
import PropTypes from 'prop-types';

import mimeMap from './mimeMap';

const FileIcon = (props) => {
  const fileIcon = mimeMap[props.file.mime] || 'file';
  return (
    <div className="image file-type-icon">
      <i className={ `huge middle aligned ${fileIcon} icon` }></i>
    </div>
  );
};

FileIcon.propTypes = {
  file: PropTypes.object.isRequired,
};

export default FileIcon;
