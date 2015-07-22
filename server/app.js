import * as ConfigController from './controllers/ConfigController';
import * as DisclosureController from './controllers/DisclosureController';
import express from 'express';
import bodyParser from 'body-parser';

export function run() {
  let app = express();
  app.disable('x-powered-by');
  try {
    let extensions = require('research-extensions');
    extensions.express(app);
  } catch (e) {}
  app.use(express.static('client'));
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

