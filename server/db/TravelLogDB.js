import {saveSingleRecord, getExistingSingleRecord, saveExistingSingleRecord, deleteExistingSingleRecord} from './CommonDB';

let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let saveQuestionnaire = (dbInfo, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'travel_log_entry', pk: 'id'}, optionalTrx);
};

export let getExistingQuestionnaire = (dbInfo, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'travel_log_entry', pk: 'id'}, optionalTrx);
};

export let saveExistingQuestionnaire = (dbInfo, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'travel_log_entry', pk: 'id'}, optionalTrx);
};

export let deleteExistingQuestionnaire = (dbInfo, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'travel_log_entry', pk: 'id'}, optionalTrx);
};

export let getTravelLogEntries = (dbInfo, callback, optionalTrx) => {
  let knex = getKnex(dbInfo);

  var query = function (trx) {
    knex.transacting(trx)
    .select('fe.name as entityName', 'tle.amount', 'tle.start_date as startDate', 'tle.end_date as endDate', 'tle.destination', 'tle.reason')
    .from('travel_log_entry as tle')
    .innerJoin('fin_entity as fe', 'fe.id', 'tle.fin_entity_id')
    .orderBy('fe.name', 'ASC')
    .then(function (result) {
      callback(null, result);
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
