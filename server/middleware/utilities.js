const ajaxDetector = (req, res, next) => {
  if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
    req.isAjaxRequest = true;
  }
  next();
};

const redirector = (req, res, next) => {
  const cb = req.query.cb ? `?cb=${req.query.cb}` : '';

  res.redirectWithCallback = (status, path) => {
    res.redirect(status, path + cb);
  };

  res.redirectToCallback = (status, path) => {
    if (req.query.cb) {
      res.redirect(status, req.query.cb);
    } else {
      res.redirect(status, path);
    }
  };
  next();
};

export default {
  ajaxDetector,
  redirector,
};
