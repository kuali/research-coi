/*eslint camelcase:0 */
import {COIConstants} from '../../COIConstants';
import {isDisclosureUsers} from './CommonDB';

let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let verifyReviewIsForUser = (dbInfo, reviewId, userId) => {
  let knex = getKnex(dbInfo);

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

let updatePIResponseComment = (dbInfo, userInfo, disclosureId, targetType, targetId, comment) => {
  let knex = getKnex(dbInfo);

  return knex.select('c.id')
    .from('comment as c')
    .where({
      'c.disclosure_id': disclosureId,
      'c.topic_section': targetType,
      'c.topic_id': targetId,
      'c.user_id': userInfo.id
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
            'c.user_id': userInfo.id
          });
      }
      else {
        return knex('comment').insert({
          'disclosure_id': disclosureId,
          'topic_section': targetType,
          'topic_id': targetId,
          'text': comment,
          'user_id': userInfo.id,
          'author': userInfo.displayName,
          'date': new Date(),
          'pi_visible': true,
          'reviewer_visible': true
        });
      }
    });
};

let updateReviewRecord = (knex, reviewId, values) => {
  let newValues = {
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

export let recordPIResponse = (dbInfo, userInfo, reviewId, comment) => {
  let knex = getKnex(dbInfo);

  return knex.select('disclosure_id as disclosureId', 'target_type as targetType', 'target_id as targetId')
    .from('pi_review')
    .where('id', reviewId)
    .then(reviewItem => {
      return isDisclosureUsers(dbInfo, reviewItem[0].disclosureId, userInfo.id)
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
          else {
            return 'Unauthorized';
          }
        });
    });
};

let extractTargetIDs = reviewItems => {
  return reviewItems.reduce((previous, current) => {
    previous.push(current.targetId);
    return previous;
  }, []);
};

let getQuestions = (knex, disclosureId, questionIDs) => {
  return knex.select('qq.id', 'qq.question', 'qa.answer')
    .from('questionnaire_question as qq')
    .innerJoin('questionnaire_answer as qa', 'qa.question_id', 'qq.id')
    .innerJoin('disclosure_answer as da', 'da.questionnaire_answer_id', 'qa.id')
    .where({
      'da.disclosure_id': disclosureId
    })
    .andWhere('qq.id', 'in', questionIDs);
};

let getSubQuestions = (knex, disclosureId, potentialParentIDs) => {
  return knex.select('qq.id', 'qq.question', 'qa.answer', 'qq.parent')
    .from('questionnaire_question as qq')
    .innerJoin('questionnaire_answer as qa', 'qa.question_id', 'qq.id')
    .innerJoin('disclosure_answer as da', 'da.questionnaire_answer_id', 'qa.id')
    .where({
      'da.disclosure_id': disclosureId
    })
    .andWhere('qq.parent', 'in', potentialParentIDs);
};

let getComments = (knex, disclosureId, topicIDs, section) => {
  return knex.select('id', 'topic_id as topicId', 'text', 'author', 'date', 'user_id as userId')
    .from('comment as c')
    .where({
      'disclosure_id': disclosureId,
      'topic_section': section,
      'pi_visible': true
    })
    .andWhere('topic_id', 'in', topicIDs);
};

let getQuestionnaireComments = (knex, disclosureId, topicIDs) => {
  return getComments(knex, disclosureId, topicIDs, COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE);
};

let getEntityComments = (knex, disclosureId, topicIDs) => {
  return getComments(knex, disclosureId, topicIDs, COIConstants.DISCLOSURE_STEP.ENTITIES);
};

