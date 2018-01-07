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
        <div className="ui mini file-name-input input field">
          <input
          onChange={ this.handleTitleInput }
          ref={ e => this.newNameInput = e }
          type="text" placeholder="输入新文件名"
          value={ file.cl_input_name }
          />
        </div>
      </div>);
    }

    let name_to_display = file.title || file.filename || file.name;

    if (name_to_display.length > 19) {
      name_to_display = `${name_to_display.substring(0, 16)}...`;
    }

    return (
      <div className="content">
        <a className="small header">{name_to_display}</a>
        <div className="small extra meta">
          <span>{file.uploaded_at ? file.uploaded_at.substring(0, 10) : ''}</span>
          <span className="right floated time">
            <p>{ uploading_state ?
              (`${fileSize(uploading_state.uploaded).human('si')}/${fileSize(uploading_state.total).human('si')}`) :
              (`${fileSize(file.size).human('si')}`)}
            </p>
          </span>
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
