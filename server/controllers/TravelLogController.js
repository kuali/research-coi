import * as TravelLogDB from '../db/TravelLogDB';

export let init = app => {

  app.get('/api/coi/travelLogEntries/', function(req, res, next) {
    TravelLogDB.getTravelLogEntries(req.dbInfo, function(err, travelLog) {
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
