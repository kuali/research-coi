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

import * as DisclosureDB from '../db/DisclosureDB';
import * as PIReviewDB from '../db/PIReviewDB';
import multer from 'multer';
import Log from '../Log';
import {COIConstants} from '../../COIConstants';
import {FORBIDDEN, ACCEPTED, BAD_REQUEST, NO_CONTENT} from '../../HTTPStatusCodes';

let upload;
try {
  const extensions = require('research-extensions').default;
  upload = extensions.storage;
}
catch (err) {
  upload = multer({dest: process.env.LOCAL_FILE_DESTINATION || 'uploads/' });
}


export const init = app => {

  /**
   @Role: admin (can see any) or user (can only see their own)
   */
  app.get('/api/coi/archived-disclosures/:id/latest', (req, res, next) => {
    DisclosureDB.getLatestArchivedDisclosure(req.dbInfo, req.userInfo.schoolid, req.params.id)
    .then(results => {
      const disclosure = JSON.parse(results[0].disclosure);
      if (req.userInfo.coiRole !== COIConstants.ROLES.ADMIN && disclosure.userId !== req.userInfo.schoolId) {
        res.sendStatus(FORBIDDEN);
        return;
      }
      res.send(disclosure);
    })
    .catch(err => {
      Log.error(err);
      next(err);
    });
  });

  /**
    @Role: user
    Can only see disclosures which they submitted
  */
  app.get('/api/coi/archived-disclosures', (req, res, next) => {
    DisclosureDB.getArchivedDisclosures(req.dbInfo, req.userInfo.schoolId)
      .then(disclosures => {
        res.send(disclosures);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only see disclosures which they submitted
  */
  app.get('/api/coi/disclosure-user-summaries', (req, res, next) => {
    DisclosureDB.getSummariesForUser(req.dbInfo, req.userInfo.schoolId)
      .then(disclosures => {
        res.send(disclosures);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only see their own annual disclosure
  */
  app.get('/api/coi/disclosures/annual', (req, res, next) => {
    DisclosureDB.getAnnualDisclosure(req.dbInfo, req.userInfo, req.userInfo.name)
    .then(disclosure => {
      res.send(disclosure);
    })
    .catch(err => {
      Log.error(err);
      next(err);
    });
  });

  /**
    @Role: admin (can see any) or user (can only see their own)
  */
  app.get('/api/coi/disclosures/:id', (req, res, next) => {
    DisclosureDB.get(req.dbInfo, req.userInfo, req.params.id)
      .then(disclosure => {
        res.send(disclosure);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: admin
  */
  app.get('/api/coi/disclosure-summaries', (req, res, next) => {
    if (req.userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
      res.sendStatus(FORBIDDEN);
      return;
    }

    let sortColumn = 'DATE_SUBMITTED';
    if (req.query.sortColumn) {
      sortColumn = req.query.sortColumn;
    }
    let sortDirection = 'ASCENDING';
    if (req.query.sortDirection) {
      sortDirection = req.query.sortDirection;
    }

    let filters = {};
    if (req.query.filters) {
      try {
        let potentialFilter = decodeURIComponent(req.query.filters);
        potentialFilter = JSON.parse(potentialFilter);
        filters = potentialFilter;
      }
      catch (parseErr) {
        Log.error('invalid filters supplied to disclosure-summaries');
        Log.error(parseErr);
        next('invalid filters supplied to disclosure-summaries');
      }
    }

    let start = 0;
    if (req.query.start && !isNaN(req.query.start)) {
      start = req.query.start;
    }
    DisclosureDB.getSummariesForReview(req.dbInfo, sortColumn, sortDirection, start, filters)
      .then(summaries => {
        res.send(summaries);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: admin
  */
  app.get('/api/coi/disclosure-summaries/count', (req, res, next) => {
    if (req.userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
      res.sendStatus(FORBIDDEN);
      return;
    }

    let filters = {};
    if (req.query.filters) {
      try {
        let potentialFilter = decodeURIComponent(req.query.filters);
        potentialFilter = JSON.parse(potentialFilter);
        filters = potentialFilter;
      }
      catch (parseErr) {
        Log.error('invalid filters supplied to disclosure-summaries/count');
        Log.error(parseErr);
        next('invalid filters supplied to disclosure-summaries/count');
      }
    }

    DisclosureDB.getSummariesForReviewCount(req.dbInfo, filters)
      .then(count => {
        res.send(count);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only edit entities which are associated with their disclosure
  */
  app.put('/api/coi/disclosures/:id/financial-entities/:entityId', upload.array('attachments'), (req, res, next) => {
    DisclosureDB.saveExistingFinancialEntity(req.dbInfo, req.userInfo, req.params.entityId, JSON.parse(req.body.entity), req.files)
      .then(financialEntity => {
        res.send(financialEntity);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only add entities to disclosures which are theirs
  */
  app.post('/api/coi/disclosures/:id/financial-entities', upload.array('attachments'), (req, res, next) => {
    DisclosureDB.saveNewFinancialEntity(req.dbInfo, req.userInfo, req.params.id, JSON.parse(req.body.entity), req.files)
      .then(financialEntity => {
        res.send(financialEntity);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only add declarations to disclosures which are theirs
  */
  app.post('/api/coi/disclosures/:id/declarations', (req, res, next) => {
    req.body.disclosure_id = req.params.id; //eslint-disable-line camelcase
    DisclosureDB.saveDeclaration(req.dbInfo, req.userInfo.schoolId, req.params.id, req.body)
      .then(declaration => {
        res.send(declaration);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only edit declarations on disclosures which are theirs
  */
  app.put('/api/coi/disclosures/:id/declarations/:declarationId', (req, res, next) => {
    DisclosureDB.saveExistingDeclaration(req.dbInfo, req.userInfo.schoolId, req.params.id, req.params.declarationId, req.body)
      .then(() => {
        res.sendStatus(ACCEPTED);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only answer questions on disclosures which are theirs
  */
  app.post('/api/coi/disclosures/:id/question-answers', (req, res, next) => {
    DisclosureDB.saveNewQuestionAnswer(req.dbInfo, req.userInfo.schoolId, req.params.id, req.body)
      .then(answer => {
        res.send(answer);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only answer questions on disclosures which are theirs
  */
  app.put('/api/coi/disclosures/:id/question-answers/:questionId', (req, res, next) => {
    DisclosureDB.saveExistingQuestionAnswer(req.dbInfo, req.userInfo.schoolId, req.params.id, req.params.questionId, req.body)
      .then(answer => {
        res.send(answer);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only submit disclosures which are theirs
  */
  app.put('/api/coi/disclosures/:id/submit', (req, res, next) => {
    DisclosureDB.submit(req.dbInfo, req.userInfo, req.params.id)
      .then(() => {
        res.sendStatus(ACCEPTED);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: admin
  */
  app.put('/api/coi/disclosures/:id/approve', (req, res, next) => {
    if (req.userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
      res.sendStatus(FORBIDDEN);
      return;
    }

    DisclosureDB.approve(req.dbInfo, req.body, req.userInfo.name, req.params.id)
      .then(() => {
        res.sendStatus(ACCEPTED);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: admin
  */
  app.put('/api/coi/disclosures/:id/reject', (req, res, next) => {
    if (req.userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
      res.sendStatus(FORBIDDEN);
      return;
    }

    DisclosureDB.reject(req.dbInfo, req.userInfo.name, req.params.id)
      .then(() => {
        res.sendStatus(ACCEPTED);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: admin
  */
  app.post('/api/coi/disclosures/:id/comments', (req, res, next) => {
    if (req.userInfo.coiRole !== COIConstants.ROLES.ADMIN) {
      res.sendStatus(FORBIDDEN);
      return;
    }

    const comment = req.body;

    if (!comment.topicSection ||
        !comment.topicId ||
        comment.visibleToPI === undefined ||
        comment.visibleToReviewers === undefined ||
        !comment.text ||
        isNaN(req.params.id)
       ) {
      next(new Error('invalid comment body'));
    }
    else {
      DisclosureDB.addComment(req.dbInfo, req.userInfo, {
        topicSection: comment.topicSection,
        topicId: comment.topicId,
        visibleToPI: comment.visibleToPI,
        visibleToReviewers: comment.visibleToReviewers,
        text: comment.text,
        disclosureId: req.params.id
      })
        .then(result => {
          res.send(result[0]);
        })
        .catch(err => {
          Log.error(err);
          next(err);
        });
    }
  });

  /**
    @Role: user
    Can only retrieve items if this disclosure is theirs
  */
  app.get('/api/coi/disclosures/:id/pi-review-items', (req, res, next) => {
    PIReviewDB.getPIReviewItems(req.dbInfo, req.userInfo, req.params.id)
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only delete answers if this disclosure is theirs
  */
  app.delete('/api/coi/disclosures/:id/question-answers', (req, res, next) => {
    const toDelete = [];
    const proposedDeletions = req.body.toDelete !== undefined ? req.body.toDelete : [];

    if (Array.isArray(proposedDeletions)) {
      proposedDeletions.forEach(proposedDeletion => {
        if (Number.isInteger(proposedDeletion)) {
          toDelete.push(proposedDeletion);
        }
      });
    }

    if (toDelete.length > 0) {
      DisclosureDB.deleteAnswers(req.dbInfo, req.userInfo, req.params.id, toDelete)
        .then(() => {
          res.status(NO_CONTENT).end();
        })
        .catch(err => {
          Log.error(err);
          next(err);
        });
    }
    else {
      res.status(BAD_REQUEST).end();
    }
  });

  /**
    @Role: user
    Can only retrieve state of their disclosure
  */
  app.get('/api/coi/disclosures/:id/state', (req, res, next) => {
    DisclosureDB.getCurrentState(req.dbInfo, req.userInfo, req.params.id)
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Can only save the state of their disclosure
  */
  app.post('/api/coi/disclosures/:id/state', (req, res, next) => {
    res.status(ACCEPTED).end();

    DisclosureDB.saveCurrentState(req.dbInfo, req.userInfo, req.params.id, req.body)
      .then(() => {
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });
};
