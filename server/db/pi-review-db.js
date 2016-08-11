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
  ROLES,
  DISCLOSURE_STEP,
  RELATIONSHIP_STATUS,
  FILE_TYPE,
  DISCLOSURE_STATUS
} from '../../coi-constants';
import {isDisclosureUsers, verifyRelationshipIsUsers} from './common-db';
import * as DisclosureDB from './disclosure-db';
import getKnex from './connection-manager';

export async function verifyReviewIsForUser(dbInfo, reviewId, userId) {
  const knex = getKnex(dbInfo);

  const rows = await knex.count('d.user_id as theCount')
    .from('pi_review as p')
    .innerJoin('disclosure as d', 'd.id', 'p.disclosure_id')
    .where({
      'p.id': reviewId,
      'd.user_id': userId
    });

  return rows[0].theCount === 1;
}

async function updatePIResponseComment(
  dbInfo,
  userInfo,
  disclosureId,
  targetType,
  targetId,
  comment
) {
  const knex = getKnex(dbInfo);

  await knex('comment as c')
    .update({
      current: false
    })
    .where({
      'c.disclosure_id': disclosureId,
      'c.topic_section': targetType,
      'c.topic_id': targetId,
      'c.user_id': userInfo.schoolId
    });

  await knex('comment').insert({
    disclosure_id: disclosureId,
    topic_section: targetType,
    topic_id: targetId,
    text: comment,
    user_id: userInfo.schoolId,
    author: `${userInfo.firstName} ${userInfo.lastName}`,
    user_role: ROLES.USER,
    editable: false,
    date: new Date(),
    pi_visible: true,
    reviewer_visible: true,
    current: true
  }, 'id');
}

async function updateReviewRecord(knex, reviewId, values) {
  const newValues = {
    reviewed_on: new Date()
  };
  if (values.revised !== undefined) {
    newValues.revised = true;
  }
  if (values.respondedTo !== undefined) {
    newValues.responded_to = true;
  }

  return await knex('pi_review')
    .update(newValues)
    .where({
      id: reviewId
    });
}

export async function recordPIResponse(dbInfo, userInfo, reviewId, comment) {
  const knex = getKnex(dbInfo);

  const reviewItem = await knex.select(
      'disclosure_id as disclosureId',
      'target_type as targetType',
      'target_id as targetId'
    )
    .from('pi_review')
    .where('id', reviewId);

  const isSubmitter = await isDisclosureUsers(
    dbInfo,
    reviewItem[0].disclosureId,
    userInfo.schoolId
  );
  if (!isSubmitter) {
    return 'Unauthorized';
  }

  await updateReviewRecord(knex, reviewId, {respondedTo: true});

  await updatePIResponseComment(
    dbInfo,
    userInfo,
    reviewItem[0].disclosureId,
    reviewItem[0].targetType,
    reviewItem[0].targetId,
    comment
  );
}

function extractTargetIDs(reviewItems) {
  return reviewItems.reduce((previous, current) => {
    previous.push(current.targetId);
    return previous;
  }, []);
}

async function getQuestions(knex, disclosureId, questionIDs) {
  const disclosure = await knex('disclosure')
    .select('config_id as configId')
    .where('id', disclosureId);

  const answers = await knex.select('*')
    .from('questionnaire_answer as qa')
    .innerJoin('disclosure_answer as da', 'da.questionnaire_answer_id', 'qa.id')
    .where('da.disclosure_id', disclosureId);

  const config = await knex('config')
    .select('config')
    .where('id', disclosure[0].configId);

  const parsedConfig = JSON.parse(config[0].config);
  return parsedConfig.questions.screening.filter(question => {
    return !question.parent && questionIDs.includes(question.id);
  }).map(question => {
    const questionAnwer = answers.find(answer => {
      return answer.question_id === question.id;
    });
    const retVal = {};
    retVal.id = question.id;
    retVal.question = question.question;
    retVal.answer = questionAnwer.answer;
    return retVal;
  });
}

