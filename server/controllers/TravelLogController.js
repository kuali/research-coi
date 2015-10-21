import * as TravelLogDB from '../db/TravelLogDB';
import Log from '../Log';

export let init = app => {
  /**
    @Role: user
    Can only see travel logs associated with their entities
  */
  app.get('/api/coi/travelLogEntries/', function(req, res, next) {
    TravelLogDB.getTravelLogEntries(req.dbInfo, req.userInfo.schoolId)
      .then(travelLog => {
        res.send(travelLog);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });
};
