import * as TravelLogDB from '../db/TravelLogDB';
import {getUserInfo} from '../AuthService';

export let init = app => {
  app.get('/api/coi/travelLogEntries/', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    TravelLogDB.getTravelLogEntries(req.dbInfo, userInfo.id)
      .then(travelLog => {
        res.send(travelLog);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });
};
