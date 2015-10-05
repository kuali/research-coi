/*eslint camelcase:0 */
import {COIConstants} from '../../COIConstants';

let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

let getQuestionsToReview = (knex, disclosureId, reviewItems) => {
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
      return knex.select('topic_id as topicId', 'text', 'author', 'date')
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
              if (!question.comments) {
                question.comments = [];
              }
              question.comments.push(comment);
            }
          });
          return questions;
        });
    });
};

let getEntitiesToReview = (knex, disclosureId, reviewItems) => {
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

let getDeclarationsToReview = (knex, disclosureId, reviewItems) => {
  return ['coming soon' + reviewItems.length];
};

export let getPIReviewItems = (dbInfo, userInfo, disclosureId) => {
  let knex = getKnex(dbInfo);

  return knex.select('p.target_type as targetType', 'p.target_id as targetId', 'p.reviewed_on as reviewedOn')
    .from('pi_review as p')
    .innerJoin('disclosure as d', 'd.id', 'p.disclosure_id')
    .where({
      'p.disclosure_id': disclosureId,
      'd.user_id': userInfo.id
    })
    .then(rows => {
      return Promise.all([
        getQuestionsToReview(knex, disclosureId,
          rows.filter(row => {
            return row.targetType === COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE;
          })
        ),
        getEntitiesToReview(knex, disclosureId,
          rows.filter(row => {
            return row.targetType === COIConstants.DISCLOSURE_STEP.ENTITIES;
          })
        ),
        getDeclarationsToReview(knex, disclosureId,
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