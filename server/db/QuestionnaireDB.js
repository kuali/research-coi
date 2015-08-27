import {saveSingleRecord, getExistingSingleRecord, saveExistingSingleRecord, deleteExistingSingleRecord} from './CommonDB';
import {camelizeJson, snakeizeJson} from './JsonUtils';
import _ from 'lodash';

let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let saveQuestionnaire = (dbInfo, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'questionnaire', pk: 'id'}, optionalTrx);
};

export let getExistingQuestionnaire = (dbInfo, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'questionnaire', pk: 'id'}, optionalTrx);
};

export let saveExistingQuestionnaire = (dbInfo, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'questionnaire', pk: 'id'}, optionalTrx);
};

export let deleteExistingQuestionnaire = (dbInfo, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'questionnaire', pk: 'id'}, optionalTrx);
};

export let getLatestQuestionnaire = (dbInfo, callback, optionalTrx) => {
  let knex = getKnex(dbInfo);

  var query = function (trx) {
    knex('questionnaire')
    .transacting(trx)
    .select('*')
    .limit(1)
    .orderBy('version', 'desc')
    .then(function (result) {
      callback(null, camelizeJson(result));
    })
    .catch(function(err) {
      trx.rollback();
      callback(err);
    });
  };

  if (optionalTrx) {
    query(optionalTrx);
  } else {
    knex.transaction(function(trx) {
      query(trx);
    });
  }
};

export let saveQuestionnaireAnswers = (dbInfo, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'questionnaire_answers', pk: 'id'}, optionalTrx);
};

export let getExistingQuestionnaireAnswers = (dbInfo, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'questionnaire_answers', pk: 'id'}, optionalTrx);
};

export let saveExistingQuestionnaireAnswers = (dbInfo, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'questionnaire_answers', pk: 'id'}, optionalTrx);
};

export let deleteExistingQuestionnaireAnswers = (dbInfo, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'questionnaire_answers', pk: 'id'}, optionalTrx);
};
