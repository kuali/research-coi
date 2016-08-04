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
/* eslint-disable no-console */
import {LOG_LEVEL} from '../coi-constants';

let logLevel;
let reportError;
try {
  const extensions = require('research-extensions').default;
  reportError = extensions.reportError;
  logLevel = extensions.config.logLevel;
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    console.error(e);
  }

  logLevel = process.env.LOG_LEVEL;
}

class Log {
  info(message, req) {
    if (logLevel <= LOG_LEVEL.INFO) {
      console.info(this.create(message, 'INFO', req));
    }
  }

  warn(message, req) {
    if (logLevel <= LOG_LEVEL.WARN) {
      console.warn(this.create(message, 'WARN', req));
    }
  }

  error(message, req) {
    let toLog = this.create(message, 'ERROR', req);
    console.error(toLog);
    if (reportError !== undefined) {
      if (message.stack !== undefined) {
        toLog += `\n${message.stack}`;
      }
      reportError(toLog);
    }
  }

  create(message, type, req) {
    const date = new Date().toISOString();
    return `${date} ${type} ${this.getRequestInfo(req)} ${message}`;
  }

  getRequestInfo(req) {
    if (req) {
      return `host=${req.hostname}, path=${req.url}, method=${req.method}, userName=${req.userInfo ? req.userInfo.username : ''} - `;
    }
    return '';
  }
}

export default new Log();
