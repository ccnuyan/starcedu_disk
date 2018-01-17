import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FileList from './FileList';
import Filter from './Filter';
import Header from './Header';
import EmbedHeader from './EmbedHeader';
import filesActions from '../../store/actions/filesActions';

class Disk extends Component {
  static propTypes = {
    files_get_uploaded: PropTypes.func.isRequired,
    uiconfig: PropTypes.object.isRequired,
  };
  componentDidMount() {
    if (this.props.uiconfig.mode === 'embed') {
      this.props.files_get_uploaded();
    }
    setTimeout(() => {
      $('#cssload-thecube').css({ display: 'none' });
      $('#react').css({ display: 'block' });
    }, 200);
  }

  render = () => {
    const embed = this.props.uiconfig.mode === 'embed';
    const { uiconfig } = this.props;
    if (embed) {
      return <div className="ui sgement starc-disk" style={ {
        width: uiconfig.width,
        height: uiconfig.height,
      } }
             >
        <EmbedHeader/>
        <div className="ui basic segment">
          <FileList />
        </div>
        <Filter/>
      </div>;
    }
    return (
      <Motion defaultStyle={ { opacity: 0 } } style={ { opacity: spring(1) } }>
        {value => <div className="starc-disk" style={ { ...value,
          padding: '60px 10px' } }
                  >
          <Header/>
          <div className="ui files-container">
            <FileList />
          </div>
          <Filter/>
        </div>}
      </Motion>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.toJSON().user,
    uiconfig: state.ui.toJSON().config,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    files_get_uploaded: () => {
      dispatch(filesActions.get_uploaded());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Disk);

