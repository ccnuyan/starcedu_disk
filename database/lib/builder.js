import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import glob from 'glob';
import config from '../../config';
import pacakgeJson from '../../package.json';
import { pg } from '../connector';

const versionRoot = pacakgeJson.version.replace(/\./g, '-');
const sourceDir = path.join(__dirname, '../sql/', versionRoot);

const loadFiles = (dir) => {
  const globPattern = path.join(path.join(sourceDir, dir || ''), '**/*.sql');

  // use nosort to ensure that init.sql is loaded first
  const files = glob.sync(globPattern, {
    nosort: true,
  });
  // set search_path at first
  const result = [`set search_path = ${config.dbname};`];
  files.forEach((file) => {
    if (!_.endsWith(path.parse(file).name, '.dev')) {
      const sql = fs.readFileSync(file, {
        encoding: 'utf-8',
      });
      result.push(sql);
    }
  });
  result.push('select \'Schema initialized\' as result;');
  return result.join('\r\n');
};


const decideSqlFile = (dir) => {
  const buildDir = path.join(__dirname, '../build');
  const fileName = dir ? `${dir}-${versionRoot}.sql` : `${versionRoot}.sql`;
  return path.join(buildDir, fileName);
};

const readSql = (dir) => {
  const sqlBits = loadFiles(dir);
  // write it to file
  const sqlFile = decideSqlFile(dir);
  fs.writeFileSync(sqlFile, sqlBits);
  return sqlBits;
};

const install = () => {
  const sqlFile = decideSqlFile();
  const sql = fs.readFileSync(sqlFile, {
    encoding: 'utf-8',
  });
  return pg.query(sql).then((res) => {
    console.log(res.rows[0].result); // eslint-disable-line
    return process.exit(0);
  });
};

export default {
  readSql,
  install,
};

