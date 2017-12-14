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
import routes from '../src';
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

    if (config.mode === 'development') {
      app.use(delay(100, 300));
      app.use(morgan('tiny'));
    }

    routes(app);

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

