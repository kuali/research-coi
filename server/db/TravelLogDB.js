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

export let getTravelLogEntries = (dbInfo, userId, optionalTrx) => {
  let knex = getKnex(dbInfo);

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }
  return query.select('fe.name as entityName', 't.amount', 't.start_date as startDate', 't.end_date as endDate', 't.destination', 't.reason')
    .from('travel_relationship as t')
    .innerJoin('relationship as r', 'r.id', 't.relationship_id' )
    .innerJoin('fin_entity as fe', 'fe.id', 'r.fin_entity_id')
    .innerJoin('disclosure as d', 'd.id', 'fe.disclosure_id')
    .where('d.user_id', userId)
    .orderBy('fe.name', 'ASC');
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

let createNewEntity = (knex, disclosureId, entry) => {
  return knex('fin_entity').insert({
    disclosure_id: disclosureId,
    name: entry.entityName,
    active: true
  });
};

let createNewRelationship = (knex, entityId, entry) => {
  return knex('relationship').insert({
    fin_entity_id: entityId,
    relationship_cd: COIConstants.ENTITY_RELATIONSHIP.TRAVEL,
    person_cd: 1
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

export let createTravelLogEntry = (dbInfo, entry, userInfo) => {
  let knex = getKnex(dbInfo);
  return knex.transaction(trx => {
    return trx('disclosure').select('id').where({
      user_id: userInfo.schoolId,
      type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL
    }).then(disclosure => {
      if (disclosure[0]) {
        return trx('fin_entity')
        .select('id')
        .where({name: entry.entityName, disclosure_id: disclosure[0].id})
        .then(entity => {
          if (entity[0]) {
            return createNewRelationship(trx, entity[0].id, entry);
          } else {
            return createNewEntity(trx, disclosure[0].id, entry)
            .then(newEntityId => {
              return createNewRelationship(trx, newEntityId, entry);
            });
          }
        });
      } else {
        return createAnnualDisclosure(trx, userInfo).then(disclosureId => {
          return createNewEntity(trx, disclosureId, entry).then(entityId => {
            return createNewRelationship(trx, entityId, entry);
          });
        });
      }
    });
  });
};
