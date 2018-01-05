/*
  this middleware won't interupt the anonymous accessing
*/

import { verify } from '../../src/services/tokenServices';

export default (req, res, next) => {
  let token = '';

  if (req.session.user) {
    req.user = req.session.user;
    return next();
  }

  if (req.headers.authorization) {
    const breaks = req.headers.authorization.split(' ');
    if (breaks.length === 2 && breaks[0] === 'bearer') {
      if (breaks[1] !== 'null') {
        token = breaks[1];
      }
    }
  } else if (req.cookies.authorization) {
    token = req.cookies.authorization;
  }

  if (!token) {
    return next();
  }

  try {
    req.user = verify(token);
  } catch (err) {
    global.printError(err, __filename);
  } finally {
    next();
  }
};
