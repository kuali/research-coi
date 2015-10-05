import * as PIDB from '../db/PIDB';
import {getUserInfo} from '../AuthService';

export let init = app => {
  app.get('/api/coi/pi', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken); // eslint-disable-line no-unused-vars
    // authorization check here
    PIDB.getSuggestions(req.dbInfo, req.query.term)
      .then(suggestions => {
        res.send(suggestions);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });
};
