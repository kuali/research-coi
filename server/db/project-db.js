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

import {isNumber, uniq} from 'lodash';
import {
  DISCLOSURE_STATUS,
  DISCLOSURE_TYPE,
  NO_DISPOSITION_DESCRIPTION,
  PROJECT_DISCLOSURE_STATUSES
} from '../../coi-constants';
import * as ProjectService from '../services/project-service/project-service';
import { getGeneralConfig } from '../db/config-db';
import Log from '../log';
import {
  createAndSendNewProjectNotification
} from '../services/notification-service/notification-service';
import getKnex from './connection-manager';

export async function getProjects (dbInfo, userId, trx) {
  let knex;
  if (trx) {
    knex = trx;
  } else {
    knex = getKnex(dbInfo);
  }

  const projects = await knex
    .select(
      'p.id as id',
      'p.source_identifier as sourceIdentifier',
      'p.title as name',
      'p.type_cd as typeCd',
      'person.role_cd as roleCd',
      'p.source_status as statusCd',
      'person.new as new'
    )
    .from('project as p')
    .innerJoin('project_person as person', 'p.id', 'person.project_id')
    .where({
      'person.person_id': userId,
      'person.active': 1
    });

  let projectIds = projects.map(project => project.id);
  projectIds = uniq(projectIds);

  const sponsors = await knex
    .select(
      'project_id as projectId',
      'sponsor_cd as sponsorCode',
      'sponsor_name as sponsorName'
    )
    .from('project_sponsor')
    .whereIn('project_id', projectIds);

  sponsors.forEach(sponsor => {
    const project = projects.find(prj => prj.id === sponsor.projectId);
    if (project) {
      if (!project.sponsors) {
        project.sponsors = [];
      }
      project.sponsors.push(sponsor);
    }
  });

  return Promise.resolve(projects);
}

async function shouldUpdateStatus(trx, disclosureId) {
  const generalConfig = await getGeneralConfig(trx);

  const shouldUpdate = (
    !generalConfig.config.disableNewProjectStatusUpdateWhenNoEntities
  );

  if (shouldUpdate) {
    return true;
  }

  const entity = await trx('fin_entity')
    .first('id')
    .where({
      disclosure_id: disclosureId,
      active: true
    });

  return entity !== undefined;
}

