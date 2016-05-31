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

import {
  DISCLOSURE_STATUS,
  DISCLOSURE_TYPE,
  NO_DISPOSITION_DESCRIPTION,
  PROJECT_DISCLOSURE_STATUSES
} from '../../coi-constants';
import * as ProjectService from '../services/project-service/project-service';
import { getGeneralConfig } from '../db/config-db';
import Log from '../log';
import { createAndSendNewProjectNotification } from '../services/notification-service/notification-service';
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

  return knex.select('p.id as id', 'p.source_identifier as sourceIdentifier', 'p.title as name', 'p.type_cd as typeCd', 'person.role_cd as roleCd',
    'p.sponsor_cd as sponsorCd', 'p.sponsor_name as sponsorName', 'p.source_status as statusCd', 'person.new as new')
    .from('project as p')
    .innerJoin('project_person as person', 'p.id', 'person.project_id')
    .where({
      'person.person_id': userId,
      'person.active': 1
    });
};

async function shouldUpdateStatus(trx, disclosureId) {
  const generalConfig = await getGeneralConfig(trx);

  const shouldUpdate = !generalConfig.config.disableNewProjectStatusUpdateWhenNoEntities;

  if (shouldUpdate) {
    return true;
  }

  const entities = await trx('fin_entity').select('id').where({disclosure_id: disclosureId});

  if (entities && entities.length > 0) {
    return true;
  }
  return false;
}

async function updateDisclosureStatus(trx, person, project, req) {
  const disclosure = await trx('disclosure')
    .select('status_cd as statusCd', 'id')
    .where({
      user_id: person.personId,
      type_cd: DISCLOSURE_TYPE.ANNUAL
    });

  if (disclosure.length > 0 && await shouldUpdateStatus(trx, disclosure[0].id) && disclosure[0].statusCd === DISCLOSURE_STATUS.UP_TO_DATE) {
    await trx('disclosure')
      .update({status_cd: DISCLOSURE_STATUS.UPDATE_REQUIRED})
      .where({id: disclosure[0].id});

    try {
      createAndSendNewProjectNotification(req.dbInfo, req.hostname, req.userInfo, disclosure[0].id, project, person);
    } catch(err) {
      Log.error(err);
    }
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
        type_cd: DISCLOSURE_TYPE.ANNUAL
      });

    if (disclosure.length > 0 && disclosure[0].statusCd === DISCLOSURE_STATUS.UPDATE_REQUIRED) {
      await trx('disclosure')
        .update({status_cd: DISCLOSURE_STATUS.UP_TO_DATE})
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

async function updateProjectPerson(trx, person, project, isRequired, isNew, req) {
  await trx('project_person')
    .update({'active': true, 'role_cd': person.roleCode})
    .where({
      'person_id': person.personId,
      'source_person_type': person.sourcePersonType,
      'project_id': project.id
    });

  if (isNew === 1) {
    if (isRequired) {
      await updateDisclosureStatus(trx, person, project, req);
    } else {
      await revertDisclosureStatus(trx, person, req);
    }
  }
}

async function insertProjectPerson(trx, person, project, isRequired, req) {
  const id = await trx('project_person')
    .insert({
      'active': true,
      'role_cd': person.roleCode,
      'person_id': person.personId,
      'source_person_type': person.sourcePersonType,
      'project_id': project.id
    }, 'id');

  if (isRequired) {
    await updateDisclosureStatus(trx, person, project, req);
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

async function saveProjectPersons(trx, project, req) {
  const existingPersons = await trx('project_person')
    .select('person_id as personId', 'source_person_type', 'new')
    .where('project_id', project.id);
  if (project.persons && project.persons.length > 0) {
    let queries = project.persons.map(async person => {
      const isRequired = await isProjectRequired(req, project, person);
      const existingPerson = existingPersons.find(pr => {
        return pr.personId === person.personId && pr.source_person_type === person.sourcePersonType;
      });

      if (existingPerson) {
        return await updateProjectPerson(trx, person, project, isRequired, existingPerson.new, req);
      }
      return await insertProjectPerson(trx, person, project, isRequired, req);
    });

    const deactiveQueries = await deactivateProjectPersons(trx, existingPersons, project.persons, project.id, req);
    if (deactiveQueries && deactiveQueries.length > 0) {
      queries = queries.concat(deactiveQueries);
    }

    await Promise.all(queries);
    return;
  }

  if (existingPersons.length > 0) {
    await disableAllPersonsForProject(trx, project.id, req);
  }
}

async function insertProject(trx, project) {
  if (!project.title) {
    throw Error('title is a required field');
  }
  const id = await trx('project').insert({
    title: project.title,
    type_cd: project.typeCode,
    source_system: project.sourceSystem,
    source_identifier: project.sourceIdentifier,
    source_status: project.sourceStatus,
    sponsor_cd: project.sponsorCode,
    sponsor_name: project.sponsorName,
    start_date: new Date(project.startDate),
    end_date: new Date(project.endDate)
  }, 'id');

  return id[0];
}

async function saveNewProjects(trx, project, req) {
  project.id = await insertProject(trx, project);

  if (project.persons) {
    const inserts = project.persons.map( async person => {
      const isRequired = await isProjectRequired(req, project, person);
      const id = await insertProjectPerson(trx, person, project, isRequired, req);
      person.id = id;
    });
    await Promise.all(inserts);
  }
  return project;
}


async function saveExistingProjects(trx, project, authHeader) {
  if (!project.title) {
    throw Error('title is a required field');
  }
  await trx('project').update({
    title: project.title,
    type_cd: project.typeCode,
    source_status: project.sourceStatus,
    sponsor_cd: project.sponsorCode,
    sponsor_name: project.sponsorName,
    start_date: new Date(project.startDate),
    end_date: new Date(project.endDate)
  }).where('id', project.id);

  await saveProjectPersons(trx, project, authHeader);
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
      project.id = existingProjectId;
      return await saveExistingProjects(trx, project, req);
    }
    return await saveNewProjects(trx, project, req);
  });
}

