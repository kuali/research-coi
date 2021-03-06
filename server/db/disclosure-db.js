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

import { values, uniq, isDate, isString } from 'lodash';
import CommonDB from './common-db';
import { getReviewers } from '../services/auth-service/auth-service';
import ProjectDB from './project-db';
import ConfigDB from './config-db';
import {
  filterProjects,
  filterDeclarations
} from '../services/project-service/project-service';
import * as FileService from '../services/file-service/file-service';
import {
  createAndSendReviewerAssignedNotification
} from '../services/notification-service/notification-service';
import {camelizeJson} from './json-utils';
import {
  NO_DISPOSITION,
  ROLES,
  RELATIONSHIP_STATUS,
  FILE_TYPE,
  LANES,
  ENTITY_RELATIONSHIP,
  DISCLOSURE_STATUS,
  DATE_TYPE,
  SYSTEM_USER,
  STATE_TYPE
} from '../../coi-constants';
import {addLoggers, logError} from '../log';
const {
  IN_PROGRESS,
  REVISION_REQUIRED,
  UPDATE_REQUIRED,
  UP_TO_DATE,
  EXPIRED,
  SUBMITTED_FOR_APPROVAL,
  RETURNED
} = DISCLOSURE_STATUS;

const MILLIS = 1000;
const SECONDS = 60;
const MINUTES = 60;
const HOURS = 24;
const ONE_DAY = MILLIS * SECONDS * MINUTES * HOURS;

const DisclosureDB = {};
export default DisclosureDB;

let lane; // eslint-disable-line no-unused-vars
try {
  const extensions = require('research-extensions').default;
  lane = extensions.config.lane;
}
catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') {
    logError(err, null, 'DisclosureDB');
  }
  lane = process.env.LANE || LANES.PRODUCTION;
}

DisclosureDB.saveEntityRelationship = async function(knex, relationship) {
  this.log.logArguments({relationship});

  const relationshipId = await knex('relationship')
    .insert({
      fin_entity_id: relationship.finEntityId,
      relationship_cd: relationship.relationshipCd,
      person_cd: relationship.personCd,
      type_cd: !relationship.typeCd ? null : relationship.typeCd,
      amount_cd: !relationship.amountCd ? null : relationship.amountCd,
      comments: relationship.comments,
      status: RELATIONSHIP_STATUS.IN_PROGRESS
    }, 'id');

  relationship.id = parseInt(relationshipId[0]);

  if (relationship.relationshipCd === ENTITY_RELATIONSHIP.TRAVEL) {
    await knex('travel_relationship')
      .insert({
        relationship_id: relationshipId[0],
        amount: relationship.travel.amount,
        destination: relationship.travel.destination,
        start_date: new Date(relationship.travel.startDate),
        end_date: new Date(relationship.travel.endDate),
        reason: relationship.travel.reason
      }, 'id');
  }
};

DisclosureDB.saveEntityAnswer = async function(knex, answer, entityId) {
  this.log.logArguments({answer, entityId});

  const result = await knex('questionnaire_answer')
    .insert({
      question_id: answer.questionId,
      answer: JSON.stringify(answer.answer)
    }, 'id');

  answer.id = parseInt(result[0]);

  await knex('fin_entity_answer')
    .insert({
      fin_entity_id: entityId,
      questionnaire_answer_id: result[0]
    }, 'id');
};

DisclosureDB.saveEntityFile = async function(knex, file, entityId, userInfo) {
  this.log.logArguments({entityId, userInfo});

  const fileData = {
    file_type: FILE_TYPE.FINANCIAL_ENTITY,
    ref_id: entityId,
    type: file.mimetype,
    key: file.filename,
    name: file.originalname,
    user_id: userInfo.schoolId,
    uploaded_by: userInfo.displayName,
    upload_date: new Date()
  };

  const fileId = await knex('file')
      .insert(fileData, 'id');

  fileData.id = parseInt(fileId[0]);
  return fileData;
};

DisclosureDB.deleteEntityFile = async function(knex, dbInfo, fileId, fileKey) {
  this.log.logArguments({fileId, fileKey});

  await knex('file')
    .where('id', fileId)
    .del();

  await new Promise((resolve, rejectDelete) => {
    FileService.deleteFile(dbInfo, fileKey, err => {
      if (err) {
        this.log.error(`Failed to delete file ${fileKey}`);
        this.log.error(err);
        rejectDelete();
      } else {
        resolve();
      }
    });
  });
};

DisclosureDB.saveNewFinancialEntity = async function(
    knex,
    userInfo,
    disclosureId,
    financialEntity,
    files
  ) {
  this.log.logArguments({disclosureId, financialEntity});

  const isSubmitter = await CommonDB.isDisclosureUsers(
    knex,
    disclosureId,
    userInfo.schoolId
  );
  if (!isSubmitter) {
    throw Error(
      `Attempt by ${userInfo.username} to associate an entity with disclosure ${disclosureId} that isnt the users` // eslint-disable-line max-len
    );
  }

  await DisclosureDB.resetAdminRelationships(knex, disclosureId);
  await DisclosureDB.resetProjectDispositions(knex, disclosureId);

  const id = await knex('fin_entity')
    .insert({
      disclosure_id: disclosureId,
      active: financialEntity.active,
      name: financialEntity.name,
      status: RELATIONSHIP_STATUS.IN_PROGRESS
    }, 'id');

  financialEntity.id = parseInt(id[0]);

  for (const relationship of financialEntity.relationships) {
    relationship.finEntityId = financialEntity.id;
    await DisclosureDB.saveEntityRelationship(knex, relationship);
  }

  for (const answer of financialEntity.answers) {
    await DisclosureDB.saveEntityAnswer(knex, answer, financialEntity.id);
  }

  financialEntity.files = [];

  for (const file of files) {
    const fileData = await DisclosureDB.saveEntityFile(
      knex,
      file,
      financialEntity.id,
      userInfo
    );
    financialEntity.files.push(fileData);
  }

  const currentStatus = await DisclosureDB.getDisclosureStatus(
    knex,
    disclosureId
  );
  if (currentStatus !== IN_PROGRESS && currentStatus !== REVISION_REQUIRED) {
    if (await ProjectDB.entitiesNeedDeclaration(knex, parseInt(disclosureId))) {
      await DisclosureDB.updateDisclosureStatus(
        knex,
        disclosureId,
        UPDATE_REQUIRED
      );
    }
    else {
      await DisclosureDB.updateDisclosureStatus(
        knex,
        disclosureId,
        UP_TO_DATE
      );
    }
  }

  return financialEntity;
};

DisclosureDB.isEntityUsers = async function(knex, entityId, userId) {
  this.log.logArguments({entityId, userId});

  const rows = await knex.select('e.id')
    .from('fin_entity as e')
    .innerJoin('disclosure as d', 'd.id', 'e.disclosure_id')
    .where({
      'e.id': entityId,
      'd.user_id': userId
    });

  return rows.length > 0;
};

DisclosureDB.deleteEntityRelationship = async function(knex, relationshipId) {
  this.log.logArguments({relationshipId});

  await knex('travel_relationship')
    .del()
    .where('relationship_id', relationshipId);

  await knex('relationship')
    .del()
    .where('id', relationshipId);
};

DisclosureDB.updateEntityRelationships = async function(
    knex,
    entityId,
    newRelationships
  ) {
  this.log.logArguments({entityId, newRelationships});

  const existingRelationships = await knex
    .select('id')
    .from('relationship')
    .where('fin_entity_id', entityId);

  const relationshipsToDelete = existingRelationships.filter(
    existingRelationship => {
      const match = newRelationships.some(
        relationship => relationship.id === existingRelationship.id
      );
      return !match;
    }
  );
  
  for (const relationship of relationshipsToDelete) {
    await DisclosureDB.deleteEntityRelationship(knex, relationship.id);
  }

  for (const relationship of newRelationships) {
    if (isNaN(relationship.id)) {
      relationship.finEntityId = entityId;
      await DisclosureDB.saveEntityRelationship(knex, relationship);
    }
  }
};

