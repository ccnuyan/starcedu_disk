import fileServices from '../services/fileServices';
import qiniuBusiness from './qiniuBusiness';

const create_file = async (req, res) => {
  const ret = await fileServices.create_file({
    uploader_id: req.user.id,
    filename: req.body.filename,
  }, req.context);

  return res.status(201).send({
    code: '201',
    message: 'token created',
    data: {
      ...ret,
      ...qiniuBusiness.requestUpload(),
    },
  });
};

const access_file = async (req, res) => {
  const ret = await fileServices.require_file({
    file_id: req.query.file_id,
  }, req.context);

  if (req.user.id !== ret.uploader_id) {
    return ret.status(401).send({
      code: 401,
      message: 'unauthorized',
    });
  }

  const acessUrlObject = qiniuBusiness.getAccessUrl(ret.etag);
  if (req.isAjaxRequest) {
    return res.send({
      code: 0,
      message: 'access url retrived',
      data: acessUrlObject,
    });
  }
  return res.redirect(`${acessUrlObject.access_url}&attname=${encodeURIComponent(ret.filename || ret.title)}`);
};

const require_file = async (req, res) => {
  const ret = await fileServices.require_file({
    file_id: req.query.file_id,
  }, req.context);

  if (req.user.id !== ret.uploader_id) {
    return ret.status(401).send({
      code: 401,
      message: 'unauthorized',
    });
  }
  return res.send({
    code: 0,
    message: 'file get',
    data: ret,
  });
};

const require_uploaded_files = async (req, res) => {
  const ret = await fileServices.require_uploaded_files({
    uploader_id: req.user.id,
  }, req.context);
  return res.send({
    code: 0,
    message: 'files get',
    data: ret,
  });
};

const update_file_title = async (req, res) => {
  const query = {
    title: req.body.title,
  };

  const ret = await fileServices.update_file_title({
    uploader_id: req.user.id,
    file_id: req.body.file_id,
    ...query,
  }, req.context);
  return res.send({
    code: 0,
    message: 'file title updated',
    data: ret,
  });
};

const update_file_status = async (req, res) => {
  const query = {
    etag: req.body.etag,
    mime: req.body.mime,
    size: req.body.size,
  };

  const ret = await fileServices.update_file_status({
    file_id: req.body.id,
    ...query,
  }, req.context);
  return res.send(ret);
};

const delete_file = async (req, res) => {
  const ret = await fileServices.delete_file({
    uploader_id: req.user.id,
    file_id: req.body.file_id,
  }, req.context);

  return res.send({
    code: 0,
    message: 'file removed',
    data: ret,
  });
};

export default {
  create_file,
  require_file,
  access_file,
  require_uploaded_files,
  update_file_title,
  update_file_status,
  delete_file,
};
