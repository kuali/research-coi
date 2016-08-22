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

import {
  createAdditionalReviewer,
  deleteAdditionalReviewer,
  updateAdditionalReviewer,
  getReviewerForDisclosureAndUser,
  getDisclosuresForReviewer,
  saveRecommendation,
  saveProjectRecommendation
} from '../db/additional-reviewer-db';
import { getReviewers } from '../services/auth-service/auth-service';
import { ROLES, DATE_TYPE } from '../../coi-constants';
const { ADMIN, REVIEWER } = ROLES;
import { allowedRoles } from '../middleware/role-check';
import { OK, ACCEPTED } from '../../http-status-codes';
import wrapAsync from './wrap-async';
import {
  createAndSendReviewerAssignedNotification,
  createAndSendReviewCompleteNotification,
  createAndSendReviewerUnassignNotification
} from '../services/notification-service/notification-service';
import useKnex from '../middleware/request-knex';

export const init = app => {
  app.post(
    '/api/coi/additional-reviewers',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async (req, res) =>
    {
      const {knex, body, userInfo, hostname, dbInfo} = req;
      let result;
      await knex.transaction(async (knexTrx) => {
        result = await createAdditionalReviewer(knexTrx, body, userInfo);
      });

      await createAndSendReviewerAssignedNotification(
        dbInfo,
        hostname,
        userInfo,
        result.id
      );

      res.send(result);
    }
  ));

  app.delete(
    '/api/coi/additional-reviewers/:id',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async (req, res) =>
    {
      const {knex, dbInfo, hostname, userInfo, params} = req;
      await knex.transaction(async (knexTrx) => {
        await deleteAdditionalReviewer(knexTrx, params.id);
      });
      await createAndSendReviewerUnassignNotification(
        dbInfo,
        hostname,
        userInfo,
        params.id
      );
      res.sendStatus(OK);
    }
  ));

  app.put(
    '/api/coi/additional-reviewers/:id',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async ({knex, params, body}, res) =>
    {
      await knex.transaction(async (knexTrx) => {
        await updateAdditionalReviewer(knexTrx, params.id, body);
      });
      res.sendStatus(OK);
    }
  ));

  app.put(
    '/api/coi/additional-reviewers/complete-review/:disclosureId',
    allowedRoles(REVIEWER),
    useKnex,
    wrapAsync(async (req, res) =>
    {
      const {knex, userInfo, params, dbInfo, hostname, headers} = req;
      let additionalReviewer;
      await knex.transaction(async (knexTrx) => {
        additionalReviewer = await getReviewerForDisclosureAndUser(
          knexTrx,
          userInfo.schoolId,
          params.disclosureId
        );
        const dates = JSON.parse(additionalReviewer[0].dates);
        dates.push({type: DATE_TYPE.COMPLETED, date: new Date()});
        const updates = {
          active: false,
          dates
        };
        await updateAdditionalReviewer(
          knexTrx,
          additionalReviewer[0].id,
          updates
        );
      });

      await createAndSendReviewCompleteNotification(
        dbInfo,
        hostname,
        headers.authorization,
        userInfo,
        additionalReviewer[0].id
      );
      res.sendStatus(OK);
    }
  ));

  app.get(
    '/api/coi/reviewers',
    allowedRoles([ADMIN, REVIEWER]),
    wrapAsync(async ({dbInfo, headers}, res) =>
    {
      const results = await getReviewers(dbInfo, headers.authorization);
      res.send(results);
    }
  ));

  app.get(
    '/api/coi/reviewers/disclosures',
    allowedRoles('ANY'),
    useKnex,
    wrapAsync(async ({knex, userInfo}, res) =>
    {
      const results = await getDisclosuresForReviewer(knex, userInfo.schoolId);
      res.send(results);
    }
  ));

  app.get(
    '/api/coi/reviewers/:disclosureId',
    allowedRoles(ADMIN),
    useKnex,
    wrapAsync(async ({query, dbInfo, headers, knex, params}, res) =>
    {
      if (!query.term) {
        res.send([]);
        return;
      }
      const availableReviewers = await getReviewers(
        dbInfo,
        headers.authorization
      );

      const existingReviewerIds = await getReviewerForDisclosureAndUser(
          knex,
          undefined,
          params.disclosureId
        ).map(reviewer => reviewer.userId);

      const queryTerm = query.term.toLowerCase();

      const matchingReviewers = availableReviewers.filter(potential => {
        const notFound = !existingReviewerIds.includes(potential.userId);
        const isMatch = potential.value.toLowerCase().includes(queryTerm);
        return notFound && isMatch;
      });

      res.send(matchingReviewers);
    }
  ));

  app.put(
    '/api/coi/reviewers/:disclosureId/recommend/:declarationId',
    allowedRoles([REVIEWER]),
    useKnex,
    wrapAsync(async ({knex, userInfo, params, body}, res) =>
    {
      await knex.transaction(async (knexTrx) => {
        await saveRecommendation(
          knexTrx,
          userInfo.schoolId,
          params.disclosureId,
          params.declarationId,
          body.dispositionCd
        );
      });
      res.sendStatus(ACCEPTED);
    }
  ));

  app.put(
    '/api/coi/reviewers/:disclosureId/recommendProject/:projectPersonId',
    allowedRoles([REVIEWER]),
    useKnex,
    wrapAsync(async ({knex, userInfo, params, body}, res) =>
    {
      await knex.transaction(async (knexTrx) => {
        await saveProjectRecommendation(
          knexTrx,
          userInfo.schoolId,
          params.disclosureId,
          params.projectPersonId,
          body.dispositionTypeCd
        );
      });
      res.sendStatus(ACCEPTED);
    }
  ));
};