DisclosureDB.saveExistingFinancialEntity = async function(
    dbInfo,
    knex,
    userInfo,
    entityId,
    body,
    uploadedFiles
  ) {
  this.log.logArguments({userInfo, entityId, body});

  const financialEntity = body;

  const isOwner = await DisclosureDB.isEntityUsers(
    knex,
    entityId,
    userInfo.schoolId
  );

  if (!isOwner) {
    throw Error(`Attempt by ${userInfo.username} to update entity ${entityId} not owned by user`); // eslint-disable-line max-len
  }

  const entityRecord = await knex
    .first('disclosure_id as disclosureId')
    .from('fin_entity')
    .where({
      id: entityId
    });

  await DisclosureDB.resetAdminRelationships(knex, entityRecord.disclosureId);
  await DisclosureDB.resetProjectDispositions(knex, entityRecord.disclosureId);

  await knex('fin_entity')
    .update({
      active: financialEntity.active,
      name: financialEntity.name
    })
    .where('id', entityId);

  await DisclosureDB.updateEntityRelationships(
    knex,
    entityId,
    financialEntity.relationships
  );

  for (const answer of financialEntity.answers) {
    if (answer.id) {
      await knex('questionnaire_answer')
        .update({
          question_id: answer.questionId,
          answer: JSON.stringify(answer.answer)
        })
        .where('id', answer.id);
    } else {
      await DisclosureDB.saveEntityAnswer(knex, answer, entityId);
    }
  }

  const existingFiles = await knex
    .select('id', 'key')
    .from('file')
    .where({
      ref_id: entityId,
      file_type: FILE_TYPE.FINANCIAL_ENTITY
    });

  if (existingFiles) {
    for (const existingFile of existingFiles) {
      const match = financialEntity.files.find(
        file => existingFile.id === file.id
      );
      if (!match) {
        await DisclosureDB.deleteEntityFile(
          knex,
          dbInfo,
          existingFile.id,
          existingFile.key
        );
      }
    }
  }

  for (const file of uploadedFiles) {
    const fileData = await DisclosureDB.saveEntityFile(
      knex,
      file,
      entityId,
      userInfo
    );
    financialEntity.files.push(fileData);
  }

  const currentStatus = await DisclosureDB.getDisclosureStatus(
    knex,
    entityRecord.disclosureId
  );
  if (currentStatus !== IN_PROGRESS && currentStatus !== REVISION_REQUIRED) {
    if (
      await ProjectDB.entitiesNeedDeclaration(knex, entityRecord.disclosureId)
    ) {
      await DisclosureDB.updateDisclosureStatus(
        knex,
        entityRecord.disclosureId,
        UPDATE_REQUIRED
      );
    }
    else {
      await DisclosureDB.updateDisclosureStatus(
        knex,
        entityRecord.disclosureId,
        UP_TO_DATE
      );
    }
  }

  return financialEntity;
};

DisclosureDB.getDisclosureStatus = async function(knex, id) {
  this.log.logArguments({id});

  const row = await knex
    .first('status_cd as statusCd')
    .from('disclosure')
    .where({id});

  if (!row) {
    return null;
  }

  return row.statusCd;
};

DisclosureDB.updateDisclosureStatus = async function(knex, id, status_cd) {
  this.log.logArguments({id, status_cd});

  await knex('disclosure')
    .update({status_cd})
    .where({id});
};

DisclosureDB.saveDeclaration = async function(
    knex,
    userId,
    disclosureId,
    record
  ) {
  this.log.logArguments({userId, disclosureId, record});

  const isSubmitter = await CommonDB.isDisclosureUsers(
    knex,
    disclosureId,
    userId
  );
  if (!isSubmitter) {
    throw Error(`Attempt by user id ${userId} to create a declaration for disclosure ${disclosureId} which isnt the users`); // eslint-disable-line max-len
  }

  const id = await knex('declaration')
    .insert({
      project_id: record.projectId,
      disclosure_id: disclosureId,
      fin_entity_id: record.finEntityId,
      type_cd: record.typeCd,
      comments: record.comments ? record.comments : null
    }, 'id');

  record.id = parseInt(id[0]);
  return record;
};

DisclosureDB.saveExistingDeclaration = async function(
    knex,
    userInfo,
    disclosureId,
    declarationId,
    record
  ) {
  this.log.logArguments({disclosureId, declarationId, record});

  const {typeCd, comments, adminRelationshipCd} = record;
  const isSubmitter = await CommonDB.isDisclosureUsers(
    knex,
    disclosureId,
    userInfo.schoolId
  );
  if (!isSubmitter && userInfo.coiRole !== ROLES.ADMIN) {
    throw Error(`Attempt by userId ${userInfo.schoolId} to save a declaration on disclosure ${disclosureId} which isnt theirs`); // eslint-disable-line max-len
  }

  return await knex('declaration')
    .update({
      type_cd: typeCd,
      comments,
      admin_relationship_cd: adminRelationshipCd ? adminRelationshipCd : null
    })
    .where({
      disclosure_id: disclosureId,
      id: declarationId
    });
};

DisclosureDB.saveNewQuestionAnswer = async function(
    knex,
    userId,
    disclosureId,
    body
  ) {
  this.log.logArguments({userId, disclosureId, body});

  const isSubmitter = await CommonDB.isDisclosureUsers(
    knex,
    disclosureId,
    userId
  );
  if (!isSubmitter) {
    throw Error(`Attempt by user id ${userId} to save a question answer on disclosure ${disclosureId} which isnt theirs`); // eslint-disable-line max-len
  }

  const answer = body;
  const result = await knex('questionnaire_answer')
    .insert({
      question_id: body.questionId,
      answer: JSON.stringify(body.answer)
    }, 'id');

  answer.id = parseInt(result[0]);
  await knex('disclosure_answer')
    .insert({
      disclosure_id: disclosureId,
      questionnaire_answer_id: result[0]
    }, 'id');

  return body;
};

DisclosureDB.saveExistingQuestionAnswer = async function(
    knex,
    userId,
    disclosureId,
    questionId,
    body
  ) {
  this.log.logArguments({userId, disclosureId, questionId, body});

  const isSubmitter = await CommonDB.isDisclosureUsers(
    knex,
    disclosureId,
    userId
  );

  if (!isSubmitter) {
    throw Error(`Attempt by user id ${userId} to save a question answer on disclosure ${disclosureId} which isnt theirs`); // eslint-disable-line max-len
  }

  const result = await knex
    .first('qa.id')
    .from('disclosure_answer as da')
    .innerJoin(
      'questionnaire_answer as qa',
      'da.questionnaire_answer_id',
      'qa.id'
    )
    .where('da.disclosure_id', disclosureId)
    .andWhere('qa.question_id', questionId);

  await knex('questionnaire_answer')
    .where('id', result.id)
    .update('answer', JSON.stringify(body.answer));

  return body;
};

DisclosureDB.retrieveComments = async function(knex, userInfo, disclosureId) {
  this.log.logArguments({disclosureId});

  const criteria = {
    disclosure_id: disclosureId
  };

  if (userInfo.coiRole === ROLES.USER) {
    criteria.pi_visible = true;
  }

  const query = knex.select(
      'id',
      'disclosure_id as disclosureId',
      'topic_section as topicSection',
      'topic_id as topicId',
      'text',
      'author',
      'editable',
      'user_role as userRole',
      'user_id as userId',
      'date',
      'pi_visible as piVisible',
      'reviewer_visible as reviewerVisible',
      'current'
    )
    .from('review_comment')
    .where(criteria);

  if (userInfo.coiRole === ROLES.REVIEWER) {
    query.andWhere(function() {
      this.where({
        reviewer_visible: true
      }).orWhere({
        user_id: userInfo.schoolId
      });
    });
  }

  const comments = await query;

  comments.forEach(comment => {
    comment.isCurrentUser = comment.userId == userInfo.schoolId; // eslint-disable-line eqeqeq, max-len
  });

  return comments;
};

