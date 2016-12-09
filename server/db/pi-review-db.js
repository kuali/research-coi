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
import CommonDB from './common-db';
import ProjectDB from '../db/project-db';
import { filterProjects } from '../services/project-service/project-service';
import DisclosureDB from './disclosure-db';
import {addLoggers} from '../log';

const PIReviewDB = {};
export default PIReviewDB;

PIReviewDB.verifyReviewIsForUser = async function(knex, reviewId, userId) {
  const rows = await knex
    .count('d.user_id as theCount')
    .from('pi_review as p')
    .innerJoin('disclosure as d', 'd.id', 'p.disclosure_id')
    .where({
      'p.id': reviewId,
      'd.user_id': userId
    });

  return rows[0].theCount === 1;
};

PIReviewDB.updatePIResponseComment = async function(
    knex,
    userInfo,
    disclosure_id,
    topic_section,
    topic_id,
    comment
  ) {
  const {schoolId: user_id} = userInfo;
  const commentRow = await knex
    .first('c.id')
    .from('review_comment as c')
    .where({
      disclosure_id,
      topic_section,
      topic_id,
      user_id,
      current: true
    });

  if (commentRow) {
    await knex('review_comment as c')
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
    await knex('review_comment').insert({
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
};

PIReviewDB.updateReviewRecord = async function(knex, reviewId, values) {
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
};

PIReviewDB.recordPIResponse = async function(
    knex,
    userInfo,
    reviewId,
    comment
  ) {
  const reviewItem = await knex
    .first(
      'disclosure_id as disclosureId',
      'target_type as targetType',
      'target_id as targetId'
    )
    .from('pi_review')
    .where('id', reviewId);

  const isSubmitter = await CommonDB.isDisclosureUsers(
    knex,
    reviewItem.disclosureId,
    userInfo.schoolId
  );
  if (!isSubmitter) {
    return 'Unauthorized';
  }

  await PIReviewDB.updateReviewRecord(knex, reviewId, {respondedTo: true});

  await PIReviewDB.updatePIResponseComment(
    knex,
    userInfo,
    reviewItem.disclosureId,
    reviewItem.targetType,
    reviewItem.targetId,
    comment
  );
};

PIReviewDB.extractTargetIDs = function(reviewItems) {
  return reviewItems.reduce((previous, current) => {
    previous.push(current.targetId);
    return previous;
  }, []);
};

PIReviewDB.getQuestions = async function(knex, disclosureId) {
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
};

PIReviewDB.getSubQuestions = async function(knex, disclosureId) {
  const disclosure = await knex('disclosure')
    .first('config_id as configId')
    .where('id', disclosureId);

  const answers = await knex.select('*')
    .from('questionnaire_answer as qa')
    .innerJoin('disclosure_answer as da', 'da.questionnaire_answer_id', 'qa.id')
    .where(function() {
      this
        .where('da.disclosure_id', disclosureId)
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
};

PIReviewDB.getComments = async function(knex, disclosureId, topicIDs, section) {
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
    .from('review_comment as c')
    .where({
      disclosure_id: disclosureId,
      topic_section: section,
      pi_visible: true
    })
    .andWhere('topic_id', 'in', topicIDs);
};

PIReviewDB.getQuestionnaireComments = async function(
    knex,
    disclosureId,
    topicIDs
  ) {
  return await PIReviewDB.getComments(
    knex,
    disclosureId,
    topicIDs,
    DISCLOSURE_STEP.QUESTIONNAIRE
  );
};

PIReviewDB.getAdminProjectDisposition = async function(
    knex,
    projectId,
    personId
  ) {
  return await knex
    .first('disposition_type_cd as dispositionTypeCd')
    .from('project_person')
    .where({
      project_id: projectId,
      person_id: personId
    });
};

PIReviewDB.getEntityComments = async function(knex, disclosureId, topicIDs) {
  return await PIReviewDB.getComments(
    knex,
    disclosureId,
    topicIDs,
    DISCLOSURE_STEP.ENTITIES
  );
};

PIReviewDB.getDeclarationComments = async function(
    knex,
    disclosureId,
    topicIDs
  ) {
  return await PIReviewDB.getComments(
    knex,
    disclosureId,
    topicIDs,
    DISCLOSURE_STEP.PROJECTS
  );
};

PIReviewDB.setAdminCommentsForTopics = function(topics, comments) {
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
};

PIReviewDB.setPIReviewDataForTopics = function(topics, reviewItems) {
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
};

PIReviewDB.associateSubQuestions = function(questions, subQuestions) {
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
};

PIReviewDB.getQuestionsToReview = async function (
    knex,
    disclosureId,
    userId,
    reviewItems
  ) {
  const questionIDs = PIReviewDB.extractTargetIDs(reviewItems);

  const [questions, comments, subQuestions] = await Promise.all([
    PIReviewDB.getQuestions(knex, disclosureId),
    PIReviewDB.getQuestionnaireComments(knex, disclosureId, questionIDs),
    PIReviewDB.getSubQuestions(knex, disclosureId)
  ]);

  PIReviewDB.associateSubQuestions(questions, subQuestions);
  PIReviewDB.setAdminCommentsForTopics(questions, comments);
  PIReviewDB.setPIReviewDataForTopics(questions, reviewItems);
  return questions;
};

PIReviewDB.updateEntityQuestionAnswer = async function(
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

  await PIReviewDB.updateQuestionnaireAnswer(knex, row.id, newAnswer);

  return true;
};

PIReviewDB.upsertEntityQuestionAnswerById = async function(
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
    await PIReviewDB.insertEntityQuestionAnswer(
      knex,
      entityId,
      questionId,
      newAnswer
    );
    return;
  }

  await PIReviewDB.updateQuestionnaireAnswer(knex, row.id, newAnswer);
};

PIReviewDB.updateScreeningQuestionAnswer = async function(
    knex,
    reviewId,
    answer
  ) {
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

  await PIReviewDB.updateQuestionnaireAnswer(knex, row.id, answer);
};

PIReviewDB.reviseEntityQuestion = async function(
    knex,
    userInfo,
    reviewId,
    questionId,
    newAnswer
  ) {
  return await Promise.all([
    PIReviewDB.updateEntityQuestionAnswer(
      knex,
      reviewId,
      questionId,
      newAnswer
    ),
    PIReviewDB.updateReviewRecord(knex, reviewId, {revised: true})
  ]);
};

PIReviewDB.reviseEntityQuestionById = async function(
    knex,
    userInfo,
    entityId,
    questionId,
    newAnswer
  ) {
  await PIReviewDB.upsertEntityQuestionAnswerById(
    knex,
    entityId,
    questionId,
    newAnswer
  );

  const disclosureId = await PIReviewDB.getDisclosureIdForEntity(
    knex,
    entityId
  );

  await PIReviewDB.upsertReviewRecord(
    knex,
    disclosureId,
    DISCLOSURE_STEP.ENTITIES,
    entityId,
    {revised: true}
  );
};

PIReviewDB.getDisclosureIdForEntity = async function(knex, entityId) {
  const entityRow = await knex
    .first('disclosure_id as disclosureId')
    .from('fin_entity')
    .where('id', entityId);

  if (!entityRow) {
    throw Error('Disclosure not found');
  }

  return entityRow.disclosureId;
};

PIReviewDB.reviseScreeningQuestion = async function(
    knex,
    userInfo,
    reviewId,
    answer
  ) {
  return await Promise.all([
    PIReviewDB.updateScreeningQuestionAnswer(knex, reviewId, answer),
    PIReviewDB.updateReviewRecord(knex, reviewId, {revised: true})
  ]);
};

PIReviewDB.updateQuestionnaireAnswer = async function(knex, id, value) {
  await knex('questionnaire_answer')
    .update('answer', JSON.stringify({value}))
    .where('id', id);
};

PIReviewDB.insertEntityQuestionAnswer = async function(
    knex,
    fin_entity_id,
    question_id,
    newAnswer
  ) {
  const result = await knex('questionnaire_answer')
    .insert({
      question_id,
      answer: JSON.stringify({value: newAnswer})
    }, 'id');

  const questionnaire_answer_id = parseInt(result[0]);

  await knex('fin_entity_answer')
    .insert({
      fin_entity_id,
      questionnaire_answer_id
    });
};

PIReviewDB.getQuestionnaireAnswerId = async function(
    knex,
    disclosureId,
    questionId
  ) {
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
};

PIReviewDB.upsertReviewRecord = async function(
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
};

PIReviewDB.reviseScreeningQuestionById = async function(
    knex,
    userInfo,
    disclosureId,
    questionId,
    answer
  ) {
  const qaId = await PIReviewDB.getQuestionnaireAnswerId(
    knex,
    disclosureId,
    questionId
  );
  await PIReviewDB.updateQuestionnaireAnswer(knex, qaId, answer);
  await PIReviewDB.upsertReviewRecord(
    knex,
    disclosureId,
    DISCLOSURE_STEP.QUESTIONNAIRE,
    questionId,
    {revised: true}
  );
};

PIReviewDB.getEntityNames = function(knex, disclosureId) {
  return knex
    .select('fe.id', 'fe.name', 'fe.disclosure_id as disclosureId')
    .from('fin_entity as fe')
    .where('fe.disclosure_id', disclosureId);
};

PIReviewDB.getEntitiesAnswers = function(knex, disclosureId) {
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
};

PIReviewDB.getRelationships = async function(knex, disclosureId) {
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

  const travels = await knex
    .select(
      'amount',
      'destination',
      'start_date as startDate',
      'end_date as endDate',
      'reason',
      'relationship_id as relationshipId'
    )
    .from('travel_relationship')
    .whereIn(
      'relationship_id',
      relationships.map(relationship => relationship.id)
    );

  relationships.forEach(relationship => {
    const travel = travels.find(item => {
      return item.relationshipId === relationship.id;
    });
    relationship.travel = travel ? travel : {};
  });
  return relationships;
};

PIReviewDB.getFiles = function(knex, disclosureId) {
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
};

PIReviewDB.setQuestionAnswersForEntities = function(
    entities,
    entityQuestionAnswers
  ) {
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
};

PIReviewDB.setRelationshipsForEntities = function(entities, relationships) {
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
};

PIReviewDB.setFilesForEntities = function(entities, files) {
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
};

PIReviewDB.getEntitiesToReview = async function(
    knex,
    disclosureId,
    userId,
    reviewItems
  ) {
  const entityIDs = PIReviewDB.extractTargetIDs(reviewItems);

  const [entities, entityQuestionAnswers, comments, relationships, files] =
    await Promise.all([
      PIReviewDB.getEntityNames(knex, disclosureId),
      PIReviewDB.getEntitiesAnswers(knex, disclosureId),
      PIReviewDB.getEntityComments(knex, disclosureId, entityIDs),
      PIReviewDB.getRelationships(knex, disclosureId),
      PIReviewDB.getFiles(knex, disclosureId)
    ]);

  PIReviewDB.setQuestionAnswersForEntities(entities, entityQuestionAnswers);
  PIReviewDB.setRelationshipsForEntities(entities, relationships);
  PIReviewDB.setAdminCommentsForTopics(entities, comments);
  PIReviewDB.setPIReviewDataForTopics(entities, reviewItems);
  PIReviewDB.setFilesForEntities(entities, files);
  return entities;
};

PIReviewDB.getAllProjects = async function(knex, userId, authHeader, dbInfo) {
  const projects = await ProjectDB.getProjects(knex, userId);
  return await filterProjects(
    dbInfo,
    projects,
    authHeader,
    knex
  );
};

PIReviewDB.getProjectsForDisclosure = function(knex, disclosureId) {
  return knex.distinct(
    'p.title as name',
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
};

PIReviewDB.getEntitesWithTheseDeclarations = function(knex, disclosureId) {
  return knex.distinct('fe.name', 'fe.id', 'd.project_id as projectId')
    .from('declaration as d')
    .innerJoin('fin_entity as fe', 'fe.id', 'd.fin_entity_id')
    .where({
      'd.disclosure_id': disclosureId
    });
};

PIReviewDB.getDeclarations = function (knex, disclosureId) {
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
};

PIReviewDB.setPIReviewDataForDeclaration = function(
    target,
    declaration,
    reviewItems
  ) {
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

PIReviewDB.getAllActiveEntitiesForDisclosure = function(knex, disclosureId) {
  return knex.select(
      'id',
      'name'
    )
    .from('fin_entity')
    .where({
      disclosure_id: disclosureId,
      active: true
    });
};

PIReviewDB.handleNewDeclaration = async function(
    knex,
    entity,
    project,
    disclosureId
  ) {
  const newDeclaration = {
    disclosure_id: disclosureId,
    fin_entity_id: entity.id,
    project_id: project.id
  };

  await knex('declaration').insert(newDeclaration);

  this.log.info(
    `inserted declaration new declaration ${JSON.stringify(newDeclaration)}`
  );

  return {
    id: entity.id,
    name: entity.name,
    projectId: project.id,
    adminComments: []
  };
};

PIReviewDB.handleNewProject = async function(
    knex,
    project,
    entities,
    declarations,
    disclosureId
  ) {
  const declarationExists = declarations.some(declaration => {
    return declaration.projectId === project.id;
  });

  if (!declarationExists) {
    this.log.info(
      `project: ${JSON.stringify(project)} exists with no declaration`
    );
    project.entities = await Promise.all(
      entities.map(
        entity => PIReviewDB.handleNewDeclaration(
          knex,
          entity,
          project,
          disclosureId
        )
      )
    );
  }
  return project;
};

PIReviewDB.getDeclarationsToReview = async function(
    knex,
    disclosureId,
    userId,
    reviewItems,
    authHeader,
    dbInfo
  ) {
  const declarationIDs = PIReviewDB.extractTargetIDs(reviewItems);

  const [
    declaredProjects,
    allProjects,
    entities,
    comments,
    declarations,
    allEntities
  ] = await Promise.all([
    PIReviewDB.getProjectsForDisclosure(knex, disclosureId),
    PIReviewDB.getAllProjects(knex, userId, authHeader, dbInfo),
    PIReviewDB.getEntitesWithTheseDeclarations(knex, disclosureId),
    PIReviewDB.getDeclarationComments(knex, disclosureId, declarationIDs),
    PIReviewDB.getDeclarations(knex, disclosureId),
    PIReviewDB.getAllActiveEntitiesForDisclosure(knex, disclosureId)
  ]);

  let projects;
  if (Array.isArray(allEntities) && allEntities.length > 0) {
    projects = await Promise.all(
      allProjects.map(
        project => PIReviewDB.handleNewProject(
          knex,
          project,
          allEntities,
          declarations,
          disclosureId
        )
      )
    );
  } else {
    projects = declaredProjects;
  }

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
        return comment.topicId === declaration.id;
      }).sort((a, b) => {
        return a.date - b.date;
      });

      PIReviewDB.setPIReviewDataForDeclaration(
        entity,
        declaration,
        reviewItems
      );
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
};

PIReviewDB.getPIReviewItems = async function(
    knex,
    userInfo,
    disclosureId,
    authHeader,
    dbInfo
  ) {
  const isSubmitter = await CommonDB.isDisclosureUsers(
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

  const [
    questions,
    entities,
    declarations,
    disclosure,
    projects
  ] = await Promise.all([
    PIReviewDB.getQuestionsToReview(
      knex,
      disclosureId,
      userInfo.schoolId,
      rows.filter(row => row.targetType === DISCLOSURE_STEP.QUESTIONNAIRE)
    ),
    PIReviewDB.getEntitiesToReview(
      knex,
      disclosureId,
      userInfo.schoolId,
      rows.filter(row => row.targetType === DISCLOSURE_STEP.ENTITIES)
    ),
    PIReviewDB.getDeclarationsToReview(
      knex,
      disclosureId,
      userInfo.schoolId,
      rows.filter(row => row.targetType === DISCLOSURE_STEP.PROJECTS),
      authHeader,
      dbInfo
    ),
    knex('disclosure')
      .first(
        'config_id as configId',
        'submitted_date as submittedDate',
        'last_review_date as lastReviewDate',
        'type_cd as typeCd'
      )
      .where('id', disclosureId),
    PIReviewDB.getAllProjects(knex, userInfo.schoolId, authHeader, dbInfo)
  ]);

  return {
    questions,
    entities,
    projects,
    declarations,
    configId: disclosure.configId,
    submittedDate: disclosure.submittedDate,
    lastReviewDate: disclosure.lastReviewDate,
    typeCd: disclosure.typeCd
  };
};

PIReviewDB.getReviewTarget = async function(knex, reviewId) {
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
};

PIReviewDB.addRelationship = async function(
    knex,
    userInfo,
    reviewId,
    newRelationship
  ) {
  const reviewTarget = await PIReviewDB.getReviewTarget(knex, reviewId);

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
    PIReviewDB.getRelationships(knex, reviewTarget.disclosureId),
    PIReviewDB.updateReviewRecord(knex, reviewId, {revised: true})
  ]);

  return relationships;
};

PIReviewDB.addRelationshipById = async function(
    knex,
    userInfo,
    entityId,
    newRelationship
  ) {
  const disclosureId = await PIReviewDB.getDisclosureIdForEntity(
    knex,
    entityId
  );

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
    PIReviewDB.getRelationships(knex, disclosureId),
    PIReviewDB.upsertReviewRecord(
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
};

PIReviewDB.removeRelationship = async function(
    knex,
    userInfo,
    reviewId,
    relationshipId
  ) {
  const isAllowed = await CommonDB.verifyRelationshipIsUsers(
    knex,
    userInfo.schoolId,
    relationshipId
  );

  if (isAllowed) {
    return await Promise.all([
      PIReviewDB.updateReviewRecord(knex, reviewId, {revised: true}),
      knex('relationship')
        .where('id', relationshipId)
        .del()
    ]);
  }

  return 'Unauthorized';
};

PIReviewDB.deleteRelationship = async function(knex, relationshipId) {
  await knex('relationship')
    .where('id', relationshipId)
    .del();
};

PIReviewDB.removeRelationshipById = async function(
    knex,
    userInfo,
    entityId,
    relationshipId
  ) {
  const isAllowed = await CommonDB.verifyRelationshipIsUsers(
    knex,
    userInfo.schoolId,
    relationshipId
  );

  if (isAllowed) {
    const [disclosureId] = await Promise.all([
      PIReviewDB.getDisclosureIdForEntity(knex, entityId),
      PIReviewDB.deleteRelationship(knex, relationshipId)
    ]);

    await PIReviewDB.upsertReviewRecord(
      knex,
      disclosureId,
      DISCLOSURE_STEP.ENTITIES,
      entityId,
      {revised: true}
    );
  }

  return 'Unauthorized';
};

PIReviewDB.reviseDeclaration = async function(
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
    PIReviewDB.updateReviewRecord(knex, reviewId, {revised: true})
  ]);
};

PIReviewDB.reviseDeclarationById = async function(
    knex,
    userInfo,
    entityId,
    projectId,
    declaration
  ) {
  const [disclosureId, declarationRow] = await Promise.all([
    PIReviewDB.getDisclosureIdForEntity(knex, entityId),
    knex('declaration')
      .first('id')
      .where({
        project_id: projectId,
        fin_entity_id: entityId
      })
  ]);

  if (!declarationRow) {
    const declarationId = await knex('declaration')
      .insert({
        disclosure_id: disclosureId,
        fin_entity_id: entityId,
        project_id: projectId,
        type_cd: declaration.disposition,
        comments: declaration.comment
      }, 'id');

    await PIReviewDB.upsertReviewRecord(
      knex,
      disclosureId,
      DISCLOSURE_STEP.PROJECTS,
      declarationId,
      {revised: true}
    );
  }
  else {
    await Promise.all([
      knex('declaration')
        .update({
          comments: declaration.comment,
          type_cd: declaration.disposition
        })
        .where('id', declarationRow.id),
      PIReviewDB.upsertReviewRecord(
        knex,
        disclosureId,
        DISCLOSURE_STEP.PROJECTS,
        declarationRow.id,
        {revised: true}
      )
    ]);
  }
};

PIReviewDB.reviseSubQuestion = async function(
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
    PIReviewDB.updateReviewRecord(knex, reviewId, {revised: true})
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
};

PIReviewDB.reviseSubQuestionByQuestionId = async function(
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
};

PIReviewDB.deleteAnswers = async function(knex, userInfo, reviewId, toDelete) {
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
};

PIReviewDB.updateProjects = async function(knex, schoolId) {
  await knex('project_person')
    .update({
      new: false
    })
    .where({
      person_id: schoolId,
      active: true
    });
};

PIReviewDB.reSubmitDisclosure = async function(
    knex,
    {schoolId},
    disclosure_id
  ) {
  const isSubmitter = await CommonDB.isDisclosureUsers(
    knex,
    disclosure_id,
    schoolId
  );
  if (!isSubmitter) {
    return 'Unauthorized';
  }

  await knex('disclosure')
    .update({
      status_cd: DISCLOSURE_STATUS.RESUBMITTED,
      resubmission_date: new Date()
    })
    .where({id: disclosure_id});

  await knex('pi_review')
    .update({
      revised: null,
      responded_to: null
    })
    .where({disclosure_id});

  await PIReviewDB.updateProjects(knex, schoolId);
  await knex('review_comment')
    .update({
      current: false
    })
    .where({disclosure_id});
};

PIReviewDB.getPIResponseInfo = async function(knex, disclosureId) {
  return await knex
    .select(
      'target_id as targetId',
      'target_type as targetType',
      'reviewed_on as reviewedOn'
    )
    .from('pi_review')
    .where('disclosure_id', disclosureId);
};

PIReviewDB.setEntityName = async function(knex, entityId, name) {
  await knex('fin_entity')
    .update({name})
    .where({id: entityId});
};

addLoggers({PIReviewDB});
