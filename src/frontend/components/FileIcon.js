import React from 'react';
import PropTypes from 'prop-types';

const FileIcon = () => {
  return (
    <i className="huge middle aligned outline image icon"></i>
  );
};

FileIcon.propTypes = {
  file: PropTypes.object.isRequired,
};

export default FileIcon;
