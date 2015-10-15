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

  /**
    @Role: PI
  */
  app.post('/api/coi/pi-response/:reviewId', (req, res, next) => {
    let userInfo = getUserInfo(req.cookies.authToken);

    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, userInfo.id)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.recordPIResponse(req.dbInfo, userInfo, req.params.reviewId, req.body.comment)
            .then(response => {
              res.send(response);
            });
        }
        else {
          res.status(403).end();
        }
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  /**
    @Role: PI
  */
  app.put('/api/coi/pi-revise/:reviewId', (req, res, next) => {
    let userInfo = getUserInfo(req.cookies.authToken);

    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, userInfo.id)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.reviseQuestion(req.dbInfo, userInfo, req.params.reviewId, req.body.answer)
            .then(response => {
              res.send(response);
            });
        }
        else {
          res.status(403).end();
        }
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.put('/api/coi/pi-revise/:reviewId/entity-question/:questionId', (req, res, next) => {
    let userInfo = getUserInfo(req.cookies.authToken);

    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, userInfo.id)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.reviseEntityQuestion(req.dbInfo, userInfo, req.params.reviewId, req.params.questionId, req.body.answer)
            .then(response => {
              res.send(response);
            });
        }
        else {
          res.status(403).end();
        }
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });
};
