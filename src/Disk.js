import React, { Component } from 'react';
import FileList from './components/FileList';

class Help extends Component {
  render = () => {
    return (
      <div className="disk">
        <div className="ui divider"></div>
        <div className="ui container">
          <div className="ui steps">
            <a href='/' className="active step">
              <i className="home icon"></i>
              <div className="content">
                <div className="title">Starcedu</div>
                <div className="description">Choose your shipping options</div>
              </div>
            </a>
            <a href='/apps/disk' className="step">
              <i className="save icon"></i>
              <div className="content">
                <div className="title">Disk</div>
                <div className="description">Enter billing information</div>
              </div>
            </a>
          </div>
        </div>
        <div className="ui divider"></div>
        <div className="ui container">
          <FileList />
        </div>
      </div>
    );
  }
}

export default Help;
