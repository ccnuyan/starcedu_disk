import actionTypes from '../actionTypes';
import utils from '../../utils';
import config from '../../frontend/config';
import fill from './messagesMW';

const base = config.serviceBase;

/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-return */

const get_uploaded = () => {
  return (dispatch) => {
    const payload = {
      method: 'GET',
      credentials: 'include',
      headers: utils.getHeaders(),
    };
    dispatch(fill({ type: actionTypes.FILES_GET_UPLOADED_START }));

    fetch(`${base}/api/local/files/uploaded`, payload)
    .then(res => res.json())
    .then((ret) => {
      dispatch(fill({ type: actionTypes.FILES_GET_UPLOADED_END, payload: ret.data }));
      return;
    }).catch(() => {
      dispatch(fill({ type: actionTypes.FILES_GET_UPLOADED_ERROR }));
      return;
    });
  };
};

const update = ({ file_id, title }) => {
  return (dispatch) => {
    const payload = {
      method: 'PUT',
      credentials: 'include',
      headers: utils.getHeaders(),
      body: JSON.stringify({
        file_id,
        title,
      }),
    };

    dispatch(fill({ type: actionTypes.FILES_UPDATE_START, payload: { file_id, title } }));

    fetch(`${base}/api/local/files`, payload)
    .then(res => res.json())
    .then((ret) => {
      if (ret.code === 0) {
        dispatch(fill({ type: actionTypes.FILES_UPDATE_END, payload: ret.data }));
      } else {
        dispatch(fill({ type: actionTypes.FILES_UPDATE_ERROR }));
      }
      return;
    }).catch(() => {
      dispatch(fill({ type: actionTypes.FILES_UPDATE_ERROR }));
      return;
    });
  };
};

const remove = ({ file_id }) => {
  return (dispatch) => {
    const payload = {
      method: 'DELETE',
      credentials: 'include',
      headers: utils.getHeaders(),
      body: JSON.stringify({ file_id }),
    };

    dispatch(fill({ type: actionTypes.FILES_REMOVE_START, payload: { file_id } }));

    fetch(`${base}/api/local/files`, payload)
    .then(res => res.json())
    .then((ret) => {
      if (ret.code === 0) {
        dispatch(fill({ type: actionTypes.FILES_REMOVE_END, payload: ret.data }));
      } else {
        dispatch(fill({ type: actionTypes.FILES_REMOVE_ERROR }));
      }
      return;
    }).catch(() => {
      return;
    });
  };
};

const set_cl_mode = (dispatch, { file_id, mode }) => {
  dispatch({
    type: actionTypes.FILES_SET_CL_MODE,
    payload: { file_id, mode },
  });
};

const set_cl_input_title = (dispatch, { file_id, title }) => {
  dispatch({
    type: actionTypes.FILES_SET_CL_INPUT_TITLE,
    payload: { file_id, title },
  });
};

const set_filter_all = (dispatch) => {
  dispatch({
    type: actionTypes.FILES_SET_FILTER_ALL,
    payload: { },
  });
};

const set_filter_one = (dispatch, payload) => {
  dispatch({
    type: actionTypes.FILES_SET_FILTER_ONE,
    payload,
  });
};


export default {
  get_uploaded,
  update,
  remove,
  set_cl_mode,
  set_cl_input_title,
  set_filter_all,
  set_filter_one,
};
