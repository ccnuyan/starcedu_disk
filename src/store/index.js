import { fromJS } from 'immutable';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from './reducers';

const combined_reducers = combineReducers(reducers);
// middlewares
const loggerMiddleware = createLogger();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// Grab the state from a global variable injected into the server-generated HTML

const store = ui => createStore(
  combined_reducers, {
    ui: fromJS(ui),
  },
  composeEnhancers(applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware, // neat middleware that logs actions
  )),
);


export default store;
