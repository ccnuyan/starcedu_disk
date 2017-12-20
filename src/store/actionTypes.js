const types = {
};

export const syncTypes = [
  'USER_LOGOUT',
  'SET_PRISTINE',
];
export const asyncTypes = [
  'USER_TOKEN_AUTHENTICATE',
  'USER_LOCAL_AUTHENTICATE',
  'USER_BIND_AUTHENTICATE',
  'USER_USERNAME_CHECK',
  'USER_GET_STUDENT_INFO',
  'USER_COLLEGE_STUDENT_CHECK',
  'USER_REGISTER',
  'USER_GET_OAUTH_INFO',


  'WORKS_GET_POPULAR',
  'WORKS_GET_CREATED',
  'WORKS_GET_LATEST',
  'WORKS_CREATE',
  'WORKS_UPDATE',
  'WORKS_DELETE',

  'FILES_GET_UPLOADED',

  'FILES_UPLOAD_GET_TOKEN',
  'FILES_UPLOAD_PROGRESS',
  'FILES_UPLOAD',
  'FILES_UPDATE',
  'FILES_DELETE',
];

syncTypes.forEach((tp) => {
  types[tp] = tp;
});

asyncTypes.forEach((tp) => {
  types[`${tp}_START`] = `${tp}_START`;
  types[`${tp}_END`] = `${tp}_END`;
  types[`${tp}_ERROR`] = `${tp}_START`;
});

Object.keys(types).forEach((key) => {
  types[key] = key;
});

export default types;
