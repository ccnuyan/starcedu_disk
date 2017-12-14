import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'whatwg-fetch';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './style.scss';

import Disk from './components/Disk';
import store from '../store';

injectTapEventPlugin();

const rootNode = document.getElementById('react');

Provider.propTypes.children = PropTypes.object;

ReactDOM.render(
  <Provider store={ store }>
    <Disk/>
  </Provider>,
  rootNode);

