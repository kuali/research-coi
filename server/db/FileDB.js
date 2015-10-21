/*eslint camelcase:0 */
import * as FileService from '../services/fileService/FileService';
import {COIConstants} from '../../COIConstants';
import {isDisclosureUsers} from './CommonDB';

let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let getFile = (dbInfo, userInfo, id) => {
  let knex = getKnex(dbInfo);

  let criteria = {
    'id': id
  };

  if (userInfo.role !== COIConstants.ROLES.ADMIN) {
    criteria.user_id = userInfo.schoolId;
  }

  return knex.select('*').from('file').where(criteria);
};

export let saveNewFiles = (dbInfo, body, files, userInfo) => {
  if (body.type !== COIConstants.FILE_TYPE.DISCLOSURE && body.type !== COIConstants.FILE_TYPE.MANAGEMENT_PLAN) {
    throw Error('Attempted an unknown file type upload');
  }

  return isDisclosureUsers(dbInfo, body.refId, userInfo.schoolId)
    .then(isSubmitter => {
      if (!isSubmitter && userInfo.role !== COIConstants.ROLES.ADMIN) {
        throw Error('Attempt to upload a file for a disclosure that isnt theirs');
      }

      let knex = getKnex(dbInfo);
      let fileData = [];
      return Promise.all(
        files.map(file=>{
          let fileDatum = {
            file_type: body.type,
            ref_id: body.refId,
            type: file.mimetype,
            key: file.filename,
            name: file.originalname,
            user_id: userInfo.schoolId,
            uploaded_by: userInfo.displayName,
            upload_date: new Date()
          };
          return knex('file')
            .insert(fileDatum)
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

export let deleteFiles = (dbInfo, userInfo, file, fileId) => {
  let knex = getKnex(dbInfo);

  let criteria = {
    'id': fileId
  };

  if (userInfo.role !== COIConstants.ROLES.ADMIN) {
    criteria.user_id = userInfo.schoolId;
  }

  return knex('file')
    .del()
    .where(criteria)
    .then(() => {
      return new Promise((resolve, reject) => {
        FileService.deleteFile(file.key, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
};
