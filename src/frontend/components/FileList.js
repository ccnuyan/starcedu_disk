import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import File from './File';
import filesActions from '../../store/actions/filesActions';

class FileList extends Component {
  static propTypes = {
    uploaded_files: PropTypes.object.isRequired,
    files_get_uploaded: PropTypes.func.isRequired,
  };

  render = () => {
    const files = Object.keys(this.props.uploaded_files).map((k) => {
      return this.props.uploaded_files[k];
    });

    const sortedFiles = _.orderBy(files, ['busy', 'uploaded_at'], ['asc', 'desc']);

    return (
      <div className="ui link eight doubling cards">
        {sortedFiles.map((file) => {
          return <File key={ file.id } file={ file }/>;
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    uploaded_files: state.files.toJSON().uploaded.files,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    files_get_uploaded: () => {
      dispatch(filesActions.get_uploaded());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileList);