DisclosureDB.flagPIReviewNeeded = async function(
    knex,
    disclosureId,
    section,
    id
  ) {
  this.log.logArguments({disclosureId, section, id});

  const rows = await knex.select('*')
    .from('pi_review')
    .where({
      disclosure_id: disclosureId,
      target_type: section,
      target_id: id
    });
    
  if (rows.length > 0) {
    return await knex('pi_review')
      .update({
        reviewed_on: null
      })
      .where({
        disclosure_id: disclosureId,
        target_type: section,
        target_id: id
      });
  }
  return await knex('pi_review').insert({
    disclosure_id: disclosureId,
    target_type: section,
    target_id: id
  }, 'id');
};

DisclosureDB.unflagPIReviewNeeded = async function(
    knex,
    disclosureId,
    section,
    id
  ) {
  this.log.logArguments({disclosureId, section, id});

  const result = await knex('review_comment')
    .count()
    .where({
      disclosure_id: disclosureId,
      topic_section: section,
      topic_id: id,
      pi_visible: true
    });

  const count = result[0]['count(*)'];

  if (count == 0) {
    return await knex('pi_review').delete()
      .where({
        disclosure_id: disclosureId,
        target_type: section,
        target_id: id
      });
  }
};

DisclosureDB.addGeneralComment = async function(knex, userInfo, comment) {
  this.log.logArguments({comment});

  await knex('general_comment')
    .insert({
      disclosure_id: comment.disclosureId,
      text: comment.text,
      user_id: userInfo.schoolId,
      author: `${userInfo.firstName} ${userInfo.lastName}`,
      user_role: userInfo.coiRole,
      date: new Date()
    }, 'id');
};

DisclosureDB.getGeneralComment = async function(knex, userInfo, disclosureId) {
  this.log.logArguments({disclosureId});

  return await knex
    .select('text as text')
    .from('general_comment')
    .where('disclosure_id', disclosureId);
};

DisclosureDB.addComment = async function(knex, userInfo, comment) {
  this.log.logArguments({comment});

  await knex('review_comment')
    .insert({
      disclosure_id: comment.disclosureId,
      topic_section: comment.topicSection,
      topic_id: comment.topicId,
      text: comment.text,
      user_id: userInfo.schoolId,
      author: `${userInfo.firstName} ${userInfo.lastName}`,
      user_role: userInfo.coiRole,
      date: new Date(),
      pi_visible: userInfo.coiRole === ROLES.ADMIN && comment.piVisible,
      reviewer_visible: (
        userInfo.coiRole === ROLES.ADMIN &&
        comment.reviewerVisible
      )
    }, 'id');

  const statements = [
    DisclosureDB.retrieveComments(knex, userInfo, comment.disclosureId)
  ];
  if (comment.piVisible) {
    statements.push(
      DisclosureDB.flagPIReviewNeeded(
        knex,
        comment.disclosureId,
        comment.topicSection,
        comment.topicId
      )
    );
  }
  return await Promise.all(statements);
};

DisclosureDB.updateComment = async function(knex, userInfo, comment) {
  this.log.logArguments({comment});

  await knex('review_comment')
    .update({
      text: comment.text,
      date: new Date(),
      pi_visible: userInfo.coiRole === ROLES.ADMIN && comment.piVisible,
      reviewer_visible: (
        userInfo.coiRole === ROLES.ADMIN &&
        comment.reviewerVisible
      )
    })
    .where({
      id: comment.id
    });

  if (comment.piVisible) {
    await DisclosureDB.flagPIReviewNeeded(
      knex,
      comment.disclosureId,
      comment.topicSection,
      comment.topicId
    );
  }
  else {
    await DisclosureDB.unflagPIReviewNeeded(
      knex,
      comment.disclosureId,
      comment.topicSection,
      comment.topicId
    );
  }

  return await DisclosureDB.retrieveComments(
    knex,
    userInfo,
    comment.disclosureId
  );
};

DisclosureDB.getDisclosure = async function(knex, userInfo, disclosureId) {
  this.log.logArguments({disclosureId});

  const criteria = {
    id: disclosureId
  };
  if (userInfo.coiRole !== ROLES.ADMIN && userInfo.coiRole !== ROLES.REVIEWER) {
    criteria.user_id = userInfo.schoolId;
  }

  return await knex
    .first(
      'de.id',
      'de.type_cd as typeCd',
      'de.title',
      'de.status_cd as statusCd',
      'de.submitted_by as submittedBy',
      'de.submitted_date as submittedDate',
      'de.revised_date as revisedDate',
      'de.start_date as startDate',
      'de.expired_date as expiredDate',
      'de.last_review_date as lastReviewDate',
      'de.config_id as configId',
      'de.returned_date as returnedDate',
      'de.resubmission_date as resubmissionDate'
  )
    .from('disclosure as de')
    .where(criteria);
};

DisclosureDB.getDeclarations = async function(
    dbInfo,
    knex,
    disclosureId,
    authHeader
  ) {
  this.log.logArguments({disclosureId});

  const declarations = await knex.select(
      'd.id as id',
      'd.project_id as projectId',
      'd.fin_entity_id as finEntityId',
      'd.type_cd as typeCd',
      'd.comments as comments',
      'd.admin_relationship_cd as adminRelationshipCd',
      'p.title as projectTitle',
      'p.source_identifier as sourceIdentifier',
      'fe.name as entityName',
      'p.type_cd as projectTypeCd',
      'pp.role_cd as roleCd',
      'pr.description as roleDescription',
      'fe.active as finEntityActive',
      'pp.id as projectPersonId',
      'pp.disposition_type_cd as dispositionTypeCd',
      'p.source_status as statusCd'
    )
    .from('declaration as d')
    .innerJoin('project as p', 'p.id', 'd.project_id')
    .innerJoin('project_person as pp', 'pp.project_id', 'p.id')
    .innerJoin('project_role as pr', function() {
      this.on('pr.source_role_cd', '=', 'pp.role_cd').
        andOn('pr.project_type_cd', '=', 'p.type_cd');
    })
    .innerJoin('disclosure as di', 'di.user_id', 'pp.person_id')
    .innerJoin('fin_entity as fe', function() {
      this.on('fe.id', 'd.fin_entity_id')
        .andOn('di.id', 'fe.disclosure_id');
    })
    .where({
      'd.disclosure_id': disclosureId,
      'pp.active': 1
    });

  if (declarations.length === 0) {
    return declarations;
  }

  let projectIds = declarations.map(declaration => declaration.projectId);
  projectIds = uniq(projectIds);

  const sponsors = await knex
    .distinct(
      'sponsor_name as sponsorName',
      'project_id as projectId',
      'sponsor_cd as sponsorCode'
    )
    .from('project_sponsor')
    .whereIn('project_id', projectIds);

  declarations.forEach(declaration => {
    declaration.sponsors = sponsors.filter(sponsor => {
      return sponsor.projectId === declaration.projectId;
    });
  });

  return filterDeclarations(dbInfo, declarations, authHeader);
};

DisclosureDB.getArchivedVersionList = async function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  return await knex.select(
      'id',
      'approved_date as approvedDate'
    ).from('disclosure_archive')
    .where('disclosure_id', disclosureId)
    .orderBy('approvedDate', 'DESC');
};

DisclosureDB.getEntities = async function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  return await knex.select(
      'e.id',
      'e.disclosure_id as disclosureId',
      'e.active',
      'e.name'
    )
    .from('fin_entity as e')
    .where('disclosure_id', disclosureId)
    .andWhereNot('status', RELATIONSHIP_STATUS.PENDING);
};

