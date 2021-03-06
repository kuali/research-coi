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

import { DATE_TYPE } from '../../coi-constants';
import {addLoggers} from '../log';

const AdditionalReviewerDB = {};
export default AdditionalReviewerDB;

AdditionalReviewerDB.getAdditionalReviewer = async function (knex, id) {
  this.log.logArguments({id});

  const reviewer = await knex('additional_reviewer')
    .first(
      'name',
      'user_id as userId',
      'email',
      'disclosure_id as disclosureId',
      'dates',
      'title',
      'unit_name as unitName',
      'active',
      'assigned_by as assignedBy'
    )
    .where({id});

  if (reviewer && reviewer.dates) {
    reviewer.dates = JSON.parse(reviewer.dates);
  }
  return reviewer;
};

AdditionalReviewerDB.getDisclosuresForReviewer = async function(
    knex,
    schoolId
  ) {
  this.log.logArguments({schoolId});

  return await knex('additional_reviewer as ar')
    .select(
      'd.type_cd as typeCd',
      'd.status_cd as statusCd',
      'd.id',
      'd.config_id as configId',
      'ar.user_id as userId',
      'ar.disclosure_id as disclosureId',
      'ar.name',
      'd.submitted_by as reporter',
      'ar.email',
      'ar.title',
      'ar.unit_name as unitName',
      'ar.active',
      'ar.dates',
      'ar.assigned_by as assignedBy'
    )
    .innerJoin('disclosure as d', 'd.id', 'ar.disclosure_id')
    .where({
      'ar.user_id': schoolId,
      'ar.active': true
    });
};

AdditionalReviewerDB.getDisclosureIdsForReviewer = async function(
    knex,
    schoolId
  ) {
  this.log.logArguments({schoolId});

  const reviewers = await knex('additional_reviewer')
    .select('disclosure_id as disclosureId')
    .where({
      user_id: schoolId,
      active: true
    });

  return reviewers.map(reviewer => {
    return reviewer.disclosureId.toString();
  });
};

AdditionalReviewerDB.getReviewerForDisclosureAndUser = async function (
    knex,
    schoolId,
    disclosureId
  ) {
  this.log.logArguments({schoolId, disclosureId});

  const criteria = {
    disclosure_id: disclosureId,
    active: true
  };

  if (schoolId) {
    criteria.user_id = schoolId;
  }

  return knex('additional_reviewer')
    .select('id','dates', 'user_id as userId')
    .where(criteria);
};

AdditionalReviewerDB.createAdditionalReviewer = async function (
    knex,
    reviewer,
    displayName
  ) {
  this.log.logArguments({reviewer, displayName});

  reviewer.dates = [
    {
      type: DATE_TYPE.ASSIGNED,
      date: new Date()
    }
  ];

  const id = await knex('additional_reviewer')
    .insert({
      disclosure_id: reviewer.disclosureId,
      user_id: reviewer.userId,
      name: reviewer.name,
      email: reviewer.email,
      title: reviewer.title ? reviewer.title : null,
      unit_name: reviewer.unitName ? reviewer.unitName : null,
      active: true,
      dates: JSON.stringify(reviewer.dates),
      assigned_by: displayName
    }, 'id');

  reviewer.id = parseInt(id[0]);
  return reviewer;
};

AdditionalReviewerDB.unassignAdditionalReviewer = async function (knex, id) {
  this.log.logArguments({id});

  const preExistingDates = await knex
    .first('dates as dates')
    .from('additional_reviewer')
    .where({id});

  let dates;
  if (!preExistingDates || preExistingDates.dates.length === 0) {
    dates = [];
  }
  else {
    dates = JSON.parse(preExistingDates.dates);
  }
  dates.push({
    type: DATE_TYPE.UNASSIGNED,
    date: new Date()
  });

  return knex('additional_reviewer')
    .update({
      active: false,
      dates: JSON.stringify(dates)
    })
    .where({id});
};

AdditionalReviewerDB.updateAdditionalReviewer = function (knex, id, updates) {
  this.log.logArguments({id, updates});

  if (updates.dates) {
    updates.dates = JSON.stringify(updates.dates);
  }

  return knex('additional_reviewer')
    .update({
      active: updates.active,
      dates: updates.dates
    })
    .where({id});
};

AdditionalReviewerDB.findAdditionalReviewer = async function (
    knex,
    userId,
    disclosureId
  ) {
  this.log.logArguments({userId, disclosureId});

  return await knex('additional_reviewer')
    .first('id')
    .where({
      user_id: userId,
      disclosure_id: disclosureId
    });
};

AdditionalReviewerDB.saveRecommendation = async function (
    knex,
    schoolId,
    disclosureId,
    declarationId,
    dispositionType
  ) {
  this.log.logArguments({
    schoolId,
    disclosureId,
    declarationId,
    dispositionType
  });

  const additionalReviewer = await AdditionalReviewerDB.findAdditionalReviewer(
    knex,
    schoolId,
    disclosureId
  );

  if (!additionalReviewer) {
    throw new Error(
      `Attempt was made to save a recommendation for a user that isn't a reviewer on disclosure id ${disclosureId}` // eslint-disable-line max-len
    );
  }
  
  const additionalReviewerId = additionalReviewer.id;

  const exists = await knex('reviewer_recommendation')
    .first()
    .where({
      additional_reviewer_id: additionalReviewerId,
      declaration_id: declarationId
    });

  if (exists) {
    return knex('reviewer_recommendation')
      .update({
        disposition_type_id: dispositionType
      })
      .where({
        additional_reviewer_id: additionalReviewerId,
        declaration_id: declarationId
      });
  }

  return knex('reviewer_recommendation').insert({
    additional_reviewer_id: additionalReviewerId,
    declaration_id: declarationId,
    disposition_type_id: dispositionType
  });
};

AdditionalReviewerDB.saveProjectRecommendation = async function (
    knex,
    schoolId,
    disclosureId,
    projectPersonId,
    dispositionType
  ) {
  this.log.logArguments({
    schoolId,
    disclosureId,
    projectPersonId,
    dispositionType
  });

  const additionalReviewer = await AdditionalReviewerDB.findAdditionalReviewer(
    knex,
    schoolId,
    disclosureId
  );

  if (!additionalReviewer) {
    throw new Error(
      `Attempt was made to save a recommendation for a user that isn't a reviewer on disclosure id ${disclosureId}` // eslint-disable-line max-len
    );
  }
  
  const additionalReviewerId = additionalReviewer.id;

  const exists = await knex('reviewer_recommendation')
    .first()
    .where({
      additional_reviewer_id: additionalReviewerId,
      project_person_id: projectPersonId
    });

  if (exists) {
    return knex('reviewer_recommendation')
      .update({
        disposition_type_id: dispositionType
      })
      .where({
        additional_reviewer_id: additionalReviewerId,
        project_person_id: projectPersonId
      });
  }

  return knex('reviewer_recommendation').insert({
    additional_reviewer_id: additionalReviewerId,
    project_person_id: projectPersonId,
    disposition_type_id: dispositionType
  });
};

addLoggers({AdditionalReviewerDB});
