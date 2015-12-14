/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import * as PIDB from '../db/PIDB';
import * as PIReviewDB from '../db/PIReviewDB';
import Log from '../Log';
import {COIConstants} from '../../COIConstants';
import {FORBIDDEN, NO_CONTENT} from '../../HTTPStatusCodes';

export let init = app => {
  /**
    @Role: admin
  */
  app.get('/api/coi/pi', function(req, res, next) {
    if (req.userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
      res.sendStatus(FORBIDDEN);
      return;
    }

    PIDB.getSuggestions(req.dbInfo, req.query.term)
      .then(suggestions => {
        res.send(suggestions);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only respond to review items which are associated with their disclosures
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

        res.status(FORBIDDEN).end();
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only revise questions which are associated with their disclosures
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

        res.status(FORBIDDEN).end();
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only revise questions which are associated with their disclosures
  */
  app.put('/api/coi/pi-revise/:reviewId/entity-question/:questionId', (req, res, next) => {
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.reviseEntityQuestion(req.dbInfo, req.userInfo, req.params.reviewId, req.params.questionId, req.body.answer)
            .then(response => {
              res.send(response);
            });
        }

        res.status(FORBIDDEN).end();
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only add relationships for entities which are associated with their disclosures
  */
  app.post('/api/coi/pi-revise/:reviewId/entity-relationship', (req, res, next) => {
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.addRelationship(req.dbInfo, req.userInfo, req.params.reviewId, req.body)
            .then(response => {
              res.send(response);
            });
        }

        res.status(FORBIDDEN).end();
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only remove relationships for entities which are associated with their disclosures
  */
  app.delete('/api/coi/pi-revise/:reviewId/entity-relationship/:relationshipId', (req, res, next) => {
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.removeRelationship(req.dbInfo, req.userInfo, req.params.reviewId, req.params.relationshipId)
            .then(() => {
              res.status(NO_CONTENT).end();
            });
        }

        res.status(FORBIDDEN).end();
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only revise declarations which are associated with their disclosures
  */
  app.put('/api/coi/pi-revise/:reviewId/declaration', (req, res, next) => {
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.reviseDeclaration(req.dbInfo, req.userInfo, req.params.reviewId, req.body)
            .then(() => {
              res.status(NO_CONTENT).end();
            });
        }

        res.status(FORBIDDEN).end();
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only revise subquestions which are associated with their disclosures
  */
  app.put('/api/coi/pi-revise/:reviewId/subquestion-answer/:subQuestionId', (req, res, next) => {
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.reviseSubQuestion(req.dbInfo, req.userInfo, req.params.reviewId, req.params.subQuestionId, req.body)
            .then(() => {
              res.status(NO_CONTENT).end();
            });
        }

        res.status(FORBIDDEN).end();
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only remove answers for questions which are associated with their disclosures
  */
  app.delete('/api/coi/pi-revise/:reviewId/question-answers', (req, res, next) => {
    PIReviewDB.verifyReviewIsForUser(req.dbInfo, req.params.reviewId, req.userInfo.schoolId)
      .then(isAllowed => {
        if (isAllowed) {
          return PIReviewDB.deleteAnswers(req.dbInfo, req.userInfo, req.params.reviewId, req.body.toDelete)
            .then(() => {
              res.status(NO_CONTENT).end();
            })
            .catch(err => {
              Log.error(err);
              next(err);
            });
        }

        res.status(FORBIDDEN).end();
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only resubmit their own disclosures
  */
  app.put('/api/coi/pi-revise/:disclosureId/submit', (req, res, next) => {
    PIReviewDB.reSubmitDisclosure(req.dbInfo, req.userInfo, req.params.disclosureId)
      .then(() => {
        res.send({success: true});
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: admin
  */
  app.get('/api/coi/disclosures/:id/pi-responses', function(req, res, next) {
    if (req.userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
      res.sendStatus(FORBIDDEN);
      return;
    }

    PIReviewDB.getPIResponseInfo(req.dbInfo, req.params.id)
      .then(responses => {
        res.send(responses);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });
};
