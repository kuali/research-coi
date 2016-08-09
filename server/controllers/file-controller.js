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

import * as FileService from '../services/file-service/file-service';
import { isDisclosureUsers, isFinancialEntityUsers, getDisclosureForFinancialEntity } from '../db/common-db';
import { getDisclosureIdsForReviewer } from '../db/additional-reviewer-db';
import { ROLES, FILE_TYPE, LANES } from '../../coi-constants';
import * as FileDb from '../db/file-db';
import multer from 'multer';
import Log from '../log';
import {FORBIDDEN, ACCEPTED} from '../../http-status-codes';
import { allowedRoles } from '../middleware/role-check';
import wrapAsync from './wrap-async';
import archiver from 'archiver';

let upload = multer({dest: process.env.LOCAL_FILE_DESTINATION || 'uploads/' });
try {
  const extensions = require('research-extensions').default;
  
  if (extensions.config.lane !== LANES.TEST) {
    upload = extensions.storage;
  }
}
catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') {
    Log.error(err);
  }
}

function handleDuplicateFileName(name, count) {
  const array = name.split('.');
  return `${array[0]} (${count}).${array[1]}`;
}

async function userHasPermissionForMultiFileUpload(req, fileType, refId) {
  try {
    if (fileType === FILE_TYPE.FINANCIAL_ENTITY) {
      if (req.userInfo.coiRole === ROLES.USER) {
        const permitted = await isFinancialEntityUsers(req.dbInfo, refId, req.userInfo.schoolId);
        if (!permitted) {
          return Promise.resolve(false);
        }
      }

      if (req.userInfo.coiRole === ROLES.REVIEWER) {
        const disclosureId = await getDisclosureForFinancialEntity(req.dbInfo, refId);
        const reviewerDisclosures = await getDisclosureIdsForReviewer(req.dbInfo, req.userInfo.schoolId);
        if (!reviewerDisclosures.includes(String(disclosureId))) {
          return Promise.resolve(false);
        }
      }
    } else {
      if (req.userInfo.coiRole === ROLES.USER) {
        const permitted = await isDisclosureUsers(req.dbInfo, refId, req.userInfo.schoolId);
        if (!permitted) {
          return Promise.resolve(false);
        }
      }

      if (req.userInfo.coiRole === ROLES.REVIEWER) {
        const reviewerDisclosures = await getDisclosureIdsForReviewer(req.dbInfo, req.userInfo.schoolId);
        if (!reviewerDisclosures.includes(String(refId))) {
          return Promise.resolve(false);
        }
      }
    }
    return Promise.resolve(true);
  } catch (err) {
    Promise.reject(err);
  }
}

export const init = app => {
  /**
    Admin or user for their own files
  */
  app.get('/api/coi/files/:id', allowedRoles('ANY'), wrapAsync(async (req, res, next) => {
    const result = await FileDb.getFile(req.dbInfo, req.userInfo, req.params.id);
    if (result.length < 1) {
      res.sendStatus(FORBIDDEN);
      return;
    }

    res.setHeader('Content-disposition', `attachment; filename="${result[0].name}"`);
    FileService.getFile(req.dbInfo, result[0].key, error => {
      if (error) {
        Log.error(error, req);
        next(error);
      }
    }).pipe(res);
  }));

  app.get('/api/coi/files/:fileType/:refId', allowedRoles('ANY'), wrapAsync(async (req, res, next) => {
    const fileType = req.params.fileType;
    const refId = req.params.refId;

    const hasPermission = await userHasPermissionForMultiFileUpload(req, fileType, refId);
    if (!hasPermission) {
      res.sendStatus(FORBIDDEN);
      return;
    }
    const files = await FileDb.getFiles(req.dbInfo, req.userInfo, refId, fileType);

    res.setHeader('Content-disposition', `attachment; filename="${fileType}.zip"`);

    const archive = archiver('zip');

    const names = {};
    files.forEach(file => {
      const stream = FileService.getFile(req.dbInfo, file.key, error => {
        if (error) {
          Log.error(error, req);
          next(error);
        }
      });

      let name = file.name;
      if (!names[name]) {
        names[name] = 1;
      } else {
        const count = names[name];
        names[name] = count + 1;
        name = handleDuplicateFileName(name, count);
      }
      archive.append(stream, {name});
    });
    archive.finalize();
    archive.pipe(res);
  }));

  /**
    @Role: Admin or user for their own disclosures
  */
  app.post('/api/coi/files', allowedRoles('ANY'), upload.array('attachments'), wrapAsync(async (req, res) => {
    const result = await FileDb.saveNewFiles(
      req.dbInfo,
      JSON.parse(req.body.data),
      req.files,
      req.userInfo
    );
    res.send(result);
  }));

  /**
    @Role: admin or user for their own files
  */
  app.delete('/api/coi/files/:id', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    await FileDb.deleteFiles(req.dbInfo, req.userInfo, req.params.id);
    res.sendStatus(ACCEPTED);
  }));
};
