import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import delay from 'express-delay';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import '../globals';
import config from '../config';
import routes from '../src';
import tokenAuth from './middleware/tokenAuth';
import crossDomain from './middleware/crossDomain';
import utilities from './middleware/utilities';

const app = express();

// serve the app
const PORT = process.env.PORT || config.port;
global.report();

// express middleware
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use('/static/', express.static(path.join(__dirname, '../build/')));
app.use('/static/', express.static(path.join(__dirname, '../public/')));

// custom middlewares
app.use(utilities.ajaxDetector);
app.use(crossDomain);

if (config.mode === 'development') {
  app.use(delay(100, 300));
  app.use(morgan('tiny'));
}

// auth
app.use(tokenAuth);

routes(app);

const server = app.listen(PORT, (err) => {
  if (err) {
    printError(err, __filename);
  } else {
    printMessage(`${config.title} is listening on port ${PORT}`, __filename);
  }
});

export default server;

