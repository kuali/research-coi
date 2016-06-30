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
import {ROLES, FILE_TYPE} from '../../coi-constants';
import {isDisclosureUsers} from './common-db';
import getKnex from './connection-manager';

export const getFile = (dbInfo, userInfo, id) => {
  const knex = getKnex(dbInfo);
  const criteria = {
    id
  };
  const query = knex.select('name', 'key', 'file_type').from('file').where(criteria);
  if (userInfo.coiRole === ROLES.ADMIN || userInfo.coiRole === ROLES.REVIEWER) {
    return query;
  }

  return query.then(file => {
    if (file[0] && file[0].file_type === FILE_TYPE.MANAGEMENT_PLAN) {
      return knex.select('f.name', 'f.key')
        .from('file as f')
        .innerJoin('disclosure as d', 'd.id', 'f.ref_id')
        .where(function() {
          this.where({'f.user_id': userInfo.schoolId})
            .orWhere({'d.user_id': userInfo.schoolId});
        })
        .andWhere({'f.id': id});
    }
    return query.andWhere({
      user_id: userInfo.schoolId
    });
  });
};

export async function getFiles(dbInfo, userInfo, refId, fileType) {
  const knex = getKnex(dbInfo);
  const criteria = {
    file_type: fileType,
    ref_id: refId
  };

  const query = knex.select('name', 'key').from('file').where(criteria);
  if (userInfo.coiRole === ROLES.ADMIN || userInfo.coiRole === ROLES.REVIEWER) {
    return query;
  }

  if (fileType === FILE_TYPE.MANAGEMENT_PLAN) {
    return knex.select('f.name', 'f.key')
      .from('file as f')
      .innerJoin('disclosure as d', 'd.id', 'f.ref_id')
      .where(function() {
        this.where({'f.user_id': userInfo.schoolId})
          .orWhere({'d.user_id': userInfo.schoolId});
      })
      .andWhere({
        'f.file_type': fileType,
        'f.ref_id': refId
      });
  }
  return query.andWhere({
    user_id: userInfo.schoolId
  });
}

export const saveNewFiles = (dbInfo, body, files, userInfo) => {
  if (body.type !== FILE_TYPE.DISCLOSURE &&
    body.type !== FILE_TYPE.MANAGEMENT_PLAN &&
    body.type !== FILE_TYPE.FINANCIAL_ENTITY &&
    body.type !== FILE_TYPE.ADMIN) {
    throw Error(`Attempt by ${userInfo.username} to upload an unknown file type`);
  }

  return isDisclosureUsers(dbInfo, body.disclosureId, userInfo.schoolId)
    .then(isSubmitter => {
      if (!isSubmitter && userInfo.coiRole !== ROLES.ADMIN) {
        throw Error(`Attempt by ${userInfo.username} to upload a file for disclosure ${body.disclosureId} which isnt theirs`);
      }

      const knex = getKnex(dbInfo);
      const fileData = [];
      return Promise.all(
        files.map(file => {
          const fileDatum = {
            fileType: body.type,
            refId: body.refId,
            type: file.mimetype,
            key: file.filename,
            name: file.originalname,
            userId: userInfo.schoolId,
            uploadedBy: userInfo.name,
            uploadDate: new Date()
          };
          return knex('file')
            .insert({
              file_type: fileDatum.fileType,
              ref_id: fileDatum.refId,
              type: fileDatum.type,
              key: fileDatum.key,
              name: fileDatum.name,
              user_id: fileDatum.userId,
              uploaded_by: fileDatum.uploadedBy,
              upload_date: fileDatum.uploadDate
            }, 'id')
            .then(fileId => {
              fileDatum.id = fileId[0];
              fileData.push(fileDatum);
            });
        })
      ).then(() => {
        return fileData;
      });
    });
};

export const deleteFiles = (dbInfo, userInfo, fileId) => {
  const knex = getKnex(dbInfo);

  const criteria = {
    id: fileId
  };

  if (userInfo.coiRole !== ROLES.ADMIN) {
    criteria.user_id = userInfo.schoolId;
  }

  return knex('file')
    .select('key')
    .where(criteria)
    .then((file) => {
      return knex('file')
        .del()
        .where(criteria)
        .then(() => {
          return new Promise((resolve, reject) => {
            FileService.deleteFile(file[0].key, err => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        });
    });
};
