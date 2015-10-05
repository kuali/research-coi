import * as FileService from '../services/fileService/FileService';
import * as FileDB from '../db/FileDB';

export let init = app => {
  app.get('/api/coi/file/:path', function(req, res, next){
    FileDB.getFile(req.dbInfo, req.params.path)
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
};
