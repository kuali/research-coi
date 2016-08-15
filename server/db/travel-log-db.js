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
import {getLatestConfigsId} from './config-db';
import * as FileService from '../services/file-service/file-service';
import getKnex from './connection-manager';

export function getTravelLogEntries(
  dbInfo,
  userId,
  sortColumn,
  sortDirection,
  filter
) {
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
      query
        .andWhere('r.active', true)
        .andWhere('r.status', RELATIONSHIP_STATUS.DISCLOSED);
      break;
    case 'notYetDisclosed':
      query
        .whereIn(
          'r.status',
          [RELATIONSHIP_STATUS.IN_PROGRESS, RELATIONSHIP_STATUS.PENDING]
        )
        .andWhere('r.active', true);
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

async function createAnnualDisclosure(knex, userInfo) {
  const latestConfigId = await getLatestConfigsId(knex);

  return await knex('disclosure')
    .insert({
      type_cd: 2,
      status_cd: 1,
      start_date: new Date(),
      user_id: userInfo.schoolId,
      submitted_by: userInfo.name,
      config_id: latestConfigId
    }, 'id');
}

async function createNewEntity(knex, disclosureId, entry, status) {
  return await knex('fin_entity').insert({
    disclosure_id: disclosureId,
    name: entry.entityName,
    active: true,
    status
  }, 'id');
}

async function createNewRelationship(knex, entityId, entry, status) {
  const relationshipId = await knex('relationship').insert({
    fin_entity_id: entityId,
    relationship_cd: ENTITY_RELATIONSHIP.TRAVEL,
    person_cd: 1,
    status
  }, 'id');

  const travelRelationshipId = await knex('travel_relationship').insert({
    relationship_id: relationshipId[0],
    amount: entry.amount,
    destination: entry.destination,
    start_date: new Date(entry.startDate),
    end_date: new Date(entry.endDate),
    reason: entry.reason
  }, 'id');

  entry.id = travelRelationshipId[0];
  entry.relationshipId = relationshipId[0];
  return entry;
}

function isSubmitted(status) {
  if (EDITABLE_STATUSES.includes(status)) {
    return false;
  }

  return true;
}

function getExistingFinancialEntity(trx, entityName, disclosureId) {
  return trx('fin_entity')
    .first('id')
    .where({
      name: entityName,
      disclosure_id: disclosureId
    });
}

async function handleTravelLogEntry(trx, disclosureId, entry, status) {
  const entity = await getExistingFinancialEntity(
    trx,
    entry.entityName,
    disclosureId
  );

  if (entity) {
    return await createNewRelationship(trx, entity.id, entry, status);
  }

  const newEntityId = await createNewEntity(trx, disclosureId, entry, status);
  return await createNewRelationship(trx, newEntityId, entry, status);
}

function getAnnualDisclosureForUser(trx, schoolId) {
  return trx('disclosure')
    .first(
      'status_cd',
      'id'
    )
    .where({
      user_id: schoolId,
      type_cd: DISCLOSURE_TYPE.ANNUAL
    });
}

export async function createTravelLogEntry(dbInfo, entry, userInfo) {
  const knex = getKnex(dbInfo);
  const disclosure = await getAnnualDisclosureForUser(knex, userInfo.schoolId);
  if (disclosure) {
    if (isSubmitted(disclosure.status_cd) === true) {
      return await handleTravelLogEntry(
        knex,
        disclosure.id,
        entry,
        RELATIONSHIP_STATUS.PENDING
      );
    }

    return await handleTravelLogEntry(
      knex,
      disclosure.id,
      entry,
      RELATIONSHIP_STATUS.IN_PROGRESS
    );
  }

  const disclosureId = await createAnnualDisclosure(knex, userInfo);
  const entityId = await createNewEntity(
    knex,
    disclosureId,
    entry,
    RELATIONSHIP_STATUS.IN_PROGRESS
  );

  return await createNewRelationship(
    knex,
    entityId,
    entry,
    RELATIONSHIP_STATUS.IN_PROGRESS
  );
}

async function getRelationshipsEntity(trx, id) {
  const relationship = await trx('relationship')
    .first('fin_entity_id')
    .where('id', id);

  return relationship.fin_entity_id;
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

async function getQuestionnaireAnswerIds(trx, id) {
  const answers = await trx('fin_entity_answer')
    .select('questionnaire_answer_id')
    .where('fin_entity_id', id);

  return answers.map(answer => {
    return answer.questionnaire_answer_id;
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

async function deleteEntityAnswers(trx, id) {
  const answerIds = await getQuestionnaireAnswerIds(trx, id);
  await deleteFinEntityAnswers(trx, id);
  return await deleteQuestionnaireAnswers(trx, answerIds);
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

async function deleteEntityFiles(trx, dbInfo, id) {
  const files = await getEntityFiles(trx, id);
  await deleteDbFiles(trx, id);
  return await deleteFileData(dbInfo, files);
}

function deleteEntity(trx, id) {
  return trx('fin_entity')
    .del()
    .where('id', id);
}

async function deleteEntityIfAllRelationshipsAreDeleted(dbInfo, trx, entityId) {
  const row = await trx('relationship')
    .first('id')
    .where('fin_entity_id', entityId);

  if (!row) {
    await deleteEntityAnswers(trx, entityId);
    await deleteEntityFiles(trx, dbInfo, entityId);
    return await deleteEntity(trx, entityId);
  }
}

export async function deleteTravelLogEntry(dbInfo, id, userInfo) {
  const knex = getKnex(dbInfo);
  const isAllowed = await verifyRelationshipIsUsers(
    knex,
    userInfo.schoolId,
    id
  );

  if (isAllowed) {
    const entityId = await getRelationshipsEntity(knex, id);
    await deleteTravelRelationship(knex, id);
    await deleteRelationship(knex, id);
    return await deleteEntityIfAllRelationshipsAreDeleted(
      dbInfo,
      knex,
      entityId
    );
  }

  throw new Error(
    `${userInfo.userName} is unauthorized to edit this record`
  );
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
  return deleteEntityIfAllRelationshipsAreDeleted(dbInfo, trx, entityId);
}

async function getEntityNameFromId(trx, id) {
  const entity = await trx('fin_entity')
    .first('name')
    .where('id', id);
  return entity.name;
}

async function getEntityIdFromName(trx, name, disclosureId) {
  const entity = await trx('fin_entity')
    .first('id')
    .where({
      name,
      disclosure_id: disclosureId
    });

  if (entity) {
    return entity.id;
  }

  return undefined;
}

function getRelationship(trx, id) {
  return trx('relationship')
    .first('fin_entity_id')
    .where('id', id);
}

function updateRelationshipEntityId(trx, id, entityId) {
  return trx('relationship')
    .update({fin_entity_id: entityId})
    .where('id', id);
}

async function updateEntity(trx, dbInfo, entry, id, schoolId) {
  const relationship = await getRelationship(trx, id);

  const entityName = await getEntityNameFromId(
    trx,
    relationship.fin_entity_id
  );
  if (entry.entityName === entityName || !entry.entityName) {
    return undefined;
  }

  const disclosure = await getAnnualDisclosureForUser(trx, schoolId);
  const entityId = await getEntityIdFromName(
    trx,
    entry.entityName, disclosure.id
  );
  if (entityId) {
    await updateRelationshipEntityId(trx, id, entityId);
    return await handleOldEntity(
      trx,
      dbInfo,
      relationship.fin_entity_id
    );
  }

  const newEntityId = await createNewEntity(
    trx,
    disclosure.id,
    entry,
    RELATIONSHIP_STATUS.IN_PROGRESS
  );

  await updateRelationshipEntityId(trx, id, newEntityId);
  return await handleOldEntity(
    trx,
    dbInfo,
    relationship.fin_entity_id
  );
}

export async function updateTravelLogEntry(dbInfo, entry, id, userInfo) {
  const knex = getKnex(dbInfo);
  const isAllowed = await verifyRelationshipIsUsers(
    knex,
    userInfo.schoolId,
    id
  );

  if (isAllowed) {
    await Promise.all([
      updateTravelRelationship(knex, entry, id),
      updateRelationship(knex, entry, id),
      updateEntity(knex, dbInfo, entry, id, userInfo.schoolId)
    ]);

    return entry;
  }

  throw new Error(`${userInfo.userName} is unauthorized to edit this record`);
}