async function updateDisclosureStatus(trx, person, project, req) {
  const disclosure = await trx('disclosure')
    .first('status_cd as statusCd', 'id')
    .where({
      user_id: person.personId,
      type_cd: DISCLOSURE_TYPE.ANNUAL
    });

  if (
    disclosure &&
    await shouldUpdateStatus(trx, disclosure.id) &&
    disclosure.statusCd === DISCLOSURE_STATUS.UP_TO_DATE
  ) {
    await trx('disclosure')
      .update({status_cd: DISCLOSURE_STATUS.UPDATE_REQUIRED})
      .where({id: disclosure.id});

    try {
      createAndSendNewProjectNotification(
        req.dbInfo,
        req.hostname,
        req.userInfo,
        disclosure.id,
        project,
        person
      );
    } catch (err) {
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
      .first('status_cd as statusCd', 'id')
      .where({
        user_id: person.personId,
        type_cd: DISCLOSURE_TYPE.ANNUAL
      });

    if (
      disclosure &&
      disclosure.statusCd === DISCLOSURE_STATUS.UPDATE_REQUIRED
    ) {
      await trx('disclosure')
        .update({status_cd: DISCLOSURE_STATUS.UP_TO_DATE})
        .where({id: disclosure.id});
    }
  }
}

async function isProjectRequired(req, project, person) {
  const projectData = {
    typeCd: project.typeCode,
    roleCd: person.roleCode,
    statusCd: project.sourceStatus,
    sponsors: project.sponsors
  };

  return await ProjectService.isProjectRequired(
    req.dbInfo,
    projectData,
    req.headers.authorization
  );
}

async function disableAllPersonsForProject(trx, projectId, req) {
  const existingPersons = await trx('project_person')
    .select('person_id as personId')
    .where({project_id: projectId});

  await trx('project_person')
    .update('active', false)
    .where('project_id', projectId);

  if (Array.isArray(existingPersons)) {
    for (let i = 0; i < existingPersons.length; i++) {
      const person = existingPersons[i];
      await revertDisclosureStatus(trx, person, req, projectId);
    }
  }
}

async function updateProjectPerson(
  trx,
  person,
  project,
  isRequired,
  isNew,
  req
) {
  await trx('project_person')
    .update({
      active: true,
      role_cd: person.roleCode
    })
    .where({
      person_id: person.personId,
      source_person_type: person.sourcePersonType,
      project_id: project.id
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
      active: true,
      role_cd: person.roleCode,
      person_id: person.personId,
      source_person_type: person.sourcePersonType,
      project_id: project.id
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
      person_id: person.personId,
      source_person_type: person.source_person_type,
      project_id: projectId
    });
  await revertDisclosureStatus(trx, person, req, projectId);
}

async function deactivateProjectPersons(
  trx,
  existingPersons,
  persons,
  projectId,
  req
) {
  const filtered = existingPersons.filter(pr => {
    return persons.find(person => {
      return (
        person.personId === pr.personId &&
        person.sourcePersonType === pr.source_person_type
      );
    }) === undefined;
  });
  
  for (let i = 0; i < filtered.length; i++) {
    const result = filtered[i];
    await deactivateProjectPerson(trx, result, projectId, req);
  }
}

async function saveProjectPersons(trx, project, req) {
  Log.info('pre project_person select');

  const existingPersons = await trx('project_person')
    .select('person_id as personId', 'source_person_type', 'new')
    .where('project_id', project.id);

  Log.info('post project_person select');

  if (project.persons && project.persons.length > 0) {
    const queries = project.persons.map(async (person) => {
      Log.info('pre isProjectRequired');
      const isRequired = await isProjectRequired(req, project, person);
      Log.info('post isProjectRequired');
      const existingPerson = existingPersons.find(pr => {
        return (
          pr.personId === person.personId &&
          pr.source_person_type === person.sourcePersonType
        );
      });

      if (existingPerson) {
        Log.info('pre updateProjectPerson');
        return await updateProjectPerson(
          trx,
          person,
          project,
          isRequired,
          existingPerson.new,
          req
        );
      }
      Log.info('pre insertProjectPerson');
      return await insertProjectPerson(trx, person, project, isRequired, req);
    });

    Log.info('pre deactivateProjectPersons');
    await deactivateProjectPersons(
      trx,
      existingPersons,
      project.persons,
      project.id,
      req
    );
    Log.info('post deactivateProjectPersons');

    Log.info('pre queries');
    await Promise.all(queries);
    Log.info('post queries');
    return;
  }

  if (existingPersons.length > 0) {
    Log.info('pre disableAllPersonsForProject');
    await disableAllPersonsForProject(trx, project.id, req);
    Log.info('post disableAllPersonsForProject');
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
    start_date: new Date(project.startDate),
    end_date: new Date(project.endDate)
  }, 'id');

  return id[0];
}

async function saveNewProjects(trx, project, req) {
  Log.info('pre insertProject');
  project.id = await insertProject(trx, project);
  Log.info('post insertProject');

  if (project.sponsors) {
    Log.info('pre updateProjectSponsors');
    await updateProjectSponsors(trx, project.id, project.sponsors);
    Log.info('post updateProjectSponsors');
  }

  if (project.persons && Array.isArray(project.persons)) {
    for (let i = 0; i < project.persons.length; i++) {
      const person = project.persons[i];
      Log.info('pre isProjectRequired');
      const isRequired = await isProjectRequired(req, project, person);
      Log.info('post isProjectRequired');
      const id = await insertProjectPerson(
        trx,
        person,
        project,
        isRequired,
        req
      );
      Log.info('post insertProjectPerson');
      person.id = id;
    }
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
    start_date: new Date(project.startDate),
    end_date: new Date(project.endDate)
  }).where('id', project.id);

  Log.info('update project table complete');

  await updateProjectSponsors(trx, project.id, project.sponsors);
  await saveProjectPersons(trx, project, authHeader);
}

