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
import Log, {
  logArguments,
  logVariable,
  logValue
} from '../log';
import {
  createAndSendNewProjectNotification
} from '../services/notification-service/notification-service';

export async function getSponsorsForProjects(knex, projectIds) {
  logArguments('getSponsorsForProjects', {projectIds});

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
  logArguments('getActiveProjectsForUser', {userId});

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

export async function getDeclarationsForUser(knex, userId) {
  logArguments('getActiveProjectDeclarationsForUser', {userId});

  if (!Number.isInteger(userId) && typeof userId !== 'string') {
    throw Error('invalid user id');
  }

  return await knex
    .select(
      'p.id as id',
      'p.source_identifier as sourceIdentifier',
      'p.title as name',
      'p.type_cd as typeCd',
      'p.source_status as statusCd'
    )
    .from('project as p')
    .innerJoin('declaration as d', 'p.id', 'd.project_id')
    .innerJoin('project_person as pp', 'pp.project_id', 'p.id')
    .where({
      'pp.person_id': userId,
      'pp.active': true
    });
}

export function associateSponsorsWithProject(sponsors, projects) {
  logArguments('associateSponsorsWithProject', {sponsors, projects});

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
    logVariable({matchingProjects});

    for (const project of matchingProjects) {
      if (!project.sponsors) {
        project.sponsors = [];
      }
      project.sponsors.push(sponsor);
    }
  });

  return projects;
}

export async function getActiveProjectsWithDeclarationsForUser(knex, userId) {
  logArguments('getActiveProjectsWithDeclarations', {userId});

  const projects = await getDeclarationsForUser(knex, userId);
  return await aggregateProjectData(projects, knex);
}

async function aggregateProjectData(projects, knex) {
  logVariable({projects});
  const projectIds = projects.map(project => project.id);
  logVariable({projectIds});
  const uniqueProjectIds = uniq(projectIds);
  logVariable(uniqueProjectIds);

  const sponsors = await getSponsorsForProjects(knex, uniqueProjectIds);
  logVariable(sponsors);
  const projectsWithData = associateSponsorsWithProject(sponsors, projects);

  return projectsWithData;
}

export async function getProjects (knex, userId) {
  logArguments('getProjects', {userId});

  const projects = await getActiveProjectsForUser(knex, userId);
  return await aggregateProjectData(projects, knex);
}

export async function entitiesNeedDeclaration(knex, disclosure_id) {
  logArguments('entitiesNeedDeclaration', {disclosure_id});

  if (!Number.isInteger(disclosure_id)) {
    throw Error('invalid disclosure id');
  }

  const generalConfig = await getGeneralConfig(knex);
  logVariable({generalConfig});

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
  logVariable({entity});

  const entitiesExist = (entity !== undefined);

  return entitiesExist;
}

