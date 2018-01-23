import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './style.css';
import './app.css';
import './includes';

import Disk from './components/Disk';
import store from '../store';

const rootNode = document.getElementById('react');

Provider.propTypes.children = PropTypes.object;

const uiConfig = {
  config: {},
};

ReactDOM.render(
  <Provider store={ store(uiConfig) }>
    <Disk/>
  </Provider>,
  rootNode);

