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
import {flagIsOn} from '../feature-flags';

export async function verifyReviewIsForUser(knex, reviewId, userId) {
  const rows = await knex
    .count('d.user_id as theCount')
    .from('pi_review as p')
    .innerJoin('disclosure as d', 'd.id', 'p.disclosure_id')
    .where({
      'p.id': reviewId,
      'd.user_id': userId
    });

  return rows[0].theCount === 1;
}

async function updatePIResponseComment(
  knex,
  userInfo,
  disclosure_id,
  topic_section,
  topic_id,
  comment
) {
  if (await flagIsOn(knex, 'RESCOI-940')) {
    const {schoolId: user_id} = userInfo;
    const commentRow = await knex
      .first('c.id')
      .from('comment as c')
      .where({
        disclosure_id,
        topic_section,
        topic_id,
        user_id,
        current: true
      });

    if (commentRow) {
      await knex('comment as c')
        .update({
          text: comment,
          date: new Date()
        })
        .where({
          disclosure_id,
          topic_section,
          topic_id,
          user_id,
          current: true
        });
    } else {
      await knex('comment').insert({
        disclosure_id,
        topic_section,
        topic_id,
        text: comment,
        user_id,
        author: `${userInfo.firstName} ${userInfo.lastName}`,
        user_role: ROLES.USER,
        editable: false,
        date: new Date(),
        pi_visible: true,
        reviewer_visible: true,
        current: true
      }, 'id');
    }
  }
  else {
    await knex('comment as c')
      .update({
        current: false
      })
      .where({
        'c.disclosure_id': disclosure_id,
        'c.topic_section': topic_section,
        'c.topic_id': topic_id,
        'c.user_id': userInfo.schoolId
      });

    await knex('comment').insert({
      disclosure_id,
      topic_section,
      topic_id,
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

export async function recordPIResponse(knex, userInfo, reviewId, comment) {
  const reviewItem = await knex
    .first(
      'disclosure_id as disclosureId',
      'target_type as targetType',
      'target_id as targetId'
    )
    .from('pi_review')
    .where('id', reviewId);

  const isSubmitter = await isDisclosureUsers(
    knex,
    reviewItem.disclosureId,
    userInfo.schoolId
  );
  if (!isSubmitter) {
    return 'Unauthorized';
  }

  await updateReviewRecord(knex, reviewId, {respondedTo: true});

  await updatePIResponseComment(
    knex,
    userInfo,
    reviewItem.disclosureId,
    reviewItem.targetType,
    reviewItem.targetId,
    comment
  );
}

function extractTargetIDs(reviewItems) {
  return reviewItems.reduce((previous, current) => {
    previous.push(current.targetId);
    return previous;
  }, []);
}

async function getQuestions(knex, disclosureId) {
  const disclosure = await knex('disclosure')
    .first('config_id as configId')
    .where('id', disclosureId);

  const answers = await knex
    .select('*')
    .from('questionnaire_answer as qa')
    .innerJoin('disclosure_answer as da', 'da.questionnaire_answer_id', 'qa.id')
    .where('da.disclosure_id', disclosureId);

  const config = await knex('config')
    .first('config')
    .where('id', disclosure.configId);
  const parsedConfig = JSON.parse(config.config);

  return parsedConfig.questions.screening
    .filter(question => !question.parent)
    .map(question => {
      const retVal = {};
      retVal.id = question.id;
      retVal.question = question.question;
      const questionAnswer = answers.find(
        answer => answer.question_id === question.id
      );
      if (questionAnswer) {
        retVal.answer = questionAnswer.answer;
      }
      return retVal;
    });
}

async function getSubQuestions(knex, disclosureId) {
  const disclosure = await knex('disclosure')
    .first('config_id as configId')
    .where('id', disclosureId);

  const answers = await knex.select('*')
    .from('questionnaire_answer as qa')
    .innerJoin('disclosure_answer as da', 'da.questionnaire_answer_id', 'qa.id')
    .where(function() {
      this.where('da.disclosure_id', disclosureId)
      .orWhereNull('da.disclosure_id');
    });

  const config = await knex('config')
      .first('config')
      .where('id', disclosure.configId);

  const parsedConfig = JSON.parse(config.config);

  return parsedConfig.questions.screening.map(question => {
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
  if (await flagIsOn(knex, 'RESCOI-940')) {
    return await knex.select(
        'id',
        'topic_id as topicId',
        'text',
        'author',
        'date',
        'user_id as userId',
        'user_role as userRole',
        'current'
      )
      .from('comment as c')
      .where({
        disclosure_id: disclosureId,
        topic_section: section,
        pi_visible: true
      })
      .andWhere('topic_id', 'in', topicIDs);
  }
  else { // eslint-disable-line no-else-return
    return await knex
      .select(
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
}

async function getQuestionnaireComments(knex, disclosureId, topicIDs) {
  return await getComments(
    knex,
    disclosureId,
    topicIDs,
    DISCLOSURE_STEP.QUESTIONNAIRE
  );
}

export async function getDeclarationWithProjectId(knex, projectId) {
  const flagOn = await flagIsOn(knex, 'RESCOI-932');
  if (!flagOn) {
    return await knex
      .select(
        'id',
        'fin_entity_id as finEntityId',
        'project_id as projectId',
        'type_cd as typeCd',
        'comments',
        'admin_relationship_cd as adminRelationshipCd'
      )
      .from('declaration')
      .where({project_id: projectId});
  }
}

export async function getAdminProjectDisposition(knex, projectId, personId) {
  return await knex
    .first('disposition_type_cd as dispositionTypeCd')
    .from('project_person')
    .where({
      project_id: projectId,
      person_id: personId
    });
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
    getQuestions(knex, disclosureId),
    getQuestionnaireComments(knex, disclosureId, questionIDs),
    getSubQuestions(knex, disclosureId)
  ]);

  associateSubQuestions(questions, subQuestions);
  setAdminCommentsForTopics(questions, comments);
  setPIReviewDataForTopics(questions, reviewItems);
  return questions;
}

async function updateEntityQuestionAnswer(
  knex,
  reviewId,
  questionId,
  newAnswer
) {
  const row = await knex
    .first('qa.id')
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
    });

  if (!row) {
    return false;
  }

  await updateQuestionnaireAnswer(knex, row.id, newAnswer);

  return true;
}

async function updateEntityQuestionAnswerById(
  knex,
  entityId,
  questionId,
  newAnswer
) {
  const row = await knex
    .first('qa.id')
    .from('fin_entity_answer as fea')
    .innerJoin(
      'questionnaire_answer as qa',
      'fea.questionnaire_answer_id',
      'qa.id'
    )
    .where({
      'fea.fin_entity_id': entityId,
      'qa.question_id': questionId
    });

  if (!row) {
    return false;
  }

  await updateQuestionnaireAnswer(knex, row.id, newAnswer);

  return true;
}

async function updateScreeningQuestionAnswer(knex, reviewId, answer) {
  const row = await knex
    .first('qa.id')
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
    });

  if (!row) {
    return false;
  }

  await updateQuestionnaireAnswer(knex, row.id, answer);
}

export async function reviseEntityQuestion(
  knex,
  userInfo,
  reviewId,
  questionId,
  newAnswer
) {
  return await Promise.all([
    updateEntityQuestionAnswer(knex, reviewId, questionId, newAnswer),
    updateReviewRecord(knex, reviewId, {revised: true})
  ]);
}

export async function reviseEntityQuestionById(
  knex,
  userInfo,
  entityId,
  questionId,
  newAnswer
) {
  await updateEntityQuestionAnswerById(knex, entityId, questionId, newAnswer);

  const disclosureId = await getDisclosureIdForEntity(knex, entityId);

  await upsertReviewRecord(
    knex,
    disclosureId,
    DISCLOSURE_STEP.ENTITIES,
    entityId,
    {revised: true}
  );
}

async function getDisclosureIdForEntity(knex, entityId) {
  const entityRow = await knex
    .first('disclosure_id as disclosureId')
    .from('fin_entity')
    .where('id', entityId);

  if (!entityRow) {
    throw Error('Disclosure not found');
  }

  return entityRow.disclosureId;
}

export async function reviseScreeningQuestion(
  knex,
  userInfo,
  reviewId,
  answer
) {
  return await Promise.all([
    updateScreeningQuestionAnswer(knex, reviewId, answer),
    updateReviewRecord(knex, reviewId, {revised: true})
  ]);
}

async function updateQuestionnaireAnswer(knex, id, value) {
  await knex('questionnaire_answer')
    .update('answer', JSON.stringify({value}))
    .where('id', id);
}

async function getQuestionnaireAnswerId(knex, disclosureId, questionId) {
  const row = await knex
    .first('qa.id')
    .from('disclosure_answer as da')
    .innerJoin(
      'questionnaire_answer as qa',
      'da.questionnaire_answer_id',
      'qa.id'
    )
    .where({
      'qa.question_id': questionId,
      'da.disclosure_id': disclosureId
    });

  if (row) {
    return row.id;
  }
}

export async function upsertReviewRecord(
  knex,
  disclosureId,
  type,
  targetId,
  values
) {
  const existingRow = await knex
    .first('id')
    .from('pi_review')
    .where({
      disclosure_id: disclosureId,
      target_id: targetId,
      target_type: type
    });

  const newValues = {
    reviewed_on: new Date()
  };
  if (values.revised !== undefined) {
    newValues.revised = true;
  }
  if (values.respondedTo !== undefined) {
    newValues.responded_to = true;
  }

  if (existingRow) {
    await knex('pi_review')
      .update(newValues)
      .where({
        id: existingRow.id
      });
  }
  else {
    newValues.disclosure_id = disclosureId;
    newValues.target_type = type;
    newValues.target_id = targetId;
    
    await knex('pi_review')
      .insert(newValues);
  }
}

export async function reviseScreeningQuestionById(
  knex,
  userInfo,
  disclosureId,
  questionId,
  answer
) {
  const qaId = await getQuestionnaireAnswerId(knex, disclosureId, questionId);
  await updateQuestionnaireAnswer(knex, qaId, answer);
  await upsertReviewRecord(
    knex,
    disclosureId,
    DISCLOSURE_STEP.QUESTIONNAIRE,
    questionId,
    {revised: true}
  );
}

function getEntityNames(knex, disclosureId) {
  return knex
    .select('fe.id', 'fe.name', 'fe.disclosure_id as disclosureId')
    .from('fin_entity as fe')
    .where('fe.disclosure_id', disclosureId);
}

function getEntitiesAnswers(knex, disclosureId) {
  return knex.select(
      'qq.id as questionId',
      'qa.answer',
      'fa.fin_entity_id as finEntityId'
    )
    .from('questionnaire_question as qq')
    .innerJoin('questionnaire_answer as qa', 'qa.question_id', 'qq.id')
    .innerJoin('fin_entity_answer as fa', 'fa.questionnaire_answer_id', 'qa.id')
    .innerJoin('fin_entity as fe', 'fe.id', 'fa.fin_entity_id')
    .where('fe.disclosure_id', disclosureId);
}

async function getRelationships(knex, disclosureId) {
  const relationships = await knex
    .select(
      'r.id',
      'r.comments as comments',
      'r.relationship_cd as relationshipCd',
      'r.person_cd as personCd',
      'r.type_cd as typeCd',
      'r.amount_cd as amountCd',
      'r.fin_entity_id as finEntityId'
    )
    .from('relationship as r')
    .innerJoin('fin_entity as fe', 'fe.id', 'r.fin_entity_id')
    .where('fe.disclosure_id', disclosureId)
    .andWhereNot('r.status', RELATIONSHIP_STATUS.PENDING);

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

function getFiles(knex, disclosureId) {
  return knex
    .select(
      'f.id',
      'f.name',
      'f.key',
      'f.ref_id as refId'
    )
    .from('file as f')
    .innerJoin('fin_entity as fe', 'fe.id', 'f.ref_id')
    .andWhere('fe.disclosure_id', disclosureId)
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
      getEntityNames(knex, disclosureId),
      getEntitiesAnswers(knex, disclosureId),
      getEntityComments(knex, disclosureId, entityIDs),
      getRelationships(knex, disclosureId),
      getFiles(knex, disclosureId)
    ]);

  setQuestionAnswersForEntities(entities, entityQuestionAnswers);
  setRelationshipsForEntities(entities, relationships);
  setAdminCommentsForTopics(entities, comments);
  setPIReviewDataForTopics(entities, reviewItems);
  setFilesForEntities(entities, files);
  return entities;
}

function getProjects(knex, disclosureId) {
  return knex.distinct(
      'p.title',
      'p.id',
      'p.source_identifier as sourceIdentifier',
      'type.description as projectType'
    )
    .from('declaration as d')
    .innerJoin('project as p', 'p.id', 'd.project_id')
    .innerJoin('project_type as type', 'p.type_cd', 'type.type_cd')
    .andWhere({
      'd.disclosure_id': disclosureId
    });
}

function getEntitesWithTheseDeclarations(knex, disclosureId) {
  return knex.distinct('fe.name', 'fe.id', 'd.project_id as projectId')
    .from('declaration as d')
    .innerJoin('fin_entity as fe', 'fe.id', 'd.fin_entity_id')
    .where({
      'd.disclosure_id': disclosureId
    });
}

function getDeclarations (knex, disclosureId) {
  return knex.select(
      'd.id',
      'd.fin_entity_id as finEntityId',
      'd.project_id as projectId',
      'd.type_cd as typeCd',
      'd.comments'
    )
    .from('declaration as d')
    .andWhere({
      'd.disclosure_id': disclosureId
    });
}

function setPIReviewDataForDeclaration(target, declaration, reviewItems) {
  const piReviewRecord = reviewItems.find(item => {
    return item.targetId === declaration.id;
  });

  if (piReviewRecord) {
    target.reviewId = piReviewRecord.id;
    target.reviewedOn = piReviewRecord.reviewedOn;
    target.revised = piReviewRecord.revised;
    target.respondedTo = piReviewRecord.respondedTo;
  }
}

async function getDeclarationsToReview(
  knex,
  disclosureId,
  userId,
  reviewItems
) {
  const flag940 = await flagIsOn(knex, 'RESCOI-940');

  const declarationIDs = extractTargetIDs(reviewItems);

  const [projects, entities, comments, declarations] = await Promise.all([
    getProjects(knex, disclosureId),
    getEntitesWithTheseDeclarations(knex, disclosureId),
    getDeclarationComments(knex, disclosureId, declarationIDs),
    getDeclarations(knex, disclosureId)
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
        if (flag940) {
          return comment.topicId === declaration.id;
        }
        else { // eslint-disable-line no-else-return
          return (
            comment.topicId === declaration.id &&
            comment.userId !== userId
          );
        }
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

export async function getPIReviewItems(knex, userInfo, disclosureId) {
  const isSubmitter = await isDisclosureUsers(
    knex,
    disclosureId,
    userInfo.schoolId
  );

  if (!isSubmitter) {
    throw Error(`Attempt by ${userInfo.username} to access pi-review-items for disclosure ${disclosureId} which isnt theirs`); // eslint-disable-line max-len
  }

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

  const [questions, entities, declarations, disclosure] = await Promise.all([
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
    knex('disclosure')
      .first(
        'config_id as configId',
        'submitted_date as submittedDate',
        'last_review_date as lastReviewDate',
        'type_cd as typeCd'
      )
      .where('id', disclosureId)
  ]);

  return {
    questions,
    entities,
    declarations,
    configId: disclosure.configId,
    submittedDate: disclosure.submittedDate,
    lastReviewDate: disclosure.lastReviewDate,
    typeCd: disclosure.typeCd
  };
}

async function getReviewTarget(knex, reviewId) {
  const row = await knex
    .first(
      'target_type as targetType',
      'target_id as targetId',
      'disclosure_id as disclosureId'
    )
    .from('pi_review as p')
    .where({
      'p.id': reviewId
    });

  return row;
}

export async function addRelationship(
  knex,
  userInfo,
  reviewId,
  newRelationship
) {
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
    getRelationships(knex, reviewTarget.disclosureId),
    updateReviewRecord(knex, reviewId, {revised: true})
  ]);

  return relationships;
}

export async function addRelationshipById(
  knex,
  userInfo,
  entityId,
  newRelationship
) {
  const disclosureId = await getDisclosureIdForEntity(knex, entityId);

  await knex('relationship')
    .insert({
      fin_entity_id: entityId,
      relationship_cd: newRelationship.relationshipCd,
      person_cd: newRelationship.personCd,
      type_cd: !newRelationship.typeCd ? null : newRelationship.typeCd,
      amount_cd: !newRelationship.amountCd ? null : newRelationship.amountCd,
      comments: newRelationship.comments,
      status: RELATIONSHIP_STATUS.IN_PROGRESS
    }, 'id');

  const [relationships] = await Promise.all([
    getRelationships(knex, disclosureId),
    upsertReviewRecord(
      knex,
      disclosureId,
      DISCLOSURE_STEP.ENTITIES,
      entityId,
      {revised: true}
    )
  ]);

  return relationships.filter(
    relationship => relationship.finEntityId === Number(entityId)
  );
}

export async function removeRelationship(
  knex,
  userInfo,
  reviewId,
  relationshipId
) {
  const isAllowed = await verifyRelationshipIsUsers(
    knex,
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

async function deleteRelationship(knex, relationshipId) {
  await knex('relationship')
    .where('id', relationshipId)
    .del();
}

export async function removeRelationshipById(
  knex,
  userInfo,
  entityId,
  relationshipId
) {
  const isAllowed = await verifyRelationshipIsUsers(
    knex,
    userInfo.schoolId,
    relationshipId
  );

  if (isAllowed) {
    const [disclosureId] = await Promise.all([
      getDisclosureIdForEntity(knex, entityId),
      deleteRelationship(knex, relationshipId)
    ]);

    await upsertReviewRecord(
      knex,
      disclosureId,
      DISCLOSURE_STEP.ENTITIES,
      entityId,
      {revised: true}
    );
  }

  return 'Unauthorized';
}

export async function reviseDeclaration(
  knex,
  userInfo,
  reviewId,
  declaration
) {
  const targetId = await knex
    .first('target_id as targetId')
    .from('pi_review')
    .where('id', reviewId);

  return await Promise.all([
    knex('declaration')
      .update({
        comments: declaration.comment,
        type_cd: declaration.disposition
      })
      .where({
        id: targetId.targetId
      }),
    updateReviewRecord(knex, reviewId, {revised: true})
  ]);
}

export async function reviseDeclarationById(
  knex,
  userInfo,
  entityId,
  projectId,
  declaration
) {
  const [disclosureId, declarationRow] = await Promise.all([
    getDisclosureIdForEntity(knex, entityId),
    knex('declaration')
      .first('id')
      .where({
        project_id: projectId,
        fin_entity_id: entityId
      })
  ]);

  return await Promise.all([
    knex('declaration')
      .update({
        comments: declaration.comment,
        type_cd: declaration.disposition
      })
      .where('id', declarationRow.id),
    upsertReviewRecord(
      knex,
      disclosureId,
      DISCLOSURE_STEP.PROJECTS,
      declarationRow.id,
      {revised: true}
    )
  ]);
}

export async function reviseSubQuestion(
  knex,
  userInfo,
  reviewId,
  subQuestionId,
  answer
) {
  const row = await knex
    .first(
      'disclosure_id as disclosureId',
      'target_id as targetId'
    )
    .from('pi_review as p')
    .where({
      'p.id': reviewId
    });

  const [rowCount] = await Promise.all([
    knex
      .count('qa.* as answerCount')
      .from('questionnaire_answer as qa')
      .innerJoin(
        'disclosure_answer as da',
        'da.questionnaire_answer_id',
        'qa.id'
      )
      .where({
        'qa.question_id': subQuestionId,
        'da.disclosure_id': row.disclosureId
      }),
    updateReviewRecord(knex, reviewId, {revised: true})
  ]);

  if (rowCount[0].answerCount > 0) {
    return DisclosureDB.saveExistingQuestionAnswer(
      knex,
      userInfo.schoolId,
      row.disclosureId,
      subQuestionId,
      answer
    );
  }

  return DisclosureDB.saveNewQuestionAnswer(
    knex,
    userInfo.schoolId,
    row.disclosureId,
    {
      questionId: subQuestionId,
      answer
    }
  );
}

export async function reviseSubQuestionByQuestionId(
  knex,
  userInfo,
  disclosureId,
  subQuestionId,
  answer
) {
  const qaRow = await knex
    .first('qa.id')
    .from('questionnaire_answer as qa')
    .innerJoin(
      'disclosure_answer as da',
      'da.questionnaire_answer_id',
      'qa.id'
    )
    .where({
      'qa.question_id': subQuestionId,
      'da.disclosure_id': disclosureId
    });

  if (qaRow) {
    return DisclosureDB.saveExistingQuestionAnswer(
      knex,
      userInfo.schoolId,
      disclosureId,
      subQuestionId,
      answer
    );
  }

  return DisclosureDB.saveNewQuestionAnswer(
    knex,
    userInfo.schoolId,
    disclosureId,
    {
      questionId: subQuestionId,
      answer: answer.answer
    }
  );
}

export async function deleteAnswers(knex, userInfo, reviewId, toDelete) {
  const row = await knex
    .first('p.disclosure_id as disclosureId')
    .from('pi_review as p')
    .where('id', reviewId);

  return DisclosureDB.deleteAnswers(
    knex,
    userInfo,
    row.disclosureId,
    toDelete
  );
}

export async function reSubmitDisclosure(knex, {schoolId}, disclosure_id) {
  const isSubmitter = await isDisclosureUsers(
    knex,
    disclosure_id,
    schoolId
  );
  if (!isSubmitter) {
    return 'Unauthorized';
  }

  await knex('disclosure')
    .update({
      status_cd: DISCLOSURE_STATUS.RESUBMITTED
    })
    .where({id: disclosure_id});

  await knex('pi_review')
    .update({
      revised: null,
      responded_to: null
    })
    .where({disclosure_id});

  if (await flagIsOn(knex, 'RESCOI-940')) {
    await knex('comment')
      .update({
        current: false
      })
      .where({disclosure_id});
  }
}

export async function getPIResponseInfo(knex, disclosureId) {
  return await knex
    .select(
      'target_id as targetId',
      'target_type as targetType',
      'reviewed_on as reviewedOn'
    )
    .from('pi_review')
    .where('disclosure_id', disclosureId);
}
