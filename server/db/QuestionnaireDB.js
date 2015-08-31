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
  .then(function (result) {
    callback(null, camelizeJson(result));
  })
  .catch(function(err) {
    if (optionalTrx) {
      optionalTrx.rollback();
    }
    callback(err);
  });
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
