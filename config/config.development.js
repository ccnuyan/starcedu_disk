export default {
  mode: 'development',
  domain: 'www.syncollege.com',
  port: 18000,
  serviceBase: '/apps/disk',
  qiniu_bucket: '7xt1pi.com1.z0.glb.clouddn.com',
  qiniu: {
    bucket: 'test',
    mode: 'direct',
    ak: 'JK2nEgwnvAoWh4e7hWyUX3Iuc6fs8-6vL5xNu-kq',
    sk: 'LRKdhh_0T4l_w6q1rbA2T-rNolTogMMjXihigG8x',
    callbackBase: 'http://www.syncollege.com/',
    url: 'http://7xt1pi.com1.z0.glb.clouddn.com/',
  },
  dbname: 'starcedu_disk',
  auth: {
    jwt: {
      secret: '12345678',
    },
    cookie: {
      name: 'authorization',
    },
  },
  pg: {
    user: 'postgres',
    database: 'postgres',
    host: 'localhost',
    port: process.env.DBPORT ? process.env.DBPORT : 5432,
    max: 10,
    idleTimeoutMillis: 30000,
  },
  resources: {
    common: {
      stylesheets: {
        normalize: '//cdn.bootcss.com/normalize/6.0.0/normalize.min.css',
        semantic: '/static/semantic/semantic.min.css',
        main: '/static/main.css',
      },
      scripts: {
        jquery: '//cdn.bootcss.com/jquery/3.2.1/jquery.min.js',
        head: '//cdn.bootcss.com/headjs/1.0.3/head.min.js',
        html5shiv: '//cdn.bootcss.com/html5shiv/r29/html5.min.js',
        classlist: '//cdn.bootcss.com/classlist/2014.01.31/classList.min.js',
        semantic: '/static/semantic/semantic.min.js',
      },
    },
    app: {
      stylesheets: {
      },
      scripts: {
      },
    },
    projector: {
      stylesheets: {
      },
      scripts: {
      },
    },
    viewer: {
      stylesheets: {
      },
      scripts: {
      },
    },
  },
  title: 'DEV MODE',
};
