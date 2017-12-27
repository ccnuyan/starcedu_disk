import chai from 'chai';
import pgPool from '../connector';

chai.should();

// http://chaijs.com/api/bdd/

after(() => {
  pgPool.end();
});
