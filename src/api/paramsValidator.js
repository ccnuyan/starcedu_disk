const validationRules = {
  filename: {
    emptyCode: 101,
  },
  file_id: {
    emptyCode: 111,
  },
  title: {
    emptyCode: 121,
  },
  id: {
    emptyCode: 131,
  },
  etag: {
    emptyCode: 141,
  },
  mime: {
    emptyCode: 151,
  },
  size: {
    emptyCode: 161,
  },
  file_url: {
    emptyCode: 171,
  },
};

const validate = (payload, nonNullParamsArray) => {
  const ret = {
    code: 0,
    message: '',
  };

  Object.keys(payload).forEach((k) => {
    if (payload[k] && typeof payload[k] === 'string') {
      payload[k] = payload[k].trim(); // eslint-disable-line no-param-reassign
    }
    if (payload[k] && validationRules[k] && validationRules[k].beforeVal) {
      payload[k] = validationRules[k].beforeVal(payload[k]); // eslint-disable-line no-param-reassign
    }
  });

  nonNullParamsArray.every((k) => {
    if (!validationRules[k]) {
      console.log(`no validation rule for non-null parameter ${k} in \n)${JSON.stringify(payload, null, 2)}`); // eslint-disable-line
    } else if (!payload[k]) {
      ret.code = validationRules[k].emptyCode;
      ret.message = `${k} empty`;
      return false;
    }
    return true;
  });

  if (ret.code !== 0) {
    return ret;
  }

  Object.keys(payload).every((k) => {
    if (!validationRules[k]) {
      // console.log(`no validation rule for parameter ${k} in \n)${JSON.stringify(payload, null, 2)}`);
    } else if (!validationRules[k].regex) {
      // console.log(`no regex rule for parameter ${k}`);
    } else if (!validationRules[k].regex.test(payload[k])) {
      ret.code = validationRules[k].code;
      ret.message = `provided ${k} illigal`;
      return false;
    }
    return true;
  });

  return ret;
};

export default {
  validate,
  validationRules,
};
