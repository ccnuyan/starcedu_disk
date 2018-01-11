export default (req, res, next) => {
  if (req.tenant && req.tenant.id) {
    if (req.tenant.local || req.tenant.fields.indexOf('disk') >= 0) {
      return next();
    }
    return res.status(403).send({
      code: 403,
      message: 'tenant unauthorized',
    });
  }

  return res.status(401).send({
    code: 401,
    message: 'tenant unauthenticated',
  });
};
