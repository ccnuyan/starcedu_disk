import React from 'react';
import PropTypes from 'prop-types';

const FileIcon = (props) => {
  return (
    <div className="image file-type-icon">
      <i className={ `huge middle aligned ${props.fileConf.className} ${props.fileConf.color} icon` }></i>
    </div>
  );
};

FileIcon.propTypes = {
  fileConf: PropTypes.object.isRequired,
};

export default FileIcon;
