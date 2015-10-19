import * as TravelLogDB from '../db/TravelLogDB';

export let init = app => {
  app.get('/api/coi/travelLogEntries/', function(req, res, next) {
    TravelLogDB.getTravelLogEntries(req.dbInfo, req.userInfo.schoolId)
      .then(travelLog => {
        res.send(travelLog);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });
};
