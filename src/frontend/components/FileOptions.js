import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import config from '../config';
import filesActions from '../../store/actions/filesActions';

class FileOptions extends Component {
  static propTypes = {
    file: PropTypes.object.isRequired,
    file_remove: PropTypes.func.isRequired,
    file_rename: PropTypes.func.isRequired,
    set_cl_mode: PropTypes.func.isRequired,
  }

  handleRemove = () => {
    this.props.file_remove({
      file_id: this.props.file.id,
    });
  }

  handleRename = () => {
    this.props.file_rename({
      file_id: this.props.file.id,
      title: this.props.file.cl_input_title,
    });
  }

  handleOK = () => {
    if (this.props.file.cl_mode === 'rename') {
      this.handleRename();
    }
    if (this.props.file.cl_mode === 'remove') {
      this.handleRemove();
    }
  }

  setMode = (mode) => {
    this.props.set_cl_mode({ file_id: this.props.file.id, mode });
  }

  render() {
    const { file } = this.props;

    if (file.busy || file.cl_mode === 'renaming' || file.cl_mode === 'removing') {
      return (<div/>);
    }

    if (file.cl_mode === 'rename') {
      return (
        <div className='extra'>
          <div className='right floated buttons'>
            <div className={ 'ui blue mini button' } onTouchTap={ this.handleOK }>OK</div>
            <div className="ui mini button" onTouchTap={ () => this.setMode('normal') }>NO</div>
          </div>
        </div>);
    }

    if (file.cl_mode === 'remove') {
      return (
        <div className='extra'>
          <div className='right floated buttons'>
            <div className={ 'ui red mini button' } onTouchTap={ this.handleOK }>OK</div>
            <div className="ui mini button" onTouchTap={ () => this.setMode('normal') }>NO</div>
          </div>
        </div>);
    }

    return (
      <div className='extra'>
        <div className='buttons'>
          <a className="ui gray mini icon button" onTouchTap={ () => this.setMode('rename') }>
            <i className="ui edit icon"></i>
          </a>
          <a className="ui gray mini icon button" onTouchTap={ () => this.setMode('remove') }>
            <i className="ui trash icon"></i>
          </a>
          <a className="ui gray mini icon button" href={ `${config.serviceBase}/api/files/access?file_id=${file.id}` }>
            <i className="ui download icon"></i>
          </a>
        </div>
      </div>);
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => {
  return {
    file_remove: ({ file_id }) => {
      dispatch(filesActions.remove({ file_id }));
    },
    file_rename: ({ file_id, title }) => {
      dispatch(filesActions.update({ file_id, title }));
    },
    set_cl_mode: ({ file_id, mode }) => {
      filesActions.set_cl_mode(dispatch, { file_id, mode });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileOptions);
