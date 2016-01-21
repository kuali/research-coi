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

/*eslint camelcase:0 */
import * as FileService from '../services/fileService/FileService';
import {COIConstants} from '../../COIConstants';
import {isDisclosureUsers} from './CommonDB';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager').default;
}

export const getFile = (dbInfo, userInfo, id) => {
  const knex = getKnex(dbInfo);

  const criteria = {
    id
  };
  const query = knex.select('name', 'key', 'file_type').from('file').where(criteria);
  if (userInfo.coiRole === COIConstants.ROLES.ADMIN) {
    return query;
  }

  return query.then(file => {
    if (file[0] && file[0].file_type === COIConstants.FILE_TYPE.MANAGEMENT_PLAN) {
      return knex.select('f.name', 'f.key')
        .from('file as f')
        .innerJoin('disclosure as d', 'd.id', 'f.ref_id')
        .where(function() {
          this.where({'f.user_id': userInfo.schoolId})
            .orWhere({'d.user_id': userInfo.schoolId});
        })
        .andWhere({'f.id': id});
    }
    return query.andWhere({'user_id': userInfo.schoolId});
  });

};

export const saveNewFiles = (dbInfo, body, files, userInfo) => {
  if (body.type !== COIConstants.FILE_TYPE.DISCLOSURE && body.type !== COIConstants.FILE_TYPE.MANAGEMENT_PLAN && body.type !== COIConstants.FILE_TYPE.FINANCIAL_ENTITY) {
    throw Error(`Attempt by ${userInfo.username} to upload an unknown file type`);
  }

  return isDisclosureUsers(dbInfo, body.disclosureId, userInfo.schoolId)
    .then(isSubmitter => {
      if (!isSubmitter && userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
        throw Error(`Attempt by ${userInfo.username} to upload a file for disclosure ${body.disclosureId} which isnt theirs`);
      }

      const knex = getKnex(dbInfo);
      const fileData = [];
      return Promise.all(
        files.map(file => {
          const fileDatum = {
            file_type: body.type,
            ref_id: body.refId,
            type: file.mimetype,
            key: file.filename,
            name: file.originalname,
            user_id: userInfo.schoolId,
            uploaded_by: userInfo.name,
            upload_date: new Date()
          };
          return knex('file')
            .insert(fileDatum, 'id')
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
    'id': fileId
  };

  if (userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
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
