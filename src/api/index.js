import files from './files';

export default (app) => {
    // These are works apis
  app.use('/api/files', (req, res, next) => {
    return files(req, res, next);
  }); // notice here is use not route
};