async function getStatus(trx, projectPerson, dbInfo, authHeader) {
  const disclosureStatus = {
    userId: projectPerson.person_id,
    disposition: projectPerson.disposition ? projectPerson.disposition : NO_DISPOSITION_DESCRIPTION
  };

  const isRequired = await ProjectService.isProjectRequired(dbInfo, projectPerson, authHeader);

  if (!isRequired) {
    disclosureStatus.status = PROJECT_DISCLOSURE_STATUSES.DISCLOSURE_NOT_REQUIRED;
    return disclosureStatus;
  }

  const disclosure = await trx('disclosure as d')
    .select('ds.description as status', 'd.id')
    .innerJoin('disclosure_status as ds', 'ds.status_cd', 'd.status_cd')
    .where({user_id: projectPerson.person_id});

  const declaration = await trx('declaration')
    .select('disclosure_id')
    .where({
      project_id: projectPerson.projectId,
      disclosure_id: projectPerson.disclosureId
    });

  if (disclosure[0]) {
    const entities = await trx('fin_entity')
      .select('id')
      .where({disclosure_id: disclosure[0].id});

    if(declaration[0] || entities.length === 0) {
      disclosureStatus.status = disclosure[0].status;
    } else {
      disclosureStatus.status = PROJECT_DISCLOSURE_STATUSES.UPDATE_NEEDED;
    }
  } else {
    disclosureStatus.status = PROJECT_DISCLOSURE_STATUSES.NOT_YET_DISCLOSED;
  }
  return disclosureStatus;
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
    .select('p.id as projectId', 'd.id as disclosureId', 'p.sponsor_cd as sponsorCd', 'p.source_status as statusCd',
      'p.type_cd as typeCd','pp.role_cd as roleCd', 'dt.description as disposition')
    .innerJoin('project_person as pp', 'p.id', 'pp.project_id')
    .leftJoin('disclosure as d', 'd.user_id', 'pp.person_id')
    .leftJoin('disposition_type as dt', 'dt.type_cd', 'pp.disposition_type_cd')
    .where(criteria);

  return projectPersons;
}

export async function getProjectStatuses(dbInfo, sourceSystem, sourceIdentifier, authHeader) {
  try {
    const knex = getKnex(dbInfo);
    return knex.transaction(async function(trx) {
      const projectPersons = await getProjectPersons(trx, sourceSystem, sourceIdentifier);
      const queries = projectPersons.map(async projectPerson => {
        return await getStatus(trx, projectPerson, dbInfo, authHeader);
      });

      return Promise.all(queries);
    });
  } catch(err) {
    return Promise.reject(err);
  }
}

export async function getProjectStatus(dbInfo, sourceSystem, sourceIdentifier, personId, authHeader) {
  try {
    const knex = getKnex(dbInfo);
    return knex.transaction(async function(trx) {
      const projectPersons = await getProjectPersons(trx, sourceSystem, sourceIdentifier, personId);

      if (projectPersons[0]) {
        return await getStatus(trx, projectPersons[0], dbInfo, authHeader);
      }

      return {};
    });
  } catch(err) {
    return Promise.reject(err);
  }
}

export async function updateProjectPersonDispositionType(dbInfo, projectPerson, id) {
  try {
    const knex = getKnex(dbInfo);
    return knex('project_person').update({
      disposition_type_cd: projectPerson.dispositionTypeCd ? projectPerson.dispositionTypeCd : null
    }).where({id});
  } catch(err) {
    return Promise.reject(err);
  }
}
