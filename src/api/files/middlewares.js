import fileServices from '../services/fileServices';

const exist = async (req, res, next) => {
  const file_id = req.body.file_id || req.query.file_id;
  if (file_id) {
    const ret = await fileServices.require_file({
      file_id,
    }, req.context);
    if (!ret.id) {
      return res.send({
        code: 400,
        message: 'specific file not exist',
        data: ret,
      });
    }
    req.file = ret;
    next();
  } else {
    res.send({
      code: 111,
      message: 'file_id not provided',
    });
  }
};

export default { exist };
