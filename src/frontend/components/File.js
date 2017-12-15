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

  render() {
    const file = this.props.file;
    return (
      <div className="item" style={ { position: 'relative' } }>
        <div className="right floated content">
          {this.state.status === 'normal' ? <div>
            <a className="ui green mini icon button" href={ `http://${config.qiniu_bucket}/${file.etag}` } target='blank'>
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
        </div>
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
        {file.upload_mode ? <div className="ui tiny progress"
          style={ { position: 'absolute', button: 0 } }
          data-value={ file.uploaded } data-total={ file.total }
                            >
          <div className="bar">
            <div className="progress"></div>
          </div>
          <div className="label"></div>
        </div> : ''}
      </div>
    );
  }
}

File.propTypes = {
  file: PropTypes.object.isRequired,
  files_remove: PropTypes.func.isRequired,
  files_update: PropTypes.func.isRequired,
};


const mapStateToProps = () => {
  return {
  };
};

export default create(File, mapStateToProps);
