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
const {
  NOT_YET_DISCLOSED,
  DISCLOSURE_NOT_REQUIRED,
  UPDATE_NEEDED
} = PROJECT_DISCLOSURE_STATUSES;
import * as ProjectService from '../services/project-service/project-service';
import { getGeneralConfig } from '../db/config-db';
import Log from '../log';
import {
  createAndSendNewProjectNotification
} from '../services/notification-service/notification-service';
import {flagIsOn} from '../feature-flags';

export async function getSponsorsForProjects(knex, projectIds) {
  if (!Array.isArray(projectIds)) {
    throw Error('invalid project ids');
  }

  return await knex
    .select(
      'project_id as projectId',
      'sponsor_cd as sponsorCode',
      'sponsor_name as sponsorName'
    )
    .from('project_sponsor')
    .whereIn('project_id', projectIds);
}

export async function getActiveProjectsForUser(knex, userId) {
  if (!Number.isInteger(userId) && typeof userId !== 'string') {
    throw Error('invalid user id');
  }

  return await knex
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
}

export function associateSponsorsWithProject(sponsors, projects) {
  if (!Array.isArray(sponsors)) {
    throw Error('Invalid sponsors');
  }

  if (!Array.isArray(projects)) {
    throw Error('Invalid projects');
  }

  sponsors.forEach(sponsor => {
    const matchingProjects = projects.filter(
      prj => prj.id === sponsor.projectId
    );

    for (const project of matchingProjects) {
      if (!project.sponsors) {
        project.sponsors = [];
      }
      project.sponsors.push(sponsor);
    }
  });

  return projects;
}

export async function getProjects (knex, userId) {
  let projects = await getActiveProjectsForUser(knex, userId);
  const projectIds = projects.map(project => project.id);
  const uniqueProjectIds = uniq(projectIds);

  const sponsors = await getSponsorsForProjects(knex, uniqueProjectIds);
  projects = associateSponsorsWithProject(sponsors, projects);

  return projects;
}

export async function shouldUpdateStatus(knex, disclosure_id) {
  if (!Number.isInteger(disclosure_id)) {
    throw Error('invalid disclosure id');
  }

  const generalConfig = await getGeneralConfig(knex);

  if (!generalConfig.config.disableNewProjectStatusUpdateWhenNoEntities) {
    return true;
  }

  const entity = await knex
    .first('id')
    .from('fin_entity')
    .where({
      disclosure_id,
      active: true
    });

  const entitiesExist = (entity !== undefined);

  return entitiesExist;
}

export async function getDisclosureForUser(knex, user_id) {
  if (!Number.isInteger(user_id) && typeof user_id !== 'string') {
    throw Error('invalid user id');
  }

  return await knex
    .first(
      'id',
      'type_cd as typeCd',
      'title',
      'status_cd as statusCd',
      'user_id as userId',
      'submitted_by as submittedBy',
      'submitted_date as submittedDate',
      'revised_date as revisedDate',
      'start_date as startDate',
      'expired_date as expiredDate',
      'last_review_date as lastReviewDate',
      'config_id as configId'
    )
    .from('disclosure')
    .where({
      user_id,
      type_cd: DISCLOSURE_TYPE.ANNUAL
    });
}

async function updateDisclosureStatus(knex, person, project, req, isRequired) {
  const disclosure = await getDisclosureForUser(knex, person.personId);

  if (await flagIsOn(knex, 'RESCOI-911_925')) {
    if (isRequired) {
      await createAndSendNewProjectNotification(
        req.dbInfo,
        req.hostname,
        req.userInfo,
        disclosure ? disclosure.id : undefined,
        project,
        person
      );

      if (
        disclosure &&
        await shouldUpdateStatus(knex, disclosure.id) &&
        disclosure.statusCd === DISCLOSURE_STATUS.UP_TO_DATE
      ) {
        await knex('disclosure')
          .update({status_cd: DISCLOSURE_STATUS.UPDATE_REQUIRED})
          .where({id: disclosure.id});
      }
    }
  } else if (
    disclosure &&
    await shouldUpdateStatus(knex, disclosure.id) &&
    disclosure.statusCd === DISCLOSURE_STATUS.UP_TO_DATE
  ) {
    await knex('disclosure')
      .update({status_cd: DISCLOSURE_STATUS.UPDATE_REQUIRED})
      .where({id: disclosure.id});
    await createAndSendNewProjectNotification(
      req.dbInfo,
      req.hostname,
      req.userInfo,
      disclosure.id,
      project,
      person
    );
  } else if (!disclosure) {
    await createAndSendNewProjectNotification(
        req.dbInfo,
        req.hostname,
        req.userInfo,
        undefined,
        project,
        person
    );
  }
}

