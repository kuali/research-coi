import * as ConfigDB from '../db/ConfigDB';
import {getUserInfo} from '../AuthService';

export let init = app => {
  app.get('/api/coi/config', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    ConfigDB.getConfig(req.dbInfo, userInfo.id, function(err, config) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(config);
      }
    });
  });

  app.post('/api/coi/config/', function(req, res, next){
    let userInfo = getUserInfo(req.cookies.authToken);
    ConfigDB.setConfig(req.dbInfo, userInfo.id, req.body, function(err, config) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(config);
      }
    });
  });
};
