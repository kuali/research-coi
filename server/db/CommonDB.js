/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

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
  return query.insert(snakeizeJson(record), tableProps.pk)
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

export let isDisclosureUsers = (dbInfo, disclosureId, userId) => {
  let knex = getKnex(dbInfo);

  return knex.select('user_id')
    .from('disclosure')
    .where({
      'id': disclosureId,
      'user_id': userId
    })
    .then(result => {
      return result.length > 0;
    });
};

export let verifyRelationshipIsUsers = (dbInfo, userId, relationshipId) => {
  let knex = getKnex(dbInfo);

  return knex.select('')
  .from('relationship as r')
  .innerJoin('fin_entity as f', 'f.id', 'r.fin_entity_id')
  .innerJoin('disclosure as d', 'd.id', 'f.disclosure_id')
  .where({
    'd.user_id': userId,
    'r.id': relationshipId
  })
  .then(rows => {
    return rows.length > 0;
  });
};
