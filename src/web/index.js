import indexHtml from './indexFabricator';
import appTestHtml from './appTestFabricator';
import fileServices from '../api/services/fileServices';

export default (app) => {
  if (serverConfig.mode === 'development') {
    app.get('/test', (req, res) => {
      res.send(appTestHtml);
    });
  }

  app.get('/', async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.redirect(302, '/user/signin?cb=/apps/disk/');
    }

    const files = await fileServices.require_uploaded_files({ uploader_id: req.user.id }, req.context);

    const filesObject = {};

    files.forEach((file) => {
      file.client_id = file.id; // eslint-disable-line no-param-reassign
      filesObject[file.id] = file;
    });

    const preloadedState = {
      user: {
        user: req.user,
      },
      files: {
        uploaded: {
          files: filesObject,
        },
      },
    };

    res.send(indexHtml.replace('_starc_server_state_', JSON.stringify(preloadedState, null, 2)));
  });
};
