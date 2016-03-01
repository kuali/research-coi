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

/* eslint-disable camelcase */

import {COIConstants} from '../../coi-constants';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./connection-manager').default;
}

export const getProjects = (dbInfo, userId) => {
  const knex = getKnex(dbInfo);
  return knex.select('p.id as id', 'p.title as name', 'p.type_cd as typeCd', 'person.role_cd as roleCd',
    'p.sponsor_cd as sponsorCd', 'p.sponsor_name as sponsorName', 'p.source_status as statusCd', 'person.new as new')
    .from('project as p')
    .innerJoin('project_person as person', 'p.id', 'person.project_id')
    .where({
      'person.person_id': userId,
      'person.active': 1
    });
};

const saveNewProjects = (dbInfo, projects) => {
  const knex = getKnex(dbInfo);
  return knex('project').insert({
    title: projects.title,
    type_cd: projects.typeCode,
    source_system: projects.sourceSystem,
    source_identifier: projects.sourceIdentifier,
    source_status: projects.sourceStatus,
    sponsor_cd: projects.sponsorCode,
    sponsor_name: projects.sponsorName,
    start_date: projects.startDate,
    end_date: projects.endDate
  }, 'id')
    .then(insertResult => {
      if (projects.persons) {
        const projectId = insertResult[0];
        const inserts = projects.persons.map(person => {
          return knex('project_person').insert({
            project_id: projectId,
            person_id: person.personId,
            source_person_type: person.sourcePersonType,
            role_cd: person.roleCode,
            new: true,
            active: true
          }, 'id');
        });
        return Promise.all(inserts);
      }
    });
};

const disableAllPersonsForProject = (dbInfo, projectId) => {
  const knex = getKnex(dbInfo);
  return knex('project_person').update('active', false).where('project_id', projectId);
};

const saveProjectPersons = (dbInfo, persons, projectId) => {
  const knex = getKnex(dbInfo);
  return knex.select('person_id', 'source_person_type').from('project_person').where('project_id', projectId)
    .then(personIdResult => {
      if (persons && persons.length > 0) {
        let queries = persons.map(person => {
          if (personIdResult.find(pr => {
            return pr.person_id === person.personId && pr.source_person_type === person.sourcePersonType;
          })) {
            return knex('project_person')
              .update({'active': true, 'role_cd': person.roleCode})
              .where({
                'person_id': person.personId,
                'source_person_type': person.sourcePersonType,
                'project_id': projectId
              });
          }

          return knex('project_person')
            .insert({
              'active': true,
              'role_cd': person.roleCode,
              'person_id': person.personId,
              'source_person_type': person.sourcePersonType,
              'project_id': projectId
            }, 'id');
        });

        const deactiveQueries = personIdResult.filter(pr => {
          return persons.find(person => {
            return person.personId === pr.person_id && person.sourcePersonType === pr.source_person_type;
          }) === undefined;
        }).map(result => {
          return knex('project_person')
            .update('active', false)
            .where({
              'person_id': result.person_id,
              'source_person_type': result.source_person_type,
              'project_id': projectId
            });
        });

        if (deactiveQueries.length > 0) {
          queries = queries.concat(deactiveQueries);
        }

        return Promise.all(queries);
      }
      
      if (personIdResult.length > 0) {
        return disableAllPersonsForProject(dbInfo, projectId);
      }
    });
};

const saveExistingProjects = (dbInfo, projects, projectId) => {
  const knex = getKnex(dbInfo);
  return knex('project').update({
    title: projects.title,
    type_cd: projects.typeCode,
    source_status: projects.sourceStatus,
    sponsor_cd: projects.sponsorCode,
    sponsor_name: projects.sponsorName,
    start_date: projects.startDate,
    end_date: projects.endDate
  }).where('id', projects.id)
    .then(() => {
      return saveProjectPersons(dbInfo, projects.persons, projectId);
    });
};

export const saveProjects = (dbInfo, projects) => {
  const knex = getKnex(dbInfo);
  return knex.select('id').from('project').where({
    source_system: projects.sourceSystem,
    source_identifier: projects.sourceIdentifier
  }).then(projectIdResult => {
    if (projectIdResult.length > 0) {
      const projectId = projectIdResult[0].id;
      return saveExistingProjects(dbInfo, projects, projectId);
    }

    return saveNewProjects(dbInfo, projects);
  });
};

function getStatus(trx, projectPerson) {
  const result = {
    userId: projectPerson.person_id,
    status: COIConstants.NOT_YET_DISCLOSED
  };
  return trx('declaration')
    .select('disclosure_id')
    .where({
      project_id: projectPerson.projectId,
      disclosure_id: projectPerson.disclosureId
    })
    .then(declaration => {
      if (declaration.length > 0) {
        return trx('disclosure as d')
          .select('ds.description as status')
          .innerJoin('disclosure_status as ds', 'ds.status_cd', 'd.status_cd')
          .where({id: declaration[0].disclosure_id})
          .then(disclosure => {
            result.status = disclosure[0].status;
            return result;
          });
      }
      return result;
    });
}

async function getProjectPersons(trx, sourceSystem, sourceIdentifier, personId) {
  const criteria = {
    'p.source_system': sourceSystem,
    'p.source_identifier': sourceIdentifier
  };

  if (personId) {
    criteria['pp.person_id'] = personId;
  }

  const projectPersons = await trx('project as p')
    .distinct('pp.person_id')
    .select('p.id as projectId', 'd.id as disclosureId')
    .innerJoin('project_person as pp', 'p.id', 'pp.project_id')
    .innerJoin('disclosure as d', 'd.user_id', 'pp.person_id')
    .where(criteria);

  return projectPersons;
}

export async function getProjectStatuses(dbInfo, sourceSystem, sourceIdentifier) {
  const knex = getKnex(dbInfo);
  return knex.transaction(async function(trx) {
    const projectPersons = await getProjectPersons(trx, sourceSystem, sourceIdentifier);
    const queries = projectPersons.map(projectPerson => {
      return getStatus(trx, projectPerson);
    });

    return Promise.all(queries);
  });
}

export async function getProjectStatus(dbInfo, sourceSystem, sourceIdentifier, personId) {
  const knex = getKnex(dbInfo);
  return knex.transaction(async function(trx) {
    const projectPersons = await getProjectPersons(trx, sourceSystem, sourceIdentifier, personId);

    if (projectPersons[0]) {
      return getStatus(trx, projectPersons[0]);
    }

    return {};
  });
}