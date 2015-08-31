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

export let saveSingleRecord = (dbInfo, record, callback, tableProps, optionalTrx) => {
  let knex = getKnex(dbInfo);

  let recordId = record[camelizeJson(tableProps.pk)];
  if (recordId) {
    callback('Record already has an ' + tableProps.pk + ' ' + recordId + ' for table ' + tableProps.table);
  }

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }
  query.insert(snakeizeJson(record))
  .into(tableProps.table)
  .then(function (result) {
    let updatedRecord = _.clone(record);
    updatedRecord[camelizeJson(tableProps.pk)] = result;
    callback(null, updatedRecord);
  })
  .catch(function(err) {
    if (optionalTrx) {
      optionalTrx.rollback();
    }
    callback(err);
  });
};

export let getExistingSingleRecord = (dbInfo, recordId, callback, tableProps, optionalTrx) => {
  let knex = getKnex(dbInfo);

  if (!recordId) {
    callback('Record does not have an ' + tableProps.pk + ' for table ' + tableProps.table);
  }

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }

  query.select('*')
  .from(tableProps.table)
  .where(tableProps.pk, recordId)
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

export let saveExistingSingleRecord = (dbInfo, record, callback, tableProps, optionalTrx) => {
  let knex = getKnex(dbInfo);

  let recordId = record[camelizeJson(tableProps.pk)];
  if (!recordId) {
    callback('Record does not have an ' + tableProps.pk + ' for table ' + tableProps.table);
  }

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }
  query.update(snakeizeJson(record))
  .table(tableProps.table)
  .where(tableProps.pk, recordId)
  .then(function (result) {  //eslint-disable-line no-unused-vars
    let updatedRecord = _.clone(record);
    callback(null, updatedRecord);
  })
  .catch(function(err) {
    if (optionalTrx) {
      optionalTrx.rollback();
    }
    callback(err);
  });
};

export let deleteExistingSingleRecord = (dbInfo, recordId, callback, tableProps, optionalTrx) => {
  let knex = getKnex(dbInfo);

  if (!recordId) {
    callback('Record does not have an ' + tableProps.pk + ' for table ' + tableProps.table);
  }

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }
  query.delete()
  .from(tableProps.table)
  .where(tableProps.pk, recordId)
  .then(function (result) {
    callback(null, result);
  })
  .catch(function(err) {
    if (optionalTrx) {
      optionalTrx.rollback();
    }
    callback(err);
  });

  if (optionalTrx) {
    query(optionalTrx);
  } else {
    knex.transaction(function(trx) {
      query(trx);
    });
  }
};

