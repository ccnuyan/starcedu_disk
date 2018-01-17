const types = {
};

export const syncTypes = [
  'FILES_SET_CL_MODE',
  'FILES_SET_CL_INPUT_TITLE',
  'FILES_SET_FILTER_ALL',
  'FILES_SET_FILTER_ONE',
];
export const asyncTypes = [
  'FILES_GET_UPLOADED',
  'FILES_UPLOAD_GET_TOKEN',
  'FILES_UPLOAD_PROGRESS',
  'FILES_UPLOAD',
  'FILES_UPDATE',
  'FILES_REMOVE',
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
