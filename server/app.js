import * as ConfigController from './controllers/ConfigController';
import * as DisclosureController from './controllers/DisclosureController';

let express = require('express');
try {
  let extensions = require('research-extensions');
  express = extensions.Express(express);
} catch (e) {console.log(e);}
import bodyParser from 'body-parser';

export function run() {
  let app = express();
  app.disable('x-powered-by');
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

