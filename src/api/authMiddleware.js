export default (req, res, next) => {
  if (req.user && req.user.id) {
    req.tenant = tenants[req.user.to];
    return next();
  }
  return res.status(401).send({
    code: 401,
    message: 'user unauthenticated',
  });
};
