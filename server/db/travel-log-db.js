/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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

import {
  RELATIONSHIP_STATUS,
  ENTITY_RELATIONSHIP,
  EDITABLE_STATUSES,
  DISCLOSURE_TYPE,
  FILE_TYPE
} from '../../coi-constants';
import {verifyRelationshipIsUsers} from './common-db';
import * as FileService from '../services/file-service/file-service';
import getKnex from './connection-manager';

export function getTravelLogEntries(dbInfo, userId, sortColumn, sortDirection, filter) {
  const knex = getKnex(dbInfo);

  let dbSortColumn;
  const dbSortDirection = sortDirection === 'DESCENDING' ? 'desc' : undefined;
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

  const query = knex
    .select(
      'fe.name as entityName',
      't.amount',
      't.start_date as startDate',
      't.end_date as endDate',
      't.destination',
      't.reason',
      'r.status as status',
      'r.disclosed_date as disclosedDate',
      'r.id as relationshipId',
      'r.active as active'
    )
    .from('travel_relationship as t')
    .innerJoin('relationship as r', 'r.id', 't.relationship_id' )
    .innerJoin('fin_entity as fe', 'fe.id', 'r.fin_entity_id')
    .innerJoin('disclosure as d', 'd.id', 'fe.disclosure_id')
    .where('d.user_id', userId)
    .orderBy(dbSortColumn, dbSortDirection);

  switch (filter) {
    case 'disclosed':
      query.andWhere('r.active', true).andWhere('r.status', RELATIONSHIP_STATUS.DISCLOSED);
      break;
    case 'notYetDisclosed':
      query.whereIn('r.status', [RELATIONSHIP_STATUS.IN_PROGRESS, RELATIONSHIP_STATUS.PENDING]).andWhere('r.active', true);
      break;
    case 'archived':
      query.andWhere('r.active', false);
      break;
    default:
      query.andWhere('r.active', true);
      break;
  }

  return query;
}

function createAnnualDisclosure(knex, userInfo) {
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
      }, 'id');
  });
}

function createNewEntity(knex, disclosureId, entry, status) {
  return knex('fin_entity').insert({
    disclosure_id: disclosureId,
    name: entry.entityName,
    active: true,
    status
  }, 'id');
}

function createNewRelationship(knex, entityId, entry, status) {
  return knex('relationship').insert({
    fin_entity_id: entityId,
    relationship_cd: ENTITY_RELATIONSHIP.TRAVEL,
    person_cd: 1,
    status
  }, 'id').then(relationshipId => {
    return knex('travel_relationship').insert({
      relationship_id: relationshipId[0],
      amount: entry.amount,
      destination: entry.destination,
      start_date: new Date(entry.startDate),
      end_date: new Date(entry.endDate),
      reason: entry.reason
    }, 'id').then(travelRelationshipId => {
      entry.id = travelRelationshipId[0];
      entry.relationshipId = relationshipId[0];
      return entry;
    });
  });
}

function isSubmitted(status) {
  if (EDITABLE_STATUSES.includes(status)) {
    return false;
  }

  return true;
}

function getExistingFinancialEntity(trx, entityName, disclosureId) {
  return trx('fin_entity')
  .select('id')
  .where({name: entityName, disclosure_id: disclosureId});
}

function handleTravelLogEntry(trx, disclosureId, entry, status) {
  return getExistingFinancialEntity(trx, entry.entityName, disclosureId)
  .then(entity => {
    if (entity[0]) {
      return createNewRelationship(trx, entity[0].id, entry, status);
    }

    return createNewEntity(trx, disclosureId, entry, status)
    .then(newEntityId => {
      return createNewRelationship(trx, newEntityId, entry, status);
    });
  });
}

function getAnnualDisclosureForUser(trx, schoolId) {
  return trx('disclosure').select('status_cd', 'id').where({
    user_id: schoolId,
    type_cd: DISCLOSURE_TYPE.ANNUAL
  });
}

