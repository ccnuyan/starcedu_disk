import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fileSize from 'file-size';
import _ from 'lodash';
import File from './File';
import qiniuActions from '../../store/actions/qiniuFineUploader';
import mimeMap from './mimeMap';

class FileList extends Component {
  static propTypes = {
    uploaded_files: PropTypes.object.isRequired,
    filter: PropTypes.object.isRequired,
    files_initialize: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    this.uploader = this.props.files_initialize({
      button: this.uploadButton,
    });
  }

  render = () => {
    const files = Object.keys(this.props.uploaded_files).map((k) => {
      return this.props.uploaded_files[k];
    });

    let showFiles = files;

    const { filter } = this.props;

    if (!filter.all) {
      let mimes = [];

      Object.keys(mimeMap).forEach((k) => {
        if (filter.filters[k]) {
          mimes = [...mimes, ...mimeMap[k].mimes];
        }
      });

      showFiles = _.filter(showFiles, file => mimes.indexOf(file.mime) >= 0);
    }

    showFiles = _.orderBy(showFiles, ['busy', 'uploaded_at'], ['asc', 'desc']);

    return (
      <div className="ui eight doubling cards">
        <div className="file-each card">
          <div className="content">
            <div className="ui header">
              网盘空间
            </div>
            <div className="meta">
              {`文件总数：${files.length}`}
            </div>
            <div className="meta">
              {`空间占用：${fileSize(_.sum(files.map(file => file.size))).human('si')}`}
            </div>
          </div>
          <div className="extra content">
            <div ref={ e => this.uploadButton = e } className="ui blue right floated button">
                上传文件
            </div>
          </div>
        </div>
        {showFiles.map((file) => {
          return <File key={ file.id } file={ file }/>;
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    uploaded_files: state.files.toJSON().uploaded.files,
    filter: state.files.toJSON().filter,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    files_initialize: ({ button }) => {
      dispatch(qiniuActions.initialize({ button }));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileList);
