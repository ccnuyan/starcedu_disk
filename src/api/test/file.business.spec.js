import './testHelpers';
import pgPool from '../../../database/connector';
import app from '../../../server';

const usertoken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI2MTMxMzgwMjMyNTE5ODQxOCIsInVzZXJuYW1lIjoidXNlckB0ZXN0LmNvbSIsImdlbmRlciI6bnVsbCwibmlja25hbWUiOm51bGwsImlhdCI6MTUxNDM1MTAzMiwiZXhwIjoxNTE1NTYwNjMyLCJpc3MiOiJ0b2tlbiJ9.SImSmIZTmufHS-LHquAHo635Fwh7fLkrkYzkA7LGe34`; // eslint-disable-line

const callbackbody = {
  etag: 'abcdefg',
  mime: 'text/html',
  size: 123,
};

describe('FILE BUSINESS', function () {
  this.filename = 'filename';
  before(() => {
    return pgPool.query('delete from starcedu_disk.files'); // eslint-disable-line
  });

  it('returns empty list at beginning', () => {
    return chai.request(app)
      .get('/api/files/uploaded')
      .set('authorization', `bearer ${usertoken}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.code.should.equal(0);
        res.body.message.should.equal('files get');
        res.body.data.should.be.an('array').have.length(0);
        return res;
      });
  });

  it('could not create file if no filename provided', () => {
    return chai.request(app)
      .post('/api/files')
      .set('authorization', `bearer ${usertoken}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.code.should.equal(101);
        return res;
      });
  });

  it('returns the created file with token when created a file', () => {
    return chai.request(app)
      .post('/api/files')
      .set('authorization', `bearer ${usertoken}`)
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

  it('returns empty list because of the file has not been uploaded', () => {
    return chai.request(app)
      .get('/api/files/uploaded')
      .set('authorization', `bearer ${usertoken}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.code.should.equal(0);
        res.body.message.should.equal('files get');
        res.body.data.should.be.an('array').have.length(0);
        return res;
      });
  });

  it('returns the updated file', () => {
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

  it('returns the updated file when try to get file again', () => {
    return chai.request(app)
      .get(`/api/files?file_id=${this.fileUploaded.id}`)
      .set('authorization', `bearer ${usertoken}`)
      .then((res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        return res;
      });
  });
});
