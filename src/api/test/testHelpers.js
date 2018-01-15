import chai from 'chai';
import chaiHttp from 'chai-http';

import '../../../config';

import pgPool from '../../../database/connector';
import app from '../../../server';

global.should = chai.should();
global.chai = chai;
global.expect = chai.expect;
chai.use(chaiHttp);

after((done) => {
  pgPool.end();
  app.close(done);
});
