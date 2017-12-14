const getHeaders = () => {
  const headers = new Headers();
  headers.append('content-type', 'application/json');
  headers.append('accept', 'application/json');
  return headers;
};

export default {
  getHeaders,
};
