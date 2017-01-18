#!/usr/bin/env node --harmony

const pkg = require('./package.json');
require('colors');

if (require.main === module) {
  //setup as command line utility
  require('./lib/index.js');
} else {
  // setup as Node module
  console.log(`${pkg.name} is a command line tool, not a module include.`);
  console.log('If you\'d like to programmatically integrate the Watson services' +
  ' into your app, use the Watson Node.js SDK https://github.com/watson-developer-cloud/node-sdk/');
}