DisclosureDB.getQuestionAnswers = async function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  return await knex.select(
      'qa.id as id',
      'qa.question_id as questionId',
      'qa.answer as answer'
    )
    .from('disclosure_answer as da')
    .innerJoin(
      'questionnaire_answer as qa',
      'qa.id',
      'da.questionnaire_answer_id'
    )
    .where('da.disclosure_id', disclosureId);
};

DisclosureDB.getFileRecords = async function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  return await knex.select('id', 'name', 'key', 'file_type as fileType')
    .from('file')
    .whereIn('file_type', [FILE_TYPE.DISCLOSURE, FILE_TYPE.ADMIN])
    .andWhere({
      ref_id: disclosureId
    });
};

DisclosureDB.getManagementPlans = async function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  return await knex.select('id', 'name', 'key')
    .from('file')
    .where({
      ref_id: disclosureId,
      file_type: FILE_TYPE.MANAGEMENT_PLAN
    });
};

DisclosureDB.addRecommendationsForReviewer = async function(
    knex,
    disclosure,
    userId
  ) {
  this.log.logArguments({userId});

  const recommendations = await knex.select(
      'r.declaration_id as declarationId',
      'r.project_person_id as projectPersonId',
      'r.disposition_type_id as dispositionTypeId'
    )
    .from('reviewer_recommendation as r')
    .innerJoin(
      'additional_reviewer as a',
      'r.additional_reviewer_id',
      'a.id'
    )
    .where({
      'a.user_id': userId,
      'a.disclosure_id': disclosure.id
    });

  recommendations.forEach(recommendation => {
    if (recommendation.projectPersonId) {
      if (!disclosure.recommendedProjectDispositions) {
        disclosure.recommendedProjectDispositions = [];
      }

      disclosure.recommendedProjectDispositions.push({
        projectPersonId: recommendation.projectPersonId,
        disposition: recommendation.dispositionTypeId
      });
    } else {
      const decl = disclosure.declarations.find(declaration => {
        return declaration.id === recommendation.declarationId;
      });
      if (decl) {
        decl.reviewerRelationshipCd = recommendation.dispositionTypeId;
      }
    }
  });

  return disclosure;
};

DisclosureDB.addRecommendationsForAdmin = async function(knex, disclosure) {
  const recommendations = await knex.select(
      'r.declaration_id as declarationId',
      'r.project_person_id as projectPersonId',
      'r.disposition_type_id as dispositionTypeId',
      'a.name as usersName'
    )
    .from('reviewer_recommendation as r')
    .innerJoin(
      'additional_reviewer as a',
      'r.additional_reviewer_id',
      'a.id'
    )
    .where({
      'a.disclosure_id': disclosure.id
    })
    .orderBy('r.disposition_type_id');

  recommendations.forEach(recommendation => {
    let decl;
    if (recommendation.declarationId) {
      decl = disclosure.declarations.find(declaration => {
        return declaration.id === recommendation.declarationId;
      });

      if (decl) {
        if (!decl.recommendations) {
          decl.recommendations = [];
        }

        decl.recommendations.push({
          usersName: recommendation.usersName,
          dispositionTypeCd: recommendation.dispositionTypeId
        });
      }
    } else if (recommendation.projectPersonId) {
      if (!disclosure.recommendedProjectDispositions) {
        disclosure.recommendedProjectDispositions = [];
      }

      disclosure.recommendedProjectDispositions.push({
        usersName: recommendation.usersName,
        projectPersonId: recommendation.projectPersonId,
        disposition: recommendation.dispositionTypeId
      });
    }
  });

  return disclosure;
};

DisclosureDB.getAdditionalReviewers = async function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  const reviewers = await knex('additional_reviewer')
    .select(
      'id',
      'disclosure_id as disclosureId',
      'user_id as userId',
      'name',
      'email',
      'title',
      'unit_name as unitName',
      'active',
      'dates'
    )
    .where({disclosure_id: disclosureId});

  return reviewers.map(reviewer => {
    reviewer.dates = JSON.parse(reviewer.dates);
    return reviewer;
  });
};

DisclosureDB.addRelationships = async function(knex, disclosure) {
  const relationships = await knex.select(
      'r.id',
      'r.fin_entity_id as finEntityId',
      'r.relationship_cd as relationshipCd',
      'r.person_cd as personCd',
      'r.type_cd as typeCd',
      'r.amount_cd as amountCd',
      'r.comments'
    )
    .from('relationship as r')
    .whereIn('fin_entity_id', disclosure.entities.map(entity => entity.id))
    .andWhereNot('status', RELATIONSHIP_STATUS.PENDING);

  const travels = await knex('travel_relationship')
    .select(
      'amount',
      'destination',
      'start_date as startDate',
      'end_date as endDate',
      'reason',
      'relationship_id as relationshipId'
    )
    .whereIn(
      'relationship_id',
      relationships.map(relationship => { return relationship.id; })
    );

  disclosure.entities.forEach(entity => {
    entity.relationships = relationships.filter(relationship => {
      return relationship.finEntityId === entity.id;
    }).map(relationship => {
      const travel = travels.find(item => {
        return item.relationshipId === relationship.id;
      });
      relationship.travel = travel ? travel : {};
      return relationship;
    });
  });

  return disclosure;
};

DisclosureDB.addEntityFileRecords = async function(knex, disclosure) {
  const files = await knex.select('*')
    .from('file')
    .whereIn('ref_id', disclosure.entities.map(entity => entity.id))
    .andWhere('file_type', FILE_TYPE.FINANCIAL_ENTITY);

  disclosure.entities.forEach(entity => {
    entity.files = files.filter(file => {
      return file.ref_id === entity.id;
    });
  });

  return disclosure;
};

DisclosureDB.updateDisclosuresConfig = async function(knex, disclosure) {
  await knex('disclosure')
    .update({config_id: disclosure.configId})
    .where({id: disclosure.id});
};

DisclosureDB.addEntityQuestionAnswers = async function(knex, disclosure) {
  const answers = await knex.select(
      'qa.question_id as questionId',
      'qa.answer as answer',
      'fea.fin_entity_id as finEntityId',
      'qa.id as id'
    )
    .from('questionnaire_answer as qa' )
    .innerJoin(
      'fin_entity_answer as fea',
      'fea.questionnaire_answer_id',
      'qa.id'
    )
    .whereIn(
      'fea.fin_entity_id',
      disclosure.entities.map(entity => entity.id)
    );

  disclosure.entities.forEach(entity => {
    entity.answers = answers.filter(answer => {
      return answer.finEntityId === entity.id;
    }).map(answer => {
      answer.answer = JSON.parse(answer.answer);
      return answer;
    });
  });

  return disclosure;
};

