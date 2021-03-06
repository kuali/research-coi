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

import {getFileStream} from '../services/file-service/file-service';
import CommonDB from '../db/common-db';
import ReviewerDB from '../db/additional-reviewer-db';
import { ROLES, FILE_TYPE, LANES } from '../../coi-constants';
import FileDb from '../db/file-db';
import multer from 'multer';
import {
  FORBIDDEN,
  ACCEPTED,
  INTERNAL_SERVER_ERROR
} from '../../http-status-codes';
import { allowedRoles } from '../middleware/role-check';
import wrapAsync from './wrap-async';
import archiver from 'archiver';
import useKnex from '../middleware/request-knex';
import {createLogger} from '../log';
const log = createLogger('FileController');

let upload = multer({dest: process.env.LOCAL_FILE_DESTINATION || 'uploads/' });
try {
  const extensions = require('research-extensions').default;
  
  if (extensions.config.lane !== LANES.TEST) {
    upload = extensions.storage;
  }
}
catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') {
    log.error(err);
  }
}

function handleDuplicateFileName(name, count) {
  const array = name.split('.');
  return `${array[0]} (${count}).${array[1]}`;
}

async function userHasPermissionForMultiFileUpload(
  {
    userInfo,
    knex
  },
  fileType,
  refId
) {
  if (fileType === FILE_TYPE.FINANCIAL_ENTITY) {
    if (userInfo.coiRole === ROLES.USER) {
      const permitted = await CommonDB.isFinancialEntityUsers(
        knex,
        refId,
        userInfo.schoolId
      );
      if (!permitted) {
        return false;
      }
    }

    if (userInfo.coiRole === ROLES.REVIEWER) {
      const disclosureId = await CommonDB.getDisclosureForFinancialEntity(
        knex,
        refId
      );
      const reviewerDisclosures = await ReviewerDB.getDisclosureIdsForReviewer(
        knex,
        userInfo.schoolId
      );
      if (!reviewerDisclosures.includes(String(disclosureId))) {
        return false;
      }
    }
  } else {
    if (userInfo.coiRole === ROLES.USER) {
      const permitted = await CommonDB.isDisclosureUsers(
        knex,
        refId,
        userInfo.schoolId
      );
      if (!permitted) {
        return false;
      }
    }

    if (userInfo.coiRole === ROLES.REVIEWER) {
      const reviewerDisclosures = await ReviewerDB.getDisclosureIdsForReviewer(
        knex,
        userInfo.schoolId
      );
      if (!reviewerDisclosures.includes(String(refId))) {
        return false;
      }
    }
  }
  return true;
}

export const init = app => {
  /**
    Admin or user for their own files
  */
  app.get(
    '/api/coi/files/:id',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async (req, res, next) =>
    {
      const {knex, userInfo, params, dbInfo} = req;

      const result = await FileDb.getFile(knex, userInfo, params.id);
      if (!result) {
        res.sendStatus(FORBIDDEN);
        return;
      }

      res.setHeader(
        'Content-disposition',
        `attachment; filename="${result.name}"`
      );
      const stream = await getFileStream(dbInfo, result.key);
      if (!stream) {
        res.sendStatus(INTERNAL_SERVER_ERROR);
        next(Error(`No file stream for ${params.id}`));
        return;
      }

      stream.on('error', err => {
        next(err);
      });

      stream.pipe(res);
    }
  ));

  app.get(
    '/api/coi/files/:fileType/:refId',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async (req, res, next) =>
    {
      const {params, knex, userInfo, dbInfo} = req;
      const {fileType, refId} = params;

      const hasPermission = await userHasPermissionForMultiFileUpload(
        req,
        fileType,
        refId
      );
      if (!hasPermission) {
        res.sendStatus(FORBIDDEN);
        return;
      }
      const files = await FileDb.getFiles(
        knex,
        userInfo,
        refId,
        fileType
      );

      res.setHeader(
        'Content-disposition',
        `attachment; filename="${fileType}.zip"`
      );

      const archive = archiver('zip');

      const names = {};
      for (const file of files) {
        const stream = await getFileStream(dbInfo, file.key);
        if (!stream) {
          res.sendStatus(INTERNAL_SERVER_ERROR);
          next(Error(`No file stream for ${file.key}`));
          return;
        }

        stream.on('error', err => {
          next(err);
        });

        let {name} = file;
        if (!names[name]) {
          names[name] = 1;
        } else {
          const count = names[name];
          names[name] = count + 1;
          name = handleDuplicateFileName(name, count);
        }
        archive.append(stream, {name});
      }
      archive.finalize();
      archive.pipe(res);
    }
  ));

  /**
    @Role: Admin or user for their own disclosures
  */
  app.post(
    '/api/coi/files',
    allowedRoles('ANY'),
    upload.array('attachments'),
    useKnex,
    wrapAsync(async ({knex, body, files, userInfo}, res) =>
    {
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await FileDb.saveNewFiles(
          knexTrx,
          JSON.parse(body.data),
          files,
          userInfo
        );
      });
      res.send(result);
    }
  ));

  /**
    @Role: admin or user for their own files
  */
  app.delete(
    '/api/coi/files/:id',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, dbInfo, userInfo, params}, res) =>
    {
      await knex.transaction(async (knexTrx) => {
        await FileDb.deleteFiles(dbInfo, knexTrx, userInfo, params.id);
      });
      res.sendStatus(ACCEPTED);
    }
  ));
};