async function getSubQuestions(knex, disclosureId, potentialParentIDs) {
  const disclosure = await knex('disclosure')
  .select('config_id as configId')
  .where('id', disclosureId);

  const answers = await knex.select('*')
    .from('questionnaire_answer as qa')
    .innerJoin('disclosure_answer as da', 'da.questionnaire_answer_id', 'qa.id')
    .where(function() {
      this.where('da.disclosure_id', disclosureId)
      .orWhereNull('da.disclosure_id');
    });

  const config = await knex('config')
      .select('config')
      .where('id', disclosure[0].configId);

  const parsedConfig = JSON.parse(config[0].config);
  return parsedConfig.questions.screening.filter(question => {
    return potentialParentIDs.includes(question.parent);
  }).map(question => {
    const questionAnwer = answers.find(answer => {
      return answer.question_id === question.id;
    });
    const retVal = {};
    retVal.id = question.id;
    retVal.question = question.question;
    retVal.parent = question.parent;
    retVal.answer = questionAnwer ? questionAnwer.answer : undefined;
    return retVal;
  });
}

async function getComments(knex, disclosureId, topicIDs, section) {
  return await knex.select(
      'id',
      'topic_id as topicId',
      'text',
      'author',
      'date',
      'user_id as userId',
      'user_role as userRole'
    )
    .from('comment as c')
    .where({
      disclosure_id: disclosureId,
      topic_section: section,
      pi_visible: true
    })
    .andWhere('topic_id', 'in', topicIDs);
}

async function getQuestionnaireComments(knex, disclosureId, topicIDs) {
  return await getComments(
    knex,
    disclosureId,
    topicIDs,
    DISCLOSURE_STEP.QUESTIONNAIRE
  );
}
export function getDeclarationWithProjectId(dbInfo, projectId) {
  const knex = getKnex(dbInfo);
  return knex.select('id', 'fin_entity_id as finEntityId', 'project_id as projectId',
      'type_cd as typeCd', 'comments', 'admin_relationship_cd as adminRelationshipCd')
      .from('declaration')
      .where({project_id: projectId});
}

async function getEntityComments(knex, disclosureId, topicIDs) {
  return await getComments(
    knex,
    disclosureId,
    topicIDs,
    DISCLOSURE_STEP.ENTITIES
  );
}

async function getDeclarationComments(knex, disclosureId, topicIDs) {
  return await getComments(
    knex,
    disclosureId,
    topicIDs,
    DISCLOSURE_STEP.PROJECTS
  );
}

function setAdminCommentsForTopics(topics, comments) {
  comments.forEach(comment => {
    const topic = topics.find(topicToTest => {
      return topicToTest.id === comment.topicId;
    });

    if (topic) {
      if (!topic.comments) {
        topic.comments = [];
      }
      topic.comments.push(comment);
    }
  });
}

function setPIReviewDataForTopics(topics, reviewItems) {
  topics.forEach(topic => {
    const piReviewRecord = reviewItems.find(item => {
      return item.targetId === topic.id;
    });

    if (piReviewRecord) {
      topic.reviewId = piReviewRecord.id;
      topic.reviewedOn = piReviewRecord.reviewedOn;
      topic.revised = piReviewRecord.revised;
      topic.respondedTo = piReviewRecord.respondedTo;
    }
  });
}

function associateSubQuestions(questions, subQuestions) {
  subQuestions.forEach(subQuestion => {
    const parent = questions.find(question => {
      return question.id === subQuestion.parent;
    });

    if (parent) {
      if (parent.subQuestions === undefined) {
        parent.subQuestions = [];
      }
      parent.subQuestions.push(subQuestion);
    }
  });
}