export async function getDisclosureForUser(knex, user_id) {
  logArguments('getDisclosureForUser', {user_id});

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

function onlyStatusChanged(project) {
  if (
    project.isNewProject ||
    project.peopleWhoChanged.length > 0 ||
    project.sponsorsChanged
  ) {
    return false;
  }
  return true;
}

async function updateDisclosureStatus(knex, person, isRequired) {
  logArguments('updateDisclosureStatus', {person, isRequired});
  
  if (isRequired) {
    const disclosure = await getDisclosureForUser(knex, person.personId);
    logVariable({disclosure});

    let entitiesNeedDeclaring = false;
    if (disclosure) {
      entitiesNeedDeclaring = await entitiesNeedDeclaration(
        knex,
        disclosure.id
      );
    }
    logVariable({entitiesNeedDeclaring});

    if (
      disclosure &&
      entitiesNeedDeclaring &&
      disclosure.statusCd === DISCLOSURE_STATUS.UP_TO_DATE
    ) {
      Log.verbose('updating disclosure status to UPDATE_REQUIRED');
      await knex('disclosure')
        .update({status_cd: DISCLOSURE_STATUS.UPDATE_REQUIRED})
        .where({id: disclosure.id});
    }
  }
}

async function sendNotification(
  knex,
  person,
  project,
  dbInfo,
  hostname,
  userInfo
) {
  logArguments(
    'sendNotification',
    {person, project, dbInfo, hostname, userInfo}
  );
  
  const disclosure = await getDisclosureForUser(knex, person.personId);
  logVariable({disclosure});

  let entitiesNeedDeclaring = false;
  if (disclosure) {
    entitiesNeedDeclaring = await entitiesNeedDeclaration(
      knex,
      disclosure.id
    );
  }
  logVariable({entitiesNeedDeclaring});

  const previouslyNotified = person.notified;
  if (!previouslyNotified) {
    const hasNotSubmitted = (
      !disclosure ||
      disclosure.statusCd === DISCLOSURE_STATUS.IN_PROGRESS ||
      disclosure.statusCd === DISCLOSURE_STATUS.EXPIRED ||
      disclosure.statusCd === DISCLOSURE_STATUS.UPDATE_REQUIRED ||
      disclosure.statusCd === DISCLOSURE_STATUS.UP_TO_DATE
    );
    logVariable({hasNotSubmitted});
    const hasSubmitted = !hasNotSubmitted;

    if (
      project.statusChange === true &&
      onlyStatusChanged(project) &&
      hasSubmitted
    ) {
      return;
    }

    if (hasNotSubmitted || entitiesNeedDeclaring) {
      createAndSendNewProjectNotification(
        dbInfo,
        hostname,
        userInfo,
        disclosure ? disclosure.id : undefined,
        project,
        person
      );
    }
  }
}

export async function markDisclosureAsUpToDate(knex, user_id) {
  logArguments('markDisclosureAsUpToDate', {user_id});

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
  logArguments('revertDisclosureStatus', {person, projectId});

  const projects = await getProjects(knex, person.personId);
  logVariable({projects});
  const otherProjects = projects.filter(project => project.id !== projectId);
  logVariable({otherProjects});
  const otherRequiredProjects = await ProjectService.filterProjects(
    req.dbInfo,
    otherProjects,
    req.headers.authorization
  );
  logVariable({otherRequiredProjects});

  if (otherRequiredProjects.length > 0) {
    Log.verbose('no other required projects');
    return;
  }

  await markDisclosureAsUpToDate(knex, person.personId);
}

async function isProjectRequired(req, project, person) {
  logArguments('isProjectRequired', {project, person});

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
  logArguments('deactivateAllProjectPeople', {project_id});

  if (!Number.isInteger(project_id)) {
    throw Error('invalid project id');
  }

  await knex('project_person')
    .update('active', false)
    .where({project_id});
}

async function disableAllPersonsForProject(knex, project_id, req) {
  logArguments('disableAllPersonsForProject', {project_id});

  const existingPersons = await knex
    .select('person_id as personId')
    .from('project_person')
    .where({project_id});
  logVariable({existingPersons});

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
  projectIsNewToDisclosure,
  req
) {
  logArguments(
    'updateProjectPerson',
    {person, project, isRequired, projectIsNewToDisclosure}
  );

  await knex('project_person')
    .update({
      active: true,
      role_cd: person.roleCode,
      notified: isRequired
    })
    .where({
      person_id: person.personId,
      source_person_type: person.sourcePersonType,
      project_id: project.id
    });

  if (isRequired) {
    await sendNotification(
      knex,
      person,
      project,
      req.dbInfo,
      req.hostname,
      req.userInfo
    );
  }

  if (projectIsNewToDisclosure === 1) {
    if (isRequired) {
      await updateDisclosureStatus(knex, person, isRequired);
    } else {
      await revertDisclosureStatus(knex, person, req, project.id);
    }
  }
}

async function insertProjectPerson(knex, person, project, isRequired, req) {
  logArguments('insertProjectPerson', {person, project, isRequired});

  const id = await knex('project_person')
    .insert({
      active: true,
      role_cd: person.roleCode,
      person_id: person.personId,
      source_person_type: person.sourcePersonType,
      project_id: project.id,
      notified: true
    }, 'id');
  logVariable({id});

  person.notified = false;

  if (isRequired) {
    await sendNotification(
      knex,
      person,
      project,
      req.dbInfo,
      req.hostname,
      req.userInfo
    );
    await updateDisclosureStatus(knex, person, isRequired);
  }

  return parseInt(id[0]);
}

async function deactivateProjectPerson(knex, person, projectId, req) {
  logArguments('deactivateProjectPerson', {person, projectId});

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
  logArguments(
    'deactivateProjectPersons',
    {existingPersons, persons, projectId}
  );

  const filtered = existingPersons.filter(pr => {
    return persons.find(person => {
      return (
        person.personId === pr.personId &&
        person.sourcePersonType === pr.source_person_type
      );
    }) === undefined;
  });
  logVariable({filtered});

  for (const result of filtered) {
    await deactivateProjectPerson(knex, result, projectId, req);
  }
}

export async function updateAllProjectPersons(knex, req) {
  logArguments('updateAllProjectPersons');

  const projects = await knex
    .select(
      'id',
      'type_cd as typeCode',
      'source_system as sourceSystem',
      'source_identifier as sourceIdentifier',
      'source_status as sourceStatus',
      'start_date as startDate',
      'end_date as endDate',
      'title'
    )
    .from('project');
  logVariable({projects});

  for (const project of projects) {
    project.sponsors = await getSponsorsForProjects(knex, [project.id]);
    const projSponsors = project.sponsors;
    logVariable({projSponsors});

    const existingPersons = await knex
      .select(
        'role_cd as roleCode',
        'person_id as personId',
        'source_person_type as sourcePersonType',
        'new',
        'notified'
      )
      .from('project_person')
      .where('project_id', project.id);
    logVariable({existingPersons});
    project.persons = existingPersons;

    for (const person of existingPersons) {
      const isRequired = await isProjectRequired(req, project, person);
      logVariable({isRequired});

      await updateProjectPerson(
        knex,
        person,
        project,
        isRequired,
        person.new,
        req
      );
    }
  }
}

async function saveProjectPersons(knex, project, req) {
  logArguments('saveProjectPersons', {project});

  const existingPersons = await knex
    .select('person_id as personId', 'source_person_type', 'new', 'notified')
    .from('project_person')
    .where('project_id', project.id);

  logVariable({existingPersons});

  if (project.persons && project.persons.length > 0) {
    await deactivateProjectPersons(
      knex,
      existingPersons,
      project.persons,
      project.id,
      req
    );

    for (const person of project.persons) {
      const isRequired = await isProjectRequired(req, project, person);
      logVariable({isRequired});

      const existingPerson = existingPersons.find(pr => {
        return (
          pr.personId === person.personId &&
          pr.source_person_type === person.sourcePersonType
        );
      });
      logVariable({existingPerson});

      if (existingPerson) {
        person.notified = existingPerson.notified;

        await updateProjectPerson(
          knex,
          person,
          project,
          isRequired,
          existingPerson.new,
          req
        );
      }
      else {
        await insertProjectPerson(knex, person, project, isRequired, req);
      }
    }

    return;
  }

  logVariable({existingPersons});
  if (existingPersons.length > 0) {
    await disableAllPersonsForProject(knex, project.id, req);
  }
}

export async function insertProject(knex, project) {
  logArguments('insertProject', {project});

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

  return parseInt(id[0]);
}

async function saveNewProjects(knex, project, req) {
  logArguments('saveNewProjects', {project});

  project.id = await insertProject(knex, project);
  logValue('project.id', project.id);

  if (project.sponsors) {
    let {sponsors} = project;
    if (sponsors === null || sponsors === undefined) {
      sponsors = [];
    }
    await updateProjectSponsors(knex, project.id, sponsors);
  }

  if (project.persons && Array.isArray(project.persons)) {
    for (const person of project.persons) {
      const isRequired = await isProjectRequired(req, project, person);
      logVariable({isRequired});

      const id = await insertProjectPerson(
        knex,
        person,
        project,
        isRequired,
        req
      );
      logVariable({id});
      person.id = id;
    }
  }
  return project;
}

async function saveExistingProject(knex, project, authHeader) {
  logArguments('saveExistingProject', {project});

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

  let {sponsors} = project;
  if (sponsors === null || sponsors === undefined) {
    sponsors = [];
  }
  await updateProjectSponsors(knex, project.id, sponsors);
  await saveProjectPersons(knex, project, authHeader);
}

export async function getExistingProject(knex, project) {
  logArguments('getExistingProject', {project});

  if (typeof project !== 'object') {
    throw Error('invalid project');
  }

  const existingProject = await knex
    .first(
      'id',
      'type_cd as typeCd',
      'source_system as sourceSystem',
      'source_identifier as sourceIdentifier',
      'source_status as sourceStatus',
      'start_date as startDate',
      'end_date as endDate',
      'title'
    )
    .from('project')
    .where({
      source_system: project.sourceSystem,
      source_identifier: project.sourceIdentifier
    });
  logVariable({existingProject});

  return existingProject;
}

async function getPeopleWhoChanged(knex, project) {
  logArguments('getPeopleWhoChanged', {project});

  const currentPeople = await knex
    .select(
      'person_id as personId',
      'role_cd as roleCode'
    )
    .from('project_person')
    .where({
      project_id: project.id
    });
  logVariable({currentPeople});

  if (!project.persons) {
    return currentPeople.map(person => person.personId);
  }

  const result = [];
  for (const person of currentPeople) {
    const newPerson = project.persons.find(p => p.personId == person.personId);
    logVariable({newPerson});

    const personWasRemoved = !newPerson;
    if (personWasRemoved) {
      result.push(person.personId);
    }
    else if (person.roleCode != newPerson.roleCode) {
      result.push(person.personId);
    }
  }

  for (const person of project.persons) {
    const existingPerson = currentPeople.find(
      p => p.personId == person.personId
    );
    const personWasAdded = !existingPerson;
    if (personWasAdded) {
      result.push(person.personId);
    }
  }

  return result;
}

async function didSponsorsChange(knex, project) {
  const currentSponsors = await knex
    .select(
      'sponsor_cd as sponsorCode'
    )
    .from('project_sponsor')
    .where({
      project_id: project.id
    });

  if (!project.sponsors) {
    return currentSponsors.length !== 0;
  }

  if (project.sponsors.length !== currentSponsors.length) {
    return true;
  }

  for (const sponsor of currentSponsors) {
    const found = project.sponsors.some(
      s => s.sponsorCode === sponsor.sponsorCode
    );

    if (!found) {
      return true;
    }
  }

  return false;
}

export async function saveProject(knex, req, project) {
  logArguments('saveProject', {project});

  const existingProject = await getExistingProject(knex, project);
  logVariable({existingProject});

  if (existingProject) {
    project.id = existingProject.id;
    project.isNewProject = false;
    project.peopleWhoChanged = await getPeopleWhoChanged(knex, project);
    project.sponsorsChanged = await didSponsorsChange(knex, project);

    if (project.sourceStatus != existingProject.sourceStatus) {
      project.statusChange = true;
    }

    return await saveExistingProject(knex, project, req);
  }
  project.isNewProject = true;
  return await saveNewProjects(knex, project, req);
}

export async function getDisclosureStatusForUser(knex, user_id) {
  logArguments('getDisclosureStatusForUser', {user_id});

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
  logArguments('projectHasDeclarations', {disclosure_id, project_id});

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
  logVariable({declarationRecord});

  if (declarationRecord) {
    return true;
  }
  return false;
}

export async function disclosureHasEntities(knex, disclosure_id) {
  logArguments('disclosureHasEntities', {disclosure_id});

  if (!Number.isInteger(disclosure_id)) {
    throw Error('invalid disclosure id');
  }

  const entityRecord = await knex
    .first('id')
    .from('fin_entity')
    .where({disclosure_id});
  logVariable(entityRecord);

  if (entityRecord) {
    return true;
  }
  return false;
}

async function getStatus(knex, projectPerson, dbInfo, authHeader) {
  logArguments('getStatus', {projectPerson});

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
  logVariable({isRequired});

  if (!isRequired) {
    disclosureStatus.status = DISCLOSURE_NOT_REQUIRED;
    return disclosureStatus;
  }

  const disclosureRecord = await getDisclosureStatusForUser(knex, userId);
  logVariable({disclosureRecord});
  if (!disclosureRecord) {
    disclosureStatus.status = NOT_YET_DISCLOSED;
    return disclosureStatus;
  }

  const hasDeclarations = await projectHasDeclarations(
    knex,
    disclosureId,
    projectId
  );
  logVariable({hasDeclarations});
  const hasEntities = await disclosureHasEntities(knex, disclosureRecord.id);
  logVariable({hasEntities});
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
  logArguments('getProjectInfos', {sourceSystem, sourceIdentifier, personId});

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
  logVariable({projectInfos});

  if (projectInfos.length === 0) {
    return [];
  }

  const projectIds = projectInfos.map(project => project.projectId);
  const uniqueProjectIds = uniq(projectIds);

  const sponsors = await getSponsorsForProjects(knex, uniqueProjectIds);
  logVariable({sponsors});
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
  logArguments('getProjectStatuses', {sourceSystem, sourceIdentifier});

  const projectInfos = await getProjectInfos(
    knex,
    sourceSystem,
    sourceIdentifier
  );
  logVariable({projectInfos});
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
  logArguments('getProjectStatus', {sourceSystem, sourceIdentifier, personId});

  const projectInfos = await getProjectInfos(
    knex,
    sourceSystem,
    sourceIdentifier,
    personId
  );
  logVariable({projectInfos});

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
  logArguments('updateProjectPersonDispositionType', {projectPerson, id});

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
  logArguments('updateProjectSponsors', {project_id, sponsors});

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
  logVariable({existingSponsors});

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

  if (toDelete.length > 0) {
    logVariable({toDelete});
    await knex('project_sponsor')
      .del()
      .whereIn('id', toDelete)
      .andWhere({project_id});
  }

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

  if (toAdd.length > 0) {
    logVariable({toAdd});
    await knex('project_sponsor').insert(toAdd);
  }
}
