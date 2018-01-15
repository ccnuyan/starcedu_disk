export default (req, res, next) => {
  if (req.user && req.user.id) {
    const tenant = tenants[req.user.to];

    if (tenant && tenant.id) {
      if (tenant.local || tenant.fields.indexOf('disk') >= 0) {
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
  }
  return res.status(401).send({
    code: 401,
    message: 'user unauthenticated',
  });
};