async function getQuestionsToReview (knex, disclosureId, userId, reviewItems) {
  const questionIDs = extractTargetIDs(reviewItems);

  const [questions, comments, subQuestions] = await Promise.all([
    getQuestions(knex, disclosureId, questionIDs),
    getQuestionnaireComments(knex, disclosureId, questionIDs),
    getSubQuestions(knex, disclosureId, questionIDs)
  ]);

  associateSubQuestions(questions, subQuestions);
  setAdminCommentsForTopics(questions, comments);
  setPIReviewDataForTopics(questions, reviewItems);
  return questions;
}

export function reviseEntityQuestion(
  dbInfo,
  userInfo,
  reviewId,
  questionId,
  newAnswer
) {
  const knex = getKnex(dbInfo);

  return Promise.all([
    knex.select('qa.id')
      .from('pi_review as pr')
      .innerJoin(
        'fin_entity_answer as fea',
        'pr.target_id',
        'fea.fin_entity_id'
      )
      .innerJoin(
        'questionnaire_answer as qa',
        'fea.questionnaire_answer_id',
        'qa.id'
      )
      .where({
        'pr.target_type': DISCLOSURE_STEP.ENTITIES,
        'pr.id': reviewId,
        'qa.question_id': questionId
      })
      .then(rows => {
        if (rows.length > 0) {
          const answerToStore = {
            value: newAnswer
          };
          return knex('questionnaire_answer')
            .where('id', rows[0].id)
            .update('answer', JSON.stringify(answerToStore))
            .then(() => {
              return true;
            });
        }

        return false;
      }),
    updateReviewRecord(knex, reviewId, {revised: true})
  ]);
}

export function reviseQuestion(dbInfo, userInfo, reviewId, answer) {
  const knex = getKnex(dbInfo);

  return Promise.all([
    knex.select('qa.id')
      .from('pi_review as pr')
      .innerJoin('questionnaire_question as qq', 'pr.target_id', 'qq.id')
      .innerJoin('questionnaire_answer as qa', 'qa.question_id', 'qq.id')
      .innerJoin('disclosure_answer as da', {
        'da.disclosure_id': 'pr.disclosure_id',
        'da.questionnaire_answer_id': 'qa.id'
      })
      .where({
        'pr.target_type': DISCLOSURE_STEP.QUESTIONNAIRE,
        'pr.id': reviewId
      })
      .then(rows => {
        if (rows.length > 0) {
          const answerToStore = {
            value: answer
          };
          return knex('questionnaire_answer')
            .where('id', rows[0].id)
            .update('answer', JSON.stringify(answerToStore))
            .then(() => {
              return true;
            });
        }

        return false;
      }),
    updateReviewRecord(knex, reviewId, {revised: true})
  ]);
}

function getEntityNames(knex, entityIDs) {
  return knex.select('fe.id', 'fe.name', 'fe.disclosure_id as disclosureId')
    .from('fin_entity as fe')
    .where('fe.id', 'in', entityIDs);
}

function getEntitiesAnswers(knex, entityIDs) {
  return knex.select(
      'qq.id as questionId',
      'qa.answer',
      'fa.fin_entity_id as finEntityId'
    )
    .from('questionnaire_question as qq')
    .innerJoin('questionnaire_answer as qa', 'qa.question_id', 'qq.id')
    .innerJoin('fin_entity_answer as fa', 'fa.questionnaire_answer_id', 'qa.id')
    .where('fa.fin_entity_id', 'in', entityIDs);
}

async function getRelationships(knex, entityIDs) {
  const relationships = await knex
    .select('r.id',
      'r.comments as comments',
      'r.relationship_cd as relationshipCd',
      'r.person_cd as personCd',
      'r.type_cd as typeCd',
      'r.amount_cd as amountCd',
      'r.fin_entity_id as finEntityId'
    )
    .from('relationship as r')
    .where('fin_entity_id', 'in', entityIDs)
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

  relationships.forEach(relationship => {
    const travel = travels.find(item => {
      return item.relationshipId === relationship.id;
    });
    relationship.travel = travel ? travel : {};
  });
  return relationships;
}

