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
import * as ProjectService from '../services/project-service/project-service';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./connection-manager').default;
}

export const getProjects = (dbInfo, userId, trx) => {
  let knex;
  if (trx) {
    knex = trx;
  } else {
    knex = getKnex(dbInfo);
  }

  return knex.select('p.id as id', 'p.title as name', 'p.type_cd as typeCd', 'person.role_cd as roleCd',
    'p.sponsor_cd as sponsorCd', 'p.sponsor_name as sponsorName', 'p.source_status as statusCd', 'person.new as new')
    .from('project as p')
    .innerJoin('project_person as person', 'p.id', 'person.project_id')
    .where({
      'person.person_id': userId,
      'person.active': 1
    }).debug();
};

async function updateDisclosureStatus(trx, person) {
  const disclosure = await trx('disclosure')
    .select('status_cd as statusCd', 'id')
    .where({
      user_id: person.personId,
      type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL
    });

  if (disclosure.length > 0 && disclosure[0].statusCd === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE) {
    await trx('disclosure')
      .update({status_cd: COIConstants.DISCLOSURE_STATUS.UPDATE_REQUIRED})
      .where({id: disclosure[0].id});
  }
}

async function revertDisclosureStatus(trx, person, req, projectId) {
  const projects = await getProjects(req.dbInfo, person.personId, trx);
  const otherProjects = projects.filter(project => project.id !== projectId);
  const otherRequiredProjects = await ProjectService
    .filterProjects(req.dbInfo, otherProjects , req.headers.authorization);

  if (otherRequiredProjects.length === 0) {
    const disclosure = await trx('disclosure')
      .select('status_cd as statusCd', 'id')
      .where({
        user_id: person.personId,
        type_cd: COIConstants.DISCLOSURE_TYPE.ANNUAL
      });

    if (disclosure.length > 0 && disclosure[0].statusCd === COIConstants.DISCLOSURE_STATUS.UPDATE_REQUIRED) {
      await trx('disclosure')
        .update({status_cd: COIConstants.DISCLOSURE_STATUS.UP_TO_DATE})
        .where({id: disclosure[0].id});
    }
  }
}

async function isProjectRequired(req, project, person) {
  const projectData = {
    typeCd: project.typeCode,
    roleCd: person.roleCode,
    statusCd: project.sourceStatus,
    sponsorCd: project.sponsorCode
  };

  return await ProjectService.isProjectRequired(req.dbInfo, projectData, req.headers.authorization);
}

async function disableAllPersonsForProject(trx, projectId, req) {
  const existingPersons = await trx('project_person')
    .select('person_id as personId')
    .where({project_id: projectId});

  await trx('project_person')
    .update('active', false)
    .where('project_id', projectId);

  const reverts = existingPersons.map(async person => {
    return await revertDisclosureStatus(trx, person, req, projectId);
  });

  await Promise.all(reverts);
}

async function updateProjectPerson(trx, person, projectId, isRequired, req) {
  await trx('project_person')
    .update({'active': true, 'role_cd': person.roleCode})
    .where({
      'person_id': person.personId,
      'source_person_type': person.sourcePersonType,
      'project_id': projectId
    });
  if (isRequired) {
    await updateDisclosureStatus(trx, person);
  } else {
    await revertDisclosureStatus(trx, person, req);
  }
}

async function insertProjectPerson(trx, person, projectId, isRequired) {
  const id = await trx('project_person')
    .insert({
      'active': true,
      'role_cd': person.roleCode,
      'person_id': person.personId,
      'source_person_type': person.sourcePersonType,
      'project_id': projectId
    }, 'id');

  if (isRequired) {
    await updateDisclosureStatus(trx, person);
  }
  return id[0];
}

async function deactivateProjectPerson(trx, person, projectId, req) {
  await trx('project_person')
    .update('active', false)
    .where({
      'person_id': person.personId,
      'source_person_type': person.source_person_type,
      'project_id': projectId
    });
  await revertDisclosureStatus(trx, person, req, projectId);
}

async function deactivateProjectPersons(trx, existingPersons, persons, projectId, req) {
  return existingPersons.filter(pr => {
    return persons.find(person => {
      return person.personId === pr.personId && person.sourcePersonType === pr.source_person_type;
    }) === undefined;
  }).map(async result => {
    await deactivateProjectPerson(trx, result, projectId, req);
  });
}

async function saveProjectPersons(trx, project, projectId, req) {
  const existingPersons = await trx('project_person')
    .select('person_id as personId', 'source_person_type')
    .where('project_id', projectId);
  if (project.persons && project.persons.length > 0) {
    let queries = project.persons.map(async person => {
      const isRequired = await isProjectRequired(req, project, person);
      if (existingPersons.find(pr => {
        return pr.personId === person.personId && pr.source_person_type === person.sourcePersonType;
      })) {
        return await updateProjectPerson(trx, person, projectId, isRequired, req);
      }
      return await insertProjectPerson(trx, person, projectId, isRequired);
    });

    const deactiveQueries = await deactivateProjectPersons(trx, existingPersons, project.persons, projectId, req);
    if (deactiveQueries && deactiveQueries.length > 0) {
      queries = queries.concat(deactiveQueries);
    }

    await Promise.all(queries);
    return;
  }

  if (existingPersons.length > 0) {
    await disableAllPersonsForProject(trx, projectId, req);
  }
}

async function insertProject(trx, project) {
  const id = await trx('project').insert({
    title: project.title,
    type_cd: project.typeCode,
    source_system: project.sourceSystem,
    source_identifier: project.sourceIdentifier,
    source_status: project.sourceStatus,
    sponsor_cd: project.sponsorCode,
    sponsor_name: project.sponsorName,
    start_date: project.startDate,
    end_date: project.endDate
  }, 'id');

  return id[0];
}

async function saveNewProjects(trx, project, req) {
  project.id = await insertProject(trx, project);

  if (project.persons) {
    const inserts = project.persons.map( async person => {
      const isRequired = await isProjectRequired(req, project, person);
      const id = await insertProjectPerson(trx, person, project.id, isRequired);
      person.id = id;
    });
    await Promise.all(inserts);
  }
  return project;
}


async function saveExistingProjects(trx, project, projectId, authHeader) {
  await trx('project').update({
    title: project.title,
    type_cd: project.typeCode,
    source_status: project.sourceStatus,
    sponsor_cd: project.sponsorCode,
    sponsor_name: project.sponsorName,
    start_date: project.startDate,
    end_date: project.endDate
  }).where('id', projectId);

  await saveProjectPersons(trx, project, projectId, authHeader);
}

async function getExistingProjectId(trx, project) {
  const existingProject = await trx.select('id')
    .from('project')
    .where({
      source_system: project.sourceSystem,
      source_identifier: project.sourceIdentifier
    });
  if (existingProject && existingProject.length > 0) {
    return existingProject[0].id;
  }
}

export async function saveProjects(req, project) {
  const knex = getKnex(req.dbInfo);

  return knex.transaction(async function(trx) {
    const existingProjectId = await getExistingProjectId(trx, project);
    if (existingProjectId) {
      return await saveExistingProjects(trx, project, existingProjectId, req);
    }
    return await saveNewProjects(trx, project, req);
  });
}

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