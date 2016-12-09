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
import CommonDB from './common-db';
import ConfigDB from './config-db';
import * as FileService from '../services/file-service/file-service';
import {addLoggers} from '../log';

const TravelLogDB = {};
export default TravelLogDB;

TravelLogDB.getTravelLogEntries = function(
    knex,
    userId,
    sortColumn,
    sortDirection,
    filter
  ) {
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
};

TravelLogDB.createAnnualDisclosure = async function(knex, userInfo) {
  const latestConfigId = await ConfigDB.getLatestConfigsId(knex);

  const id = await knex('disclosure')
    .insert({
      type_cd: 2,
      status_cd: 1,
      start_date: new Date(),
      user_id: userInfo.schoolId,
      submitted_by: userInfo.displayName,
      config_id: latestConfigId
    }, 'id');

  return parseInt(id[0]);
};

TravelLogDB.createNewEntity = async function(
    knex,
    disclosureId,
    entry,
    status
  ) {
  const id = await knex('fin_entity').insert({
    disclosure_id: disclosureId,
    name: entry.entityName,
    active: true,
    status
  }, 'id');

  return parseInt(id[0]);
};

TravelLogDB.createNewRelationship = async function(
    knex,
    entityId,
    entry,
    status
  ) {
  const relationshipId = await knex('relationship').insert({
    fin_entity_id: entityId,
    relationship_cd: ENTITY_RELATIONSHIP.TRAVEL,
    person_cd: 1,
    status
  }, 'id');

  const travelRelationshipId = await knex('travel_relationship').insert({
    relationship_id: parseInt(relationshipId[0]),
    amount: entry.amount,
    destination: entry.destination,
    start_date: new Date(entry.startDate),
    end_date: new Date(entry.endDate),
    reason: entry.reason
  }, 'id');

  entry.id = parseInt(travelRelationshipId[0]);
  entry.relationshipId = parseInt(relationshipId[0]);
  return entry;
};

TravelLogDB.isSubmitted = function(status) {
  if (EDITABLE_STATUSES.includes(status)) {
    return false;
  }

  return true;
};

TravelLogDB.getExistingFinancialEntity = function(
    knex,
    entityName,
    disclosureId
  ) {
  return knex('fin_entity')
    .first('id')
    .where({
      name: entityName,
      disclosure_id: disclosureId
    });
};

TravelLogDB.handleTravelLogEntry = async function(
    knex,
    disclosureId,
    entry,
    status
  ) {
  const entity = await TravelLogDB.getExistingFinancialEntity(
    knex,
    entry.entityName,
    disclosureId
  );

  if (entity) {
    return await TravelLogDB.createNewRelationship(
      knex,
      entity.id,
      entry,
      status
    );
  }

  const newEntityId = await TravelLogDB.createNewEntity(
    knex,
    disclosureId,
    entry,
    status
  );
  return await TravelLogDB.createNewRelationship(
    knex,
    newEntityId,
    entry,
    status
  );
};

TravelLogDB.getAnnualDisclosureForUser = function(knex, schoolId) {
  return knex('disclosure')
    .first(
      'status_cd',
      'id'
    )
    .where({
      user_id: schoolId,
      type_cd: DISCLOSURE_TYPE.ANNUAL
    });
};

TravelLogDB.createTravelLogEntry = async function(knex, entry, userInfo) {
  const disclosure = await TravelLogDB.getAnnualDisclosureForUser(
    knex,
    userInfo.schoolId
  );
  if (disclosure) {
    if (TravelLogDB.isSubmitted(disclosure.status_cd) === true) {
      return await TravelLogDB.handleTravelLogEntry(
        knex,
        disclosure.id,
        entry,
        RELATIONSHIP_STATUS.PENDING
      );
    }

    return await TravelLogDB.handleTravelLogEntry(
      knex,
      disclosure.id,
      entry,
      RELATIONSHIP_STATUS.IN_PROGRESS
    );
  }

  const disclosureId = await TravelLogDB.createAnnualDisclosure(knex, userInfo);
  const entityId = await TravelLogDB.createNewEntity(
    knex,
    disclosureId,
    entry,
    RELATIONSHIP_STATUS.IN_PROGRESS
  );

  return await TravelLogDB.createNewRelationship(
    knex,
    entityId,
    entry,
    RELATIONSHIP_STATUS.IN_PROGRESS
  );
};

