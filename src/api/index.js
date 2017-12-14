import files from './files';

export default (app, { pgPool }) => {
    // These are works apis
  app.use('/api/files', (req, res, next) => {
    return files(req, res, next);
  }); // notice here is use not route
};
