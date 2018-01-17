import { fromJS, Map } from 'immutable';
import actionTypes from '../actionTypes';

const preloadedState = window.__PRELOADED_STATE__;

const filesinit = fromJS({
  filter: {
    all: true,
    filters: {},
  },
  uploaded: {
    files: preloadedState && preloadedState.files ? preloadedState.files.uploaded.files : {},
  },
  uploading: {
    files: {

    },
  },
});

/* eslint-disable no-param-reassign */
export default (state = filesinit, action) => {
  switch (action.type) {
    case actionTypes.FILES_GET_UPLOADED_START: {
      state = state.setIn(['uploaded', 'files'], Map({}));
      return state;
    }
    case actionTypes.FILES_GET_UPLOADED_END: {
      action.payload.forEach((file) => {
        file.client_id = file.id;
        state = state.setIn(['uploaded', 'files', file.client_id], Map(file));
      });
      return state;
    }
    case actionTypes.FILES_GET_UPLOADED_ERROR: {
      return state;
    }

    case actionTypes.FILES_UPDATE_START: {
      state = state.setIn(['uploaded', 'files', action.payload.file_id, 'cl_mode'], 'renaming');
      return state;
    }
    case actionTypes.FILES_UPDATE_END: {
      state = state.setIn(['uploaded', 'files', action.payload.id], Map(action.payload));
      return state;
    }
    case actionTypes.FILES_UPDATE_ERROR: {
      return state;
    }

    case actionTypes.FILES_REMOVE_START: {
      state = state.setIn(['uploaded', 'files', action.payload.file_id, 'cl_mode'], 'removing');
      return state;
    }
    case actionTypes.FILES_REMOVE_END: {
      state = state.deleteIn(['uploaded', 'files', action.payload.id]);
      return state;
    }
    case actionTypes.FILES_REMOVE_ERROR: {
      return state;
    }

    case actionTypes.FILES_UPLOAD_GET_TOKEN_START: {
      return state;
    }
    case actionTypes.FILES_UPLOAD_GET_TOKEN_END: {
      action.payload.busy = true;
      action.payload.error = false;
      state = state.setIn(['uploaded', 'files', action.payload.id], fromJS(action.payload));
      return state;
    }
    case actionTypes.FILES_UPLOAD_GET_TOKEN_ERROR: {
      return state;
    }

    case actionTypes.FILES_UPLOAD_PROGRESS_START: {
      state = state.setIn(['uploading', 'files', action.payload.client_id, 'uploaded'], action.payload.uploaded);
      state = state.setIn(['uploading', 'files', action.payload.client_id, 'total'], action.payload.total);
      return state;
    }
    case actionTypes.FILES_UPLOAD_PROGRESS_END: {
      return state;
    }
    case actionTypes.FILES_UPLOAD_PROGRESS_ERROR: {
      return state;
    }

    case actionTypes.FILES_UPLOAD_START: {
      return state;
    }
    case actionTypes.FILES_UPLOAD_END: {
      action.payload.busy = null;
      action.payload.error = false;
      state = state.setIn(['uploaded', 'files', action.payload.id], fromJS(action.payload));
      state = state.removeIn(['uploading', 'files', action.payload.client_id]);
      return state;
    }
    case actionTypes.FILES_UPLOAD_ERROR: {
      action.payload.upload_mode = 'error';
      action.payload.busy = false;
      action.payload.error = true;
      state = state.removeIn(['uploading', 'files', action.payload.client_id]);
      return state;
    }

    case actionTypes.FILES_SET_CL_MODE: {
      state = state.setIn(['uploaded', 'files', action.payload.file_id, 'cl_mode'], action.payload.mode);
      return state;
    }

    case actionTypes.FILES_SET_CL_INPUT_TITLE: {
      state = state.setIn(['uploaded', 'files', action.payload.file_id, 'cl_input_title'], action.payload.title);
      return state;
    }

    case actionTypes.FILES_SET_FILTER_ALL: {
      state = state.setIn(['filter', 'all'], true);
      state = state.setIn(['filter', 'filters'], fromJS({}));
      return state;
    }

    case actionTypes.FILES_SET_FILTER_ONE: {
      Object.keys(action.payload).forEach((k) => {
        if (action.payload[k]) {
          state = state.setIn(['filter', 'all'], false);
          state = state.setIn(['filter', 'filters'], fromJS({}));
          state = state.setIn(['filter', 'filters', k], true);
        } else {
          state = state.setIn(['filter', 'filters', k], false);
        }
      });
      return state;
    }

    default: {
      return state;
    }
  }
};
