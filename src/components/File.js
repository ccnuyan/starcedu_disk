import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { create } from './creator';
import config from '../../config';
import './File.scss';

class File extends Component {
  state = {
    status: 'normal',
  }

  handleRemove = () => {
    this.props.files_remove(this.props.file);
  }

  handleRename=() => {
    const trimed = this.newNameInput.value.trim();
    if (trimed.length > 0 && trimed.length < 16) {
      this.props.file.title = trimed;
      this.props.files_update(this.props.file);
      $(this.dimmer).dimmer('hide');
    }
  }

  showDimmer = (event) => {
    event.stopPropagation();
    $(this.dimmer).dimmer({
      closable: true,
      opacity: 0.6,
    }).dimmer('show');
  }

  render() {
    const file = this.props.file;
    return (
      <div ref={ (e) => { this.card = e; } } className="ui card file-card">
        <div className="content">
          <div className="header">
            {file.title || file.filename || file.name}
          </div>
        </div>
        <div className="ui divider"></div>
        {file.upload_mode ?
          <div className="ui center loading">
            {file.upload_mode === 'uploading' ?
            `${file.uploaded}/${file.total}` :
            file.upload_mode}
            <i className="ui icon busy"></i>
          </div> :
          <div onTouchTap={ this.showDimmer }>
            <div className="image">
              <img src={ `http://${config.qiniu_bucket}/${file.etag}` } alt=""
              className="ui image"
              />
            </div>
          </div>}

        <div className="ui divider"></div>
        <div className="extra content" style={ { fontSize: '80%' } }>
          <div className="meta">
            <div className="date">{file.uploaded_at ? file.uploaded_at.substring(0, 10) : ''}</div>
          </div>
        </div>
        <div ref={ (e) => { this.dimmer = e; } } className="ui dimmer">
          <div className="content">
            <div className="center">
              {this.state.status === 'normal' ? <div className="ui mini vertical labeled icon buttons">
                <div className="ui button"
                  onTouchTap={ () => this.setState({ status: 'rename' }) }
                >
                  <i className="ui edit icon"></i>
                      重命名
                    </div>
                <div className="ui red button"
                      onTouchTap={ () => this.setState({ status: 'delete' }) }
                >
                  <i className="ui trash icon"></i>
                      删除
                    </div>
              </div> : ''}
              {this.state.status === 'rename' ?
                <div className="ui form">
                  <div className="ui mini input field">
                    <input ref={ e => this.newNameInput = e } type="text" placeholder="New Name" />
                  </div>
                  <div className="ui mini horizontal buttons">
                    <div className="ui primary button" onTouchTap={ this.handleRename }>
                          确定
                        </div>
                    <div className="ui button" onTouchTap={ () => this.setState({ status: 'normal' }) }>
                          取消
                        </div>
                  </div>
                </div> : ''}
              {this.state.status === 'delete' ?
                <div className="ui center">
                  <div className="ui inverted header">Delete?</div>
                  <div className="ui mini horizontal buttons">
                    <div className="ui primary button" onTouchTap={ this.handleRemove }>
                          确定
                        </div>
                    <div className="ui button"
                      onTouchTap={ () => this.setState({ status: 'normal' }) }
                    >
                          取消
                        </div>
                  </div>
                </div> : ''}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

File.propTypes = {
  file: PropTypes.object.isRequired,
  loginInfo: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  files_remove: PropTypes.func.isRequired,
  files_update: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => {
  return {
    authenticated: state.user.toJSON().authenticated,
    loginInfo: state.user.toJSON().loginInfo,
  };
};

export default create(File, mapStateToProps);

