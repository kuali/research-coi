import * as ConfigDB from '../db/ConfigDB';

export let init = app => {
  app.get('/api/coi/config', function(req, res, next) {
    ConfigDB.getConfig(req.dbInfo, req.userInfo.schoolId)
      .then(config => {
        res.send(config);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.post('/api/coi/config/', function(req, res, next){
    ConfigDB.setConfig(req.dbInfo, req.userInfo.schoolId, req.body)
      .then(() => {
        return ConfigDB.getConfig(req.dbInfo, req.userInfo.schoolId)
          .then(config => {
            res.send(config);
          });
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });
};
