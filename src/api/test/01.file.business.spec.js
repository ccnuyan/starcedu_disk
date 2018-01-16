import jwt from 'jsonwebtoken';

import './testHelpers';
import pgPool from '../../../database/connector';
import app from '../../../server';

const callbackbody = {
  etag: 'abcdefg',
  mime: 'text/html',
  size: 123,
};

describe('file business', function () { // eslint-disable-line
  this.timeout(10000);
  this.filename = 'filename';
  before(async () => {
    await pgPool.query('delete from starcedu_disk.files');

    this.user = {
      id: '1234567890',
      username: 'test@user.com',
    };
    this.user.token = jwt.sign({
      ...this.user,
      to: 'local_test_tenant',
    },
      serverConfig.auth.jwt.secret,
      {
        expiresIn: serverConfig.auth.jwt.expiresIn,
        issuer: 'local',
      });
  });

  it('should return empty list at beginning', () => {
    return chai.request(app)
      .get('/api/tenant/files/uploaded')
      .set(serverConfig.auth.userHeader, `bearer ${this.user.token}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.message.should.equal('files get');
        res.body.data.should.be.an('array').have.length(0);
        return res;
      });
  });

  it('can not create file if no filename provided', () => {
    return chai.request(app)
      .post('/api/tenant/files')
      .set(serverConfig.auth.userHeader, `bearer ${this.user.token}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        return res;
      });
  });

  it('can create file', () => {
    return chai.request(app)
      .post('/api/tenant/files')
      .set(serverConfig.auth.userHeader, `bearer ${this.user.token}`)
      .send({ filename: this.filename })
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.filename.should.equal(this.filename);
        res.body.data.token.should.exist;

        this.fileUploaded = res.body.data;
        return res;
      });
  });

  it('should return empty list because the file has not been uploaded', () => {
    return chai.request(app)
      .get('/api/tenant/files/uploaded')
      .set(serverConfig.auth.userHeader, `bearer ${this.user.token}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.message.should.equal('files get');
        res.body.data.should.be.an('array').have.length(0);
        return res;
      });
  });

  it('should return the updated file after callback', () => {
    return chai.request(app)
      .post('/api/files/upload_callback')
      .send({
        id: this.fileUploaded.id,
        ...callbackbody,
      })
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.filename.should.equals(this.filename);
        return res;
      });
  });

  it('should not return empty list because the file has not been uploaded', () => {
    return chai.request(app)
      .get('/api/tenant/files/uploaded')
      .set(serverConfig.auth.userHeader, `bearer ${this.user.token}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.message.should.equal('files get');
        res.body.data.should.be.an('array').have.length(1);
        return res;
      });
  });

  it('should return the updated file when try to get file again', () => {
    return chai.request(app)
      .get(`/api/tenant/files?file_id=${this.fileUploaded.id}`)
      .set(serverConfig.auth.userHeader, `bearer ${this.user.token}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        return res;
      });
  });

  it('should be ok when request to create a remote file', () => {
    return chai.request(app)
      .post('/api/tenant/files/remote')
      .set(serverConfig.auth.userHeader, `bearer ${this.user.token}`)
      .send({
        filename: 'ccnu.jpg',
        file_url: 'http://www.ccnu.edu.cn/__local/9/BE/1E/227D99AC5071495B37D18A7A181_99628090_1363C.jpg',
      })
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');

        return res;
      });
  });
});
