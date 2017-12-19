import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FileList from './FileList';
import create from './creator';
import Filter from './Filter';
import Header from './Header';

class Disk extends Component {
  render = () => {
    return (
      <div className="disk">
        <Header/>
        <div className="ui container">
          <div className="ui basic segment">
            <Filter/>
            <div className="ui hidden divider"></div>
            <FileList />
          </div>
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

