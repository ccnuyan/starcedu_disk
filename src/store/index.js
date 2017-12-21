import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { fromJS } from 'immutable';
import reducers from './reducers';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

const combined_reducers = combineReducers(reducers);

// middlewares
const loggerMiddleware = createLogger();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

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
  composeEnhancers(applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware, // neat middleware that logs actions
  )),
);


export default store;
