export default {
  mode: 'test',
  title: 'starC教育 网盘-test',
  port: 18001,
  domain: 'www.syncollege.com',
  serviceBase: '/apps/disk',
  auth: {
    jwt: {
      secret: '12345678',
    },
    cookie: {
      name: 'authorization',
    },
  },
  dbname: 'starcedu_disk',
  pg: {
    user: process.env.DBUSER ? process.env.DBUSER : 'postgres',
    database: process.env.DBDATABASE ? process.env.DBDATABASE : 'postgres',
    password: process.env.DBPASSWORD ? process.env.DBPASSWORD : '',
    host: process.env.DBHOST ? process.env.DBHOST : 'database-test',
    port: process.env.DBPORT ? process.env.DBPORT : 5432,
    max: 2,
    idleTimeoutMillis: 30000,
  },
  qiniu_bucket: '7xt1pi.com1.z0.glb.clouddn.com',
  qiniu: {
    bucket: 'test',
    mode: 'direct',
    ak: 'JK2nEgwnvAoWh4e7hWyUX3Iuc6fs8-6vL5xNu-kq',
    sk: 'LRKdhh_0T4l_w6q1rbA2T-rNolTogMMjXihigG8x',
    callbackBase: 'http://www.syncollege.com/',
    url: 'http://7xt1pi.com1.z0.glb.clouddn.com',
  },
  resources: {
    stylesheets: {
      normalize: '//cdn.bootcss.com/normalize/6.0.0/normalize.min.css',
      semantic: '/static/semantic/semantic.min.css',
    },
    scripts: {
      jquery: '//cdn.bootcss.com/jquery/3.2.1/jquery.min.js',
      head: '//cdn.bootcss.com/headjs/1.0.3/head.min.js',
      html5shiv: '//cdn.bootcss.com/html5shiv/r29/html5.min.js',
      classlist: '//cdn.bootcss.com/classlist/2014.01.31/classList.min.js',
      semantic: '/static/semantic/semantic.min.js',
    },
  },
};
