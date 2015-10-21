import * as ConfigDB from '../db/ConfigDB';
import {COIConstants} from '../../COIConstants';
import Log from '../Log';

export let init = app => {
  /**
    @Role: any
  */
  app.get('/api/coi/config', function(req, res, next) {
    ConfigDB.getConfig(req.dbInfo, req.userInfo.schoolId)
      .then(config => {
        res.send(config);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: admin
  */
  app.post('/api/coi/config/', function(req, res, next){
    if (req.userInfo.role !== COIConstants.ROLES.ADMIN) {
      res.sendStatus(403);
      return;
    }

    ConfigDB.setConfig(req.dbInfo, req.userInfo.schoolId, req.body)
      .then(() => {
        return ConfigDB.getConfig(req.dbInfo, req.userInfo.schoolId)
          .then(config => {
            res.send(config);
          });
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });
};
