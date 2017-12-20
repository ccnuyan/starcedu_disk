import { combineReducers, createStore } from 'redux';
import { fromJS } from 'immutable';
import reducers from './reducers';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

const combined_reducers = combineReducers(reducers);

const store = createStore(
  combined_reducers,
  {
    user: fromJS(preloadedState.user),
    files: fromJS({
      ...preloadedState.files,
      uploading: {
        files: {

        },
      },
    }),
    asyncStatus: fromJS({}),
  },
  global.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
