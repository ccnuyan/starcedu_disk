// config for database test in remote server;

export default {
  mode: 'test',
  dbname: 'starcedu_auth',
  pg: {
    user: 'postgres',
    database: 'postgres',
    host: '202.114.40.175',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
  },
};
