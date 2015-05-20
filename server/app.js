import koa from 'koa';
import koaStatic from 'koa-static';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import * as ConfigController from './controllers/config';
import * as DisclosureController from './controllers/disclosure';
import SchoolParser from './middleware/SchoolParser';

export function run() {
	let router = new Router();
	let app = koa();
	app.use(koaStatic('./client'));
  app.use(SchoolParser);
	app.use(bodyParser());
	app.use(router.routes());

  ConfigController.init(router);
  DisclosureController.init(router);

	app.listen(8090);	
	console.log("Listening on port 8090");
}