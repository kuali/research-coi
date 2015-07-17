import * as ConfigController from './controllers/ConfigController';
import * as DisclosureController from './controllers/DisclosureController';
import SchoolParser from './middleware/SchoolParser';
import express from 'express';
import bodyParser from 'body-parser';

export function run() {
  let app = express();
  app.use(express.static('client'));
  app.use(SchoolParser);
  app.use(bodyParser.json());
  ConfigController.init(app);
  DisclosureController.init(app);

  app.listen(8090); 
  console.log("Listening on port 8090");
}