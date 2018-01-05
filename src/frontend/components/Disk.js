import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
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
      <Motion defaultStyle={ { opacity: 0 } } style={ { opacity: spring(1) } }>
        {
          style => <div className="starc-disk" style={ style }>
            <Header/>
            <div className="ui container">
              <div className="ui basic segment">
                <Filter/>
                <div className="ui hidden divider"></div>
                <FileList />
              </div>
            </div>
          </div>
        }
      </Motion>
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

