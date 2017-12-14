import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';
import assets from '../../build/assets.json';

import config from '../../config';
import fileServices from '../../src/api/services/fileServices';


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
            <link key={key} href={config.resources.common.stylesheets[key]} rel="stylesheet" />))}
          {Object.keys(config.resources[app].stylesheets).map(key => (
            <link key={key} href={config.resources[app].stylesheets[key]} rel="stylesheet" />))}
          {assets.vendor.css ? <link href={assets.vendor.css} rel="stylesheet" /> : null}
          <link href={assets[app].css} rel="stylesheet" />
        </head>
        <body>
          <div id="react" />
          <script>
            __server_scirpt__
          </script>
          {Object.keys(config.resources.common.scripts).map(key => (
            <script key={key} src={config.resources.common.scripts[key]} />))}
          {Object.keys(config.resources[app].scripts).map(key => (
            <script key={key} src={config.resources[app].scripts[key]} />))}
          <script src={assets.vendor.js} />
          <script src={assets[app].js} />
        </body>
      </html>
    );
  }
}

const renderer = ({ app }) => async (req, res) => {
  const content = `<!doctype html>${ReactDOMServer.renderToStaticMarkup(<IndexComponent app={app} />)}`;

  const files = await fileServices.require_uploaded_files({uploader_id:req.user.id}, req.context);

  const filesObject = {}

  files.forEach((file) => {
    file.client_id = file.id;
    filesObject[file.id] = file;
  })

  const preloadedState = {
    user: {
      user: req.user
    },
    files: {
      uploaded: {
        files: filesObject
      }
    }
  }

  const filledContent = content.replace('__server_scirpt__', `window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}`)

  res.type('.html');
  res.send(filledContent);
};

export default renderer;
