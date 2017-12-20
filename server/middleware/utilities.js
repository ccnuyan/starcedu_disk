const ajaxDetector = (req, res, next) => {
  if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
    req.isAjaxRequest = true;
  }
  next();
};

export default {
  ajaxDetector,
};
