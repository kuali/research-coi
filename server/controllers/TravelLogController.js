import * as TravelLogDB from '../db/TravelLogDB';
import {getUserInfo} from '../AuthService';

export let init = app => {
  app.get('/api/coi/travelLogEntries/', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    TravelLogDB.getTravelLogEntries(req.dbInfo, userInfo.id, function(err, travelLog) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(travelLog);
      }
    });
  });
};
