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

import {noop, defaultTo} from 'lodash';
import {LOG_LEVEL} from '../coi-constants';
import debug from 'debug';

debug.formatArgs = function(...originalArgs) {
  const args = Array.from(originalArgs);

  if (this.useColors) {
    const c = this.color;

    args[0] = `${new Date().toISOString()} \u001b[3${c};1m${this.namespace} \u001b[0m${args[0]}`;
  } else {
    args[0] = `${new Date().toISOString()} ${this.namespace} ${args[0]}`;
  }
  return args;
};

let logLevel;
let reportError;
try {
  const extensions = require('research-extensions').default;
  reportError = extensions.reportError;
  logLevel = extensions.config.logLevel;
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    console.error(e); // eslint-disable-line no-console
  }

  logLevel = process.env.LOG_LEVEL;
}

export function logError(message, req, loggerName) {
  let toLog = `${new Date().toISOString()} ${defaultTo(loggerName, '')} ${create(message, 'ERROR', req)}`;
  console.error(toLog); // eslint-disable-line no-console
  if (reportError !== undefined) {
    if (message.stack !== undefined) {
      toLog += `\n${message.stack}`;
    }
    reportError(toLog);
  }
}

function create(message, type, req) {
  return `${type} ${getRequestInfo(req)} ${message}`;
}

function getRequestInfo(req) {
  if (req) {
    return `host=${req.hostname}, path=${req.url}, method=${req.method}, userName=${req.userInfo ? req.userInfo.username : ''} - `;
  }
  return '';
}

export function createLogger(loggerName) {
  const logger = debug(`coi:${loggerName}`);
  const log = {
    logger,
    logVariable: noop,
    logValue: noop,
    logArguments: noop,
    verbose: noop,
    info: noop,
    warn: noop,
    error: (msg, req) => {
      logError(msg, req, loggerName);
    }
  };

  if (logLevel <= LOG_LEVEL.VERBOSE) {
    log.verbose = (msg, req) => {
      logger(create(msg, 'VERBOSE', req));
    };

    log.logVariable = names => {
      for (const name in names) {
        logger(`\t${name} = ${JSON.stringify(names[name])}`);
      }
    };

    log.logValue = (name, value) => {
      logger(`\t${name} = ${JSON.stringify(value)}`);
    };

    log.logArguments = (functionName, parameters) => {
      logger(`${functionName}`);
      logger('ARGUMENTS:');
      for (const param in parameters) {
        logger(`\t${param} =`);
        logger(`\t\t${JSON.stringify(parameters[param])}`);
      }
    };
  }

  if (logLevel <= LOG_LEVEL.INFO) {
    log.info = (msg, req) => {
      logger(create(msg, 'INFO', req));
    };
  }

  if (logLevel <= LOG_LEVEL.WARN) {
    log.warn = (msg, req) => {
      logger(create(msg, 'WARN', req));
    };
  }

  return log;
}

function createContext(moduleName, functionName) {
  const log = createLogger(`${moduleName}:${functionName}`);
  const context = {log};

  if (logLevel <= LOG_LEVEL.VERBOSE) {
    context.log.logArguments = (parameters) => {
      context.log.logger('ARGUMENTS:');
      for (const param in parameters) {
        context.log.logger(`\t${param} =`);
        context.log.logger(`\t\t${JSON.stringify(parameters[param])}`);
      }
    };
  }

  return context;
}

export function addLoggers(container) {
  for (const moduleName in container) {
    for (const functionName in container[moduleName]) {
      container[moduleName][`__${functionName}`] = container[moduleName][functionName];
      const context = createContext(moduleName, functionName);

      container[moduleName][functionName] = function (...args) {
        context.log.verbose(`Calling ${moduleName}:${functionName}`);
        const startTime = Date.now();
        let result;
        if (this) {
          this.log = context.log;
          result = container[moduleName][`__${functionName}`].apply(this, args);
        }
        else {
          result = container[moduleName][`__${functionName}`].apply(context, args);
        }
        context.log.verbose(
          `Completed ${moduleName}:${functionName} in ${Date.now() - startTime}ms`
        );
        return result;
      };
    }
  }
}
