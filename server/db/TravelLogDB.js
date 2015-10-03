import {saveSingleRecord, getExistingSingleRecord, saveExistingSingleRecord, deleteExistingSingleRecord} from './CommonDB';

let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let saveQuestionnaire = (dbInfo, userId, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'travel_log_entry', pk: 'id'}, optionalTrx);
};

export let getExistingQuestionnaire = (dbInfo, userId, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'travel_log_entry', pk: 'id'}, optionalTrx);
};

export let saveExistingQuestionnaire = (dbInfo, userId, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'travel_log_entry', pk: 'id'}, optionalTrx);
};

export let deleteExistingQuestionnaire = (dbInfo, userId, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'travel_log_entry', pk: 'id'}, optionalTrx);
};

export let getTravelLogEntries = (dbInfo, userId, callback, optionalTrx) => {
  let knex = getKnex(dbInfo);

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }
  query.select('fe.name as entityName', 'tle.amount', 'tle.start_date as startDate', 'tle.end_date as endDate', 'tle.destination', 'tle.reason')
    .from('travel_log_entry as tle')
    .innerJoin('fin_entity as fe', 'fe.id', 'tle.fin_entity_id')
    .orderBy('fe.name', 'ASC')
    .then(function (result) {
      callback(null, result);
    })
    .catch(function(err) {
      if (optionalTrx) {
        optionalTrx.rollback();
      }
      callback(err);
    });
};
