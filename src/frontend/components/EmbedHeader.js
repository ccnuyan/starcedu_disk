import React, { Component } from 'react';

class EmbedHeader extends Component {
  render = () => {
    return (
      <div className={ 'ui huge secondary inverted blue menu' } style={ { margin: 0, borderBottom: '1px solid white' } }>
        <div className="active icon item" href='/apps/disk'>
          <div className="ui content">
            <i className="ui cloud icon"></i>
              网盘
          </div>
        </div>
        <div className="right menu">
          <div className="icon item">
            <i className="close icon"></i>
          </div>
        </div>
      </div>
    );
  }
}
export default EmbedHeader;
