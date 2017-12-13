import actionTypes from '../actionTypes';

const setPristine = dispatch => ({ action }) => {
  if (action) {
    dispatch({ type: actionTypes.SET_PRISTINE, payload: { action } });
  } else {
    dispatch({ type: actionTypes.SET_PRISTINE });
  }
};


export default {
  setPristine,
};
