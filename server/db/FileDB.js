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

  if (userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
    criteria.user_id = userInfo.schoolId;
  }

  return knex.select('*').from('file').where(criteria);
};

export let saveNewFiles = (dbInfo, body, files, userInfo) => {
  if (body.type !== COIConstants.FILE_TYPE.DISCLOSURE && body.type !== COIConstants.FILE_TYPE.MANAGEMENT_PLAN && body.type !== COIConstants.FILE_TYPE.FINANCIAL_ENTITY) {
    throw Error(`Attempt by ${userInfo.username} to upload an unknown file type`);
  }

  return isDisclosureUsers(dbInfo, body.disclosureId, userInfo.schoolId)
    .then(isSubmitter => {
      if (!isSubmitter && userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
        throw Error(`Attempt by ${userInfo.username} to upload a file for disclosure ${body.disclosureId} which isnt theirs`);
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
            uploaded_by: userInfo.name,
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

  if (userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
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
