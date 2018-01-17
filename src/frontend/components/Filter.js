import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import filesActions from '../../store/actions/filesActions';
import qiniuActions from '../../store/actions/qiniuFineUploader';

import mimeMap from './mimeMap';

class Filter extends Component {
  componentDidMount = () => {
    this.uploader = this.props.files_initialize({
      button: this.uploadButton,
    });

    $('.filter-menu>.item').popup();
  }
  onFilterSelected = (event) => {
    const payload = {};
    payload[event.currentTarget.dataset.key] = true;
    this.props.set_filter_one(payload);
  }
  render = () => {
    const { filter } = this.props;
    const embed = this.props.uiconfig.mode === 'embed';

    const files = Object.keys(this.props.uploaded_files).map((k) => {
      return this.props.uploaded_files[k];
    });

    const filterStatistics = {};
    Object.keys(mimeMap).forEach((k) => {
      filterStatistics[k] = _.sum(files.map(f => (mimeMap[k].mimes.indexOf(f.mime) >= 0 ? 1 : 0)));
    });

    return (<div className={ `ui huge secondary bottom icon menu filter-menu ${embed ? '' : ' fixed'}` }
      style={ { margin: 0, borderTop: '1px solid #0E6EB8', background: 'white' } }
            >
      <a className="item" ref={ e => this.uploadButton = e } data-content="上传新文件">
        <i className="green upload icon"></i>
      </a>
      {files.length > 0 ? <a onTouchTap={ this.props.set_filter_all } className={ `${filter.all ? 'active' : ''} item` } data-content="显示所有文件">
        <div className={ 'floating ui black label' }>{files.length}</div>
        <i className="black folder icon"></i>
      </a> : ''}
      {
        Object.keys(mimeMap).map(k =>
          (filterStatistics[k] > 0 ?
            <a key={ k } data-key={ k }
              className={ `${filter.filters[k] ? 'active' : ''} item` }
              data-content={ mimeMap[k].tip }
              onTouchTap={ this.onFilterSelected }
            >
              <div className={ `floating ui ${mimeMap[k].color} label` }>{filterStatistics[k]}</div>
              <i className={ `${mimeMap[k].color} ${mimeMap[k].className} icon` }></i>
            </a> : ''))
      }
      {/*  <div className="ui category search item">
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
        </div> */}
    </div>
    );
  }
}

Filter.propTypes = {
  uiconfig: PropTypes.object.isRequired,
  files_initialize: PropTypes.func.isRequired,
  set_filter_all: PropTypes.func.isRequired,
  set_filter_one: PropTypes.func.isRequired,
  uploaded_files: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    uploaded_files: state.files.toJSON().uploaded.files,
    filter: state.files.toJSON().filter,
    uiconfig: state.ui.toJSON().config,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    files_initialize: ({ button }) => {
      dispatch(qiniuActions.initialize({ button }));
    },
    set_filter_all: () => {
      filesActions.set_filter_all(dispatch);
    },
    set_filter_one: (payload) => {
      filesActions.set_filter_one(dispatch, payload);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);

