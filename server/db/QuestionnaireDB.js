/*eslint camelcase:0 */
import {saveSingleRecord, getExistingSingleRecord, saveExistingSingleRecord, deleteExistingSingleRecord} from './CommonDB';
import {camelizeJson} from './JsonUtils';

let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let saveQuestionnaire = (dbInfo, userId, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'questionnaire', pk: 'id'}, optionalTrx);
};

export let getExistingQuestionnaire = (dbInfo, userId, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'questionnaire', pk: 'id'}, optionalTrx);
};

export let saveExistingQuestionnaire = (dbInfo, userId, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'questionnaire', pk: 'id'}, optionalTrx);
};

export let deleteExistingQuestionnaire = (dbInfo, userId, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'questionnaire', pk: 'id'}, optionalTrx);
};

export let getLatestQuestionnaire = (dbInfo, userId, callback, optionalTrx) => {
  var questionnaire;
  let knex = getKnex(dbInfo);

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }

  query.select('*')
  .from('questionnaire')
  .limit(1)
  .orderBy('version', 'desc')
  .then( result => {
    questionnaire = result[0];
    questionnaire.questions = [];
    query.select('*')
    .from('questionnaire_question as qq')
    .where({questionnaire_id: result[0].id})
    .then(questions => {
      questions.forEach(question => {
        question.question = JSON.parse(question.question);
        questionnaire.questions.push(question);
      });
      callback(undefined, camelizeJson(questionnaire));
    });

  })
  .catch(function(err) {
    if (optionalTrx) {
      optionalTrx.rollback();
    }
    callback(err);
  });
};


export let saveQuestionnaireAnswers = (dbInfo, userId, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'questionnaire_answers', pk: 'id'}, optionalTrx);
};

export let getExistingQuestionnaireAnswers = (dbInfo, userId, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'questionnaire_answers', pk: 'id'}, optionalTrx);
};

export let saveExistingQuestionnaireAnswers = (dbInfo, userId, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'questionnaire_answers', pk: 'id'}, optionalTrx);
};

export let deleteExistingQuestionnaireAnswers = (dbInfo, userId, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'questionnaire_answers', pk: 'id'}, optionalTrx);
};
