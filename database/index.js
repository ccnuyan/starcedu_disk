import program from 'commander';

import '../config';
import builder from './lib/builder';
import developer from './lib/developer';
import '../globals';
/* eslint-disable no-console */

global.report();

program
  .command('dev')
  .description('Build the sql file for our project')
  .action(() => {
    console.log('installing now...');
    developer.install();
  });

program
  .command('build')
  .description('Build the sql file for our project')
  .action(() => {
    console.log('building now...');
    builder.readSql();
    console.log('sql script file created');
  });

program
  .command('functions-build')
  .description('Build the sql file for our project')
  .action(() => {
    console.log('building now...');
    builder.readSql('05-functions');
    console.log('sql script file created');
  });

program
  .command('install')
  .description('Install the SQL file for our project')
  .action(async () => {
    console.log('installing');
    await builder.install();
    console.log('done');
  });

program
  .command('functions-dev')
  .description('Build the functions for our project')
  .action(() => {
    console.log('installing now...');
    developer.install('05-functions');
  });


/* eslint-disable no-console */
program.parse(process.argv);
