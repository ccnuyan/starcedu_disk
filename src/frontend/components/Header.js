import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Header extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  render = () => {
    const { user } = this.props;
    return (
      <div className={ 'ui huge secondary inverted blue fixed menu' } style={ { margin: 0, borderBottom: '1px solid white' } }>
        <a className="icon item" href='/'>
          <div className="ui content">
            <i className="icon home"></i>
                主页
            </div>
        </a>
        <a className="icon item" href='/apps/notebook'>
          <div className="ui content">
            <i className="icon book"></i>
                笔记
            </div>
        </a>
        <a className="active icon item" href='/apps/disk'>
          <div className="ui content">
            <i className="ui cloud icon"></i>
                网盘
            </div>
        </a>
        <div className="right menu">
          {user.id ?
            <a className="icon item" href='/user/password'>
              <div className="ui content">
                <i className="icon user outline"></i>
                {user.username}
              </div>
            </a> : ''}
          {user.id ?
            <a className="icon item" href='/user/signout'>
              <div className="ui content">
                <i className="icon sign out"></i>
                  登出
                </div>
            </a> : ''}
          {user.id ? '' :
          <a className="icon item" href='/user/signin'>
            <div className="ui content">
              <i className="icon sign in"></i>
                登入
              </div>
          </a>}
          {user.id ? '' :
          <a className="icon item" href='/user/signup'>
            <div className="ui content">
              <i className="icon smile"></i>
                注册
              </div>
          </a>}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.toJSON().user,
});

export default connect(mapStateToProps)(Header);
