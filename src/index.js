import api from '../src/api/';
import web from '../src/web/';

export default (app) => {
  api(app);
  web(app);
};

