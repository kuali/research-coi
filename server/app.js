/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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

import healthReport from './controllers/health-report';
import * as ConfigController from './controllers/config-controller';
import * as DisclosureController from './controllers/disclosure-controller';
import * as TravelLogController from './controllers/travel-log-controller';
import * as ProjectController from './controllers/project-controller';
import * as FileController from './controllers/file-controller';
import * as PIController from './controllers/pi-controller';
import * as UserController from './controllers/user-controller';
import * as AdditionalReviewerController from './controllers/additional-reviewer-controller';
import * as FeaturesController from './controllers/features-controller';
import * as NotificationsController from './controllers/notifications-controller';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authentication from './middleware/authentication';
import apiAuthentication from './middleware/api-authentication';
import renderView from './middleware/render-view';
import {noCache} from './middleware/cache';
import Log from './log';
import methodChecker from './middleware/method-checker';
import ErrorLogger from './middleware/error-logger';
import { LOG_LEVEL } from '../coi-constants';
import { NOT_FOUND } from '../http-status-codes';
import { configCheck, adminCheck } from './middleware/role-check';
import unauthorized from './middleware/unauthorized';
import scheduleExpirationCheck from './expiration-check';
import impersonationLogger from './middleware/impersonation-logger';
import flags from '../feature-flags.json'; // eslint-disable-line
import initFeatureFlags from './feature-flags';

const DEFAULT_PORT = 8090;

initFeatureFlags(flags);

function conditionallyLogRequests(app, logLevel) {
  if (logLevel <= LOG_LEVEL.INFO) {
    app.use((req, res, next) => {
      const startTime = new Date().getTime();
      Log.info('request received', req);
      res.on('finish', () => {
        const elapsedTime = new Date().getTime() - startTime;
        Log.info(`request finished - ${elapsedTime}ms`, req);
      });
      res.on('close', () => {
        const elapsedTime = new Date().getTime() - startTime;
        Log.info(`request closed - ${elapsedTime}ms`, req);
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
  app.set('view engine', 'pug');
  app.set('views', './views');
  configureProxy(app);

  let config;
  let logLevel;
  try {
    const extensions = require('research-extensions').default;
    extensions.express(app);
    config = extensions.config;
    logLevel = config.logLevel;
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      Log.error(e);
    }
    else {
      logLevel = process.env.LOG_LEVEL;
      Log.info('extensions not found');
    }
  }

  console.log(`Log level: ${logLevel}`); // eslint-disable-line no-console

  conditionallyLogRequests(app, logLevel);

  app.use('/coi', express.static('client'));
  app.use('/coi/build', (req, res) => { res.sendStatus(NOT_FOUND); }); // Static files that weren't found
  app.use('/api', noCache);
  app.use(methodChecker);
  app.use(cookieParser());
  app.use('/coi/auth', renderView('auth'));
  app.use('/api/v1/coi/health', healthReport);
  app.use('/coi/health', healthReport);
  app.use('/api', apiAuthentication);
  app.use('/coi', authentication);
  app.use('/coi$', renderView('index'));
  app.use('/coi/$', renderView('index'));
  app.use('/coi/readonly', renderView('index'));
  app.use('/coi/archiveview', renderView('index'));
  app.use('/coi/dashboard', renderView('index'));
  app.use('/coi/disclosure', renderView('index'));
  app.use('/coi/travelLog', renderView('index'));
  app.use('/coi/revise', renderView('index'));
  app.use('/coi/about', renderView('about'));

  app.use('/coi/admin', adminCheck, renderView('admin/admin'));
  app.use('/coi/config', configCheck, renderView('admin/config'));
  app.use('/coi/features', configCheck, renderView('admin/features'));
  app.use('/coi/notifications', configCheck, renderView('admin/notifications'));
  app.use('/coi', unauthorized);

  app.use(bodyParser.json());
  app.use(impersonationLogger);
  ConfigController.init(app);
  DisclosureController.init(app);
  TravelLogController.init(app);
  ProjectController.init(app);
  FileController.init(app);
  PIController.init(app);
  UserController.init(app);
  AdditionalReviewerController.init(app);
  FeaturesController.init(app);
  NotificationsController.init(app);
  app.use(ErrorLogger);

  app.set('portNumber', config ? config.port : process.env.COI_PORT || DEFAULT_PORT);

  scheduleExpirationCheck();

  return app;
}
