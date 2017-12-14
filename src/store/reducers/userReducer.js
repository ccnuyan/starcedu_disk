import { fromJS } from 'immutable';

const userinit = fromJS({
  user: {},
});

/* eslint-disable no-param-reassign */
export default (state = userinit) => {
  return state;
};
