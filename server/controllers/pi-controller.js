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

import * as PIDB from '../db/pi-db';
import * as PIReviewDB from '../db/pi-review-db';
import Log from '../log';
import { ROLES } from '../../coi-constants';
const { ADMIN, REVIEWER } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import { FORBIDDEN, NO_CONTENT } from '../../http-status-codes';
import { getDisclosuresForReviewer } from '../db/additional-reviewer-db';

export const init = app => {
  app.get('/api/coi/pi', allowedRoles(ADMIN), (req, res, next) => {
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
    User can only respond to review items which are associated with their disclosures
  */
  app.post('/api/coi/pi-response/:reviewId', allowedRoles('ANY'), (req, res, next) => {
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
    User can only revise questions which are associated with their disclosures
  */
  app.put('/api/coi/pi-revise/:reviewId', allowedRoles('ANY'), (req, res, next) => {
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
    User can only revise questions which are associated with their disclosures
  */
  app.put('/api/coi/pi-revise/:reviewId/entity-question/:questionId', allowedRoles('ANY'), (req, res, next) => {
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
    User can only add relationships for entities which are associated with their disclosures
  */
  app.post('/api/coi/pi-revise/:reviewId/entity-relationship', allowedRoles('ANY'), (req, res, next) => {
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
    User can only remove relationships for entities which are associated with their disclosures
  */
  app.delete('/api/coi/pi-revise/:reviewId/entity-relationship/:relationshipId', allowedRoles('ANY'), (req, res, next) => {
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
    User can only revise declarations which are associated with their disclosures
  */
  app.put('/api/coi/pi-revise/:reviewId/declaration', allowedRoles('ANY'), (req, res, next) => {
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
    User can only revise subquestions which are associated with their disclosures
  */
  app.put('/api/coi/pi-revise/:reviewId/subquestion-answer/:subQuestionId', allowedRoles('ANY'), (req, res, next) => {
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
    User can only remove answers for questions which are associated with their disclosures
  */
  app.delete('/api/coi/pi-revise/:reviewId/question-answers', allowedRoles('ANY'), (req, res, next) => {
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
    User can only resubmit their own disclosures
  */
  app.put('/api/coi/pi-revise/:disclosureId/submit', allowedRoles('ANY'), (req, res, next) => {
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
   Reviewer can only see ones where they are a reviewer
   */
  app.get('/api/coi/disclosures/:id/pi-responses', allowedRoles([ADMIN, REVIEWER]), async (req, res, next) => {
    if (req.userInfo.coiRole === ROLES.REVIEWER) {
      const reviewerDisclosureIds = await getDisclosuresForReviewer(req.dbInfo, req.userInfo.schoolId);
      if (!reviewerDisclosureIds.includes(req.params.id)) {
        res.sendStatus(FORBIDDEN);
        return;
      }
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
