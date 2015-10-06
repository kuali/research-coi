import * as PIDB from '../db/PIDB';
import * as PIReviewDB from '../db/PIReviewDB';
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

  app.post('/api/coi/pi-response/:reviewId', (req, res, next) => {
    let userInfo = getUserInfo(req.cookies.authToken); // eslint-disable-line no-unused-vars
    // authorization check here
    PIReviewDB.recordPIResponse(req.dbInfo, userInfo, req.params.reviewId, req.body.comment)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });
};
