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

/*eslint camelcase:0 */
import {COIConstants} from '../../COIConstants';
import {isDisclosureUsers, verifyRelationshipIsUsers} from './CommonDB';
import * as DisclosureDB from './DisclosureDB';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export const verifyReviewIsForUser = (dbInfo, reviewId, userId) => {
  const knex = getKnex(dbInfo);

  return knex.count('d.user_id as theCount')
    .from('pi_review as p')
    .innerJoin('disclosure as d', 'd.id', 'p.disclosure_id')
    .where({
      'p.id': reviewId,
      'd.user_id': userId
    })
    .then(rows => {
      return rows[0].theCount === 1;
    });
};

const updatePIResponseComment = (dbInfo, userInfo, disclosureId, targetType, targetId, comment) => {
  const knex = getKnex(dbInfo);

  return knex.select('c.id')
    .from('comment as c')
    .where({
      'c.disclosure_id': disclosureId,
      'c.topic_section': targetType,
      'c.topic_id': targetId,
      'c.user_id': userInfo.schoolId
    })
    .then(comments => {
      if (comments.length > 0) {
        return knex('comment as c')
          .update({
            'text': comment
          })
          .where({
            'c.disclosure_id': disclosureId,
            'c.topic_section': targetType,
            'c.topic_id': targetId,
            'c.user_id': userInfo.schoolId
          });
      }

      return knex('comment').insert({
        'disclosure_id': disclosureId,
        'topic_section': targetType,
        'topic_id': targetId,
        'text': comment,
        'user_id': userInfo.schoolId,
        'author': `${userInfo.firstName} ${userInfo.lastName}`,
        'date': new Date(),
        'pi_visible': true,
        'reviewer_visible': true
      }, 'id');
    });
};

const updateReviewRecord = (knex, reviewId, values) => {
  const newValues = {
    reviewed_on: new Date()
  };
  if (values.revised !== undefined) {
    newValues.revised = true;
  }
  if (values.respondedTo !== undefined) {
    newValues.responded_to = true;
  }

  return knex('pi_review')
    .update(newValues).where({
      'id': reviewId
    });
};

export const recordPIResponse = (dbInfo, userInfo, reviewId, comment) => {
  const knex = getKnex(dbInfo);

  return knex.select('disclosure_id as disclosureId', 'target_type as targetType', 'target_id as targetId')
    .from('pi_review')
    .where('id', reviewId)
    .then(reviewItem => {
      return isDisclosureUsers(dbInfo, reviewItem[0].disclosureId, userInfo.schoolId)
        .then(isSubmitter => {
          if (isSubmitter) {
            return Promise.all([
              updateReviewRecord(knex, reviewId, {
                respondedTo: true
              }),
              updatePIResponseComment(
                dbInfo,
                userInfo,
                reviewItem[0].disclosureId,
                reviewItem[0].targetType,
                reviewItem[0].targetId,
                comment
              )
            ]).then(() => {
              return;
            });
          }

          return 'Unauthorized';
        });
    });
};

const extractTargetIDs = reviewItems => {
  return reviewItems.reduce((previous, current) => {
    previous.push(current.targetId);
    return previous;
  }, []);
};

const getQuestions = (knex, disclosureId, questionIDs) => {
  return knex('disclosure')
    .select('config_id as configId')
    .where('id', disclosureId)
    .then(disclosure => {
      return knex.select('*')
      .from('questionnaire_answer as qa')
      .innerJoin('disclosure_answer as da', 'da.questionnaire_answer_id', 'qa.id')
      .where('da.disclosure_id', disclosureId)
      .then(answers => {
        return knex('config')
        .select('config')
        .where('id', disclosure[0].configId)
        .then(config => {
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
        });
      });
    });
};

const getSubQuestions = (knex, disclosureId, potentialParentIDs) => {
  return knex('disclosure')
  .select('config_id as configId')
  .where('id', disclosureId)
  .then(disclosure => {
    return knex.select('*')
    .from('questionnaire_answer as qa')
    .innerJoin('disclosure_answer as da', 'da.questionnaire_answer_id', 'qa.id')
    .where(function() {
      this.where('da.disclosure_id', disclosureId)
      .orWhereNull('da.disclosure_id');
    })
    .then(answers => {
      return knex('config')
      .select('config')
      .where('id', disclosure[0].configId)
      .then(config => {
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
      });
    });
  });
};

