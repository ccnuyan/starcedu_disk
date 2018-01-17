import React, { Component } from 'react';
import FileList from './FileList';
import Filter from './Filter';

class DiskEmbed extends Component {
  componentDidMount() {
    setTimeout(() => {
      $('#cssload-thecube').css({ display: 'none' });
      $('#react').css({ display: 'block' });
    }, 200);
  }

  render = () => {
    return (
      <div className="starc-disk">
        <div className="ui files-container segment">
          <div onTouchTap={ window.starcdisk.hide } className="ui right floated icon button">
            <i className="close icon"></i>
          </div>
          <FileList />
        </div>
        <Filter/>
      </div>
    );
  }
}

export default DiskEmbed;
