import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import create from './creator';
import File from './File';
import './FileList.scss';


class FileList extends Component {
  componentDidMount = () => {
    console.log(this.props.uploadedFiles);
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
          <div className="ui six doubling stackable cards">
            <div className="ui card">
              <div className="content">
                <div className="header">上传文件</div>
              </div>
              <div className="content">
                <h4 className="ui sub header">文件格式</h4>
                <div className="ui small feed">
                  <div className="label">
                    <div className="content">
                      <h4 className="summary">
                        <a>图片:</a>.jpg/.png/.gif
                      </h4>
                    </div>
                  </div>
                  <div className="label">
                    <div className="content">
                      <h4 className="summary">
                        <a>视频:</a>.mp4
                      </h4>
                    </div>
                  </div>
                  <div className="label">
                    <div className="content">
                      <h4 className="summary">
                        <a>大小:</a>小于10m
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="extra content">
                <button ref={ e => this.uploadButton = e } className="ui button">开始上传</button>
              </div>
            </div>
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
  console.log(state);
  return {
    uploadedFiles: state.files.toJSON().uploaded.files,
  };
};

export default create(FileList, mapStateToProps);
