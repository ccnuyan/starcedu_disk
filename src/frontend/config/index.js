// import chalk from 'chalk';

import development from './config.development';
import production from './config.production';

let configVar = {};
if (process.env.NODE_ENV === 'production') {
  configVar = production;
  configVar.env = 'production';
// } else if (process.env.NODE_ENV === 'test') {
//   configVar = test;
//   configVar.env = 'test';
} else {
  configVar = development;
  configVar.env = 'development';
}
const config = configVar;
export default config;

// export default {
//   qiniu_bucket: '7xt1pi.com1.z0.glb.clouddn.com',
//   serviceBase: '/apps/disk',
// };
