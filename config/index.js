// import chalk from 'chalk';
import lodash from 'lodash';
import development from './config.development';
import production from './config.production';
import test from './config.test';

let configVar = {};
if (process.env.NODE_ENV === 'production') {
  configVar = production;
  configVar.env = 'production';
} else if (process.env.NODE_ENV === 'test') {
  configVar = test;
  configVar.env = 'test';
} else {
  configVar = development;
  configVar.env = 'development';
}
const config = configVar;
global.serverConfig = config;
global._ = lodash;

export default config;
