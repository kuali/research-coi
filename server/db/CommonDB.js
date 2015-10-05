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

export let saveSingleRecord = (dbInfo, record, tableProps, optionalTrx) => {
  let knex = getKnex(dbInfo);

  let recordId = record[camelizeJson(tableProps.pk)];
  if (recordId) {
    throw new Error('Record already has an ' + tableProps.pk + ' ' + recordId + ' for table ' + tableProps.table);
  }

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }
  return query.insert(snakeizeJson(record))
    .into(tableProps.table)
    .then(result => {
      let updatedRecord = _.clone(record);
      updatedRecord[camelizeJson(tableProps).pk] = result[0];
      return updatedRecord;
    });
};

export let getExistingSingleRecord = (dbInfo, recordId, tableProps, optionalTrx) => {
  let knex = getKnex(dbInfo);

  if (!recordId) {
    throw new Error('Record does not have an ' + tableProps.pk + ' for table ' + tableProps.table);
  }

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }

  return query.select('*')
    .from(tableProps.table)
    .where(tableProps.pk, recordId)
    .then(result => {
      return camelizeJson(result);
    });
};

export let saveExistingSingleRecord = (dbInfo, record, tableProps, optionalTrx) => {
  let knex = getKnex(dbInfo);

  let recordId = record[camelizeJson(tableProps).pk];
  if (!recordId) {
    throw new Error('Record does not have an ' + tableProps.pk + ' for table ' + tableProps.table);
  }

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }
  return query.update(snakeizeJson(record))
    .table(tableProps.table)
    .where(tableProps.pk, recordId)
    .then(() => {
      let updatedRecord = _.clone(record);
      return updatedRecord;
    });
};

export let deleteExistingSingleRecord = (dbInfo, recordId, tableProps, optionalTrx) => {
  let knex = getKnex(dbInfo);

  if (!recordId) {
    throw new Error('Record does not have an ' + tableProps.pk + ' for table ' + tableProps.table);
  }

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }
  return query.delete()
    .from(tableProps.table)
    .where(tableProps.pk, recordId);
};
