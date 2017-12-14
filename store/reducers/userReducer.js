import { fromJS, Map } from 'immutable';
import actionTypes from '../actionTypes';

const userinit = fromJS({
    user: {},
});

/* eslint-disable no-param-reassign */
export default (state = userinit, action) => {
    return state;
};
