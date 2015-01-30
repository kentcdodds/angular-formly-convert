let ngModuleName = 'formly';

let angular = require('angular-fix');
let ngModule = angular.module(ngModuleName, []);

require('./providers')(ngModule);
require('./services')(ngModule);
require('./directives')(ngModule);

module.exports = ngModuleName;
