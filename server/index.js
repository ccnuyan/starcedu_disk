import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import delay from 'express-delay';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';
import connectRedis from 'connect-redis';
// import timeout from 'connect-timeout';

import '../globals';
import config from '../config';
import routes from '../src';
import tokenAuth from './middleware/tokenAuth';
import crossDomain from './middleware/crossDomain';
import utilities from './middleware/utilities';

const app = express();
const RedisStore = connectRedis(session);

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

if (config.log) {
  app.use(morgan(config.log));
}
if (config.maxDelay) {
  app.use(delay(0, config.maxDelay));
}

app.use(utilities.ajaxDetector);
app.use(crossDomain);

const sessionConfig = {
  secret: config.auth.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: { httpOnly: true },
};

if (config.mode === 'test') {
  app.use(session(sessionConfig));
} else {
  app.use(session({
    store: new RedisStore(config.redisSessionServer),
    ...sessionConfig,
  }));
}

// auth
app.use(tokenAuth);

// app.use(timeout('5s'));
routes(app);

const server = app.listen(PORT, (err) => {
  if (err) {
    printError(err, __filename);
  } else {
    printMessage(`${config.title} is listening on port ${PORT}`, __filename);
  }
});

export default server;