async function getExistingProjectId(trx, project) {
  Log.info('pre existing project query');
  const existingProject = await trx
    .first('id')
    .from('project')
    .where({
      source_system: project.sourceSystem,
      source_identifier: project.sourceIdentifier
    });
  Log.info('got existing project');
  if (existingProject) {
    return existingProject.id;
  }
}

export async function saveProjects(req, project) {
  const knex = getKnex(req.dbInfo);

  const existingProjectId = await getExistingProjectId(knex, project);
  Log.info(`existingProjectId = ${existingProjectId}`);
  if (existingProjectId) {
    project.id = existingProjectId;
    Log.info('Pre saveExistingProjects');
    return await saveExistingProjects(knex, project, req);
  }
  Log.info('Pre saveNewProjects');
  return await saveNewProjects(knex, project, req);
}

async function getStatus(trx, projectPerson, dbInfo, authHeader) {
  const {disposition, person_id, disclosureId, projectId} = projectPerson;
  const disclosureStatus = {
    userId: person_id,
    disposition: disposition ? disposition : NO_DISPOSITION_DESCRIPTION
  };

  const isRequired = await ProjectService.isProjectRequired(
    dbInfo,
    projectPerson,
    authHeader
  );

  if (!isRequired) {
    disclosureStatus.status = (
      PROJECT_DISCLOSURE_STATUSES.DISCLOSURE_NOT_REQUIRED
    );
    return disclosureStatus;
  }

  const disclosure = await trx('disclosure as d')
    .first('ds.description as status', 'd.id')
    .innerJoin('disclosure_status as ds', 'ds.status_cd', 'd.status_cd')
    .where({
      user_id: person_id
    });

  const declaration = await trx('declaration')
    .select('disclosure_id')
    .where({
      project_id: projectId,
      disclosure_id: disclosureId
    });

  if (disclosure) {
    const entity = await trx('fin_entity')
      .first('id')
      .where({
        disclosure_id: disclosure.id
      });

    if (declaration[0] || !entity) {
      disclosureStatus.status = disclosure.status;
    } else {
      disclosureStatus.status = PROJECT_DISCLOSURE_STATUSES.UPDATE_NEEDED;
    }
  } else {
    disclosureStatus.status = PROJECT_DISCLOSURE_STATUSES.NOT_YET_DISCLOSED;
  }
  return disclosureStatus;
}

async function getProjectPersons(
  trx,
  sourceSystem,
  sourceIdentifier,
  personId
) {
  const criteria = {
    'p.source_system': sourceSystem,
    'p.source_identifier': sourceIdentifier
  };

  if (personId) {
    criteria['pp.person_id'] = personId;
  }

  const projectPersons = await trx('project as p')
    .distinct('pp.person_id')
    .select(
      'p.id as projectId',
      'd.id as disclosureId',
      'p.source_status as statusCd',
      'p.type_cd as typeCd',
      'pp.role_cd as roleCd',
      'dt.description as disposition'
    )
    .innerJoin('project_person as pp', 'p.id', 'pp.project_id')
    .leftJoin('disclosure as d', 'd.user_id', 'pp.person_id')
    .leftJoin('disposition_type as dt', 'dt.type_cd', 'pp.disposition_type_cd')
    .where(criteria);

  let projectIds = projectPersons.map(project => project.projectId);
  projectIds = uniq(projectIds);

  const sponsors = await trx.select(
      'project_id as projectId',
      'sponsor_cd as sponsorCode',
      'sponsor_name as sponsorName'
    )
    .from('project_sponsor')
    .whereIn('project_id', projectIds);

  sponsors.forEach(sponsor => {
    const project = projectPersons.find(
      prj => prj.projectId === sponsor.projectId
    );
    if (project) {
      if (!project.sponsors) {
        project.sponsors = [];
      }
      project.sponsors.push(sponsor);
    }
  });

  return projectPersons;
}