DisclosureDB.get = async function(
    dbInfo,
    knex,
    userInfo,
    disclosureId,
    authHeader
  ) {
  this.log.logArguments({disclosureId});

  const [
    disclosureRecord,
    entityRecords,
    answerRecords,
    declarationRecords,
    commentRecords,
    fileRecords,
    managementPlans,
    additionalReviewers,
    isOwner,
    latestConfigId,
    archivedVersions
  ] = await Promise.all([
    DisclosureDB.getDisclosure(knex, userInfo, disclosureId),
    DisclosureDB.getEntities(knex, disclosureId),
    DisclosureDB.getQuestionAnswers(knex, disclosureId),
    DisclosureDB.getDeclarations(dbInfo, knex, disclosureId, authHeader),
    DisclosureDB.retrieveComments(knex, userInfo, disclosureId),
    DisclosureDB.getFileRecords(knex, disclosureId),
    DisclosureDB.getManagementPlans(knex, disclosureId),
    DisclosureDB.getAdditionalReviewers(knex, disclosureId),
    CommonDB.isDisclosureUsers(knex, disclosureId, userInfo.schoolId),
    ConfigDB.getLatestConfigsId(knex),
    DisclosureDB.getArchivedVersionList(knex, disclosureId)
  ]);

  const { coiRole } = userInfo;
  if (coiRole !== ROLES.ADMIN && coiRole !== ROLES.REVIEWER) {
    if (!isOwner) {
      throw Error(`Attempt by ${userInfo.username} to load disclosure ${disclosureId} which is not theirs`); // eslint-disable-line max-len
    }
  }

  const phaseTwoSteps = [];
  const disclosure = disclosureRecord;
  disclosure.entities = entityRecords;
  disclosure.answers = answerRecords;
  disclosure.declarations = declarationRecords;
  disclosure.archivedVersions = archivedVersions;
  if (coiRole === ROLES.REVIEWER) {
    phaseTwoSteps.push(
      DisclosureDB.addRecommendationsForReviewer(
        knex,
        disclosure,
        userInfo.schoolId
      )
    );
  } else if (coiRole === ROLES.ADMIN) {
    phaseTwoSteps.push(
      DisclosureDB.addRecommendationsForAdmin(knex, disclosure)
    );
  }
  disclosure.comments = commentRecords;
  disclosure.files = fileRecords;
  disclosure.managementPlan = managementPlans;
  disclosure.reviewers = additionalReviewers;
  disclosure.answers.forEach(answer => {
    answer.answer = JSON.parse(answer.answer);
  });

  if (disclosure.answers.length < 1) {
    disclosure.configId = latestConfigId;
  }

  phaseTwoSteps.push(
    DisclosureDB.addRelationships(knex, disclosure)
  );

  phaseTwoSteps.push(
    DisclosureDB.addEntityQuestionAnswers(knex, disclosure)
  );

  phaseTwoSteps.push(
    DisclosureDB.addEntityFileRecords(knex, disclosure)
  );

  phaseTwoSteps.push(
    DisclosureDB.updateDisclosuresConfig(knex, disclosure)
  );

  await Promise.all(phaseTwoSteps);
  return disclosure;
};

DisclosureDB.getAnnualDisclosure = async function(
    dbInfo,
    knex,
    userInfo,
    piName,
    authHeader
  ) {
  this.log.logArguments({piName});

  const result = await knex('disclosure')
    .first('id as id')
    .where('type_cd', 2)
    .andWhere('user_id', userInfo.schoolId);

  if (result) {
    return DisclosureDB.get(dbInfo, knex, userInfo, result.id, authHeader);
  }

  const configId = await ConfigDB.getLatestConfigsId(knex);
  const newDisclosure = {
    type_cd: 2,
    status_cd: 1,
    start_date: new Date(),
    user_id: userInfo.schoolId,
    submitted_by: piName,
    config_id: configId
  };
  const id = await knex('disclosure').insert(newDisclosure, 'id');
  newDisclosure.id = parseInt(id[0]);
  newDisclosure.answers = [];
  newDisclosure.entities = [];
  newDisclosure.declarations = [];

  return camelizeJson(newDisclosure);
};

DisclosureDB.getSummariesForReview = async function(
    knex,
    sortColumn,
    sortDirection,
    start,
    filters,
    reviewerDisclosures,
    pageSize
  ) {
  this.log.logArguments({
    sortColumn,
    sortDirection,
    start,
    filters,
    reviewerDisclosures,
    pageSize
  });

  const query = knex('disclosure as d');
  const columnsToSelect = [
    'd.submitted_by',
    'd.revised_date',
    'd.status_cd as statusCd',
    'd.id',
    'd.submitted_date',
    'd.config_id as configId'
  ];

  let validTypeCds = [];
  if (Array.isArray(filters.disposition)) {
    query.distinct();
    columnsToSelect.push(
      'project_person.disposition_type_cd as dispositionTypeCd'
    );

    validTypeCds = filters.disposition.filter(typeCd => !isNaN(typeCd));
    query.leftJoin(
      'declaration as de',
      'd.id',
      'de.disclosure_id'
    );
    query.leftJoin('project_person', function() {
      this.on(
        'de.project_id', 'project_person.project_id'
      ).andOn(
        'd.user_id', 'project_person.person_id'
      );
    });
  }

  let reviewJoinMade = false;
  if (filters.reviewStatus) {
    const {reviewStatus} = filters;

    if (!reviewStatus.assigned && !reviewStatus.notAssigned) {
      query.where('status_cd', -99999999); // return no rows
    }
    else if (reviewStatus.assigned && !reviewStatus.notAssigned) {
      if (!reviewJoinMade) {
        reviewJoinMade = true;
        query.innerJoin('additional_reviewer as ar',
          'd.id',
          'ar.disclosure_id'
        );
        query.where('ar.active', true);
      }
    }
    else if (!reviewStatus.assigned && reviewStatus.notAssigned) {
      if (!reviewJoinMade) {
        reviewJoinMade = true;
        query.leftJoin('additional_reviewer as ar',
          'd.id',
          'ar.disclosure_id'
        );
        query.where(function() {
          this.whereNull('ar.id').orWhere('ar.active', false);
        });
      }
    }
  }

  if (filters.reviewers) {
    if (!reviewJoinMade) {
      reviewJoinMade = true;
      query.innerJoin('additional_reviewer as ar',
        'd.id',
        'ar.disclosure_id'
      );
    }

    query.where('ar.user_id', 'in', filters.reviewers);
  }

  query.select(columnsToSelect);

  if (filters.date) {
    if (filters.date.start && !isNaN(filters.date.start)) {
      query.where(function() {
        this.where(function() {
          this.whereNotNull('d.revised_date')
            .andWhere('d.revised_date', '>=', new Date(filters.date.start));
        });
        this.orWhere(function() {
          this.whereNull('d.revised_date')
            .andWhere('d.submitted_date', '>=', new Date(filters.date.start));
        });
      });
    }

    if (filters.date.end && !isNaN(filters.date.end)) {
      query.where(function() {
        this.where(function() {
          this.whereNotNull('d.revised_date')
            .andWhere(
              'd.revised_date',
              '<=',
              new Date(filters.date.end + ONE_DAY)
            );
        });
        this.orWhere(function() {
          this.whereNull('d.revised_date')
            .andWhere(
              'd.submitted_date',
              '<=',
              new Date(filters.date.end + ONE_DAY)
            );
        });
      });
    }
  }
  if (filters.status) {
    query.whereIn('d.status_cd', filters.status);
  }
  if (filters.submittedBy) {
    query.where('d.submitted_by', filters.submittedBy);
  }
  if (filters.search) {
    query.where(function() {
      this.where('d.submitted_by', 'like', `%${filters.search}%`);
    });
  }

  let dbSortColumn;
  const dbSortDirection = sortDirection === 'DESCENDING' ? 'desc' : undefined;
  switch (sortColumn) {
    case 'SUBMITTED_DATE':
      dbSortColumn = 'd.submitted_date';
      break;
    case 'STATUS':
      dbSortColumn = 'statusCd';
      break;
    case 'TYPE':
      dbSortColumn = 'd.type';
      break;
    default:
      dbSortColumn = 'd.submitted_by';
      break;
  }

  if (reviewerDisclosures) {
    query.whereIn('d.id', reviewerDisclosures);
  }

  query.orderBy(dbSortColumn, dbSortDirection);
  query.orderBy('d.id', 'desc');
  query.limit(pageSize);

  let queryResult = await query.offset(Number(start));

  if (Array.isArray(filters.disposition)) {
    const includeNone = validTypeCds.includes(NO_DISPOSITION);
    queryResult = queryResult.reduce((result, row) => {
      if (validTypeCds.includes(row.dispositionTypeCd) || includeNone) {
        result[row.id] = row;
      }
      return result;
    }, {});
    queryResult = values(queryResult);
  }

  return queryResult;
};

