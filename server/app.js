/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import healthReport from './controllers/healthReport';
import * as ConfigController from './controllers/ConfigController';
import * as DisclosureController from './controllers/DisclosureController';
import * as TravelLogController from './controllers/TravelLogController';
import * as ProjectController from './controllers/ProjectController';
import * as FileController from './controllers/FileController';
import * as PIController from './controllers/PIController';
import * as UserController from './controllers/UserController';
import * as AdditionalReviewerController from './controllers/AdditionalReviewerController';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authentication from './middleware/authentication';
import apiAuthentication from './middleware/apiAuthentication';
import renderView from './middleware/renderView';
import Log from './Log';
import methodChecker from './middleware/methodChecker';
import ErrorLogger from './middleware/ErrorLogger';
import {COIConstants} from '../COIConstants';
import {NOT_FOUND} from '../HTTPStatusCodes';
import adminRoleCheck from './middleware/adminRoleCheck';
import unauthorized from './middleware/unauthorized';
import scheduleExpirationCheck from './expirationCheck';

const DEFAULT_PORT = 8090;

function conditionallyLogRequests(app) {
  if (process.env.LOG_LEVEL <= COIConstants.LOG_LEVEL.INFO) {
    app.use((req, res, next) => {
      const startTime = new Date().getTime();
      res.on('finish', () => {
        const elapsedTime = new Date().getTime() - startTime;
        Log.info(`${req.originalUrl} - ${elapsedTime}ms`);
      });
      next();
    });
  }
}

function configureProxy(app) {
  const TRUST_PROXY = process.env.TRUST_PROXY;
  if (TRUST_PROXY) {
    Log.info(`Using TRUST_PROXY value of ${TRUST_PROXY}`);

    if (TRUST_PROXY.toLowerCase() === 'true') {
      app.set('trust proxy', true);
    }
    else if (TRUST_PROXY.toLowerCase() === 'false') {
      app.set('trust proxy', false);
    }
    else {
      app.set('trust proxy', TRUST_PROXY);
    }
  }
}

export function run() {
  const app = express();
  app.disable('x-powered-by');
  app.set('view engine', 'jade');
  app.set('views', './views');
  configureProxy(app);

  let config;
  try {
    const extensions = require('research-extensions').default;
    extensions.express(app);
    config = extensions.config;
  } catch (e) {
    Log.info('extensions not found');
  }

  conditionallyLogRequests(app);

  app.use('/coi', express.static('client'));
  app.use('/coi/build', (req, res) => { res.sendStatus(NOT_FOUND); }); // Static files that weren't found

  app.use(methodChecker);
  app.use(cookieParser());

  app.use('/coi/auth', renderView('auth'));
  app.get('/coi/health', healthReport);
  app.use('/api', apiAuthentication);
  app.use('/coi', authentication);
  app.use('/coi$', renderView('index'));
  app.use('/coi/$', renderView('index'));
  app.use('/coi/archiveview', renderView('index'));
  app.use('/coi/dashboard', renderView('index'));
  app.use('/coi/disclosure', renderView('index'));
  app.use('/coi/travelLog', renderView('index'));
  app.use('/coi/revise', renderView('index'));
  app.use('/coi/about', renderView('about'));

  app.use('/coi/admin', adminRoleCheck, renderView('admin/admin'));
  app.use('/coi/config', adminRoleCheck, renderView('admin/config'));
  app.use('/coi', unauthorized);

  app.use(bodyParser.json());
  ConfigController.init(app);
  DisclosureController.init(app);
  TravelLogController.init(app);
  ProjectController.init(app);
  FileController.init(app);
  PIController.init(app);
  UserController.init(app);
  AdditionalReviewerController.init(app);
  app.use(ErrorLogger);

  app.set('portNumber', config ? config.port : process.env.COI_PORT || DEFAULT_PORT);

  scheduleExpirationCheck();

  return app;
}
