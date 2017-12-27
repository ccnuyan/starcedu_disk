import files from './files';

export default (app) => {
  app.get('/api/service/status', (req, res) => {
    res.json({
      code: 0,
      message: 'ok',
    });
  });
  app.use('/api/files', (req, res, next) => {
    return files(req, res, next);
  });
};