TravelLogDB.getRelationshipsEntity = async function(knex, id) {
  const relationship = await knex('relationship')
    .first('fin_entity_id')
    .where('id', id);

  return relationship.fin_entity_id;
};

TravelLogDB.deleteTravelRelationship = function(knex, id) {
  return knex('travel_relationship')
    .del()
    .where('relationship_id', id);
};

TravelLogDB.deleteRelationship = function(knex, id) {
  return knex('relationship')
    .del()
    .where('id', id);
};

TravelLogDB.getQuestionnaireAnswerIds = async function(knex, id) {
  const answers = await knex('fin_entity_answer')
    .select('questionnaire_answer_id')
    .where('fin_entity_id', id);

  return answers.map(answer => {
    return answer.questionnaire_answer_id;
  });
};

TravelLogDB.deleteFinEntityAnswers = function(knex, id) {
  return knex('fin_entity_answer')
    .del()
    .where('fin_entity_id', id);
};

TravelLogDB.deleteQuestionnaireAnswers = function(knex, answerIds) {
  return knex('questionnaire_answer')
    .del()
    .whereIn('id', answerIds);
};

TravelLogDB.deleteEntityAnswers = async function(knex, id) {
  const answerIds = await TravelLogDB.getQuestionnaireAnswerIds(knex, id);
  await TravelLogDB.deleteFinEntityAnswers(knex, id);
  return await TravelLogDB.deleteQuestionnaireAnswers(knex, answerIds);
};

TravelLogDB.getEntityFiles = function(knex, id) {
  return knex('file')
    .select('id', 'key')
    .where({
      ref_id: id,
      file_type: FILE_TYPE.FINANCIAL_ENTITY
    });
};

TravelLogDB.deleteDbFiles = function(knex, id) {
  return knex('file')
    .del()
    .where({
      ref_id: id,
      file_type: FILE_TYPE.FINANCIAL_ENTITY
    });
};

TravelLogDB.deleteFileData = function(dbInfo, files) {
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
};

TravelLogDB.deleteEntityFiles = async function(knex, dbInfo, id) {
  const files = await TravelLogDB.getEntityFiles(knex, id);
  await TravelLogDB.deleteDbFiles(knex, id);
  return await TravelLogDB.deleteFileData(dbInfo, files);
};

TravelLogDB.deleteEntity = function(knex, id) {
  return knex('fin_entity')
    .del()
    .where('id', id);
};

TravelLogDB.deleteEntityIfAllRelationshipsAreDeleted = async function(
    dbInfo,
    knex,
    entityId
  ) {
  const row = await knex('relationship')
    .first('id')
    .where('fin_entity_id', entityId);

  if (!row) {
    await TravelLogDB.deleteEntityAnswers(knex, entityId);
    await TravelLogDB.deleteEntityFiles(knex, dbInfo, entityId);
    return await TravelLogDB.deleteEntity(knex, entityId);
  }
};

TravelLogDB.deleteTravelLogEntry = async function(dbInfo, knex, id, userInfo) {
  const isAllowed = await CommonDB.verifyRelationshipIsUsers(
    knex,
    userInfo.schoolId,
    id
  );

  if (isAllowed) {
    const entityId = await TravelLogDB.getRelationshipsEntity(knex, id);
    await TravelLogDB.deleteTravelRelationship(knex, id);
    await TravelLogDB.deleteRelationship(knex, id);
    return await TravelLogDB.deleteEntityIfAllRelationshipsAreDeleted(
      dbInfo,
      knex,
      entityId
    );
  }

  throw new Error(
    `${userInfo.userName} is unauthorized to edit this record`
  );
};