export async function markDisclosureAsUpToDate(knex, user_id) {
  if (!Number.isInteger(user_id) && typeof user_id !== 'string') {
    throw Error('invalid user id');
  }

  await knex('disclosure')
    .update({status_cd: DISCLOSURE_STATUS.UP_TO_DATE})
    .where({
      user_id,
      type_cd: DISCLOSURE_TYPE.ANNUAL,
      status_cd: DISCLOSURE_STATUS.UPDATE_REQUIRED
    });
}

async function revertDisclosureStatus(knex, person, req, projectId) {
  const projects = await getProjects(knex, person.personId);
  const otherProjects = projects.filter(project => project.id !== projectId);
  const otherRequiredProjects = await ProjectService.filterProjects(
    req.dbInfo,
    otherProjects,
    req.headers.authorization
  );

  if (otherRequiredProjects.length > 0) {
    return;
  }

  await markDisclosureAsUpToDate(knex, person.personId);
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

export async function deactivateAllProjectPeople(knex, project_id) {
  if (!Number.isInteger(project_id)) {
    throw Error('invalid project id');
  }

  await knex('project_person')
    .update('active', false)
    .where({project_id});
}

async function disableAllPersonsForProject(knex, project_id, req) {
  const existingPersons = await knex
    .select('person_id as personId')
    .from('project_person')
    .where({project_id});

  await deactivateAllProjectPeople(knex, project_id);

  if (Array.isArray(existingPersons)) {
    for (const person of existingPersons) {
      await revertDisclosureStatus(knex, person, req, project_id);
    }
  }
}

async function updateProjectPerson(
  knex,
  person,
  project,
  isRequired,
  noDisclosureSubmitted,
  req
) {
  await knex('project_person')
    .update({
      active: true,
      role_cd: person.roleCode
    })
    .where({
      person_id: person.personId,
      source_person_type: person.sourcePersonType,
      project_id: project.id
    });

  if (noDisclosureSubmitted === 1) {
    if (isRequired) {
      await updateDisclosureStatus(knex, person, project, req, isRequired);
    } else {
      await revertDisclosureStatus(knex, person, req);
    }
  }
}

async function insertProjectPerson(knex, person, project, isRequired, req) {
  const id = await knex('project_person')
    .insert({
      active: true,
      role_cd: person.roleCode,
      person_id: person.personId,
      source_person_type: person.sourcePersonType,
      project_id: project.id
    }, 'id');

  if (isRequired) {
    await updateDisclosureStatus(knex, person, project, req, isRequired);
  }

  return id[0];
}

async function deactivateProjectPerson(knex, person, projectId, req) {
  await knex('project_person')
    .update('active', false)
    .where({
      person_id: person.personId,
      source_person_type: person.source_person_type,
      project_id: projectId
    });
  await revertDisclosureStatus(knex, person, req, projectId);
}

async function deactivateProjectPersons(
  knex,
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
  
  for (const result of filtered) {
    await deactivateProjectPerson(knex, result, projectId, req);
  }
}

async function saveProjectPersons(knex, project, req) {
  Log.info('pre project_person select');

  const existingPersons = await knex
    .select('person_id as personId', 'source_person_type', 'new')
    .from('project_person')
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
          knex,
          person,
          project,
          isRequired,
          existingPerson.new,
          req
        );
      }

      Log.info('pre insertProjectPerson');
      return await insertProjectPerson(knex, person, project, isRequired, req);
    });

    Log.info('pre deactivateProjectPersons');
    await deactivateProjectPersons(
      knex,
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
    await disableAllPersonsForProject(knex, project.id, req);
    Log.info('post disableAllPersonsForProject');
  }
}

