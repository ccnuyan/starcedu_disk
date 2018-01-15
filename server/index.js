import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import delay from 'express-delay';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import '../config';
import routes from '../src';
import crossDomain from './middleware/crossDomain';
import utilities from './middleware/utilities';

import '../globals';
import './tenants';

const app = express();

// serve the app
const PORT = process.env.PORT || serverConfig.port;
global.report();

// express middleware
app.use(compression());

app.use('/static/', express.static(path.join(__dirname, '../build/')));
app.use('/static/', express.static(path.join(__dirname, '../public/')));

if (serverConfig.log) {
  app.use(morgan(serverConfig.log));
}
if (serverConfig.maxDelay) {
  app.use(delay(0, serverConfig.maxDelay));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(utilities.ajaxDetector);
app.use(crossDomain);

app.use(cookieParser());

// routes
routes.api(app);
routes.web(app);

const server = app.listen(PORT, (err) => {
  if (err) {
    printError(err, __filename);
  } else {
    printMessage(`${serverConfig.title} is listening on port ${PORT}`, __filename);
  }
});

export default server;

