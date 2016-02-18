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

import * as FileService from '../services/file-service/file-service';
import * as FileDb from '../db/file-db';
import multer from 'multer';
import Log from '../log';
import {FORBIDDEN, ACCEPTED} from '../../http-status-codes';
import { allowedRoles } from '../middleware/role-check';
import wrapAsync from './wrap-async';

let upload;
try {
  const extensions = require('research-extensions').default;
  upload = extensions.storage;
}
catch (err) {
  upload = multer({dest: process.env.LOCAL_FILE_DESTINATION || 'uploads/' });
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
        Log.error(error);
        next(error);
      }
    }).pipe(res);
  }));

  /**
    @Role: Admin or user for their own disclosures
  */
  app.post('/api/coi/files', allowedRoles('ANY'), upload.array('attachments'), wrapAsync(async req => {
    return await FileDb.saveNewFiles(
      req.dbInfo,
      JSON.parse(req.body.data),
      req.files,
      req.userInfo
    );
  }));

  /**
    @Role: admin or user for their own files
  */
  app.delete('/api/coi/files/:id', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    await FileDb.deleteFiles(req.dbInfo, req.userInfo, req.params.id);
    res.sendStatus(ACCEPTED);
  }));
};
