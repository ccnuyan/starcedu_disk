import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import qiniuActions from '../../store/actions/qiniuFineUploader';

class Filter extends Component {
  componentDidMount = () => {
    this.uploader = this.props.files_initialize({
      button: this.uploadButton,
    });
  }
  render = () => {
    return (
      <div className={ 'ui huge secondary bottom fixed menu' } style={ { margin: 0, borderTop: '1px solid #0E6EB8', background: 'white' } }>
        <a className="item" ref={ e => this.uploadButton = e }>
          <i className="green upload icon"></i>
          <div className="content">上传文件</div>
        </a>
        <a className="active item">
          全部
        </a>
        <a className="item">
          <i className="blue file image outline icon"></i>
        </a>
        <a className="item">
          <i className="blue file video outline icon"></i>
        </a>
        <a className="item">
          <i className="blue file audio outline icon icon"></i>
        </a>
        <a className="item">
          <i className="red file pdf outline icon"></i>
        </a>
        <a className="item">
          <i className="blue file word outline icon"></i>
        </a>
        <a className="item">
          <i className="orange file powerpoint outline icon"></i>
        </a>
        <a className="item">
          <i className="green file excel outline icon"></i>
        </a>
        <a className="item">
          <i className="gray file code outline icon"></i>
        </a>
        <a className="item">
          <i className="red file archive outline icon"></i>
        </a>
        <a className="item">
          <i className="teal file text outline icon"></i>
        </a>
        <a className="item">
          <i className="file icon"></i>
        </a>
        <div className="ui category search item">
          <div className="ui transparent icon input">
            <input className="prompt" type="text" placeholder="查找" />
            <i className="search link icon"></i>
          </div>
          <div className="results"></div>
        </div>
        <div className="ui right orange menu">
          <a className="right item">
            <i className="grid layout icon"></i>
          </a>
          <a className="right item">
            <i className="list layout icon"></i>
          </a>
        </div>
      </div>
    );
  }
}

Filter.propTypes = {
  files_initialize: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    uploadedFiles: state.files.toJSON().uploaded.files,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    files_initialize: ({ button }) => {
      dispatch(qiniuActions.initialize({ button }));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);

