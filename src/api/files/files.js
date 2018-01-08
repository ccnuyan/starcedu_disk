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

  return res.status(201).send({
    code: 201,
    message: 'token created',
    data: {
      ...ret,
      ...qiniuBusiness.requestUpload(),
    },
  });
};

const create_online_file = (req, res) => {
  // https://developer.qiniu.com/kodo/api/1263/fetch
  const payload = {
    filename: req.body.filename,
    file_url: req.body.file_url,
  };

  // const valRet = paramsValidator.validate(payload, ['filename']);
  // if (valRet.code !== 0) {
  //   return res.json(valRet);
  // }

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
    .then((ret) => {
      return res.status(201).send({
        code: 201,
        message: 'file created',
        data: ret,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        code: 400,
        message: 'file created',
        data: err,
      });
    });
};

const access_file = async (req, res) => {
  const payload = { file_id: req.file.id };
  const ret = await fileServices.require_file(payload);

  if (req.user.id !== ret.uploader_id) {
    return req.status(401).send({
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
  const payload = { file_id: req.file.id };
  const ret = await fileServices.require_file(payload);

  if (req.user.id !== ret.uploader_id) {
    return req.status(401).send({
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
  });
  return res.send({
    code: 0,
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
    code: 0,
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
  create_online_file,
};
