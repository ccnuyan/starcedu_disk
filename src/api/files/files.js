import fetch from 'cross-fetch';

import fileServices from '../services/fileServices';
import qiniuBusiness from './qiniuBusiness';
import paramsValidator from '../paramsValidator';

import utils from '../../utils';

const create_file = async (req, res) => {
  const payload = {
    filename: req.body.filename,
  };
  const valRet = paramsValidator.validate(payload, ['filename']);
  if (valRet.code !== 0) {
    return res.json(valRet);
  }

  const ret = await fileServices.create_file({
    uploader_id: req.user.id,
    ...payload,
  });

  return res.send({
    message: 'token created',
    data: {
      ...ret,
      ...qiniuBusiness.requestUpload(),
    },
  });
};

const add_remote_file = (req, res) => {
  // https://developer.qiniu.com/kodo/api/1263/fetch
  const payload = {
    filename: req.body.filename,
    file_url: req.body.file_url,
  };

  const valRet = paramsValidator.validate(payload, ['filename', 'file_url']);
  if (valRet.code !== 0) {
    return res.json(valRet);
  }

  const encodeBucketdUrl = qiniuBusiness.encodeEntry();
  const encodeFileUrl = qiniuBusiness.encodeFileUrl(payload.file_url);
  const targeturl = `http://iovip.qbox.me/fetch/${encodeFileUrl}/to/${encodeBucketdUrl}`;

  const token = qiniuBusiness.generateAccessToken(targeturl);

  const requestPayload = {
    headers: {
      method: 'post',
      'content-type': 'application/x-www-form-urlencoded',
      authorization: token,
    },
  };

  fetch(targeturl, requestPayload)
    .then((qiniures) => {
      return qiniures.json();
    })
    .then(async (ret) => {
      if (req.timeout) { return false; }

      const ret1 = await fileServices.create_file({
        uploader_id: req.user.id,
        ...payload,
      });

      const ret2 = await fileServices.update_file_status({
        file_id: ret1.id,
        size: ret.fsize,
        etag: ret.hash,
        mime: ret.mimeType,
      });
      if (!res.headersSent) {
        return res.send({
          message: 'file created',
          data: ret2,
        });
      }
      return false;
    })
    .catch((err) => {
      if (!res.headersSent) {
        return res.status(400).send({
          message: 'something wrong in remote server',
          data: {
            error: err,
          },
        });
      }
    });
};

const access_file = async (req, res) => {
  const payload = { file_id: req.file.id };
  const ret = await fileServices.require_file(payload);

  if (req.user.id !== ret.uploader_id) {
    return res.status(403).send({
      message: 'this user is not allowed to do this operation',
    });
  }

  const acessUrlObject = qiniuBusiness.getAccessUrl(ret.etag);
  if (req.isAjaxRequest) {
    return res.send({
      message: 'access url retrived',
      data: acessUrlObject,
    });
  }
  return res.redirect(`${acessUrlObject.access_url}&attname=${encodeURIComponent(ret.filename || ret.title)}`);
};

const require_file = async (req, res) => {
  const payload = { file_id: req.file.id };
  const ret = await fileServices.require_file(payload);

  if (req.user.id !== ret.uploader_id) {
    return res.status(403).send({
      message: 'this user is not allowed to do this operation',
    });
  }
  return res.send({
    message: 'file get',
    data: ret,
  });
};

const require_uploaded_files = async (req, res) => {
  const ret = await fileServices.require_uploaded_files({
    uploader_id: req.user.id,
  });
  return res.send({
    message: 'files get',
    data: ret,
  });
};

const update_file_title = async (req, res) => {
  const payload = {
    title: req.body.title,
  };

  const valRet = paramsValidator.validate(payload, ['title']);
  if (valRet.code !== 0) {
    return res.json(valRet);
  }

  if (utils.getFileExtension(req.file.filename) !== utils.getFileExtension(payload.title)) {
    payload.title = `${payload.title}.${utils.getFileExtension(req.file.filename)}`;
  }

  const ret = await fileServices.update_file_title({
    uploader_id: req.user.id,
    file_id: req.file.id,
    ...payload,
  });
  return res.send({
    message: 'file title updated',
    data: ret,
  });
};

const update_file_status = async (req, res) => {
  const payload = {
    etag: req.body.etag,
    mime: req.body.mime,
    size: req.body.size,
  };

  const valRet = paramsValidator.validate(payload, ['etag', 'mime', 'size']);
  if (valRet.code !== 0) {
    return res.json(valRet);
  }

  const ret = await fileServices.update_file_status({
    file_id: req.body.id,
    ...payload,
  });
  return res.send(ret);
};

const delete_file = async (req, res) => {
  const ret = await fileServices.delete_file({
    uploader_id: req.user.id,
    file_id: req.body.file_id,
  });

  return res.send({
    message: 'file removed',
    data: ret,
  });
};

const tenant_access_file = async (req, res) => {
  if (req.body && req.body.files) {
    const files = req.body.files;
    const filledFiles = files.map((file) => {
      return {
        ...file,
        ...qiniuBusiness.getAccessUrl(file.etag),
      };
    });
    return res.send({ files: filledFiles });
  }
  return res.status(400).send({ message: 'no files provided' });
};

export default {
  create_file,
  require_file,
  access_file,
  require_uploaded_files,
  update_file_title,
  update_file_status,
  delete_file,
  add_remote_file,
  tenant_access_file,
};
