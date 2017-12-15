import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import create from './creator';
import File from './File';


class FileList extends Component {
  componentDidMount = () => {
    this.uploader = this.props.files_initialize({
      button: this.uploadButton,
    });
  }

  render = () => {
    const files = Object.keys(this.props.uploadedFiles).map((k) => {
      return this.props.uploadedFiles[k];
    });

    const sortedFiles = _.sortBy(files, { uploaded_at: -1 });

    return (
      <div>
        <div ref={ e => this.uploaderContainerDom = e }></div>
        <div ref={ e => this.filelist = e }>
          <div className="ui ordered divided selection list">
            {sortedFiles.map((file) => {
              return <File key={ file.client_id } file={ file }/>;
            })}
          </div>
        </div>
      </div>
    );
  }
}

FileList.propTypes = {
  uploadedFiles: PropTypes.object.isRequired,
  files_get_uploaded: PropTypes.func.isRequired,
  files_initialize: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    uploadedFiles: state.files.toJSON().uploaded.files,
  };
};

export default create(FileList, mapStateToProps);
