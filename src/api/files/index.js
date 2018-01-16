import { Router } from 'express';
import timeout from 'connect-timeout';

import files from './files';
import auth from '../authMiddleware';
import middlewares from './middlewares';

const router = Router();

router.get('', middlewares.exist, files.require_file);
router.post('', auth, files.create_file);
router.put('', auth, middlewares.exist, files.update_file_title);
router.delete('', auth, middlewares.exist, files.delete_file);

router.post('/remote', auth, timeout('10s', { reqpond: true }), files.add_remote_file); // there is no auth for qiniu callback

router.get('/uploaded', auth, files.require_uploaded_files);
router.get('/access', middlewares.exist, files.access_file);

export default router;
