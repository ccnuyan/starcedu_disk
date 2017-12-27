import postgres from 'pg';
import config from '../config';

export const pg = new postgres.Pool(config.pg);
console.log('database:'); // eslint-disable-line
console.log(config.pg); // eslint-disable-line
export default {
  query: async (text, params) => {
    return pg.query(text, params);
  },
  end: async () => {
    return pg.end();
  },
};
