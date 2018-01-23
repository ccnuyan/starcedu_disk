import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './style.css';
import './includes';

import './app_embed.css';
import Disk from './components/Disk';
import store from '../store';

window.starcdisk = {
  init: (config) => {
    config = config || {}; // eslint-disable-line

    $('body').append('<div id="starc_disk"><div>');

    $('#starc_disk').css({
      position: 'absolute',
      opacity: '0',
      width: '0',
      height: '0',
      background: 'white',
    });

    const uiConfig = {
      mode: 'embed',
      width: config.width ? `${config.width}px` : '800px',
      height: config.height ? `${config.height}px` : '640px',
      position: config.position || 'center',
      autoHide: config.autoHide || true,
      rename: config.rename || true,
      remove: config.remove || true,
      download: config.download || true,
      select: config.select || true,
      multiSelect: config.multiSelect || true,
      dargmove: config.dargmove || true,
    };

    const rootNode = document.getElementById('starc_disk');
    Provider.propTypes.children = PropTypes.object;
    ReactDOM.render(<Provider store={ store({ config: uiConfig }) }>
      <Disk/>
    </Provider>, rootNode);
  },
  showup: () => {
    $('#starc_disk').css({
      opacity: '1',
      width: '800px',
      height: '640px',
    });
  },
};
