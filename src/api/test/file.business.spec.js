import fetch from 'cross-fetch';

import './testHelpers';
import pgPool from '../../../database/connector';
import app from '../../../server';
import config from '../../../config';

const callbackbody = {
  etag: 'abcdefg',
  mime: 'text/html',
  size: 123,
};

describe('FILE BUSINESS', function () { // eslint-disable-line
  this.timeout(10000);
  this.filename = 'filename';
  before(async () => {
    await pgPool.query('delete from starcedu_disk.files');
    await pgPool.query('delete from starcedu_auth.users');
    await pgPool.query('select * from starcedu_auth.register($1, $2)', ['user@test.com', '123456']);
    return fetch(`http://${config.domain}/api/user/signin`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        authorization: new Buffer(`${tenants.local_test_tanant.id}:${tenants.local_test_tanant.pass}`),
      },
      body: JSON.stringify({
        username: 'user@test.com',
        password: '123456',
      }),
    })
    .then(res => res.json())
    .then((ret) => {
      return this.registerResponse = ret;
    });
  });

  it('should get a valid token', () => {
    this.registerResponse.code.should.equal(0);
    this.registerResponse.data.token.should.not.be.null;
    this.user = this.registerResponse.data;
  });

  it('should return empty list at beginning', () => {
    return chai.request(app)
      .get('/api/files/uploaded')
      .set('authorization', `bearer ${this.user.token}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.code.should.equal(0);
        res.body.message.should.equal('files get');
        res.body.data.should.be.an('array').have.length(0);
        return res;
      });
  });

  it('should not create file if no filename provided', () => {
    return chai.request(app)
      .post('/api/files')
      .set('authorization', `bearer ${this.user.token}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.code.should.equal(101);
        return res;
      });
  });

  it('should return the created file with token when created a file', () => {
    return chai.request(app)
      .post('/api/files')
      .set('authorization', `bearer ${this.user.token}`)
      .send({ filename: this.filename })
      .then((res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.code.should.equal(201);
        res.body.data.filename.should.equal(this.filename);
        res.body.data.token.should.exist;
        this.fileUploaded = res.body.data;
        return res;
      });
  });

  it('should return empty list because of the file has not been uploaded', () => {
    return chai.request(app)
      .get('/api/files/uploaded')
      .set('authorization', `bearer ${this.user.token}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.code.should.equal(0);
        res.body.message.should.equal('files get');
        res.body.data.should.be.an('array').have.length(0);
        return res;
      });
  });

  it('should return the updated file', () => {
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

  it('should return the updated file when try to get file again', () => {
    return chai.request(app)
      .get(`/api/files?file_id=${this.fileUploaded.id}`)
      .set('authorization', `bearer ${this.user.token}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        return res;
      });
  });

  it('should be ok when request to create a remote file', () => {
    return chai.request(app)
      .post('/api/files/remote')
      .set('authorization', `bearer ${this.user.token}`)
      .send({
        filename: 'baidu.jpg',
        file_url: 'http://www.ccnu.edu.cn/__local/9/BE/1E/227D99AC5071495B37D18A7A181_99628090_1363C.jpg',
      })
      .then((res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        return res;
      });
  });

  it('should return filled files for local tenant', () => {
    return chai.request(app)
      .post('/api/files/tenant/access')
      .set('authorization', `basic ${new Buffer(`${tenants.local_test_tanant.id}:${tenants.local_test_tanant.pass}`).toString('base64')}`)
      .send({ files: [{ etag: '123' }, { etag: '456' }] })
      .then((res) => {
        res.should.have.status(200);
        res.body.files.should.be.a('array');
        res.body.files.should.have.length(2);
        res.body.files[0].should.be.a('object');
        res.body.files[0].should.have.property('access_url');
        return res;
      });
  });

  it('should not return when invalid tenant pass provided', () => {
    return chai.request(app)
      .post('/api/files/tenant/access')
      .set('authorization', `basic ${new Buffer(`${tenants.local_test_tanant.id}:'wrongpass'`).toString('base64')}`)
      .send({ files: [{ etag: '123' }, { etag: '456' }] })
      .catch((err) => {
        err.response.should.have.status(401);
      });
  });

  it('should not return when invalid tenant id provided', () => {
    return chai.request(app)
      .post('/api/files/tenant/access')
      .set('authorization', `basic ${new Buffer(`notvalidid:${tenants.local_test_tanant.pass}`).toString('base64')}`)
      .send({ files: [{ etag: '123' }, { etag: '456' }] })
      .catch((err) => {
        err.response.should.have.status(401);
      });
  });

  it('should return filled files for authorized 3rdparty tenant', () => {
    return chai.request(app)
      .post('/api/files/tenant/access')
      .set('authorization', `basic ${new Buffer(`${tenants.test_3rdparty_tenant1.id}:${tenants.test_3rdparty_tenant1.pass}`).toString('base64')}`)
      .send({ files: [{ etag: '123' }, { etag: '456' }] })
      .then((res) => {
        res.should.have.status(200);
        res.body.files.should.be.a('array');
        res.body.files.should.have.length(2);
        res.body.files[0].should.be.a('object');
        res.body.files[0].should.have.property('access_url');
        return res;
      });
  });

  it('should not return filled files for unauthorized 3rdparty tenant', () => {
    return chai.request(app)
      .post('/api/files/tenant/access')
      .set('authorization', `basic ${new Buffer(`${tenants.test_3rdparty_tenant2.id}:${tenants.test_3rdparty_tenant2.pass}`).toString('base64')}`)
      .send({ files: [{ etag: '123' }, { etag: '456' }] })
      .catch((err) => {
        err.response.should.have.status(403);
      });
  });
});