const getComments = (knex, disclosureId, topicIDs, section) => {
  return knex.select('id', 'topic_id as topicId', 'text', 'author', 'date', 'user_id as userId')
    .from('comment as c')
    .where({
      'disclosure_id': disclosureId,
      'topic_section': section,
      'pi_visible': true
    })
    .andWhere('topic_id', 'in', topicIDs);
};

const getQuestionnaireComments = (knex, disclosureId, topicIDs) => {
  return getComments(knex, disclosureId, topicIDs, COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE);
};

const getEntityComments = (knex, disclosureId, topicIDs) => {
  return getComments(knex, disclosureId, topicIDs, COIConstants.DISCLOSURE_STEP.ENTITIES);
};

const getDeclarationComments = (knex, disclosureId, topicIDs) => {
  return getComments(knex, disclosureId, topicIDs, COIConstants.DISCLOSURE_STEP.PROJECTS);
};

const setAdminCommentsForTopics = (topics, comments, currentUserId) => {
  comments.filter(comment => {
    return comment.userId !== currentUserId;
  }).forEach(comment => {
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

const setPIResponseForTopics = (topics, comments, currentUserId) => {
  comments.filter(comment => {
    return comment.userId === currentUserId;
  }).forEach(comment => {
    const topic = topics.find(topicToTest => {
      return topicToTest.id === comment.topicId;
    });

    if (topic) {
      topic.piResponse = comment;
    }
  });
};

const setPIReviewDataForTopics = (topics, reviewItems) => {
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

const associateSubQuestions = (questions, subQuestions) => {
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

const getQuestionsToReview = (knex, disclosureId, userId, reviewItems) => {
  const questionIDs = extractTargetIDs(reviewItems);

  return Promise.all([
    getQuestions(knex, disclosureId, questionIDs),
    getQuestionnaireComments(knex, disclosureId, questionIDs),
    getSubQuestions(knex, disclosureId, questionIDs)
  ])
  .then(([questions, comments, subQuestions]) => {
    associateSubQuestions(questions, subQuestions);
    setPIResponseForTopics(questions, comments, userId);
    setAdminCommentsForTopics(questions, comments, userId);
    setPIReviewDataForTopics(questions, reviewItems);
    return questions;
  });
};

export const reviseEntityQuestion = (dbInfo, userInfo, reviewId, questionId, newAnswer) => {
  const knex = getKnex(dbInfo);

  return Promise.all([
    knex.select('qa.id')
      .from('pi_review as pr')
      .innerJoin('fin_entity_answer as fea', 'pr.target_id', 'fea.fin_entity_id')
      .innerJoin('questionnaire_answer as qa', 'fea.questionnaire_answer_id', 'qa.id')
      .where({
        'pr.target_type': COIConstants.DISCLOSURE_STEP.ENTITIES,
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
};

export const reviseQuestion = (dbInfo, userInfo, reviewId, answer) => {
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
        'pr.target_type': COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE,
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
};

const getEntityNames = (knex, entityIDs) => {
  return knex.select('fe.id', 'fe.name', 'fe.disclosure_id as disclosureId')
    .from('fin_entity as fe')
    .where('fe.id', 'in', entityIDs);
};

const getEntitiesAnswers = (knex, entityIDs) => {
  return knex.select('qq.id as questionId', 'qa.answer', 'fa.fin_entity_id as finEntityId')
    .from('questionnaire_question as qq')
    .innerJoin('questionnaire_answer as qa', 'qa.question_id', 'qq.id')
    .innerJoin('fin_entity_answer as fa', 'fa.questionnaire_answer_id', 'qa.id')
    .where('fa.fin_entity_id', 'in', entityIDs);
};

const getRelationships = (knex, entityIDs) => {
  return knex
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
    .andWhereNot('status', COIConstants.RELATIONSHIP_STATUS.PENDING)
    .then(relationships => {
      return knex('travel_relationship')
      .select('amount', 'destination', 'start_date as startDate', 'end_date as endDate', 'reason', 'relationship_id as relationshipId')
      .whereIn('relationship_id', relationships.map(relationship => { return relationship.id; }))
      .then(travels => {
        relationships.forEach(relationship => {
          const travel = travels.find(item => {
            return item.relationshipId === relationship.id;
          });
          relationship.travel = travel ? travel : {};
        });
        return relationships;
      });
    });
};

const getFiles = (knex, entityIds) => {
  return knex.select('id', 'name', 'key', 'ref_id as refId')
    .from('file')
    .whereIn('ref_id', entityIds)
    .andWhere('file_type', COIConstants.FILE_TYPE.FINANCIAL_ENTITY);
};

const setQuestionAnswersForEntities = (entities, entityQuestionAnswers) => {
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

const setRelationshipsForEntities = (entities, relationships) => {
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

const setFilesForEntities = (entities, files) => {
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

const getEntitiesToReview = (knex, disclosureId, userId, reviewItems) => {
  const entityIDs = extractTargetIDs(reviewItems);

  return Promise.all([
    getEntityNames(knex, entityIDs),
    getEntitiesAnswers(knex, entityIDs),
    getEntityComments(knex, disclosureId, entityIDs),
    getRelationships(knex, entityIDs),
    getFiles(knex, entityIDs)
  ])
  .then(([entities, entityQuestionAnswers, comments, relationships, files]) => {
    setQuestionAnswersForEntities(entities, entityQuestionAnswers);
    setPIResponseForTopics(entities, comments, userId);
    setRelationshipsForEntities(entities, relationships);
    setAdminCommentsForTopics(entities, comments, userId);
    setPIReviewDataForTopics(entities, reviewItems);
    setFilesForEntities(entities, files);
    return entities;
  });
};

const getProjects = (knex, declarationIDs, disclosureId) => {
  return knex.distinct('p.title', 'p.id')
    .from('declaration as d')
    .innerJoin('project as p', 'p.id', 'd.project_id')
    .whereIn('d.id', declarationIDs)
    .andWhere({
      'd.disclosure_id': disclosureId
    });
};

const getEntitesWithTheseDeclarations = (knex, declarationIDs, disclosureId) => {
  return knex.distinct('fe.name', 'fe.id', 'd.project_id as projectId')
    .from('declaration as d')
    .innerJoin('fin_entity as fe', 'fe.id', 'd.fin_entity_id')
    .whereIn('d.id', declarationIDs)
    .andWhere({
      'd.disclosure_id': disclosureId
    });
};

const getDeclarations = (knex, declarationIDs, disclosureId) => {
  return knex.select('d.id', 'd.fin_entity_id as finEntityId', 'd.project_id as projectId', 'd.type_cd as typeCd', 'd.comments')
    .from('declaration as d')
    .whereIn('d.id', declarationIDs)
    .andWhere({
      'd.disclosure_id': disclosureId
    });
};

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

const getDeclarationsToReview = (knex, disclosureId, userId, reviewItems) => {
  const declarationIDs = extractTargetIDs(reviewItems);

  return Promise.all([
    getProjects(knex, declarationIDs, disclosureId),
    getEntitesWithTheseDeclarations(knex, declarationIDs, disclosureId),
    getDeclarationComments(knex, disclosureId, declarationIDs),
    getDeclarations(knex, declarationIDs, disclosureId)
  ]).then(([projects, entities, comments, declarations]) => {
    entities.forEach(entity => {
      const declaration = declarations.find(declarationToTest => {
        return declarationToTest.finEntityId === entity.id && declarationToTest.projectId === entity.projectId;
      });

      if (declaration) {
        entity.comments = declaration.comments;
        entity.relationshipCd = declaration.typeCd;

        entity.adminComments = comments.filter(comment => {
          return comment.topicId === declaration.id && comment.userId !== userId;
        }).sort((a, b) => {
          return a.date - b.date;
        });

        const piResponse = comments.find(comment => {
          return comment.topicId === declaration.id && comment.userId === userId;
        });

        if (piResponse) {
          entity.piResponse = piResponse;
        }

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
  });
};

export const getPIReviewItems = (dbInfo, userInfo, disclosureId) => {
  return isDisclosureUsers(dbInfo, disclosureId, userInfo.schoolId)
    .then(isSubmitter => {
      if (!isSubmitter) {
        throw Error(`Attempt by ${userInfo.username} to access pi-review-items for disclosure ${disclosureId} which isnt theirs`);
      }

      const knex = getKnex(dbInfo);

      return knex.select(
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
        })
        .then(rows => {
          return Promise.all([
            getQuestionsToReview(knex, disclosureId, userInfo.schoolId,
              rows.filter(row => {
                return row.targetType === COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE;
              })
            ),
            getEntitiesToReview(knex, disclosureId, userInfo.schoolId,
              rows.filter(row => {
                return row.targetType === COIConstants.DISCLOSURE_STEP.ENTITIES;
              })
            ),
            getDeclarationsToReview(knex, disclosureId, userInfo.schoolId,
              rows.filter(row => {
                return row.targetType === COIConstants.DISCLOSURE_STEP.PROJECTS;
              })
            ),
            knex('disclosure').select('config_id as configId').where('id', disclosureId)
          ]).then(([questions, entities, declarations, config]) => {
            return {
              questions,
              entities,
              declarations,
              configId: config[0].configId
            };
          });
        });
    });
};

const getReviewTarget = (knex, reviewId) => {
  return knex.select('target_type as targetType', 'target_id as targetId')
    .from('pi_review as p')
    .where({
      'p.id': reviewId
    }).then(rows => {
      return rows[0];
    });
};

export const addRelationship = (dbInfo, userInfo, reviewId, newRelationship) => {
  const knex = getKnex(dbInfo);

  return getReviewTarget(knex, reviewId)
    .then(reviewTarget => {
      return knex('relationship')
        .insert({
          fin_entity_id: reviewTarget.targetId,
          relationship_cd: newRelationship.relationshipCd,
          person_cd: newRelationship.personCd,
          type_cd: !newRelationship.typeCd ? null : newRelationship.typeCd,
          amount_cd: !newRelationship.amountCd ? null : newRelationship.amountCd,
          comments: newRelationship.comments,
          status: COIConstants.RELATIONSHIP_STATUS.IN_PROGRESS
        }, 'id')
        .then(() => {
          return Promise.all([
            getRelationships(knex, [reviewTarget.targetId]),
            updateReviewRecord(knex, reviewId, {revised: true})
          ])
          .then(([relationships]) => {
            return relationships;
          });
        });
    });
};

export const removeRelationship = (dbInfo, userInfo, reviewId, relationshipId) => {
  const knex = getKnex(dbInfo);

  return verifyRelationshipIsUsers(dbInfo, userInfo.schoolId, relationshipId)
    .then(isAllowed => {
      if (isAllowed) {
        return Promise.all([
          updateReviewRecord(knex, reviewId, {revised: true}),
          knex('relationship')
            .where('id', relationshipId)
            .del()
        ]);
      }

      return 'Unauthorized';
    });
};

export const reviseDeclaration = (dbInfo, userInfo, reviewId, declaration) => {
  const knex = getKnex(dbInfo);

  return knex.select('target_id as targetId')
    .from('pi_review')
    .where('id', reviewId)
    .then(targetIds => {
      return Promise.all([
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
    });
};

export const reviseSubQuestion = (dbInfo, userInfo, reviewId, subQuestionId, answer) => {
  const knex = getKnex(dbInfo);

  return knex.select('disclosure_id as disclosureId', 'target_id as targetId')
    .from('pi_review as p')
    .where({
      'p.id': reviewId
    }).then(rows => {
      return Promise.all([
        knex.count('* as answerCount').from('questionnaire_answer').where('question_id', subQuestionId),
        updateReviewRecord(knex, reviewId, {revised: true})
      ]).then(([rowCount]) => {
        if (rowCount[0].answerCount > 0) {
          return DisclosureDB.saveExistingQuestionAnswer(dbInfo, userInfo.schoolId, rows[0].disclosureId, subQuestionId, answer);
        }

        return DisclosureDB.saveNewQuestionAnswer(dbInfo, userInfo.schoolId, rows[0].disclosureId, {
          questionId: subQuestionId,
          answer
        });
      });
    });
};

export const deleteAnswers = (dbInfo, userInfo, reviewId, toDelete) => {
  const knex = getKnex(dbInfo);

  return knex.select('p.disclosure_id as disclosureId')
    .from('pi_review as p')
    .where('id', reviewId)
    .then(rows => {
      return DisclosureDB.deleteAnswers(dbInfo, userInfo, rows[0].disclosureId, toDelete);
    });
};

export const reSubmitDisclosure = (dbInfo, userInfo, disclosureId) => {
  const knex = getKnex(dbInfo);

  return isDisclosureUsers(dbInfo, disclosureId, userInfo.schoolId)
    .then(isSubmitter => {
      if (isSubmitter) {
        return knex('disclosure')
          .update({
            status_cd: COIConstants.DISCLOSURE_STATUS.RESUBMITTED
          })
          .where({
            id: disclosureId
          });
      }

      return 'Unauthorized';
    });
};

export const getPIResponseInfo = (dbInfo, disclosureId) => {
  const knex = getKnex(dbInfo);

  return knex.select('target_id as targetId', 'target_type as targetType', 'reviewed_on as reviewedOn')
    .from('pi_review')
    .where('disclosure_id', disclosureId)
    .then(reviewRecords => {
      return reviewRecords;
    });
};
