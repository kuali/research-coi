/*eslint-disable camelcase */

exports.seed = function(knex, Promise) {
  return Promise.join(
  knex('questionnaire').insert({
    instructions: 'Please fill out this questionnaire in order to document your disclosure activities. Thanks! No taking $$ from vendors.',
    version: 1
  })
  .then(function(questionnaireId) {
    return Promise.join(
      knex('questionnaire_question').insert({
        questionnaire_id: questionnaireId[0],
        question: JSON.stringify({
          text: 'From any for-profit organization, did you receive in the last 12 months, or do you expect to receive in the next 12 months, salary, director\'s fees, consulting payments, honoraria, royalties; or other payments for patents, copyrights or other intellectual property; or other direct payments exceeding $5,000?',
          type: 'boolean',
          validations: ['required']
        })
      }).then(function (parentId) {
        return Promise.join(
          knex('questionnaire_question').insert({
            questionnaire_id: questionnaireId[0],
            parent: parentId[0],
            question: JSON.stringify({
              text: 'If Yes, did the organization send you on vacation?',
              type: 'text',
              validations: ['select1', 'required'],
              displayCriteria: 'Yes'
            })
          }).then(function(questionId) {
            return knex('questionnaire_answer').insert({
              question_id: questionId[0],
              answer: JSON.stringify({
                value: 'no'
              })
            })
            .then(function(questionnaireAnswerId){
              return knex('disclosure').min('id as id')
              .then(function(row) {
                return knex('disclosure_answer').insert({
                  disclosure_id: row[0].id,
                  questionnaire_answer_id: questionnaireAnswerId[0]
                });
              });
            });
          }),
          knex('questionnaire_answer').insert({
            question_id: parentId[0],
            answer: JSON.stringify({
              value: 'yes'
            })
          })
          .then(function(questionnaireAnswerId){
            return knex('disclosure').min('id as id')
            .then(function(row) {
              return knex('disclosure_answer').insert({
                disclosure_id: row[0].id,
                questionnaire_answer_id: questionnaireAnswerId[0]
              });
            });
          })
        );
      }),
      knex('questionnaire_question').insert({
        questionnaire_id: questionnaireId[0],
        question: JSON.stringify({
          text: 'From any privately held organization, do you have stock, stock options, or other equity interest of any value?',
          type: 'boolean',
          validations: ['required']
        })
      })
        .then(function(questionId) {
        return knex('questionnaire_answer').insert({
          question_id: questionId[0],
          answer: JSON.stringify({
            value: 'no'
          })
        })
        .then(function(questionnaireAnswerId){
          return knex('disclosure').min('id as id')
          .then(function(row) {
            return knex('disclosure_answer').insert({
              disclosure_id: row[0].id,
              questionnaire_answer_id: questionnaireAnswerId[0]
            });
          });
        });
      }),
      knex('questionnaire_question').insert({
        questionnaire_id: questionnaireId[0],
        question: JSON.stringify({
          text: 'Some publicly traded stock must be disclosed, but only in specific circumstances. Do you own stock, which in aggregate exceeds $5,000, in a company that provides funds to this institution in support of your Institutional Responsibilities (e.g. teaching, research, committee, or other administrative responsibilities)? When aggregating, please consider stock, stock options, warrants and other existing or contingent ownership interests in the publicly held company. Do not consider investments where you do not directly influence investment decisions, such as mutual funds and retirement accounts.',
          type: 'boolean',
          validations: ['required']
        })
      })
      .then(function(questionId) {
        return knex('questionnaire_answer').insert({
          question_id: questionId[0],
          answer: JSON.stringify({
            value: 'no'
          })
        })
        .then(function(questionnaireAnswerId){
          return knex('disclosure').min('id as id')
          .then(function(row) {
            return knex('disclosure_answer').insert({
              disclosure_id: row[0].id,
              questionnaire_answer_id: questionnaireAnswerId[0]
            });
          });
        });
      }),
      knex('questionnaire_question').insert({
        questionnaire_id: questionnaireId[0],
        question: JSON.stringify({
          text: 'From US educational institutions, US teaching hospitals or US research institutions affiliated with US educational institutions: Did you receive in the last 12 months, or do you expect to receive in the next 12 months, payments for services, which in aggregate exceed $5,000 (e.g. payments for consulting, board positions, patents, copyrights or other intellectual property)? Exclude payments for scholarly or academic works (i.e. peer-reviewed (vs. editorial reviewed) articles or books based on original research or experimentation, published by an academic association or a university/academic press).',
          type: 'boolean',
          validations: ['required']
        })
      })
      .then(function(questionId) {
        return knex('questionnaire_answer').insert({
          question_id: questionId[0],
          answer: JSON.stringify({
            value: 'yes'
          })
        })
        .then(function(questionnaireAnswerId){
          return knex('disclosure').min('id as id')
          .then(function(row) {
            return knex('disclosure_answer').insert({
              disclosure_id: row[0].id,
              questionnaire_answer_id: questionnaireAnswerId[0]
            });
          });
        });
      })
    );
  })
  );
};