TravelLogDB.createTravelRelationshipFromEntry = function(entry) {
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
};

TravelLogDB.createRelationshipFromEntry = function(entry) {
  const relationship = {};
  if (entry.active !== undefined) {
    relationship.active = entry.active;
  }
  return relationship;
};

TravelLogDB.updateTravelRelationship = function(knex, entry, id) {
  const travelRelationship = TravelLogDB.createTravelRelationshipFromEntry(
    entry
  );
  if (Object.keys(travelRelationship).length > 0) {
    return knex('travel_relationship')
      .update(travelRelationship)
      .where('relationship_id', id);
  }

  return undefined;
};

TravelLogDB.updateRelationship = function(knex, entry, id) {
  const relationship = TravelLogDB.createRelationshipFromEntry(entry);
  if (Object.keys(relationship).length > 0) {
    return knex('relationship')
      .update(relationship)
      .where('id', id);
  }

  return undefined;
};

TravelLogDB.handleOldEntity = function(knex, dbInfo, entityId) {
  return TravelLogDB.deleteEntityIfAllRelationshipsAreDeleted(
    dbInfo,
    knex,
    entityId
  );
};

TravelLogDB.getEntityNameFromId = async function(knex, id) {
  const entity = await knex('fin_entity')
    .first('name')
    .where('id', id);
  return entity.name;
};

TravelLogDB.getEntityIdFromName = async function(knex, name, disclosureId) {
  const entity = await knex('fin_entity')
    .first('id')
    .where({
      name,
      disclosure_id: disclosureId
    });

  if (entity) {
    return entity.id;
  }

  return undefined;
};

TravelLogDB.getRelationship = function(knex, id) {
  return knex('relationship')
    .first('fin_entity_id')
    .where('id', id);
};

TravelLogDB.updateRelationshipEntityId = function(knex, id, entityId) {
  return knex('relationship')
    .update({fin_entity_id: entityId})
    .where('id', id);
};

TravelLogDB.updateEntity = async function(knex, dbInfo, entry, id, schoolId) {
  const relationship = await TravelLogDB.getRelationship(knex, id);

  const entityName = await TravelLogDB.getEntityNameFromId(
    knex,
    relationship.fin_entity_id
  );
  if (entry.entityName === entityName || !entry.entityName) {
    return undefined;
  }

  const disclosure = await TravelLogDB.getAnnualDisclosureForUser(
    knex,
    schoolId
  );
  const entityId = await TravelLogDB.getEntityIdFromName(
    knex,
    entry.entityName, disclosure.id
  );
  if (entityId) {
    await TravelLogDB.updateRelationshipEntityId(knex, id, entityId);
    return await TravelLogDB.handleOldEntity(
      knex,
      dbInfo,
      relationship.fin_entity_id
    );
  }

  const newEntityId = await TravelLogDB.createNewEntity(
    knex,
    disclosure.id,
    entry,
    RELATIONSHIP_STATUS.IN_PROGRESS
  );

  await TravelLogDB.updateRelationshipEntityId(knex, id, newEntityId);
  return await TravelLogDB.handleOldEntity(
    knex,
    dbInfo,
    relationship.fin_entity_id
  );
};

TravelLogDB.updateTravelLogEntry = async function(
    dbInfo,
    knex,
    entry,
    id,
    userInfo
  ) {
  const isAllowed = await CommonDB.verifyRelationshipIsUsers(
    knex,
    userInfo.schoolId,
    id
  );

  if (isAllowed) {
    await Promise.all([
      TravelLogDB.updateTravelRelationship(knex, entry, id),
      TravelLogDB.updateRelationship(knex, entry, id),
      TravelLogDB.updateEntity(knex, dbInfo, entry, id, userInfo.schoolId)
    ]);

    return entry;
  }

  throw new Error(`${userInfo.userName} is unauthorized to edit this record`);
};

addLoggers({TravelLogDB});
