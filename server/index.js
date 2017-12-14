import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import delay from 'express-delay';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import '../globals';
import { pg } from '../database/connector';
import config from '../config';
import api from '../src/api';
import indexMW from './middleware/indexMW';
import tokenAuth from './middleware/tokenAuth';
import crossDomain from './middleware/crossDomain';

const app = express();

// serve the app
const PORT = process.env.PORT || config.port;

global.report();

try {
  (async () => {
    const pgPool = await pg.connect()
      .catch(err => global.printError(err, __dirname));

    console.log(`database ${config.pg.host + ':' + config.pg.port} connected`); // eslint-disable-line

    if (config.mode === 'development') {
      app.use(delay(200, 500));
      app.use(morgan('tiny'));
    }

    // express middleware
    app.use(compression());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true,
    }));

    app.use('~/static/', express.static(path.join(__dirname, '../build/')));
    app.use('~/static/', express.static(path.join(__dirname, '../public/')));

    app.use(crossDomain);
    app.use(tokenAuth);

    app.use((req, res, next) => {
      req.context = { pgPool };
      next();
    });

    api(app, { pgPool });

    app.get('/*', (req, res, next) => {
      if (!req.user) {
        return res.redirect(302, '/signin?cb=/apps/disk/');
      }
      indexMW({ app: 'app' })(req, res, next);
    });

    app.listen(PORT, (err) => {
      if (err) {
        printError(err, __filename);
      } else {
        printMessage(`syncollege is listening on port ${PORT}`, __filename);
      }
    });
  })();
} catch (err) {
  printError(err, __filename);
}
/* eslint-disable no-console */

