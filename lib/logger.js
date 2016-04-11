/*
* This is the logger file that places log. under the global scope. We will be able to add centralized logging here.
* */
var log4js = require('log4js');

log4js.configure({
  appenders: [{
    type: 'console'
  }]
});

global['log'] = log4js.getLogger('console');