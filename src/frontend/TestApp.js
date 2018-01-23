import React, { Component } from 'react';

class TestApp extends Component {
  componentDidMount() {
    window.starcdisk.init();
  }

  onShowup = () => {
    window.starcdisk.showup();
  }

  render = () => {
    return (
      <div className="ui text container">
        <div className="ui segment">
          <div className="ui big header">
            网盘组件测试
          </div>
          <div className="ui divider"></div>
          <div onTouchTap={ this.onShowup } className="ui button">呼出网盘</div>
          <div className="ui button">关闭网盘</div>
          <div className="ui divider"></div>
        </div>
      </div>
    );
  }
}

export default TestApp;

