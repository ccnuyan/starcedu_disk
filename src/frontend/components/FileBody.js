import React, { Component } from 'react';
import fileSize from 'file-size';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import filesActions from '../../store/actions/filesActions';

class FileBody extends Component {
  static propTypes = {
    file: PropTypes.object.isRequired,
    uploading_files: PropTypes.object.isRequired,
    set_cl_input_title: PropTypes.func.isRequired,
  }

  handleTitleInput = (event) => {
    event.preventDefault();
    this.props.set_cl_input_title({
      file_id: this.props.file.id,
      title: event.target.value,
    });
  }

  render() {
    const { file, uploading_files } = this.props;
    const uploading_state = uploading_files[file.client_id];

    if (file.cl_mode === 'rename') {
      return (<div className="content">
        <div className="ui mini input field">
          <input onChange={ this.handleTitleInput } ref={ e => this.newNameInput = e } type="text" placeholder="输入新文件名" value={ file.cl_input_name }/>
        </div>
      </div>);
    }

    return (
      <div className="content">
        <div className="small meta">
          <span className="date cinema">{file.uploaded_at ? file.uploaded_at.substring(0, 10) : ''}</span>
        </div>
        <a className="small header" >{file.title || file.filename || file.name}</a>
        <div className="small description">
          <p>文件大小:{ uploading_state ?
        (`${fileSize(uploading_state.uploaded).human('si')}/${fileSize(uploading_state.total).human('si')}`) :
        (`${fileSize(file.size).human('si')}`)}</p>
        </div>
      </div>);
  }
}

const mapStateToProps = (state) => {
  return {
    uploading_files: state.files.toJSON().uploading.files,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    set_cl_input_title: ({ file_id, title }) => filesActions.set_cl_input_title(dispatch, { file_id, title }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileBody);
