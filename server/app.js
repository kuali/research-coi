import * as ConfigController from './controllers/ConfigController';
import * as DisclosureController from './controllers/DisclosureController';
import * as TravelLogController from './controllers/TravelLogController';
import * as ProjectController from './controllers/ProjectController';
import * as FileController from './controllers/FileController';
import * as PIController from './controllers/PIController';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authentication from './middleware/authentication';
import apiAuthentication from './middleware/apiAuthentication';
import viewRenderer from './middleware/viewRenderer';

export function run() {
  let app = express();
  app.disable('x-powered-by');
  let config;
  try {
    let extensions = require('research-extensions');
    extensions.express(app);
    config = extensions.config;
  } catch (e) {
    console.log('extensions not found');
  }

  app.use('/coi', express.static('client'));
  app.use(cookieParser());
  app.use('/api', apiAuthentication);
  app.use('/coi', authentication);
  app.use('/coi', viewRenderer);
  app.use('/coi/', viewRenderer);
  app.use(bodyParser.json());
  ConfigController.init(app);
  DisclosureController.init(app);
  TravelLogController.init(app);
  ProjectController.init(app);
  FileController.init(app);

  PIController.init(app);

  let portNumber = config ? config.port : 8090;
  let server = app.listen(portNumber);
  console.log('Listening on port ' + portNumber);

  process.on('uncaughtException', function(err) {
    console.error('Uncaught exception: ' + err);
    console.log('waiting for pending connections to clear');
    server.close(() => {
      console.log('shutting down');
      process.exit(1); //eslint-disable-line no-process-exit
    });
  });
}

