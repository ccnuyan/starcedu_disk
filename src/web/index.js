import indexHtml from './indexFabricator';
import fileServices from '../api/services/fileServices';

export default (app) => {
  app.get('/', async (req, res) => {
    if (!req.user) {
      return res.redirect(302, '/signin?cb=/apps/disk/');
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