DisclosureDB.getSummariesForReviewCount = async function(knex, filters) {
  this.log.logArguments({filters});

  const results = await DisclosureDB.getSummariesForReview(
    knex,
    null,
    'DESCENDING',
    0,
    filters,
    undefined,
    999999
  );
  return [{rowcount: results.length}];
};

DisclosureDB.getSummariesForUser = async function(knex, userId) {
  this.log.logArguments({userId});

  const summaries = await knex
    .select(
      'expired_date',
      'type_cd as type',
      'title',
      'status_cd as status',
      'last_review_date',
      'id',
      'config_id as configId'
    )
    .from('disclosure as d')
    .where('d.user_id', userId);

  const entityCounts = await knex
    .count('disclosure_id as entityCount')
    .select('disclosure_id as disclosureId')
    .from('fin_entity')
    .whereIn('disclosure_id', summaries.map(s => s.id))
    .andWhere('active', true)
    .groupBy('disclosure_id');

  return summaries.map(summary => {
    const count = entityCounts.find(c => c.disclosureId === summary.id);
    summary.entityCount = count ? count.entityCount : 0;
    return summary;
  });
};

DisclosureDB.updateEntitiesAndRelationshipsStatuses = async function(
    knex,
    disclosureId,
    oldStatus,
    newStatus
  ) {
  this.log.logArguments({disclosureId, oldStatus, newStatus});

  await knex('fin_entity')
    .update({status: newStatus})
    .where('disclosure_id', disclosureId)
    .andWhere('status', oldStatus);

  const results = await knex('fin_entity')
    .select('id')
    .where('disclosure_id', disclosureId);

  await Promise.all(
    results.map(result => {
      const update = {};
      update.status = newStatus;
      if (newStatus === RELATIONSHIP_STATUS.DISCLOSED) {
        update.disclosed_date = new Date();
      }

      return knex('relationship')
        .update(update)
        .where('fin_entity_id', result.id)
        .andWhere('status', oldStatus);
    })
  );
};

DisclosureDB.updateExpirationToRollingDate = async function(knex) {
  if (CommonDB.usingMySql(knex)) {
    await knex('disclosure')
      .update({
        expired_date: knex.raw('submitted_date + interval 1 year')
      })
      .whereNot({
        status_cd: EXPIRED
      });
  }
  else {
    await knex('disclosure')
      .update({
        expired_date: knex.raw('"submitted_date" + interval \'1\' year')
      })
      .whereNot({
        status_cd: EXPIRED
      });
  }
};

DisclosureDB.updateExpirationToStaticDate = async function(
    knex,
    expirationDate
  ) {
  this.log.logArguments({expirationDate});

  if (!isDate(expirationDate)) {
    throw Error('Invalid expiration date');
  }

  await knex('disclosure')
    .update({
      expired_date: expirationDate
    })
    .whereNot({
      status_cd: EXPIRED
    });
};

DisclosureDB.getRollingExpirationDate = function(date) {
  this.log.logArguments({date});

  return new Date(date.setFullYear(date.getFullYear() + 1));
};

DisclosureDB.getStaticExpirationDate = function(date, dueDate) {
  this.log.logArguments({date, dueDate});

  const dueMonthDay = dueDate.getMonth() + dueDate.getDay();
  const approveMonthDay = date.getMonth() + date.getDay();

  if (approveMonthDay < dueMonthDay) {
    return new Date(dueDate.setFullYear(date.getFullYear()));
  }

  return new Date(dueDate.setFullYear(date.getFullYear() + 1));
};

DisclosureDB.approveDisclosure = async function(
    knex,
    disclosureId,
    expiredDate,
    userId,
    dbInfo,
    authHeader
  ) {
  this.log.logArguments({disclosureId, expiredDate, userId});

  const disclosure = await knex('disclosure')
    .first('user_id as userId')
    .where({id: disclosureId});

  const projects = await ProjectDB.getProjects(
    knex,
    disclosure.userId
  );

  const entities = await DisclosureDB.getEntities(knex, disclosureId);
  const activeEntitiesExist = entities.some(entity => entity.active === 1);
  let status = UP_TO_DATE;

  const generalConfig = await ConfigDB.getGeneralConfig(knex);
  if (!generalConfig.config.disableNewProjectStatusUpdateWhenNoEntities
    || activeEntitiesExist) {
    const requiredProjects = await filterProjects(dbInfo, projects, authHeader);
    const newActiveProjects = requiredProjects.filter(
      project => project.new === 1
    );
    if (newActiveProjects.length > 0) {
      status = UPDATE_REQUIRED;
    }
  }

  await knex('disclosure')
    .update({
      expired_date: expiredDate,
      status_cd: status,
      last_review_date: new Date()
    })
    .where('id', disclosureId);
};

DisclosureDB.getDisclosureDisposition = async function(knex, declarations, id) {
  this.log.logArguments({declarations, id});

  const config = await knex('config')
    .first('config')
    .where({id});

  const {dispositionTypes} = JSON.parse(config.config);
  if (dispositionTypes && dispositionTypes.length > 0) {
    dispositionTypes.sort((a,b) => {
      return b.order - a.order;
    });

    const dispositions = declarations.map(declaration => {
      const dispostion = dispositionTypes.find(dispositionType => {
        return (
          String(dispositionType.typeCd) === String(declaration.dispositionTypeCd) // eslint-disable-line max-len
        );
      });
      return dispostion;
    });

    dispositions.sort((a,b) => {
      return a.order - b.order;
    });

    if (dispositions[0]) {
      return dispositions[0].description;
    }

    if (dispositionTypes[0]) {
      return dispositionTypes[0].description;
    }
  }

  return undefined;
};

DisclosureDB.archiveDisclosure = async function(
    knex,
    disclosureId,
    approverName,
    disclosure
  ) {
  this.log.logArguments({disclosureId, approverName});

  disclosure.disposition = await DisclosureDB.getDisclosureDisposition(
    knex,
    disclosure.declarations,
    disclosure.configId
  );

  return knex('disclosure_archive')
    .insert({
      disclosure_id: disclosureId,
      approved_date: new Date(),
      approved_by: approverName,
      disclosure: JSON.stringify(disclosure)
    }, 'id');
};

DisclosureDB.deleteComments = async function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  await knex('review_comment')
    .del()
    .where('disclosure_id', disclosureId);
};

DisclosureDB.deleteAnswersForDisclosure = async function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  const result = await knex('disclosure_answer')
    .select('questionnaire_answer_id')
    .where('disclosure_id', disclosureId);

  await knex('disclosure_answer')
    .del()
    .where('disclosure_id', disclosureId);

  const idsToDelete = result.map(disclosureAnswer => {
    return disclosureAnswer.questionnaire_answer_id;
  });

  await knex('questionnaire_answer')
    .del()
    .whereIn('id', idsToDelete);
};

DisclosureDB.deletePIReviewsForDisclsoure = function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  return knex('pi_review')
    .del()
    .where('disclosure_id', disclosureId);
};

DisclosureDB.deleteAdditionalReviewers = async function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  await knex('reviewer_recommendation')
    .del()
    .whereIn('additional_reviewer_id', function() {
      this.select('id')
        .from('additional_reviewer')
        .where({
          disclosure_id: disclosureId
        });
    });

  return knex('additional_reviewer')
    .del()
    .where('disclosure_id', disclosureId);
};

DisclosureDB.resetProjectDispositions = async function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  const disclosure = await knex('disclosure')
    .first('user_id')
    .where({
      id: disclosureId
    });

  return knex('project_person')
    .update({
      disposition_type_cd: null
    })
    .where({
      person_id: disclosure.user_id
    });
};

