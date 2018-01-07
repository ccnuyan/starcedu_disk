import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FileList from './FileList';
import Filter from './Filter';
import Header from './Header';

class Disk extends Component {
  componentDidMount() {
    $('#cssload-thecube').css({ display: 'none' });
  }

  render = () => {
    return (
      <div className="starc-disk">
        <Header/>
        <div className="ui files-container">
          <FileList />
        </div>
        <Filter/>
      </div>
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

export default connect(mapStateToProps)(Disk);

