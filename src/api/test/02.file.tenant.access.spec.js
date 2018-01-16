import './testHelpers';
import app from '../../../server';

describe('file tenant access business', function () { // eslint-disable-line
  this.timeout(10000);
  this.filename = 'filename';

  it('should return filled files for local tenant', () => {
    return chai.request(app)
      .post('/api/files/tenant/access')
      .set(serverConfig.auth.userHeader, `basic ${new Buffer(`${tenants.local_test_tenant.id}:${tenants.local_test_tenant.pass}`).toString('base64')}`)
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
      .set(serverConfig.auth.userHeader, `basic ${new Buffer(`${tenants.local_test_tenant.id}:'wrongpass'`).toString('base64')}`)
      .send({ files: [{ etag: '123' }, { etag: '456' }] })
      .catch((err) => {
        err.response.should.have.status(401);
      });
  });

  it('should not return when invalid tenant id provided', () => {
    return chai.request(app)
      .post('/api/files/tenant/access')
      .set(serverConfig.auth.userHeader, `basic ${new Buffer(`notvalidid:${tenants.local_test_tenant.pass}`).toString('base64')}`)
      .send({ files: [{ etag: '123' }, { etag: '456' }] })
      .catch((err) => {
        err.response.should.have.status(401);
      });
  });

  it('should return filled files for authorized 3rdparty tenant', () => {
    return chai.request(app)
      .post('/api/files/tenant/access')
      .set(serverConfig.auth.userHeader, `basic ${new Buffer(`${tenants.oauth_test_tenant1.id}:${tenants.oauth_test_tenant1.pass}`).toString('base64')}`)
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
      .set(serverConfig.auth.userHeader, `basic ${new Buffer(`${tenants.oauth_test_tenant2.id}:${tenants.oauth_test_tenant2.pass}`).toString('base64')}`)
      .send({ files: [{ etag: '123' }, { etag: '456' }] })
      .catch((err) => {
        err.response.should.have.status(401);
      });
  });
});
