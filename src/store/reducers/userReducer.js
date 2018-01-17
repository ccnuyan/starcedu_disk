import { fromJS } from 'immutable';

const preloadedState = window.__PRELOADED_STATE__;

const userinit = fromJS({
  user: preloadedState && preloadedState.user ? preloadedState.user.user : {},
});

/* eslint-disable no-param-reassign */
export default (state = userinit) => {
  return state;
};