let setAdminCommentsForTopics = (topics, comments, currentUserId) => {
  comments.filter(comment => {
    return comment.userId !== currentUserId;
  }).forEach(comment => {
    let topic = topics.find(topicToTest => {
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

let setPIResponseForTopics = (topics, comments, currentUserId) => {
  comments.filter(comment => {
    return comment.userId === currentUserId;
  }).forEach(comment => {
    let topic = topics.find(topicToTest => {
      return topicToTest.id === comment.topicId;
    });

    if (topic) {
      topic.piResponse = comment;
    }
  });
};

let setPIReviewDataForTopics = (topics, reviewItems) => {
  topics.forEach(topic => {
    let piReviewRecord = reviewItems.find(item => {
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

let associateSubQuestions = (questions, subQuestions) => {
  subQuestions.forEach(subQuestion => {
    let parent = questions.find(question => {
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

let getQuestionsToReview = (knex, disclosureId, userId, reviewItems) => {
  let questionIDs = extractTargetIDs(reviewItems);

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

export let reviseEntityQuestion = (dbInfo, userInfo, reviewId, questionId, newAnswer) => {
  let knex = getKnex(dbInfo);

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
          let answerToStore = {
            value: newAnswer
          };
          return knex('questionnaire_answer')
            .where('id', rows[0].id)
            .update('answer', JSON.stringify(answerToStore))
            .then(() => {
              return true;
            });
        }
        else {
          return false;
        }
      }),
    updateReviewRecord(knex, reviewId, {revised: true})
  ]);
};

export let reviseQuestion = (dbInfo, userInfo, reviewId, answer) => {
  let knex = getKnex(dbInfo);

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
          let answerToStore = {
            value: answer
          };
          return knex('questionnaire_answer')
            .where('id', rows[0].id)
            .update('answer', JSON.stringify(answerToStore))
            .then(() => {
              return true;
            });
        }
        else {
          return false;
        }
      }),
    updateReviewRecord(knex, reviewId, {revised: true})
  ]);
};

let getEntityNames = (knex, entityIDs) => {
  return knex.select('fe.id', 'fe.name')
    .from('fin_entity as fe')
    .where('fe.id', 'in', entityIDs);
};

let getEntitiesAnswers = (knex, entityIDs) => {
  return knex.select('qq.id as questionId', 'qa.answer', 'fa.fin_entity_id as finEntityId')
    .from('questionnaire_question as qq')
    .innerJoin('questionnaire_answer as qa', 'qa.question_id', 'qq.id')
    .innerJoin('fin_entity_answer as fa', 'fa.questionnaire_answer_id', 'qa.id')
    .where('fa.fin_entity_id', 'in', entityIDs);
};

let getRelationships = (knex, entityIDs) => {
  return knex.select('r.id', 'r.comments as comment', 'c.description as relationship', 'p.description as person', 't.description as type', 'a.description as amount', 'r.fin_entity_id as finEntityId')
    .from('relationship as r')
    .innerJoin('relationship_category_type as c', 'c.type_cd', 'r.relationship_cd')
    .innerJoin('relationship_person_type as p', 'p.type_cd', 'r.person_cd')
    .innerJoin('relationship_type as t', function() {
      this.on('r.relationship_cd', 't.relationship_cd')
        .andOn('r.type_cd', 't.type_cd');
    })
    .innerJoin('relationship_amount_type as a', function() {
      this.on('r.relationship_cd', 'a.relationship_cd')
        .andOn('r.amount_cd', 'a.type_cd');
    })
    .where('fin_entity_id', 'in', entityIDs);
};

let setQuestionAnswersForEntities = (entities, entityQuestionAnswers) => {
  entityQuestionAnswers.forEach(answer => {
    let targetEntity = entities.find(entity => {
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

let setRelationshipsForEntities = (entities, relationships) => {
  relationships.forEach(relationship => {
    let entity = entities.find(entityToTest => {
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

let getEntitiesToReview = (knex, disclosureId, userId, reviewItems) => {
  let entityIDs = extractTargetIDs(reviewItems);

  return Promise.all([
    getEntityNames(knex, entityIDs),
    getEntitiesAnswers(knex, entityIDs),
    getEntityComments(knex, disclosureId, entityIDs),
    getRelationships(knex, entityIDs)
  ])
  .then(([entities, entityQuestionAnswers, comments, relationships]) => {
    setQuestionAnswersForEntities(entities, entityQuestionAnswers);
    setPIResponseForTopics(entities, comments, userId);
    setRelationshipsForEntities(entities, relationships);
    setAdminCommentsForTopics(entities, comments, userId);
    setPIReviewDataForTopics(entities, reviewItems);
    return entities;
  });
};

let getDeclarationsToReview = (knex, disclosureId, userId, reviewItems) => {
  return ['coming soon' + reviewItems.length];
};

export let getPIReviewItems = (dbInfo, userInfo, disclosureId) => {
  let knex = getKnex(dbInfo);

  return knex.select('p.id', 'p.target_type as targetType', 'p.target_id as targetId', 'p.reviewed_on as reviewedOn', 'p.revised', 'p.responded_to as respondedTo')
    .from('pi_review as p')
    .innerJoin('disclosure as d', 'd.id', 'p.disclosure_id')
    .where({
      'p.disclosure_id': disclosureId,
      'd.user_id': userInfo.id
    })
    .then(rows => {
      return Promise.all([
        getQuestionsToReview(knex, disclosureId, userInfo.id,
          rows.filter(row => {
            return row.targetType === COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE;
          })
        ),
        getEntitiesToReview(knex, disclosureId, userInfo.id,
          rows.filter(row => {
            return row.targetType === COIConstants.DISCLOSURE_STEP.ENTITIES;
          })
        ),
        getDeclarationsToReview(knex, disclosureId, userInfo.id,
          rows.filter(row => {
            return row.targetType === COIConstants.DISCLOSURE_STEP.PROJECTS;
          })
        )
      ]).then(([questions, entities, declarations]) => {
        return {
          questions: questions,
          entities: entities,
          declarations: declarations
        };
      });
    });
};

let getReviewTarget = (knex, reviewId) => {
  return knex.select('target_type as targetType', 'target_id as targetId')
    .from('pi_review as p')
    .where({
      'p.id': reviewId
    }).then(rows => {
      return rows[0];
    });
};

export let addRelationship = (dbInfo, userInfo, reviewId, newRelationship) => {
  let knex = getKnex(dbInfo);

  return getReviewTarget(knex, reviewId)
    .then(reviewTarget => {
      return knex('relationship')
        .insert({
          fin_entity_id: reviewTarget.targetId,
          relationship_cd: newRelationship.relationshipCd,
          person_cd: newRelationship.personCd,
          type_cd: newRelationship.typeCd,
          amount_cd: newRelationship.amountCd,
          comments: newRelationship.comments
        })
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

let verifyRelationshipIsUsers = (knex, userId, relationshipId) => {
  return knex.select('')
    .from('relationship as r')
    .innerJoin('fin_entity as f', 'f.id', 'r.fin_entity_id')
    .innerJoin('disclosure as d', 'd.id', 'f.disclosure_id')
    .where({
      'd.user_id': userId,
      'r.id': relationshipId
    })
    .then(rows => {
      return rows.length > 0;
    });
};

export let removeRelationship = (dbInfo, userInfo, reviewId, relationshipId) => {
  let knex = getKnex(dbInfo);

  return verifyRelationshipIsUsers(knex, userInfo.id, relationshipId)
    .then(isAllowed => {
      if (isAllowed) {
        return Promise.all([
          updateReviewRecord(knex, reviewId, {revised: true}),
          knex('relationship')
            .where('id', relationshipId)
            .del()
        ]);
      }
      else {
        return 'Unauthorized';
      }
    });
};

// ///-------------------------------------------------------

//       let entityQueries = rows.filter(row => {
//         return row.targetType === COIConstants.DISCLOSURE_STEP.ENTITIES;
//       }).map(entity => {
//         return knex.select('fe.id')
//           .from('fin_entity as fe')
//           .where({
//             'fe.id': entity.targetId
//           });
//       });

//       let declarationQueries = rows.filter(row => {
//         return row.targetType === COIConstants.DISCLOSURE_STEP.PROJECTS;
//       }).map(declaration => {
//         return knex.select('de.id')
//           .from('declaration as de')
//           .where({
//             'de.id': declaration.targetId
//           });
//       });
// };