export function createTravelLogEntry(dbInfo, entry, userInfo) {
  const knex = getKnex(dbInfo);
  return knex.transaction(trx => {
    return getAnnualDisclosureForUser(trx, userInfo.schoolId)
    .then(disclosure => {
      if (disclosure[0]) {
        if (isSubmitted(disclosure[0].status_cd) === true) {
          return handleTravelLogEntry(trx, disclosure[0].id, entry, RELATIONSHIP_STATUS.PENDING);
        }

        return handleTravelLogEntry(trx, disclosure[0].id, entry, RELATIONSHIP_STATUS.IN_PROGRESS);
      }

      return createAnnualDisclosure(trx, userInfo).then(disclosureId => {
        return createNewEntity(trx, disclosureId, entry, RELATIONSHIP_STATUS.IN_PROGRESS).then(entityId => {
          return createNewRelationship(trx, entityId, entry, RELATIONSHIP_STATUS.IN_PROGRESS);
        });
      });
    });
  });
}

function getRelationshipsEntity(trx, id) {
  return trx('relationship')
    .select('fin_entity_id')
    .where('id', id)
    .then(relationship => {
      return relationship[0].fin_entity_id;
    });
}

function deleteTravelRelationship(trx, id) {
  return trx('travel_relationship')
    .del()
    .where('relationship_id', id);
}

function deleteRelationship(trx, id) {
  return trx('relationship')
  .del()
  .where('id', id);
}

function getQuestionnaireAnswerIds(trx, id) {
  return trx('fin_entity_answer')
  .select('questionnaire_answer_id')
  .where('fin_entity_id', id)
  .then(answers => {
    return answers.map(answer => {
      return answer.questionnaire_answer_id;
    });
  });
}

function deleteFinEntityAnswers(trx, id) {
  return trx('fin_entity_answer')
  .del()
  .where('fin_entity_id', id);
}

function deleteQuestionnaireAnswers(trx, answerIds) {
  return trx('questionnaire_answer')
  .del()
  .whereIn('id', answerIds);
}

function deleteEntityAnswers(trx, id) {
  return getQuestionnaireAnswerIds(trx, id).then(answerIds => {
    return deleteFinEntityAnswers(trx, id).then(() => {
      return deleteQuestionnaireAnswers(trx, answerIds);
    });
  });
}

function getEntityFiles(trx, id) {
  return trx('file')
  .select('id', 'key')
  .where({
    ref_id: id,
    file_type: FILE_TYPE.FINANCIAL_ENTITY
  });
}

function deleteDbFiles(trx, id) {
  return trx('file')
  .del()
  .where({
    ref_id: id,
    file_type: FILE_TYPE.FINANCIAL_ENTITY
  });
}

