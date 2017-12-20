import React, { Component } from 'react';
import PropTypes from 'prop-types';
import create from './creator';
import config from '../config';

class File extends Component {
  state = {
    status: 'normal',
  }

  handleRemove = () => {
    this.props.files_remove(this.props.file);
  }

  handleOK = () => {
    if (this.state.status === 'rename') {
      this.handleRename();
    }

    if (this.state.status === 'delete') {
      this.handleRemove();
    }
  }

  handleRename = () => {
    const trimed = this.newNameInput.value.trim();
    if (trimed.length > 0 && trimed.length < 16) {
      this.props.file.title = trimed;
      this.props.files_update(this.props.file);
      $(this.dimmer).dimmer('hide');
    }
  }

  componentDidUpdate() {
    const { file, uploading_files } = this.props;
    const uploading_state = uploading_files[file.client_id];
    if (uploading_state) {
      $(this.progress).progress({
        value: uploading_state.uploaded,
        total: uploading_state.total,
        duration: 100,
      });
    }
  }

  render() {
    const { file, uploading_files } = this.props;
    const uploading_state = uploading_files[file.client_id];
    return (
      <div className="item" style={ { position: 'relative' } }>
        {!file.busy ? <div className="right floated content">
          {this.state.status === 'normal' ? <div>
            {/* <a className="ui green mini icon button" href={ `http://${config.qiniu_bucket}/${file.etag}` } target='blank'>
              <i className="ui download icon"></i>
            </a> */}
            <a className="ui green mini icon button" href={ `${config.serviceBase}/api/files/access?file_id=${file.id}` } target='blank'>
              <i className="ui download icon"></i>
            </a>
            <a className="ui blue mini icon button" onTouchTap={ () => this.setState({ status: 'rename' }) }>
              <i className="ui edit icon"></i>
            </a>
            <a className="ui red mini icon button" onTouchTap={ () => this.setState({ status: 'delete' }) }>
              <i className="ui trash icon"></i>
            </a>
          </div> : ''}
          {(this.state.status === 'rename' || this.state.status === 'delete') ?
            <div className="ui mini horizontal buttons">
              <div className={ `ui button ${{
                rename: 'blue',
                delete: 'red',
              }[this.state.status]}` }
                onTouchTap={ this.handleOK }
              >
                确定
              </div>
              <div className="ui button" onTouchTap={ () => this.setState({ status: 'normal' }) }>
                取消
            </div>
            </div> : ''}
        </div> : ''}
        <i className="huge middle aligned outline image icon"></i>
        {this.state.status === 'rename' ?
          <div className="content">
            <div className="ui mini input field">
              <input ref={ e => this.newNameInput = e } type="text" placeholder="输入新文件名" />
            </div>
          </div> :
          <div className="content">
            <div className="small meta">
              <span className="date cinema">{file.uploaded_at ? file.uploaded_at.substring(0, 10) : ''}</span>
            </div>
            <a className="small header" >{file.title || file.filename || file.name}</a>
            <div className="small description">
              <p>Size:{file.size}</p>
            </div>
          </div>}
        {(file.busy && uploading_state) ?
          <div ref={ e => this.progress = e } className="ui tiny indicating progress"
          style={ { position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', margin: 0 } }
          // data-value={ uploading_state.uploaded }
          // data-total={ uploading_state.total }
          >
            <div className="bar">
              {/* <div className="progress"></div> */}
            </div>
          </div> : ''}
        {(file.busy && !uploading_state) ?
          <div className="ui active inverted dimmer">
            <div className="ui loader"></div>
          </div> : ''}
      </div>
    );
  }
}

File.propTypes = {
  file: PropTypes.object.isRequired,
  uploading_files: PropTypes.object.isRequired,
  files_remove: PropTypes.func.isRequired,
  files_update: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => {
  return {
    uploading_files: state.files.toJSON().uploading.files,
  };
};

export default create(File, mapStateToProps);
