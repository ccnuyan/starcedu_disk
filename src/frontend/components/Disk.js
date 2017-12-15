import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FileList from './FileList';
import create from './creator';
import Filter from './Filter';

class Disk extends Component {
  render = () => {
    return (
      <div className="disk">
        <div className="ui large top fixed inverted menu transition visible" style={ { display: 'flex !important' } }>
          <div className="ui container">
            <a className="item" href="/#main_content">
              <i className="home icon"></i>
              <div className="content">主页</div>
            </a>
            <a className="active item" href="/">
              <i className="save icon"></i>
              <div className="content">网盘</div>
            </a>
            <div className="right item" >
              <div className="ui buttons">
                <a className="ui blue button" href="/profile#settings">{this.props.user.username}</a>
                <a className="ui button" href="/signout" style={ { marginLeft: 0 } }>登出</a>
              </div>
            </div>
          </div>
        </div>
        <div className="ui container">
          <Filter/>
          <div className="ui hidden divider"></div>
          <FileList />
        </div>
      </div >
    );
  }
}


Disk.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user.toJSON().user,
  };
};

export default create(Disk, mapStateToProps);