function getFiles(knex, entityIds) {
  return knex.select('id', 'name', 'key', 'ref_id as refId')
    .from('file')
    .whereIn('ref_id', entityIds)
    .andWhere('file_type', FILE_TYPE.FINANCIAL_ENTITY);
}

function setQuestionAnswersForEntities(entities, entityQuestionAnswers) {
  entityQuestionAnswers.forEach(answer => {
    const targetEntity = entities.find(entity => {
      return entity.id === answer.finEntityId;
    });

    if (targetEntity) {
      if (targetEntity.answers === undefined) {
        targetEntity.answers = [];
      }

      targetEntity.answers.push(answer);
    }
  });
}

function setRelationshipsForEntities(entities, relationships) {
  relationships.forEach(relationship => {
    const entity = entities.find(entityToTest => {
      return entityToTest.id === relationship.finEntityId;
    });

    if (entity) {
      if (entity.relationships === undefined) {
        entity.relationships = [];
      }
      entity.relationships.push(relationship);
    }
  });
}

function setFilesForEntities(entities, files) {
  files.forEach(file => {
    const entity = entities.find(entityToTest => {
      return entityToTest.id === file.refId;
    });

    if (entity) {
      if (entity.files === undefined) {
        entity.files = [];
      }
      entity.files.push(file);
    }
  });
}

async function getEntitiesToReview(knex, disclosureId, userId, reviewItems) {
  const entityIDs = extractTargetIDs(reviewItems);

  const [entities, entityQuestionAnswers, comments, relationships, files] =
    await Promise.all([
      getEntityNames(knex, entityIDs),
      getEntitiesAnswers(knex, entityIDs),
      getEntityComments(knex, disclosureId, entityIDs),
      getRelationships(knex, entityIDs),
      getFiles(knex, entityIDs)
    ]);

  setQuestionAnswersForEntities(entities, entityQuestionAnswers);
  setRelationshipsForEntities(entities, relationships);
  setAdminCommentsForTopics(entities, comments);
  setPIReviewDataForTopics(entities, reviewItems);
  setFilesForEntities(entities, files);
  return entities;
}

function getProjects(knex, declarationIDs, disclosureId) {
  return knex.distinct(
      'p.title',
      'p.id',
      'p.source_identifier as sourceIdentifier',
      'type.description as projectType'
    )
    .from('declaration as d')
    .innerJoin('project as p', 'p.id', 'd.project_id')
    .innerJoin('project_type as type', 'p.type_cd', 'type.type_cd')
    .whereIn('d.id', declarationIDs)
    .andWhere({
      'd.disclosure_id': disclosureId
    });
}

function getEntitesWithTheseDeclarations(knex, declarationIDs, disclosureId) {
  return knex.distinct('fe.name', 'fe.id', 'd.project_id as projectId')
    .from('declaration as d')
    .innerJoin('fin_entity as fe', 'fe.id', 'd.fin_entity_id')
    .whereIn('d.id', declarationIDs)
    .andWhere({
      'd.disclosure_id': disclosureId
    });
}

function getDeclarations (knex, declarationIDs, disclosureId) {
  return knex.select(
      'd.id',
      'd.fin_entity_id as finEntityId',
      'd.project_id as projectId',
      'd.type_cd as typeCd',
      'd.comments'
    )
    .from('declaration as d')
    .whereIn('d.id', declarationIDs)
    .andWhere({
      'd.disclosure_id': disclosureId
    });
}

const setPIReviewDataForDeclaration = (target, declaration, reviewItems) => {
  const piReviewRecord = reviewItems.find(item => {
    return item.targetId === declaration.id;
  });

  if (piReviewRecord) {
    target.reviewId = piReviewRecord.id;
    target.reviewedOn = piReviewRecord.reviewedOn;
    target.revised = piReviewRecord.revised;
    target.respondedTo = piReviewRecord.respondedTo;
  }
};

