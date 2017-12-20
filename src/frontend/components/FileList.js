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
    const files = Object.keys(this.props.uploaded_files).map((k) => {
      return this.props.uploaded_files[k];
    });

    const sortedFiles = _.orderBy(files, ['busy', 'uploaded_at'], ['asc', 'desc']);

    return (
      <div>
        <div ref={ e => this.uploaderContainerDom = e }></div>
        <div ref={ e => this.filelist = e }>
          <div className="ui ordered divided selection list">
            {sortedFiles.map((file) => {
              return <File key={ file.id } file={ file }/>;
            })}
          </div>
        </div>
      </div>
    );
  }
}

FileList.propTypes = {
  uploaded_files: PropTypes.object.isRequired,
  files_get_uploaded: PropTypes.func.isRequired,
  files_initialize: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    uploaded_files: state.files.toJSON().uploaded.files,
  };
};

export default create(FileList, mapStateToProps);
