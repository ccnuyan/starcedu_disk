import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './style.scss';
import './includes';

import Disk from './components/Disk';
import store from '../store';

const rootNode = document.getElementById('react');

Provider.propTypes.children = PropTypes.object;

ReactDOM.render(
  <Provider store={ store }>
    <Disk/>
  </Provider>,
  rootNode);

