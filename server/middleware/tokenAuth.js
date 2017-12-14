/*
  this middleware won't interupt the anonymous accessingß
*/

import { verify } from '../../src/services/tokenServices';

export default (req, res, next) => {
  // no authorization token: bypass
  let token = '';

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