DisclosureDB.resetAdminRelationships = function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  return knex('declaration')
    .update({
      admin_relationship_cd: null
    })
    .where({
      disclosure_id: disclosureId
    });
};

DisclosureDB.approve = async function(
    dbInfo,
    knex,
    disclosure,
    displayName,
    disclosureId,
    authHeader
  ) {
  this.log.logArguments({displayName, disclosureId});

  disclosure.statusCd = UP_TO_DATE;
  disclosure.lastReviewDate = new Date();

  const [config, archivedDisclosure] = await Promise.all([
    knex('config')
      .first('config')
      .orderBy('id', 'desc'),
    DisclosureDB.archiveDisclosure(
      knex,
      disclosureId,
      displayName,
      disclosure
    ),
    DisclosureDB.deleteComments(knex, disclosureId),
    DisclosureDB.deleteAnswersForDisclosure(knex, disclosureId),
    DisclosureDB.deletePIReviewsForDisclsoure(knex, disclosureId),
    DisclosureDB.deleteAdditionalReviewers(knex, disclosureId),
    DisclosureDB.updateEntitiesAndRelationshipsStatuses(
      knex,
      disclosureId,
      RELATIONSHIP_STATUS.PENDING,
      RELATIONSHIP_STATUS.IN_PROGRESS
    )
  ]);

  const generalConfig = JSON.parse(config.config).general;
  let expiredDate;
  if (generalConfig.isRollingDueDate) {
    expiredDate = DisclosureDB.getRollingExpirationDate(
      new Date(disclosure.submittedDate)
    );
  }
  else {
    expiredDate = DisclosureDB.getStaticExpirationDate(
      new Date(disclosure.submittedDate),
      new Date(generalConfig.dueDate)
    );
  }
  await DisclosureDB.approveDisclosure(
    knex,
    disclosureId,
    expiredDate,
    disclosure.userId,
    dbInfo,
    authHeader
  );

  return parseInt(archivedDisclosure[0]);
};

DisclosureDB.updateStatus = function(knex, name, disclosureId) {
  this.log.logArguments({name, disclosureId});

  if (!isString(name) || name.length === 0) {
    throw Error(`Invalid name: ${name}`);
  }
  if (!Number.isInteger(disclosureId) || disclosureId < 0) {
    throw Error(`Invalid disclosure id: ${disclosureId}`);
  }

  return knex('disclosure')
    .update({
      status_cd: SUBMITTED_FOR_APPROVAL,
      submitted_by: name,
      submitted_date: new Date()
    })
    .where('id', disclosureId);
};

DisclosureDB.updateProjects = async function(knex, schoolId) {
  this.log.logArguments({schoolId});

  await knex('project_person')
    .update({
      new: false
    })
    .where({
      person_id: schoolId,
      active: true
    });
};

DisclosureDB.addAdditionalReviewer = async function(
    knex,
    reviewer,
    disclosureId
  ) {
  this.log.logArguments({reviewer, disclosureId});

  try {
    const newId = await knex('additional_reviewer')
      .insert({
        user_id: reviewer.userId,
        disclosure_id: disclosureId,
        name: reviewer.value,
        email: reviewer.email,
        active: true,
        dates: JSON.stringify([{
          type: DATE_TYPE.ASSIGNED,
          date: new Date()
        }]),
        assigned_by: SYSTEM_USER
      }, 'id');

    return parseInt(newId[0]);
  } catch (err) {
    this.log.info(
      `reviewer ${reviewer.userId} already added to disclosure ${disclosureId}`
    );
    return null;
  }
};

DisclosureDB.addAdditionalReviewers = async function(
    knex,
    dbInfo,
    authHeader,
    disclosureId,
    userInfo
  ) {
  this.log.logArguments({disclosureId});

  const reviewers = await getReviewers(
    dbInfo,
    authHeader,
    userInfo.primaryDepartmentCode
  );

  return await Promise.all(
    reviewers
      .filter(reviewer => {
        return reviewer.userId !== userInfo.schoolId;
      })
      .map(reviewer => {
        return DisclosureDB.addAdditionalReviewer(knex, reviewer, disclosureId);
      })
  );
};

DisclosureDB.submit = async function(
    dbInfo,
    knex,
    userInfo,
    disclosureId,
    authHeader,
    hostName
  ) {
  this.log.logArguments({disclosureId, hostName});

  const isSubmitter = await CommonDB.isDisclosureUsers(
    knex,
    disclosureId,
    userInfo.schoolId
  );

  if (!isSubmitter) {
    throw Error(`Attempt by ${userInfo.username} to submit disclosure ${disclosureId} which isnt theirs`); // eslint-disable-line max-len
  }

  let reviewerIds;

  await DisclosureDB.updateStatus(
    knex,
    userInfo.displayName,
    Number(disclosureId)
  );
  await DisclosureDB.updateEntitiesAndRelationshipsStatuses(
    knex,
    disclosureId,
    RELATIONSHIP_STATUS.IN_PROGRESS,
    RELATIONSHIP_STATUS.DISCLOSED
  );
  await DisclosureDB.updateProjects(knex, userInfo.schoolId);

  const disclosure = await DisclosureDB.get(
    dbInfo,
    knex,
    userInfo,
    disclosureId,
    authHeader,
    knex
  );
  const config = await knex('config')
    .first('config')
    .where({id: disclosure.configId});

  const generalConfig = JSON.parse(config.config).general;

  if (generalConfig.autoAddAdditionalReviewer) {
    reviewerIds = await DisclosureDB.addAdditionalReviewers(
      knex,
      dbInfo,
      authHeader,
      disclosureId,
      userInfo
    );
  }

  if (generalConfig.autoApprove) {
    const count = await knex('fin_entity')
      .count('id as count')
      .where({
        active: true,
        disclosure_id: disclosureId
      });

    if (count[0].count === 0) {
      await DisclosureDB.approve(
        dbInfo,
        knex,
        disclosure,
        SYSTEM_USER,
        disclosureId,
        authHeader,
        knex
      );
    }
  }

  if (Array.isArray(reviewerIds)) {
    for (let i = 0; i < reviewerIds.length; i++) {
      if (reviewerIds[i] === null) {
        continue;
      }

      await createAndSendReviewerAssignedNotification(
        dbInfo,
        hostName,
        userInfo,
        reviewerIds[i]
      );
    }
  }
};

DisclosureDB.updateEditableComments = async function(knex, disclosureId) {
  this.log.logArguments({disclosureId});

  await knex('review_comment')
    .update({editable: false})
    .where({disclosure_id: disclosureId});
};

DisclosureDB.reject = async function(knex, userInfo, disclosureId) {
  this.log.logArguments({disclosureId});

  await knex('disclosure')
    .update({
      status_cd: REVISION_REQUIRED,
      last_review_date: new Date()
    })
    .where('id', disclosureId);

  return DisclosureDB.updateEditableComments(knex, disclosureId);
};

DisclosureDB.returnToReporter = async function(knex, userInfo, disclosureId) {
  this.log.logArguments({disclosureId});

  await knex('disclosure')
    .update({
      status_cd: RETURNED,
      last_review_date: new Date(),
      returned_date: new Date()
    })
    .where('id', disclosureId);

  return DisclosureDB.updateEditableComments(knex, disclosureId);
};

DisclosureDB.getArchivedDisclosures = async function(knex, userId) {
  this.log.logArguments({userId});

  const [archives, configs] = await Promise.all([
    knex
      .select(
        'da.id',
        'da.disclosure_id as disclosureId',
        'da.approved_by as approvedBy',
        'da.approved_date as approvedDate',
        'da.disclosure as disclosure'
      )
      .from('disclosure_archive as da')
      .innerJoin('disclosure as d', 'd.id', 'da.disclosure_id')
      .where('d.user_id', userId)
      .orderBy('da.id', 'desc'),
    knex
      .select(
        'id',
        'config'
      )
      .from('config as c')
  ]);

  archives.forEach(archive => {
    const archivesConfigId = JSON.parse(archive.disclosure).configId;
    const theConfig = configs.find(config => {
      return config.id === archivesConfigId;
    });

    if (theConfig) {
      const configObject = JSON.parse(theConfig.config);
      configObject.id = archivesConfigId;
      archive.config = JSON.stringify(configObject);
    }
  });

  return archives;
};

