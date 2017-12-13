import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';
import assets from '../../build/assets.json';

import config from '../../config';


class IndexComponent extends Component {
  static propTypes = {
    app: PropTypes.string.isRequired,
  }
  render = () => {
    const app = this.props.app;

    return (
      <html className="no-js" lang="zh-CN">
        <head>
          <meta charSet="utf-8" />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <title>
            {config.title}
          </title>
          <meta content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1" name="viewport" />
          { /* <!-- Use minimum-scale=1 to enable GPU rasterization --> */}
          <title>
            {config.title}
          </title>
          {Object.keys(config.resources.common.stylesheets).map(key => (
            <link key={ key } href={ config.resources.common.stylesheets[key] } rel="stylesheet" />))}
          {Object.keys(config.resources[app].stylesheets).map(key => (
            <link key={ key } href={ config.resources[app].stylesheets[key] } rel="stylesheet" />))}
          {assets.vendor.css ? <link href={ assets.vendor.css } rel="stylesheet" /> : null}
          <link href={ assets[app].css } rel="stylesheet" />
        </head>
        <body>
          <div id="react" />
          {Object.keys(config.resources.common.scripts).map(key => (
            <script key={ key } src={ config.resources.common.scripts[key] } />))}
          {Object.keys(config.resources[app].scripts).map(key => (
            <script key={ key } src={ config.resources[app].scripts[key] } />))}
          <script src={ assets.vendor.js } />
          <script src={ assets[app].js } />
        </body>
      </html>
    );
  }
}

const renderer = ({ app }) => (req, res) => {
  const content = `<!doctype html>${ReactDOMServer.renderToStaticMarkup(<IndexComponent app={ app } />)}`;
  res.type('.html');
  res.send(content);
};

export default renderer;