function deleteFileData(dbInfo, files) {
  return Promise.all(
    files.map(file => {
      return new Promise((resolve, reject) => {
        FileService.deleteFile(dbInfo, file.key, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    })
  );
}

function deleteEntityFiles(trx, dbInfo, id) {
  return getEntityFiles(trx, id).then(files => {
    return deleteDbFiles(trx, id).then(() => {
      return deleteFileData(dbInfo, files);
    });
  });
}

function deleteEntity(trx, id) {
  return trx('fin_entity')
  .del()
  .where('id', id);
}

function deleteEntityIfAllRelationshipsAreDelete(dbInfo, trx, entityId) {
  return trx('relationship')
    .select('id')
    .where('fin_entity_id', entityId)
    .then(rows => {
      if (!rows.length) {
        return deleteEntityAnswers(trx, entityId).then(() => {
          return deleteEntityFiles(trx, dbInfo, entityId).then(() => {
            return deleteEntity(trx, entityId);
          });
        });
      }
    });
}

export function deleteTravelLogEntry(dbInfo, id, userInfo) {
  const knex = getKnex(dbInfo);
  return verifyRelationshipIsUsers(dbInfo, userInfo.schoolId, id)
    .then(isAllowed => {
      if (isAllowed) {
        return knex.transaction(trx => {
          return getRelationshipsEntity(trx, id).then(entityId => {
            return deleteTravelRelationship(trx, id).then(() => {
              return deleteRelationship(trx, id).then(() => {
                return deleteEntityIfAllRelationshipsAreDelete(dbInfo, trx, entityId);
              });
            });
          });
        });
      }

      throw new Error(`${userInfo.userName} is unauthorized to edit this record`);
    });
}

function createTravelRelationshipFromEntry(entry) {
  const travelRelationship = {};
  if (entry.amount) {
    travelRelationship.amount = entry.amount;
  }

  if (entry.startDate) {
    travelRelationship.start_date = new Date(entry.startDate);
  }

  if (entry.endDate) {
    travelRelationship.end_date = new Date(entry.endDate);
  }

  if (entry.reason) {
    travelRelationship.reason = entry.reason;
  }

  if (entry.destination) {
    travelRelationship.destination = entry.destination;
  }
  return travelRelationship;
}

function createRelationshipFromEntry(entry) {
  const relationship = {};
  if (entry.active !== undefined) {
    relationship.active = entry.active;
  }
  return relationship;
}

function updateTravelRelationship(trx, entry, id) {
  const travelRelationship = createTravelRelationshipFromEntry(entry);
  if (Object.keys(travelRelationship).length > 0) {
    return trx('travel_relationship')
    .update(travelRelationship)
    .where('relationship_id', id);
  }

  return undefined;
}

function updateRelationship(trx, entry, id) {
  const relationship = createRelationshipFromEntry(entry);
  if (Object.keys(relationship).length > 0) {
    return trx('relationship')
    .update(relationship)
    .where('id', id);
  }

  return undefined;
}

function handleOldEntity(trx, dbInfo, entityId) {
  return deleteEntityIfAllRelationshipsAreDelete(dbInfo, trx, entityId);
}

function getEntityNameFromId(trx, id) {
  return trx('fin_entity')
  .select('name')
  .where('id', id)
  .then(entity => {
    return entity[0].name;
  });
}

function getEntityIdFromName(trx, name, disclosureId) {
  return trx('fin_entity')
  .select('id')
  .where({
    name,
    disclosure_id: disclosureId
  })
  .then(entity => {
    if (entity[0]) {
      return entity[0].id;
    }

    return undefined;
  });
}

function getRelationship(trx, id) {
  return trx('relationship')
  .select('fin_entity_id')
  .where('id', id);
}

function updateRelationshipEntityId(trx, id, entityId) {
  return trx('relationship')
  .update({fin_entity_id: entityId})
  .where('id', id);
}

function updateEntity(trx, dbInfo, entry, id, schoolId) {
  return getRelationship(trx, id).then(relationship => {
    return getEntityNameFromId(trx, relationship[0].fin_entity_id).then(entityName => {
      if (entry.entityName === entityName || !entry.entityName) {
        return undefined;
      }

      return getAnnualDisclosureForUser(trx, schoolId).then(disclosure => {
        return getEntityIdFromName(trx, entry.entityName, disclosure[0].id).then(entityId => {
          if (entityId) {
            return updateRelationshipEntityId(trx, id, entityId).then(() => {
              return handleOldEntity(trx, dbInfo, relationship[0].fin_entity_id);
            });
          }

          return createNewEntity(trx, disclosure[0].id, entry, RELATIONSHIP_STATUS.IN_PROGRESS).then(newEntityId => {
            return updateRelationshipEntityId(trx, id, newEntityId).then(() => {
              return handleOldEntity(trx, dbInfo, relationship[0].fin_entity_id);
            });
          });
        });
      });
    });
  });
}

export function updateTravelLogEntry(dbInfo, entry, id, userInfo) {
  const knex = getKnex(dbInfo);
  return verifyRelationshipIsUsers(dbInfo, userInfo.schoolId, id)
  .then(isAllowed => {
    if (isAllowed) {
      return knex.transaction(trx => {
        return Promise.all([
          updateTravelRelationship(trx, entry, id),
          updateRelationship(trx, entry, id),
          updateEntity(trx, dbInfo, entry, id, userInfo.schoolId)
        ]).then(() => {
          return entry;
        });
      });
    }

    throw new Error(`${userInfo.userName} is unauthorized to edit this record`);
  });
}
