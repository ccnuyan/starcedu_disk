import postgres from 'pg';
import chalk from 'chalk';

export const pg = new postgres.Pool(serverConfig.pg);

console.log(chalk.yellow(`DATABASE -> ${serverConfig.pg.host}:${serverConfig.pg.port}/${serverConfig.pg.database}`));
export default {
  query: async (text, params) => {
    return pg.query(text, params);
  },
  end: async () => {
    return pg.end();
  },
};
