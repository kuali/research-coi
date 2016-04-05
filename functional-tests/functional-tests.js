require('babel-register');
require("babel-polyfill");
process.env.NODE_ENV='test';
var test = require('./test.js')
module.exports = test;