import * as FileService from '../services/fileService/FileService';
import * as FileDb from '../db/FileDB';
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
  app.get('/api/coi/files/:id', function(req, res, next){
    FileDb.getFile(req.dbInfo, req.params.id)
      .then(result => {
        if (result.length < 1) {
          res.sendStatus(403);
        } else {
          res.setHeader('Content-disposition', 'attachment; filename="' + result[0].name + '"');
          FileService.getFile(req.dbInfo, result[0].key, error => {
            if (error) {
              console.error(error);
              next(error);
            }
          }).pipe(res);
        }
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.post('/api/coi/files', upload.array('attachments'), function(req, res, next) {
    FileDb.saveNewFiles(req.dbInfo, JSON.parse(req.body.data), req.files, req.userInfo.name)
      .then(result => {
        res.send(result);
      }).catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.delete('/api/coi/files/:id', function(req, res, next) {
    FileDb.deleteFiles(req.dbInfo, req.body, req.params.id)
    .then(() => {
      res.sendStatus(202);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
  });
};
