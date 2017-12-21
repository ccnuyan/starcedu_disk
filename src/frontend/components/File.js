import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FileIcon from './FileIcon';
import FileOptions from './FileOptions';
import FileBody from './FileBody';

class File extends Component {
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
      <li className="item" style={ { position: 'relative' } }>
        <FileOptions file={ this.props.file } cl_mode={ this.props.file.cl_mode }/>
        <FileIcon file={ this.props.file }/>
        <FileBody file={ this.props.file }/>
        {(file.busy && uploading_state) ?
          <div ref={ e => this.progress = e } className="ui tiny indicating progress"
          style={ { position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', margin: 0 } }
          ><div className="bar"></div>
          </div> : ''}
        {((file.busy || file.cl_mode === 'renaming' || file.cl_mode === 'removing') && !uploading_state) ?
          <div className="ui active inverted dimmer">
            <div className="ui loader"></div>
          </div> : ''}
      </li>
    );
  }
}

File.propTypes = {
  file: PropTypes.object.isRequired,
  uploading_files: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    uploading_files: state.files.toJSON().uploading.files,
  };
};

export default connect(mapStateToProps)(File);

