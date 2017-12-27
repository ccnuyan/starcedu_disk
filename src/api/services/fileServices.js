import config from '../../../config';
import pgPool from '../../../database/connector';

const create_file = async ({ uploader_id, filename }) => {
  return pgPool.query(`select * from ${config.dbname}.create_file($1, $2)`, [uploader_id, filename]).then((res) => {
    return res.rows[0];
  });
};
const require_file = async ({ file_id }) => {
  return pgPool.query(`select * from ${config.dbname}.require_file($1)`, [file_id]).then((res) => {
    if (res.rowCount === 1) {
      const ret = res.rows[0];
      return ret;
    }
    return false;
  });
};
const require_uploaded_files = async ({ uploader_id }) => {
  return pgPool.query(`select * from ${config.dbname}.files where uploader_id = $1 and status=1`, [uploader_id]).then((res) => {
    return res.rows;
  });
};
const update_file_title = async ({ uploader_id, file_id, title }) => {
  return pgPool.query(`select * from ${config.dbname}.update_file_title($1, $2, $3)`, [uploader_id, file_id, title]).then((res) => {
    if (res.rowCount === 1) {
      const ret = res.rows[0];
      return ret;
    }
    return false;
  });
};
const update_file_status = async ({ file_id, etag, mime, size }) => {
  return pgPool.query(`select * from ${config.dbname}.update_file_status($1, $2, $3, $4)`, [file_id, etag, mime, size]).then((res) => {
    if (res.rowCount === 1) {
      const ret = res.rows[0];
      return ret;
    }
    return false;
  });
};
const delete_file = async ({ uploader_id, file_id }) => {
  return pgPool.query(`select * from ${config.dbname}.delete_file($1, $2)`, [uploader_id, file_id]).then((res) => {
    if (res.rowCount === 1) {
      const ret = res.rows[0];
      return ret;
    }
    return false;
  });
};

export default {
  create_file,
  require_file,
  require_uploaded_files,
  update_file_status,
  update_file_title,
  delete_file,
};
