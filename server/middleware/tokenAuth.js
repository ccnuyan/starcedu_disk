/*
  this middleware won't interupt the anonymous accessing
*/

import { verify } from '../../src/services/tokenServices';

export default (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  // no authorization token: bypass
  if (!req.headers.authorization) {
    return next();
  }

  // authorization not in right format: bypass
  const breaks = req.headers.authorization.split(' ');
  if (breaks.length !== 2) {
    return next();
  }
  if (breaks[1] === 'null' || breaks[1] === 'undefined') {
    return next();
  }

  try {
    // user token authentication
    if (breaks[0] === 'bearer') {
      const decoded = verify(breaks[1]);
      req.user = decoded;
    }
    // tenant basic authentication
    if (breaks[0] === 'basic') {
      const credentials = new Buffer(breaks[1], 'base64').toString().split(':');
      if (credentials.length === 2) {
        if (tenants[credentials[0]] && tenants[credentials[0]].pass === credentials[1]) {
          req.tenant = tenants[credentials[0]];
        }
      }
    }
  } catch (err) {
    global.printError(err, __filename);
  } finally {
    next();
  }
};
