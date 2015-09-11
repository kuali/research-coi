import * as ConfigDB from '../db/ConfigDB';
import {getUserInfo} from '../AuthService';

export let init = app => {
  app.get('/api/coi/config', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    ConfigDB.getConfig(req.dbInfo, userInfo.id, function(err, questionnaire) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(questionnaire);
      }
    });
  });

  app.put('/api/coi/config/', function(req, res){
    let userInfo = getUserInfo(req.cookies.authToken);
    // validation?
    res.sendStatus(202);
    res.send(ConfigDB.setConfig(req, userInfo.id));
  });
};
