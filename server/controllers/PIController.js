import * as PIDB from '../db/PIDB';
import {getUserInfo} from '../AuthService';

export let init = app => {
  app.get('/api/coi/pi', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    // authorization check here
    PIDB.getSuggestions(req.dbInfo, req.query.term, function(err, suggestions) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(suggestions);
      }
    });
  });
};
