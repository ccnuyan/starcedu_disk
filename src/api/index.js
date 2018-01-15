import files from './files';
import files_controller from './files/files';
import tenantAuthMiddleware from './tenantAuthMiddleware';
import tenantBasicAuthMiddleware from './tenantBasicAuthMiddleware';

export default (app) => {
  app.post('/api/files/upload_callback', files_controller.update_file_status); // there is no auth for qiniu callback
  app.post('/api/files/tenant/access', tenantBasicAuthMiddleware, files_controller.tenant_access_file); // there is no auth for qiniu callback
  app.use('/api/local/files', files);
  app.use('/api/tenant/files', tenantAuthMiddleware, files);
};
