/*eslint camelcase:0 */
import * as FileService from '../services/fileService/FileService';
let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let getFile = (dbInfo, key) => {
  let knex = getKnex(dbInfo);
  return knex.select('*').from('file').where('key', key);
};

export let saveNewFiles = (dbInfo, body, files, userName) => {
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
        uploaded_by: userName,
        upload_date: new Date()
      };
      return knex('file')
        .insert(fileDatum)
        .then(fileId=>{
          fileDatum.id = fileId[0];
          fileData.push(fileDatum);
        });
    })
  ).then(() => {
    return fileData;
  });
};

export let deleteFiles = (dbInfo, file) => {
  let knex = getKnex(dbInfo);
  return knex('file')
    .del()
    .where('id', file.id)
    .then(()=>{
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
