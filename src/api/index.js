import files from './files';

export default (app) => {
  // These are works apis
  app.get('/api/service/status', (req, res) => {
    res.json({
      code: 0,
      message: 'ok',
    });
  }); // notice here is use not route
  app.use('/api/files', (req, res, next) => {
    return files(req, res, next);
  }); // notice here is use not route
};
