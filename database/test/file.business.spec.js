import { expect } from 'chai';
import './testHelpers';
import pgPool from '../connector';

const userid = '12345678';

const file = {
  filename: 'file.txt',
};

describe('database file crud bussiness', function () { // eslint-disable-line
  describe('create a new file', () => {
    before(async () => {
      return pgPool.query('select * from starcedu_disk.create_file($1, $2)', [
        userid,
        file.filename,
      ]).then((res) => {
        this.fileInfo = res.rows[0];
        return res;
      });
    });
    it('successfully', () => {
      this.fileInfo.success.should.be.true;
      this.fileInfo.filename.should.equals(file.filename);
    });
  });

  describe('require created file', () => {
    before(async () => {
      return pgPool.query('select * from starcedu_disk.require_file($1)', [this.fileInfo.id])
        .then((res) => {
          this.requiredFileInfo = res.rows[0];
          return res;
        });
    });
    it('successfully', () => {
      this.requiredFileInfo.success.should.be.true;
      this.fileInfo.id.should.equals(this.requiredFileInfo.id);
      this.fileInfo.filename.should.equals(this.requiredFileInfo.filename);
    });
  });

  describe('update created file title', () => {
    before(async () => {
      return pgPool.query('select * from starcedu_disk.update_file_title($1, $2, $3)', [
        userid,
        this.fileInfo.id,
        `${file.filename}new`,
      ]).then((res) => {
        this.updatedFileInfo = res.rows[0];
        return res;
      });
    });
    it('successfully', () => {
      this.updatedFileInfo.success.should.be.true;
      this.updatedFileInfo.id.should.equals(this.requiredFileInfo.id);
      this.updatedFileInfo.filename.should.equals(this.requiredFileInfo.filename);
    });
  });

  describe('update created file status', () => {
    this.fileCallbackPayload = {
      etag: 'abc',
      mime: 'application/json',
      size: 123,
    };
    before(async () => {
      return pgPool.query('select * from starcedu_disk.update_file_status($1, $2, $3, $4)', [
        this.fileInfo.id,
        this.fileCallbackPayload.etag,
        this.fileCallbackPayload.mime,
        this.fileCallbackPayload.size,
      ]).then((res) => {
        this.statusUpdatedFileInfo = res.rows[0];
        return res;
      });
    });
    it('successfully', () => {
      this.statusUpdatedFileInfo.success.should.be.true;
      this.statusUpdatedFileInfo.id.should.equals(this.fileInfo.id);
    });
  });

  describe('delete created file', () => {
    before(async () => {
      return pgPool.query('select * from starcedu_disk.delete_file($1, $2)', [
        userid,
        this.fileInfo.id,
      ]).then((res) => {
        this.deleteFileInfo = res.rows[0];
        return res;
      });
    });
    it('successfully', () => {
      this.statusUpdatedFileInfo.success.should.be.true;
      this.statusUpdatedFileInfo.id.should.equals(this.fileInfo.id);
    });
  });

  describe('created file can not be required now', () => {
    before(async () => {
      return pgPool.query('select * from starcedu_disk.require_file($1)', [this.fileInfo.id]).then((res) => {
        this.requiredAgainFileInfo = res.rows[0];
        return res;
      });
    });
    it('successfully', () => {
      expect(this.requiredAgainFileInfo.success).to.be.false;
    });
  });
});
