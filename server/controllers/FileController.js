import * as FileService from '../services/fileService/FileService';
import * as FileDb from '../db/FileDB';
import {getUserInfo} from '../AuthService';
import multer from 'multer';

let upload;
try {
  let extensions = require('research-extensions');
  upload = extensions.storage;
}
catch (err) {
  upload = multer({dest: process.env.LOCAL_FILE_DESTINATION || 'uploads/' });
}

export let init = app => {
  app.get('/api/coi/file/:path', function(req, res, next){
    FileDb.getFile(req.dbInfo, req.params.path)
      .then(result => {
        if (result.length < 1) {
          res.sendStatus(403);
        } else {
          res.setHeader('Content-disposition', 'attachment; filename="' + result[0].name + '"');
          FileService.getFile(req.params.path, error => {
            if (error) {
              console.error(error);
              next(error);
            }
          }).pipe(res);
        }
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  });

  app.put('/api/coi/file', upload.array('attachments'), function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    FileDb.saveNewFiles(req.dbInfo, JSON.parse(req.body.data), req.files, userInfo.id)
      .then(result => {
        res.send(result);
      }).catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.delete('/api/coi/file', function(req, res, next) {
    FileDb.deleteFiles(req.dbInfo, req.body)
    .then(() => {
      res.sendStatus(202);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
  });
};
