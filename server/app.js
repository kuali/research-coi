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

  let server = app.listen(8090); 
  console.log("Listening on port 8090");

  process.on('uncaughtException', function(err) {
    console.error('Uncaught exception: ' + err);
    console.log('waiting for pending connections to clear');
    server.close(() => {
      console.log('shutting down');
      process.exit(1);
    });
  });
}

