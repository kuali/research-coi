'use strict';
require('babel/register');
const koa  = require('koa');
const koaStatic = require('koa-static');
let app = koa();
let router = new require('koa-router')();
require('./controllers/financialEntity').init(router);

app.use(koaStatic('./client'));
app.use(router.routes());

app.listen(8090);	
console.log("Listening on port 8090");