export async function insertProject(knex, project) {
  if (typeof project !== 'object') {
    throw Error('invalid project');
  }
  if (!project.title) {
    throw Error('title is a required field');
  }

  const id = await knex('project')
    .insert({
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

async function saveNewProjects(knex, project, req) {
  Log.info('pre insertProject');
  project.id = await insertProject(knex, project);
  Log.info('post insertProject');

  if (project.sponsors) {
    Log.info('pre updateProjectSponsors');
    await updateProjectSponsors(knex, project.id, project.sponsors);
    Log.info('post updateProjectSponsors');
  }

  if (project.persons && Array.isArray(project.persons)) {
    for (const person of project.persons) {
      Log.info('pre isProjectRequired');
      const isRequired = await isProjectRequired(req, project, person);
      Log.info('post isProjectRequired');
      const id = await insertProjectPerson(
        knex,
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

async function saveExistingProject(knex, project, authHeader) {
  if (!project.title) {
    throw Error('title is a required field');
  }
  await knex('project')
    .update({
      title: project.title,
      type_cd: project.typeCode,
      source_status: project.sourceStatus,
      start_date: new Date(project.startDate),
      end_date: new Date(project.endDate)
    })
    .where('id', project.id);

  Log.info('update project table complete');

  await updateProjectSponsors(knex, project.id, project.sponsors);
  await saveProjectPersons(knex, project, authHeader);
}

export async function getExistingProjectId(knex, project) {
  if (typeof project !== 'object') {
    throw Error('invalid project');
  }

  Log.info('pre existing project query');
  const existingProject = await knex
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

export async function saveProject(knex, req, project) {
  const existingProjectId = await getExistingProjectId(knex, project);
  Log.info(`existingProjectId = ${existingProjectId}`);
  if (existingProjectId) {
    project.id = existingProjectId;
    Log.info('Pre saveExistingProjects');
    return await saveExistingProject(knex, project, req);
  }
  Log.info('Pre saveNewProjects');
  return await saveNewProjects(knex, project, req);
}

export async function getDisclosureStatusForUser(knex, user_id) {
  if (!Number.isInteger(user_id) && typeof user_id !== 'string') {
    throw Error('invalid user id');
  }

  return await knex
    .first('ds.description as status', 'd.id')
    .from('disclosure as d')
    .innerJoin('disclosure_status as ds', 'ds.status_cd', 'd.status_cd')
    .where({user_id});
}

export async function projectHasDeclarations(knex, disclosure_id, project_id) {
  if (!Number.isInteger(disclosure_id)) {
    throw Error('Invalid disclosure id');
  }

  if (!Number.isInteger(project_id)) {
    throw Error('Invalid project id');
  }

  const declarationRecord = await knex
    .first('disclosure_id')
    .from('declaration')
    .where({
      project_id,
      disclosure_id
    });
  
  if (declarationRecord) {
    return true;
  }
  return false;
}

export async function disclosureHasEntities(knex, disclosure_id) {
  if (!Number.isInteger(disclosure_id)) {
    throw Error('invalid disclosure id');
  }

  const entityRecord = await knex
    .first('id')
    .from('fin_entity')
    .where({disclosure_id});
  
  if (entityRecord) {
    return true;
  }
  return false;
}

async function getStatus(knex, projectPerson, dbInfo, authHeader) {
  const {
    disposition,
    person_id: userId,
    disclosureId,
    projectId
  } = projectPerson;

  const disclosureStatus = {
    userId,
    disposition: disposition ? disposition : NO_DISPOSITION_DESCRIPTION
  };

  const isRequired = await ProjectService.isProjectRequired(
    dbInfo,
    projectPerson,
    authHeader
  );

  if (!isRequired) {
    disclosureStatus.status = DISCLOSURE_NOT_REQUIRED;
    return disclosureStatus;
  }

  const disclosureRecord = await getDisclosureStatusForUser(knex, userId);
  if (!disclosureRecord) {
    disclosureStatus.status = NOT_YET_DISCLOSED;
    return disclosureStatus;
  }

  const hasDeclarations = await projectHasDeclarations(
    knex,
    disclosureId,
    projectId
  );
  const hasEntities = await disclosureHasEntities(knex, disclosureRecord.id);
  const shouldUseDisclosuresStatus = hasDeclarations || !hasEntities;
  if (shouldUseDisclosuresStatus) {
    disclosureStatus.status = disclosureRecord.status;
  } else {
    disclosureStatus.status = UPDATE_NEEDED;
  }

  return disclosureStatus;
}

export async function getProjectInfos(
  knex,
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

  let projectInfos = await knex
    .distinct('pp.person_id')
    .select(
      'p.id as id',
      'p.id as projectId',
      'd.id as disclosureId',
      'p.source_status as statusCd',
      'p.type_cd as typeCd',
      'pp.role_cd as roleCd',
      'dt.description as disposition'
    )
    .from('project as p')
    .innerJoin('project_person as pp', 'p.id', 'pp.project_id')
    .leftJoin('disclosure as d', 'd.user_id', 'pp.person_id')
    .leftJoin('disposition_type as dt', 'dt.type_cd', 'pp.disposition_type_cd')
    .where(criteria);

  if (projectInfos.length === 0) {
    return [];
  }

  const projectIds = projectInfos.map(project => project.projectId);
  const uniqueProjectIds = uniq(projectIds);

  const sponsors = await getSponsorsForProjects(knex, uniqueProjectIds);
  projectInfos = associateSponsorsWithProject(sponsors, projectInfos);

  return projectInfos;
}

export async function getProjectStatuses(
  dbInfo,
  knex,
  sourceSystem,
  sourceIdentifier,
  authHeader
) {
  const projectInfos = await getProjectInfos(
    knex,
    sourceSystem,
    sourceIdentifier
  );
  const results = [];
  if (Array.isArray(projectInfos)) {
    for (const projectInfo of projectInfos) {
      results.push(await getStatus(knex, projectInfo, dbInfo, authHeader));
    }
  }
  return results;
}

export async function getProjectStatus(
  dbInfo,
  knex,
  sourceSystem,
  sourceIdentifier,
  personId,
  authHeader
) {
  const projectInfos = await getProjectInfos(
    knex,
    sourceSystem,
    sourceIdentifier,
    personId
  );

  if (projectInfos[0]) {
    return await getStatus(knex, projectInfos[0], dbInfo, authHeader);
  }

  return {};
}

export async function updateProjectPersonDispositionType(
  knex,
  projectPerson,
  id
) {
  if (typeof projectPerson !== 'object') {
    throw Error('invalid project person object');
  }
  if (!Number.isInteger(id)) {
    throw Error('invalid id');
  }

  const {dispositionTypeCd: disposition_type_cd = null} = projectPerson;

  return await knex('project_person')
    .update({disposition_type_cd})
    .where({id});
}

export async function updateProjectSponsors(knex, project_id, sponsors) {
  Log.info('beginning updateProjectSponsors');
  if (!isNumber(project_id)) {
    throw Error('invalid project id');
  }

  if (!Array.isArray(sponsors)) {
    throw Error('invalid sponsors array');
  }

  const existingSponsors = await knex
    .select(
      'id',
      'source_system as sourceSystem',
      'source_identifier as sourceIdentifier',
      'sponsor_cd as sponsorCode',
      'sponsor_name as sponsorName'
    )
    .from('project_sponsor')
    .where({project_id});

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
    await knex('project_sponsor')
      .del()
      .whereIn('id', toDelete)
      .andWhere({project_id});
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
        project_id,
        source_system: sponsor.sourceSystem,
        source_identifier: sponsor.sourceIdentifier,
        sponsor_cd: sponsor.sponsorCode,
        sponsor_name: sponsor.sponsorName
      });
    }
  });

  Log.info('pre project_sponsor insert');

  if (toAdd.length > 0) {
    await knex('project_sponsor').insert(toAdd);
  }

  Log.info('post project_sponsor insert');
}
