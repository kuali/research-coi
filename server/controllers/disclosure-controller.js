/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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

import * as DisclosureDB from '../db/disclosure-db';
import * as PIReviewDB from '../db/pi-review-db';
import wrapAsync from './wrap-async';
import { getDisclosureIdsForReviewer } from '../db/additional-reviewer-db';
import multer from 'multer';
import Log from '../log';
import { ROLES, ADMIN_PAGE_SIZE } from '../../coi-constants';
const { ADMIN, REVIEWER } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import {FORBIDDEN, ACCEPTED, BAD_REQUEST, NO_CONTENT} from '../../http-status-codes';
import {
  createAndSendSubmitNotification,
  createAndSendApproveNotification,
  createAndSendSentBackNotification
} from '../services/notification-service/notification-service';
let upload;
try {
  const extensions = require('research-extensions').default;
  upload = extensions.storage;
}
catch (err) {
  upload = multer({dest: process.env.LOCAL_FILE_DESTINATION || 'uploads/' });
}

function validateComment(comment) {
  return (
    comment.topicSection &&
    comment.topicId &&
    comment.text &&
    comment.piVisible !== undefined &&
    comment.reviewerVisible !== undefined &&
    !isNaN(comment.disclosureId)
  );
}

export const init = app => {
  /**
    user can only see their own
  */
  app.get('/api/coi/archived-disclosures/:id/latest', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const results = await DisclosureDB.getLatestArchivedDisclosure(req.dbInfo, req.userInfo.schoolid, req.params.id);
    const disclosure = JSON.parse(results[0].disclosure);
    if (req.userInfo.coiRole !== ROLES.ADMIN && disclosure.userId !== req.userInfo.schoolId) {
      res.sendStatus(FORBIDDEN);
      return;
    }
    res.send(disclosure);
  }));

  /**
    User can only see disclosures which they submitted
  */
  app.get('/api/coi/archived-disclosures', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const result = await DisclosureDB.getArchivedDisclosures(req.dbInfo, req.userInfo.schoolId);
    res.send(result);
  }));

  /**
    User can only see disclosures which they submitted
  */
  app.get('/api/coi/disclosure-user-summaries', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const result = await DisclosureDB.getSummariesForUser(req.dbInfo, req.userInfo.schoolId);
    res.send(result);
  }));

  /**
    User can only see their own annual disclosure
  */
  app.get('/api/coi/disclosures/annual', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const result = await DisclosureDB.getAnnualDisclosure(req.dbInfo, req.userInfo, req.userInfo.name);
    res.send(result);
  }));

  /**
    Admin can see any, User can only see their own,
    Reviewer can only see ones where they are a reviewer
  */
  app.get('/api/coi/disclosures/:id', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    if (req.userInfo.coiRole === ROLES.REVIEWER) {
      const reviewerDisclosures = await getDisclosureIdsForReviewer(req.dbInfo, req.userInfo.schoolId);
      if (!reviewerDisclosures.includes(req.params.id)) {
        res.sendStatus(FORBIDDEN);
        return;
      }
    }

    const result = await DisclosureDB.get(req.dbInfo, req.userInfo, req.params.id);
    res.send(result);
  }));

  /**
    Admin can see any, Reviewer can only see ones where they are a reviewer
  */
  app.get('/api/coi/disclosure-summaries', allowedRoles([ADMIN, REVIEWER]), wrapAsync(async (req, res, next) => {
    let reviewerDisclosureIds;
    if (req.userInfo.coiRole === ROLES.REVIEWER) {
      reviewerDisclosureIds = await getDisclosureIdsForReviewer(req.dbInfo, req.userInfo.schoolId);
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
        Log.error('invalid filters supplied to disclosure-summaries', req);
        Log.error(parseErr, req);
        next('invalid filters supplied to disclosure-summaries');
      }
    }

    let start = 0;
    if (req.query.start && !isNaN(req.query.start)) {
      start = req.query.start;
    }
    const result = await DisclosureDB.getSummariesForReview(
      req.dbInfo,
      sortColumn,
      sortDirection,
      start,
      filters,
      reviewerDisclosureIds,
      ADMIN_PAGE_SIZE
    );
    res.send(result);
  }));

  app.get('/api/coi/disclosure-summaries/count', allowedRoles(ADMIN), wrapAsync(async (req, res, next) => {
    let filters = {};
    if (req.query.filters) {
      try {
        let potentialFilter = decodeURIComponent(req.query.filters);
        potentialFilter = JSON.parse(potentialFilter);
        filters = potentialFilter;
      }
      catch (parseErr) {
        Log.error('invalid filters supplied to disclosure-summaries/count', req);
        Log.error(parseErr, req);
        next('invalid filters supplied to disclosure-summaries/count');
        return;
      }
    }

    const result = await DisclosureDB.getSummariesForReviewCount(req.dbInfo, filters);
    res.send(result);
  }));

  /**
    User can only edit entities which are associated with their disclosure
  */
  app.put('/api/coi/disclosures/:id/financial-entities/:entityId', allowedRoles('ANY'), upload.array('attachments'), wrapAsync(async (req, res) => {
    const result = await DisclosureDB.saveExistingFinancialEntity(req.dbInfo, req.userInfo, req.params.entityId, JSON.parse(req.body.entity), req.files);
    res.send(result);
  }));

  /**
    User can only add entities to disclosures which are theirs
  */
  app.post('/api/coi/disclosures/:id/financial-entities', allowedRoles('ANY'), upload.array('attachments'), wrapAsync(async (req, res) => {
    const result = await DisclosureDB.saveNewFinancialEntity(req.dbInfo, req.userInfo, req.params.id, JSON.parse(req.body.entity), req.files);
    res.send(result);
  }));

  /**
    User can only add declarations to disclosures which are theirs
  */
  app.post('/api/coi/disclosures/:id/declarations', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    req.body.disclosure_id = req.params.id; //eslint-disable-line camelcase
    const result = await DisclosureDB.saveDeclaration(req.dbInfo, req.userInfo.schoolId, req.params.id, req.body);
    res.send(result);
  }));

  /**
    User can only edit declarations on disclosures which are theirs
  */
  app.put('/api/coi/disclosures/:id/declarations/:declarationId', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    await DisclosureDB.saveExistingDeclaration(req.dbInfo, req.userInfo, req.params.id, req.params.declarationId, req.body);
    res.sendStatus(ACCEPTED);
  }));

  /**
    User can only answer questions on disclosures which are theirs
  */
  app.post('/api/coi/disclosures/:id/question-answers', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const result = await DisclosureDB.saveNewQuestionAnswer(req.dbInfo, req.userInfo.schoolId, req.params.id, req.body);
    res.send(result);
  }));

  /**
    User can only answer questions on disclosures which are theirs
  */
  app.put('/api/coi/disclosures/:id/question-answers/:questionId', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const result = await DisclosureDB.saveExistingQuestionAnswer(req.dbInfo, req.userInfo.schoolId, req.params.id, req.params.questionId, req.body);
    res.send(result);
  }));

  /**
    User can only submit disclosures which are theirs
  */
  app.put('/api/coi/disclosures/:id/submit', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    await DisclosureDB.submit(req.dbInfo, req.userInfo, req.params.id, req.headers.authorization, req.hostname);
    try {
      createAndSendSubmitNotification(req.dbInfo, req.hostname, req.headers.authorization, req.userInfo, req.params.id);
    } catch (err) {
      Log.error(err, req);
    }

    res.sendStatus(ACCEPTED);
  }));

  app.put('/api/coi/disclosures/:id/approve', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    const archiveId = await DisclosureDB.approve(req.dbInfo, req.body, req.userInfo.name, req.params.id, req.headers.authorization);
    try {
      createAndSendApproveNotification(req.dbInfo, req.hostname, req.userInfo, archiveId);
    } catch (err) {
      Log.error(err, req);
    }
    res.sendStatus(ACCEPTED);
  }));

  app.put('/api/coi/disclosures/:id/reject', allowedRoles(ADMIN), wrapAsync(async (req, res) => {
    await DisclosureDB.reject(req.dbInfo, req.userInfo, req.params.id);
    try {
      createAndSendSentBackNotification(req.dbInfo, req.hostname, req.userInfo, req.params.id);
    } catch (err) {
      Log.error(err, req);
    }
    res.sendStatus(ACCEPTED);
  }));

  /**
    Admin can add any, Reviewer can only add ones where they are a reviewer
  */
  app.post('/api/coi/disclosures/:id/comments', allowedRoles([ADMIN, REVIEWER]), wrapAsync(async (req, res, next) => {
    if (req.userInfo.coiRole === ROLES.REVIEWER) {
      const reviewerDisclosures = await getDisclosureIdsForReviewer(req.dbInfo, req.userInfo.schoolId);
      if (!reviewerDisclosures.includes(req.params.id)) {
        res.sendStatus(FORBIDDEN);
        return;
      }
    }

    const comment = req.body;
    comment.disclosureId = req.params.id;

    if (validateComment(comment)) {
      const result = await DisclosureDB.addComment(req.dbInfo, req.userInfo, comment);
      res.send(result[0]);
    } else {
      next(new Error('invalid comment body'));
    }
  }));

  /**
    Admin can add any, Reviewer can only add ones where they are a reviewer
  */
  app.put('/api/coi/disclosures/:disclosureId/comments/:id', allowedRoles([ADMIN, REVIEWER]), wrapAsync(async (req, res, next) => {
    if (req.userInfo.coiRole === ROLES.REVIEWER) {
      const reviewerDisclosures = await getDisclosureIdsForReviewer(req.dbInfo, req.userInfo.schoolId);
      if (!reviewerDisclosures.includes(req.params.disclosureId)) {
        res.sendStatus(FORBIDDEN);
        return;
      }
    }

    const comment = req.body;

    if (validateComment(comment)) {
      const result = await DisclosureDB.updateComment(req.dbInfo, req.userInfo, comment);
      res.send(result);
    } else {
      next(new Error('invalid comment body'));
    }
  }));

  /**
    User can only retrieve items if this disclosure is theirs
  */
  app.get('/api/coi/disclosures/:id/pi-review-items', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const result = await PIReviewDB.getPIReviewItems(req.dbInfo, req.userInfo, req.params.id);
    res.send(result);
  }));

  /**
    Can only delete answers if this disclosure is theirs
  */
  app.delete('/api/coi/disclosures/:id/question-answers', allowedRoles('ANY'), wrapAsync(async (req, res) => {
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
      await DisclosureDB.deleteAnswers(req.dbInfo, req.userInfo, req.params.id, toDelete);
      res.status(NO_CONTENT).end();
    }
    else {
      res.status(BAD_REQUEST).end();
    }
  }));

  /**
    Can only retrieve state of their disclosure
  */
  app.get('/api/coi/disclosures/:id/state', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    const result = await DisclosureDB.getCurrentState(req.dbInfo, req.userInfo, req.params.id);
    res.send(result);
  }));

  /**
    Can only save the state of their disclosure
  */
  app.post('/api/coi/disclosures/:id/state', allowedRoles('ANY'), wrapAsync(async (req, res) => {
    res.status(ACCEPTED).end();
    await DisclosureDB.saveCurrentState(req.dbInfo, req.userInfo, req.params.id, req.body);
  }));
};
