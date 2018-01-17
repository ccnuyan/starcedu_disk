import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './style.css';
import './includes';

import './app_embed.css';
import DiskEmbed from './components/DiskEmbed';
import store from '../store';

window.starcdisk = {
  init: () => {
    // this.config = config || {};

    $('body').append('<div id="starc_disk"><div>');
    $('#starc_disk').css({
      position: 'absolute',
      opacity: '0',
      width: '0',
      height: '0',
      background: 'white',
    });

    const rootNode = document.getElementById('starc_disk');

    Provider.propTypes.children = PropTypes.object;
    ReactDOM.render(<Provider store={ store }>
      <DiskEmbed/>
    </Provider>, rootNode);
  },
  showup: () => {
    $('#starc_disk').css({
      position: 'absolute',
      opacity: '1',
      width: '640px',
      height: '640px',
    });
  },
  hide: () => {
    $('#starc_disk').css({
      position: 'absolute',
      opacity: '0',
      width: '0px',
      height: '0px',
    });
  },
};
