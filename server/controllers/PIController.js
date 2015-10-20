import * as PIDB from '../db/PIDB';
import * as PIReviewDB from '../db/PIReviewDB';

export let init = app => {
  app.get('/api/coi/pi', function(req, res, next) {
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
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.recordPIResponse(req.dbInfo, req.userInfo, req.params.reviewId, req.body.comment)
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
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.reviseQuestion(req.dbInfo, req.userInfo, req.params.reviewId, req.body.answer)
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
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.reviseEntityQuestion(req.dbInfo, req.userInfo, req.params.reviewId, req.params.questionId, req.body.answer)
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

  app.post('/api/coi/pi-revise/:reviewId/entity-relationship', (req, res, next) => {
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.addRelationship(req.dbInfo, req.userInfo, req.params.reviewId, req.body)
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

  app.delete('/api/coi/pi-revise/:reviewId/entity-relationship/:relationshipId', (req, res, next) => {
    PIReviewDB.removeRelationship(req.dbInfo, req.userInfo, req.params.reviewId, req.params.relationshipId)
      .then(() => {
        res.status(204).end();
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.put('/api/coi/pi-revise/:reviewId/declaration', (req, res, next) => {
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.reviseDeclaration(req.dbInfo, req.userInfo, req.params.reviewId, req.body)
            .then(() => {
              res.status(204).end();
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

  app.put('/api/coi/pi-revise/:reviewId/subquestion-answer/:subQuestionId', (req, res, next) => {
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.reviseSubQuestion(req.dbInfo, req.userInfo, req.params.reviewId, req.params.subQuestionId, req.body)
            .then(() => {
              res.status(204).end();
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

  app.delete('/api/coi/pi-revise/:reviewId/question-answers', (req, res, next) => {
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.deleteAnswers(req.dbInfo, req.userInfo, req.params.reviewId, req.body.toDelete)
            .then(() => {
              res.status(204).end();
            })
            .catch(err => {
              console.error(err);
              next(err);
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
