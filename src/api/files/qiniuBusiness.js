import qiniu from 'qiniu';
import conf from '../../../config';

qiniu.conf.ACCESS_KEY = conf.qiniu.ak;
qiniu.conf.SECRET_KEY = conf.qiniu.sk;
const mac = new qiniu.auth.digest.Mac(conf.qiniu.ak, conf.qiniu.sk);
const config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, config);

// 7xt1pi.com1.z0.glb.clouddn.com
// 7xt1pi.com2.z0.glb.clouddn.com
// 7xt1pi.com2.z0.glb.qiniucdn.com

/**
 * this function should be called by qiniu;
 */

const requestUpload = () => {
  // first create the id
  // http://eslint.org/docs/rules/quotes
  let putPolicy;
  if (conf.qiniu.mode === 'callback') {
    putPolicy = new qiniu.rs.PutPolicy({
      scope: conf.qiniu.bucket,
      callbackUrl: `${conf.serviceBase}api/files/upload_callback/`,
      callbackBodyType: 'application/json',
      callbackBody: `{
      "size":$(fsize),
      "mime":$(mimeType),
      "key":$(key),
      "etag":$(etag),
      "id":$(x:id)
    }` });
  } else {
    putPolicy = new qiniu.rs.PutPolicy({
      scope: conf.qiniu.bucket,
      returnBody: `{
      "size":$(fsize),
      "mime":$(mimeType),
      "key":$(key),
      "etag":$(etag),
      "id":$(x:id),
      "success":true
    }` });
  }
  return {
    token: putPolicy.uploadToken(mac),
  };
};

const getAccessUrl = (file_id) => {
  // https://developer.qiniu.com/kodo/sdk/1289/nodejs#private-get
  const deadline = parseInt(Date.now() / 1000, 10) + 3600;
  const access_url = bucketManager.privateDownloadUrl(conf.qiniu.url, file_id, deadline);
  return { access_url };
};

const generateAccessToken = (requestURI, body) => {
  // https://github.com/qiniu/nodejs-sdk/blob/master/qiniu/util.js
  return qiniu.util.generateAccessToken(mac, requestURI, body);
};

const encodeEntry = () => {
  return qiniu.util.urlsafeBase64Encode(conf.qiniu.bucket);
};

const encodeFileUrl = (fileUrl) => {
  return qiniu.util.urlsafeBase64Encode(fileUrl);
};

export default {
  requestUpload,
  getAccessUrl,
  generateAccessToken,
  encodeEntry,
  encodeFileUrl,
};