async function getDeclarationsToReview(
  knex,
  disclosureId,
  userId,
  reviewItems
) {
  const declarationIDs = extractTargetIDs(reviewItems);

  const [projects, entities, comments, declarations] = await Promise.all([
    getProjects(knex, declarationIDs, disclosureId),
    getEntitesWithTheseDeclarations(knex, declarationIDs, disclosureId),
    getDeclarationComments(knex, disclosureId, declarationIDs),
    getDeclarations(knex, declarationIDs, disclosureId)
  ]);

  entities.forEach(entity => {
    const declaration = declarations.find(declarationToTest => {
      return (
        declarationToTest.finEntityId === entity.id &&
        declarationToTest.projectId === entity.projectId
      );
    });

    if (declaration) {
      entity.comments = declaration.comments;
      entity.relationshipCd = declaration.typeCd;

      entity.adminComments = comments.filter(comment => {
        return comment.topicId === declaration.id && comment.userId !== userId;
      }).sort((a, b) => {
        return a.date - b.date;
      });

      setPIReviewDataForDeclaration(entity, declaration, reviewItems);
    }

    const project = projects.find(projectToCheck => {
      return projectToCheck.id === entity.projectId;
    });

    if (project) {
      if (project.entities === undefined) {
        project.entities = [];
      }
      project.entities.push(entity);
    }
  });

  return projects;
}

export async function getPIReviewItems(dbInfo, userInfo, disclosureId) {
  const isSubmitter = await isDisclosureUsers(
    dbInfo,
    disclosureId,
    userInfo.schoolId
  );

  if (!isSubmitter) {
    throw Error(`Attempt by ${userInfo.username} to access pi-review-items for disclosure ${disclosureId} which isnt theirs`); // eslint-disable-line max-len
  }

  const knex = getKnex(dbInfo);

  const rows = await knex.select(
      'p.id',
      'p.target_type as targetType',
      'p.target_id as targetId',
      'p.reviewed_on as reviewedOn',
      'p.revised',
      'p.responded_to as respondedTo'
    )
    .from('pi_review as p')
    .innerJoin('disclosure as d', 'd.id', 'p.disclosure_id')
    .where({
      'p.disclosure_id': disclosureId,
      'd.user_id': userInfo.schoolId
    });

  const [questions, entities, declarations, config] = await Promise.all([
    getQuestionsToReview(
      knex,
      disclosureId,
      userInfo.schoolId,
      rows.filter(row => row.targetType === DISCLOSURE_STEP.QUESTIONNAIRE)
    ),
    getEntitiesToReview(
      knex,
      disclosureId,
      userInfo.schoolId,
      rows.filter(row => row.targetType === DISCLOSURE_STEP.ENTITIES)
    ),
    getDeclarationsToReview(
      knex,
      disclosureId,
      userInfo.schoolId,
      rows.filter(row => row.targetType === DISCLOSURE_STEP.PROJECTS)
    ),
    knex('disclosure').select('config_id as configId').where('id', disclosureId)
  ]);

  return {
    questions,
    entities,
    declarations,
    configId: config[0].configId
  };
}

async function getReviewTarget(knex, reviewId) {
  const rows = await knex.select(
      'target_type as targetType',
      'target_id as targetId'
    )
    .from('pi_review as p')
    .where({
      'p.id': reviewId
    });

  return rows[0];
}

export async function addRelationship(
  dbInfo,
  userInfo,
  reviewId,
  newRelationship
) {
  const knex = getKnex(dbInfo);

  const reviewTarget = await getReviewTarget(knex, reviewId);

  await knex('relationship')
    .insert({
      fin_entity_id: reviewTarget.targetId,
      relationship_cd: newRelationship.relationshipCd,
      person_cd: newRelationship.personCd,
      type_cd: !newRelationship.typeCd ? null : newRelationship.typeCd,
      amount_cd: !newRelationship.amountCd ? null : newRelationship.amountCd,
      comments: newRelationship.comments,
      status: RELATIONSHIP_STATUS.IN_PROGRESS
    }, 'id');

  const [relationships] = await Promise.all([
    getRelationships(knex, [reviewTarget.targetId]),
    updateReviewRecord(knex, reviewId, {revised: true})
  ]);

  return relationships;
}

