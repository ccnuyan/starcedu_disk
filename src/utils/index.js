const getHeaders = () => {
  const headers = new Headers();
  headers.append('content-type', 'application/json');
  headers.append('accept', 'application/json');
  return headers;
};

const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2); // eslint-disable-line
};

const escapeFileName = (filename) => {
  return filename.replace(/[:,/,>,<,",\\,|,?,*"]/g, '_');
};

export default {
  getHeaders,
  getFileExtension,
  escapeFileName,
};
