import jwt from 'jsonwebtoken';
import _ from 'lodash';
import config from '../../config';

export const sign = (issuer, payload) => {
  const user = _.pick(payload, [' id', 'username', 'gender', 'nickname']);
  return jwt.sign(
    user,
    config.auth.jwt.secret,
    {
      expiresIn: config.auth.jwt.expiresIn,
      issuer,
    },
  );
};

export const verify = (token) => {
  return jwt.verify(token, config.auth.jwt.secret);
};

