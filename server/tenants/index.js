import fs from 'fs';
import path from 'path';

const tenants = JSON.parse(fs.readFileSync(process.env.TENANTS_CONFIG || path.join(__dirname, './tenants.json'), 'utf-8'));

Object.keys(tenants).forEach((t) => {
  tenants[t].id = t;
});

global.tenants = tenants;