export async function removeRelationship(
  dbInfo,
  userInfo,
  reviewId,
  relationshipId
) {
  const knex = getKnex(dbInfo);

  const isAllowed = await verifyRelationshipIsUsers(
    dbInfo,
    userInfo.schoolId,
    relationshipId
  );

  if (isAllowed) {
    return await Promise.all([
      updateReviewRecord(knex, reviewId, {revised: true}),
      knex('relationship')
        .where('id', relationshipId)
        .del()
    ]);
  }

  return 'Unauthorized';
}

export async function reviseDeclaration(
  dbInfo,
  userInfo,
  reviewId,
  declaration
) {
  const knex = getKnex(dbInfo);

  const targetIds = await knex.select('target_id as targetId')
    .from('pi_review')
    .where('id', reviewId);

  return await Promise.all([
    knex('declaration')
      .update({
        comments: declaration.comment,
        type_cd: declaration.disposition
      })
      .where({
        id: targetIds[0].targetId
      }),
    updateReviewRecord(knex, reviewId, {revised: true})
  ]);
}

export async function reviseSubQuestion(
  dbInfo,
  userInfo,
  reviewId,
  subQuestionId,
  answer
) {
  const knex = getKnex(dbInfo);

  const rows = await knex
    .select('disclosure_id as disclosureId', 'target_id as targetId')
    .from('pi_review as p')
    .where({
      'p.id': reviewId
    });
    
  const [rowCount] = await Promise.all([
    knex
      .count('* as answerCount')
      .from('questionnaire_answer')
      .where('question_id', subQuestionId),
    updateReviewRecord(knex, reviewId, {revised: true})
  ]);

  if (rowCount[0].answerCount > 0) {
    return DisclosureDB.saveExistingQuestionAnswer(
      dbInfo,
      userInfo.schoolId,
      rows[0].disclosureId,
      subQuestionId,
      answer
    );
  }

  return DisclosureDB.saveNewQuestionAnswer(
    dbInfo,
    userInfo.schoolId,
    rows[0].disclosureId,
    {
      questionId: subQuestionId,
      answer
    }
  );
}

export async function deleteAnswers(dbInfo, userInfo, reviewId, toDelete) {
  const knex = getKnex(dbInfo);

  const rows = await knex.select('p.disclosure_id as disclosureId')
    .from('pi_review as p')
    .where('id', reviewId);

  return DisclosureDB.deleteAnswers(
    dbInfo,
    userInfo,
    rows[0].disclosureId,
    toDelete
  );
}

export async function reSubmitDisclosure(dbInfo, {schoolId}, disclosureId) {
  const knex = getKnex(dbInfo);

  const isSubmitter = await isDisclosureUsers(
    dbInfo,
    disclosureId,
    schoolId
  );
  if (!isSubmitter) {
    return 'Unauthorized';
  }

  await knex.transaction(async (trx) => {
    await trx('disclosure')
      .update({
        status_cd: DISCLOSURE_STATUS.RESUBMITTED
      })
      .where({
        id: disclosureId
      });

    await trx('pi_review')
      .update({
        revised: null,
        responded_to: null
      })
      .where({disclosure_id: disclosureId});
  });
}

export async function getPIResponseInfo(dbInfo, disclosureId) {
  const knex = getKnex(dbInfo);

  return await knex.select(
      'target_id as targetId',
      'target_type as targetType',
      'reviewed_on as reviewedOn'
    )
    .from('pi_review')
    .where('disclosure_id', disclosureId);
}