DisclosureDB.getLatestArchivedDisclosure = function(
    knex,
    userId,
    disclosureId
  ) {
  this.log.logArguments({userId, disclosureId});

  return knex
    .first('disclosure')
    .from('disclosure_archive')
    .where('disclosure_id', disclosureId)
    .orderBy('approved_date', 'desc');
};

DisclosureDB.getArchivedDisclosure = function(knex, archiveId) {
  this.log.logArguments({archiveId});

  return knex
    .first('disclosure')
    .from('disclosure_archive')
    .where('id', archiveId);
};

DisclosureDB.deleteAnswers = async function(
    knex,
    userInfo,
    disclosureId,
    answersToDelete
  ) {
  this.log.logArguments({disclosureId, answersToDelete});

  const isSubmitter = await CommonDB.isDisclosureUsers(
    knex,
    disclosureId,
    userInfo.schoolId
  );

  const isAdmin = userInfo.coiRole === ROLES.ADMIN;
  if (!isSubmitter && !isAdmin) {
    throw Error(`Attempt by ${userInfo.username} to delete answers from disclosure ${disclosureId} which isnt theirs`); // eslint-disable-line max-len
  }

  const results = await knex.select(
      'qa.id as questionnaireAnswerId',
      'da.id as disclosureAnswerId'
    )
    .from('disclosure_answer as da')
    .innerJoin(
      'questionnaire_answer as qa',
      'qa.id',
      'da.questionnaire_answer_id'
    )
    .whereIn('qa.question_id', answersToDelete)
    .andWhere('da.disclosure_id', disclosureId);

  const disclosureAnswerIds = results.map(row => row.disclosureAnswerId);
  await knex('disclosure_answer')
    .whereIn('id', disclosureAnswerIds)
    .del();

  const questionnaireAnswerIds = results.map(row => row.questionnaireAnswerId);
  await knex('questionnaire_answer')
    .whereIn('id', questionnaireAnswerIds)
    .del();
};

DisclosureDB.deleteAllAnswers = async function(
    knex,
    userInfo,
    disclosureId
  ) {
  this.log.logArguments({disclosureId});

  const isSubmitter = await CommonDB.isDisclosureUsers(
    knex,
    disclosureId,
    userInfo.schoolId
  );

  const isAdmin = userInfo.coiRole === ROLES.ADMIN;
  if (!isSubmitter && !isAdmin) {
    throw Error(`Attempt by ${userInfo.username} to delete answers from disclosure ${disclosureId} which isnt theirs`); // eslint-disable-line max-len
  }

  const results = await knex.select(
    'qa.id as questionnaireAnswerId',
    'da.id as disclosureAnswerId'
  )
    .from('disclosure_answer as da')
    .innerJoin(
    'questionnaire_answer as qa',
    'qa.id',
    'da.questionnaire_answer_id'
  )
    .where('da.disclosure_id', disclosureId);

  const disclosureAnswerIds = results.map(row => row.disclosureAnswerId);
  await knex('disclosure_answer')
    .whereIn('id', disclosureAnswerIds)
    .del();

  const questionnaireAnswerIds = results.map(row => row.questionnaireAnswerId);
  await knex('questionnaire_answer')
    .whereIn('id', questionnaireAnswerIds)
    .del();
};

DisclosureDB.getCurrentState = async function(knex, userInfo, disclosureId) {
  this.log.logArguments({disclosureId});

  const isSubmitter = await CommonDB.isDisclosureUsers(
    knex,
    disclosureId,
    userInfo.schoolId
  );

  if (!isSubmitter) {
    throw Error(`Attempt by user id ${userInfo.schoolId} to retrieve state of disclosure ${disclosureId} which isnt theirs`); // eslint-disable-line max-len
  }

  const stateFound = await knex
    .first('state')
    .from('state')
    .where({
      key: STATE_TYPE.ANNUAL_DISCLOSURE_STATE,
      user_id: userInfo.schoolId
    });

  if (!stateFound) {
    return '';
  }
  return JSON.parse(stateFound.state);
};

DisclosureDB.saveCurrentState = async function(
    knex,
    userInfo,
    disclosureId,
    state
  ) {
  this.log.logArguments({disclosureId});

  const currentState = await DisclosureDB.getCurrentState(
    knex,
    userInfo,
    disclosureId
  );

  if (currentState !== '') {
    await knex('state')
      .update({
        state: JSON.stringify(state)
      })
      .where({
        key: STATE_TYPE.ANNUAL_DISCLOSURE_STATE,
        user_id: userInfo.schoolId
      });
    return;
  }

  await knex('state')
    .insert({
      key: STATE_TYPE.ANNUAL_DISCLOSURE_STATE,
      user_id: userInfo.schoolId,
      state: JSON.stringify(state)
    }, 'id');
};

DisclosureDB.getDisclosureInfoForNotifications = async function(knex, id) {
  this.log.logArguments({id});

  const disclosure = await knex('disclosure')
    .first(
      'id',
      'status_cd as statusCd',
      'submitted_date as submittedDate',
      'expired_date as expiredDate',
      'user_id as userId',
      'returned_date as returnedDate',
      'resubmission_date as resubmissionDate'
    )
    .where({id});

  return disclosure;
};

DisclosureDB.getArchivedDisclosureInfoForNotifications = async function(
    knex,
    id
  ) {
  this.log.logArguments({id});

  const results = await knex('disclosure_archive as da')
    .first(
      'd.user_id as userId',
      'da.approved_date as approvedDate',
      'da.approved_by as approvedBy',
      'da.disclosure'
    )
    .innerJoin('disclosure as d', 'da.disclosure_id', 'd.id')
    .where({'da.id': id});

  const disclosure = JSON.parse(results.disclosure);
  disclosure.approvedDate = results.approvedDate;
  disclosure.approvedBy = results.approvedBy;
  disclosure.userId = results.userId;
  return disclosure;
};

DisclosureDB.getProjectIdsForPerson = async function(knex, userId) {
  this.log.logArguments({userId});

  return await knex
    .select('project_id as id')
    .from('project_person')
    .where('person_id', userId);
};

DisclosureDB.createEmptyDeclarations = async function(
    knex,
    disclosureId,
    userId,
    entityId
  ) {
  this.log.logArguments({disclosureId, userId, entityId});

  const projects = await DisclosureDB.getProjectIdsForPerson(
    knex,
    userId
  );

  const declarationIds = [];
  for (const project of projects) {
    const id = await knex('declaration')
      .insert({
        disclosure_id: disclosureId,
        fin_entity_id: entityId,
        project_id: project.id
      }, 'id');

    declarationIds.push(parseInt(id[0]));
  }

  return declarationIds;
};

DisclosureDB.getDisclosuresAdminDisposition = async function(
    knex,
    disclosureId
  ) {
  this.log.logArguments({disclosureId});

  const disclosureRecord = await knex
    .first('user_id as userId')
    .from('disclosure')
    .where('disclosure_id', disclosureId);

  if (!disclosureRecord) {
    throw Error('invalid disclosure id');
  }

  const worstDisposition = await knex
    .first('dt.description')
    .from('project_person as pp')
    .innerJoin('disposition_type as dt', 'dt.type_cd', 'pp.disposition_type_cd')
    .where({
      person_id: disclosureRecord.userId
    })
    .orderBy('disposition_type_cd');

  if (worstDisposition) {
    return worstDisposition.description;
  }
};

addLoggers({DisclosureDB});