export async function getProjectStatuses(
  dbInfo,
  sourceSystem,
  sourceIdentifier,
  authHeader
) {
  try {
    const knex = getKnex(dbInfo);
    const projectPersons = await getProjectPersons(
      knex,
      sourceSystem,
      sourceIdentifier
    );
    const results = [];
    if (Array.isArray(projectPersons)) {
      for (let i = 0; i < projectPersons.length; i++) {
        const projectPerson = projectPersons[i];
        results.push(await getStatus(knex, projectPerson, dbInfo, authHeader));
      }
    }
    return results;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getProjectStatus(
  dbInfo,
  sourceSystem,
  sourceIdentifier,
  personId,
  authHeader
) {
  try {
    const knex = getKnex(dbInfo);
    const projectPersons = await getProjectPersons(
      knex,
      sourceSystem,
      sourceIdentifier,
      personId
    );

    if (projectPersons[0]) {
      return await getStatus(knex, projectPersons[0], dbInfo, authHeader);
    }

    return {};
  } catch (err) {
    return Promise.reject(err);
  }
}

export function updateProjectPersonDispositionType(dbInfo, projectPerson, id) {
  const {dispositionTypeCd} = projectPerson;
  try {
    const knex = getKnex(dbInfo);
    return knex('project_person').update({
      disposition_type_cd: dispositionTypeCd ? dispositionTypeCd : null
    }).where({id});
  } catch (err) {
    return Promise.reject(err);
  }
}

async function updateProjectSponsors(trx, projectId, sponsors) {
  Log.info('beginning updateProjectSponsors');
  if (!isNumber) {
    throw new Error('invalid project id');
  }

  if (!Array.isArray(sponsors)) {
    throw new Error('invalid sponsors array');
  }

  const existingSponsors = await trx.select(
      'id',
      'source_system as sourceSystem',
      'source_identifier as sourceIdentifier',
      'sponsor_cd as sponsorCode',
      'sponsor_name as sponsorName'
    ).from('project_sponsor')
    .where({
      project_id: projectId
    });

  Log.info('existingSponsors query complete');

  const toDelete = [];
  existingSponsors.forEach(existingSponsor => {
    const stillExists = sponsors.some(sponsor => {
      return (
        sponsor.sourceSystem === existingSponsor.sourceSystem &&
        sponsor.sourceIdentifier === existingSponsor.sourceIdentifier &&
        sponsor.sponsorCode === existingSponsor.sponsorCode &&
        sponsor.sponsorName === existingSponsor.sponsorName
      );
    });

    if (!stillExists) {
      toDelete.push(existingSponsor.id);
    }
  });

  Log.info('pre project_sponsor delete');
  if (toDelete.length > 0) {
    await trx('project_sponsor')
      .whereIn('id', toDelete)
      .andWhere({
        project_id: projectId
      })
      .del();
  }
  Log.info('post project_sponsor delete');

  const toAdd = [];
  sponsors.forEach(sponsor => {
    const alreadyExists = existingSponsors.some(existingSponsor => {
      return (
        sponsor.sourceSystem === existingSponsor.sourceSystem &&
        sponsor.sourceIdentifier === existingSponsor.sourceIdentifier &&
        sponsor.sponsorCode === existingSponsor.sponsorCode &&
        sponsor.sponsorName === existingSponsor.sponsorName
      );
    });

    if (!alreadyExists) {
      toAdd.push({
        project_id: projectId,
        source_system: sponsor.sourceSystem,
        source_identifier: sponsor.sourceIdentifier,
        sponsor_cd: sponsor.sponsorCode,
        sponsor_name: sponsor.sponsorName
      });
    }
  });

  Log.info('pre project_sponsor insert');

  if (toAdd.length > 0) {
    await trx('project_sponsor').insert(toAdd);
  }

  Log.info('post project_sponsor insert');
}
