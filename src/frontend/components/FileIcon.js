import React from 'react';
import PropTypes from 'prop-types';

import mimeMap from './mimeMap';

const FileIcon = (props) => {
  let fileIcon = 'file';
  Object.keys(mimeMap).every((k) => {
    if (mimeMap[k].mimes.indexOf(props.file.mime) >= 0) {
      fileIcon = mimeMap[k].className;
      return false;
    }
    return true;
  });

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
