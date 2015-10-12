/*eslint camelcase:0 */
import {COIConstants} from '../../COIConstants';
import {isDisclosureUsers} from './CommonDB';
import {camelizeJson} from './JsonUtils';

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

  return knex.count('d.user_id')
    .from('pi_review as p')
    .innerJoin('disclosure as d', 'd.id', 'p.disclosure_id')
    .where({
      'p.id': reviewId,
      'd.user_id': userId
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
              knex('pi_review')
                .update({
                  'reviewed_on': new Date()
                }).where({
                  'id': reviewId
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

let getQuestionsToReview = (knex, disclosureId, userId, reviewItems) => {
  let questionIDs = reviewItems.reduce((previous, current) => {
    previous.push(current.targetId);
    return previous;
  }, []);

  return knex.select('qq.id', 'qq.question', 'qa.answer')
    .from('questionnaire_question as qq')
    .innerJoin('questionnaire_answer as qa', 'qa.question_id', 'qq.id')
    .innerJoin('disclosure_answer as da', 'da.questionnaire_answer_id', 'qa.id')
    .where({
      'da.disclosure_id': disclosureId
    })
    .andWhere('qq.id', 'in', questionIDs)
    .then(questions => {
      return knex.select('id', 'topic_id as topicId', 'text', 'author', 'date', 'user_id as userId')
        .from('comment as c')
        .where({
          'disclosure_id': disclosureId,
          'topic_section': COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE,
          'pi_visible': true
        })
        .andWhere('topic_id', 'in', questionIDs)
        .then(comments => {
          comments.forEach(comment => {
            let question = questions.find(questionToTest => {
              return questionToTest.id === comment.topicId;
            });
            if (question) {
              if (comment.userId === userId) {
                question.piResponse = comment;
              }
              else {
                if (!question.comments) {
                  question.comments = [];
                }
                question.comments.push(comment);
              }
            }
          });

          return questions;
        });
    }).then(questions => {
      questions.map(question => {
        let piReviewRecord = reviewItems.find(item => {
          return item.targetId === question.id;
        });
        question.reviewId = piReviewRecord.id;
        question.reviewedOn = piReviewRecord.reviewedOn;
        return question;
      });
      return questions;
    });
};

export let reviseQuestion = (dbInfo, userInfo, reviewId, answer) => {
  let knex = getKnex(dbInfo);

  return knex.select('qa.id')
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
    });
};

let getEntitiesToReview = (knex, disclosureId, userId, reviewItems) => {
  let entityIDs = reviewItems.reduce((previous, current) => {
    previous.push(current.targetId);
    return previous;
  }, []);

  return knex.select('fe.name', 'fe.description', 'qq.id', 'qq.question', 'qa.answer')
    .from('questionnaire_question as qq')
    .innerJoin('questionnaire_answer as qa', 'qa.question_id', 'qq.id')
    .innerJoin('fin_entity_answer as fea', 'fea.questionnaire_answer_id', 'qa.id')
    .innerJoin('fin_entity as fe', 'fe.id', 'fea.fin_entity_id')
    .where({
      'fe.disclosure_id': disclosureId
    })
    .andWhere('fe.id', 'in', entityIDs)
    .then(entities => {
      return knex.select('topic_id as topicId', 'text', 'author', 'date')
        .from('comment as c')
        .where({
          'disclosure_id': disclosureId,
          'topic_section': COIConstants.DISCLOSURE_STEP.ENTITIES,
          'pi_visible': true
        })
        .andWhere('topic_id', 'in', entityIDs)
        .then(comments => {
          comments.forEach(comment => {
            let entity = entities.find(entityToTest => {
              return entityToTest.id === comment.topicId;
            });
            if (entity) {
              if (!entity.comments) {
                entity.comments = [];
              }
              entity.comments.push(comment);
            }
          });
          return entities;
        });
    });
};

let getDeclarationsToReview = (knex, disclosureId, userId, reviewItems) => {
  return ['coming soon' + reviewItems.length];
};

export let getPIReviewItems = (dbInfo, userInfo, disclosureId) => {
  let knex = getKnex(dbInfo);

  return knex.select('p.id', 'p.target_type as targetType', 'p.target_id as targetId', 'p.reviewed_on as reviewedOn')
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
      ]).then(results => {
        return {
          questions: results[0],
          entities: results[1],
          declarations: results[2]
        };
      });
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