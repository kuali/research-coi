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

export let getTravelLogEntries = (dbInfo, userId, sortColumn, sortDirection) => {
  let knex = getKnex(dbInfo);

  let dbSortColumn;
  let dbSortDirection = sortDirection === 'DESCENDING' ? 'desc' : undefined;
  switch (sortColumn) {
    case 'date':
      dbSortColumn = 't.start_date';
      break;
    case 'destination':
      dbSortColumn = 't.destination';
      break;
    case 'amount':
      dbSortColumn = 't.amount';
      break;
    default:
      dbSortColumn = 'fe.name';
      break;
  }

  return knex.select('fe.name as entityName', 't.amount', 't.start_date as startDate', 't.end_date as endDate', 't.destination', 't.reason')
    .from('travel_relationship as t')
    .innerJoin('relationship as r', 'r.id', 't.relationship_id' )
    .innerJoin('fin_entity as fe', 'fe.id', 'r.fin_entity_id')
    .innerJoin('disclosure as d', 'd.id', 'fe.disclosure_id')
    .where('d.user_id', userId)
    .orderBy(dbSortColumn, dbSortDirection);
};

let createAnnualDisclosure = (knex, userInfo) => {
  return knex('config').max('id as id')
  .then(config => {
    return knex('disclosure')
    .insert({
      type_cd: 2,
      status_cd: 1,
      start_date: new Date(),
      user_id: userInfo.schoolId,
      submitted_by: userInfo.name,
      config_id: config[0].id
    });
  });
};

let createNewEntity = (knex, disclosureId, entry, status) => {
  return knex('fin_entity').insert({
    disclosure_id: disclosureId,
    name: entry.entityName,
    active: true,
    status: status
  });
};

let createNewRelationship = (knex, entityId, entry, status) => {
  return knex('relationship').insert({
    fin_entity_id: entityId,
    relationship_cd: COIConstants.ENTITY_RELATIONSHIP.TRAVEL,
    person_cd: 1,
    status: status
  }).then(relationshipId => {
    return knex('travel_relationship').insert({
      relationship_id: relationshipId,
      amount: entry.amount,
      destination: entry.destination,
      start_date: new Date(entry.startDate),
      end_date: new Date(entry.endDate),
      reason: entry.reason
    }).then(travelRelationshipId => {
      entry.id = travelRelationshipId[0];
      return entry;
    });
  });
};

let isSubmitted = (status) => {
  if (status === COIConstants.DISCLOSURE_STATUS.IN_PROGRESS || status === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE) {
    return false;
  } else {
    return true;
  }
};

let getExistingFinancialEntity = (trx, entityName, disclosureId) => {
  return trx('fin_entity')
  .select('id')
  .where({name: entityName, disclosure_id: disclosureId});
};

let handleTravelLogEntry = (trx, disclosureId, entry, status) => {
  return getExistingFinancialEntity(trx, entry.entityName, disclosureId)
  .then(entity => {
    if (entity[0]) {
      return createNewRelationship(trx, entity[0].id, entry, status);
    } else {
      return createNewEntity(trx, disclosureId, entry, status)
      .then(newEntityId => {
        return createNewRelationship(trx, newEntityId, entry, status);
      });
    }
  });
};

export let createTravelLogEntry = (dbInfo, entry, userInfo) => {
  let knex = getKnex(dbInfo);
  return knex.transaction(trx => {
    return trx('disclosure').select('status_cd', 'id').where({
      user_id: userInfo.schoolId,
      type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL
    }).then(disclosure => {
      if (disclosure[0]) {
        if (isSubmitted(disclosure[0].status_cd) === true) {
          return handleTravelLogEntry(trx, disclosure[0].id, entry, COIConstants.RELATIONSHIP_STATUS.PENDING);
        } else {
          return handleTravelLogEntry(trx, disclosure[0].id, entry, COIConstants.RELATIONSHIP_STATUS.IN_PROGRESS);
        }
      } else {
        return createAnnualDisclosure(trx, userInfo).then(disclosureId => {
          return createNewEntity(trx, disclosureId, entry, COIConstants.RELATIONSHIP_STATUS.IN_PROGRESS).then(entityId => {
            return createNewRelationship(trx, entityId, entry, COIConstants.RELATIONSHIP_STATUS.IN_PROGRESS);
          });
        });
      }
    });
  });
};
