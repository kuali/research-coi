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
  UPDATE_NEEDED,
  UP_TO_DATE
} = PROJECT_DISCLOSURE_STATUSES;
import * as ProjectService from '../services/project-service/project-service';
import ConfigDB from '../db/config-db';
import {addLoggers} from '../log';
import {
  createAndSendNewProjectNotification
} from '../services/notification-service/notification-service';

const ProjectDB = {};
export default ProjectDB;

ProjectDB.getSponsorsForProjects = async function(knex, projectIds) {
  this.log.logArguments('getSponsorsForProjects', {projectIds});

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
};

ProjectDB.getActiveProjectsForUser = async function(knex, userId) {
  this.log.logArguments('getActiveProjectsForUser', {userId});

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
      'role.description as roleDescription',
      'p.source_status as statusCd',
      'person.new as new',
      'type.description as projectType'
    )
    .from('project as p')
    .innerJoin('project_person as person', 'p.id', 'person.project_id')
    .innerJoin('project_type as type', 'p.type_cd', 'type.type_cd')
    .innerJoin('project_role as role', function() {
      this.on('role.source_role_cd', '=', 'person.role_cd').
        andOn('role.project_type_cd', '=', 'p.type_cd');
    })
    .where({
      'person.person_id': userId,
      'person.active': 1
    });
};

ProjectDB.getDeclarationsForUser = async function(knex, userId) {
  this.log.logArguments('getActiveProjectDeclarationsForUser', {userId});

  if (!Number.isInteger(userId) && typeof userId !== 'string') {
    throw Error('invalid user id');
  }

  return await knex
    .distinct(
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
    })
    .select();
};

ProjectDB.associateSponsorsWithProject = function(sponsors, projects) {
  this.log.logArguments('associateSponsorsWithProject', {sponsors, projects});

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
    this.log.logVariable({matchingProjects});

    for (const project of matchingProjects) {
      if (!project.sponsors) {
        project.sponsors = [];
      }
      project.sponsors.push(sponsor);
    }
  });

  return projects;
};

ProjectDB.getActiveProjectsWithDeclarationsForUser = async function(
    knex,
    userId
  ) {
  this.log.logArguments('getActiveProjectsWithDeclarations', {userId});

  const projects = await ProjectDB.getDeclarationsForUser(knex, userId);
  return await ProjectDB.aggregateProjectData(projects, knex);
};

ProjectDB.aggregateProjectData = async function(projects, knex) {
  this.log.logVariable({projects});
  const projectIds = projects.map(project => project.id);
  this.log.logVariable({projectIds});
  const uniqueProjectIds = uniq(projectIds);
  this.log.logVariable(uniqueProjectIds);

  const sponsors = await ProjectDB.getSponsorsForProjects(
    knex,
    uniqueProjectIds
  );
  this.log.logVariable(sponsors);
  const projectsWithData = ProjectDB.associateSponsorsWithProject(
    sponsors,
    projects
  );

  return projectsWithData;
};

ProjectDB.getProjects = async function (knex, userId) {
  this.log.logArguments('getProjects', {userId});

  const projects = await ProjectDB.getActiveProjectsForUser(knex, userId);
  return await ProjectDB.aggregateProjectData(projects, knex);
};

ProjectDB.entitiesNeedDeclaration = async function(knex, disclosure_id) {
  this.log.logArguments('entitiesNeedDeclaration', {disclosure_id});

  if (!Number.isInteger(disclosure_id)) {
    throw Error('invalid disclosure id');
  }

  const generalConfig = await ConfigDB.getGeneralConfig(knex);
  this.log.logVariable({generalConfig});

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
  this.log.logVariable({entity});

  const entitiesExist = (entity !== undefined);

  return entitiesExist;
};

ProjectDB.getDisclosureForUser = async function(knex, user_id) {
  this.log.logArguments('getDisclosureForUser', {user_id});

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
};

ProjectDB.projectChangedForPerson = function(project, person) {
  this.log.logArguments('projectChangedForPerson', {project, person});

  if (Array.isArray(project.peopleWhoChanged)) {
    if (project.peopleWhoChanged.includes(person.personId)) {
      return true;
    }
  }

  return (
    project.isNewProject ||
    project.sponsorsChanged ||
    project.statusChange
  );
};

ProjectDB.onlyStatusChanged = function(project) {
  if (
    project.isNewProject ||
    project.peopleWhoChanged.length > 0 ||
    project.sponsorsChanged
  ) {
    return false;
  }
  return true;
};

ProjectDB.updateDisclosureStatus = async function(knex, person, isRequired) {
  this.log.logArguments('updateDisclosureStatus', {person, isRequired});

  if (isRequired) {
    const disclosure = await ProjectDB.getDisclosureForUser(
      knex,
      person.personId
    );
    this.log.logVariable({disclosure});

    let entitiesNeedDeclaring = false;
    if (disclosure) {
      entitiesNeedDeclaring = await ProjectDB.entitiesNeedDeclaration(
        knex,
        disclosure.id
      );
    }
    this.log.logVariable({entitiesNeedDeclaring});

    if (
      disclosure &&
      entitiesNeedDeclaring &&
      disclosure.statusCd === DISCLOSURE_STATUS.UP_TO_DATE
    ) {
      this.log.verbose('updating disclosure status to UPDATE_REQUIRED');
      await knex('disclosure')
        .update({status_cd: DISCLOSURE_STATUS.UPDATE_REQUIRED})
        .where({id: disclosure.id});
    }
  }
};

ProjectDB.getRoleDescription = async function(knex, projectTypeCd, roleCode) {
  const result = await knex
    .first('description')
    .from('project_role')
    .where({
      project_type_cd: projectTypeCd,
      source_role_cd: roleCode
    });

  if (!result) {
    throw Error(
      `Invalid project type / role code: ${projectTypeCd}/${roleCode}`
    );
  }

  return result.description;
};

ProjectDB.sendNotification = async function(
    knex,
    person,
    project,
    dbInfo,
    hostname,
    userInfo
  ) {
  this.log.logArguments(
    'sendNotification',
    {person, project, dbInfo, hostname, userInfo}
  );

  if (!ProjectDB.projectChangedForPerson(project, person)) {
    this.log.info('Not sending notification because project didn\'t change');
    return;
  }

  if (project.statusChange === true && ProjectDB.onlyStatusChanged(project)) {
    if (person.notified) {
      this.log.info('Not sending notification because only status changed and the person was already notified'); // eslint-disable-line max-len
      return;
    }
  }

  person.roleDescription = await ProjectDB.getRoleDescription(
    knex,
    project.typeCode,
    person.roleCode
  );

  const disclosure = await ProjectDB.getDisclosureForUser(
    knex,
    person.personId
  );
  this.log.logVariable({disclosure});

  if (!disclosure) {
    createAndSendNewProjectNotification(
      dbInfo,
      hostname,
      userInfo,
      undefined,
      project,
      person
    );
    return;
  }

  if (
    disclosure.statusCd === DISCLOSURE_STATUS.IN_PROGRESS ||
    disclosure.statusCd === DISCLOSURE_STATUS.EXPIRED
  ) {
    createAndSendNewProjectNotification(
      dbInfo,
      hostname,
      userInfo,
      disclosure.id,
      project,
      person
    );
    return;
  }

  const entitiesNeedDeclaring = await ProjectDB.entitiesNeedDeclaration(
    knex,
    disclosure.id
  );
  this.log.logVariable({entitiesNeedDeclaring});

  if (entitiesNeedDeclaring) {
    createAndSendNewProjectNotification(
      dbInfo,
      hostname,
      userInfo,
      disclosure.id,
      project,
      person
    );
  }
  else {
    this.log.info(
      'Not sending notification because no entities need declaring'
    );
  }
};

ProjectDB.markDisclosureAsUpToDate = async function(knex, user_id) {
  this.log.logArguments('markDisclosureAsUpToDate', {user_id});

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
};

ProjectDB.revertDisclosureStatus = async function(
    knex,
    person,
    req,
    projectId
  ) {
  this.log.logArguments('revertDisclosureStatus', {person, projectId});

  const projects = await ProjectDB.getProjects(knex, person.personId);
  this.log.logVariable({projects});
  const otherProjects = projects.filter(project => project.id !== projectId);
  this.log.logVariable({otherProjects});
  const otherRequiredProjects = await ProjectService.filterProjects(
    req.dbInfo,
    otherProjects,
    req.headers.authorization
  );
  this.log.logVariable({otherRequiredProjects});

  if (otherRequiredProjects.length > 0) {
    this.log.verbose('no other required projects');
    return;
  }

  await ProjectDB.markDisclosureAsUpToDate(knex, person.personId);
};

ProjectDB.isProjectRequired = async function(req, project, person) {
  this.log.logArguments('isProjectRequired', {project, person});

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
};

ProjectDB.deactivateAllProjectPeople = async function(knex, project_id) {
  this.log.logArguments('deactivateAllProjectPeople', {project_id});

  if (!Number.isInteger(project_id)) {
    throw Error('invalid project id');
  }

  await knex('project_person')
    .update('active', false)
    .where({project_id});
};

ProjectDB.disableAllPersonsForProject = async function(knex, project_id, req) {
  this.log.logArguments('disableAllPersonsForProject', {project_id});

  const existingPersons = await knex
    .select('person_id as personId')
    .from('project_person')
    .where({project_id});
  this.log.logVariable({existingPersons});

  await ProjectDB.deactivateAllProjectPeople(knex, project_id);

  if (Array.isArray(existingPersons)) {
    for (const person of existingPersons) {
      await ProjectDB.revertDisclosureStatus(knex, person, req, project_id);
    }
  }
};

ProjectDB.updateProjectPerson = async function(
    knex,
    person,
    project,
    isRequired,
    projectIsNewToDisclosure,
    req
  ) {
  this.log.logArguments(
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
    await ProjectDB.sendNotification(
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
      await ProjectDB.updateDisclosureStatus(knex, person, isRequired);
    } else {
      await ProjectDB.revertDisclosureStatus(knex, person, req, project.id);
    }
  }
};

ProjectDB.insertProjectPerson = async function(
    knex,
    person,
    project,
    isRequired,
    req
  ) {
  this.log.logArguments('insertProjectPerson', {person, project, isRequired});

  const id = await knex('project_person')
    .insert({
      active: true,
      role_cd: person.roleCode,
      person_id: person.personId,
      source_person_type: person.sourcePersonType,
      project_id: project.id,
      notified: isRequired
    }, 'id');
  this.log.logVariable({id});

  person.notified = false;

  if (isRequired) {
    await ProjectDB.sendNotification(
      knex,
      person,
      project,
      req.dbInfo,
      req.hostname,
      req.userInfo
    );
    await ProjectDB.updateDisclosureStatus(knex, person, isRequired);
  }

  return parseInt(id[0]);
};

ProjectDB.deactivateProjectPerson = async function(
    knex,
    person,
    projectId,
    req
  ) {
  this.log.logArguments('deactivateProjectPerson', {person, projectId});

  await knex('project_person')
    .update('active', false)
    .where({
      person_id: person.personId,
      source_person_type: person.source_person_type,
      project_id: projectId
    });
  await ProjectDB.revertDisclosureStatus(knex, person, req, projectId);
};

ProjectDB.deactivateProjectPersons = async function(
    knex,
    existingPersons,
    persons,
    projectId,
    req
  ) {
  this.log.logArguments(
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
  this.log.logVariable({filtered});

  for (const result of filtered) {
    await ProjectDB.deactivateProjectPerson(knex, result, projectId, req);
  }
};

ProjectDB.updateAllProjectPersons = async function(knex, req) {
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
  this.log.logVariable({projects});

  for (const project of projects) {
    project.sponsors = await ProjectDB.getSponsorsForProjects(
      knex,
      [project.id]
    );
    const projSponsors = project.sponsors;
    this.log.logVariable({projSponsors});

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
    this.log.logVariable({existingPersons});
    project.persons = existingPersons;

    for (const person of existingPersons) {
      const isRequired = await ProjectDB.isProjectRequired(
        req,
        project,
        person
      );
      this.log.logVariable({isRequired});

      await ProjectDB.updateProjectPerson(
        knex,
        person,
        project,
        isRequired,
        person.new,
        req
      );
    }
  }
};

ProjectDB.saveProjectPersons = async function(knex, project, req) {
  this.log.logArguments('saveProjectPersons', {project});

  const existingPersons = await knex
    .select('person_id as personId', 'source_person_type', 'new', 'notified')
    .from('project_person')
    .where('project_id', project.id);

  this.log.logVariable({existingPersons});

  if (project.persons && project.persons.length > 0) {
    await ProjectDB.deactivateProjectPersons(
      knex,
      existingPersons,
      project.persons,
      project.id,
      req
    );

    for (const person of project.persons) {
      const isRequired = await ProjectDB.isProjectRequired(
        req,
        project,
        person
      );
      this.log.logVariable({isRequired});

      const existingPerson = existingPersons.find(pr => {
        return (
          pr.personId === person.personId &&
          pr.source_person_type === person.sourcePersonType
        );
      });
      this.log.logVariable({existingPerson});

      if (existingPerson) {
        person.notified = existingPerson.notified;

        await ProjectDB.updateProjectPerson(
          knex,
          person,
          project,
          isRequired,
          existingPerson.new,
          req
        );
      }
      else {
        await ProjectDB.insertProjectPerson(
          knex,
          person,
          project,
          isRequired,
          req
        );
      }
    }

    return;
  }

  this.log.logVariable({existingPersons});
  if (existingPersons.length > 0) {
    await ProjectDB.disableAllPersonsForProject(knex, project.id, req);
  }
};

ProjectDB.insertProject = async function(knex, project) {
  this.log.logArguments('insertProject', {project});

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
};

ProjectDB.saveNewProjects = async function(knex, project, req) {
  this.log.logArguments('saveNewProjects', {project});

  project.id = await ProjectDB.insertProject(knex, project);
  this.log.logValue('project.id', project.id);

  if (project.sponsors) {
    let {sponsors} = project;
    if (sponsors === null || sponsors === undefined) {
      sponsors = [];
    }
    await ProjectDB.updateProjectSponsors(knex, project.id, sponsors);
  }

  if (project.persons && Array.isArray(project.persons)) {
    for (const person of project.persons) {
      const isRequired = await ProjectDB.isProjectRequired(
        req,
        project,
        person
      );
      this.log.logVariable({isRequired});

      const id = await ProjectDB.insertProjectPerson(
        knex,
        person,
        project,
        isRequired,
        req
      );
      this.log.logVariable({id});
      person.id = id;
    }
  }
  return project;
};

ProjectDB.saveExistingProject = async function(knex, project, authHeader) {
  this.log.logArguments('saveExistingProject', {project});

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
  await ProjectDB.updateProjectSponsors(knex, project.id, sponsors);
  await ProjectDB.saveProjectPersons(knex, project, authHeader);
};

ProjectDB.getExistingProject = async function(knex, project) {
  this.log.logArguments('getExistingProject', {project});

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
  this.log.logVariable({existingProject});

  return existingProject;
};

ProjectDB.getPeopleWhoChanged = async function(knex, project) {
  this.log.logArguments('getPeopleWhoChanged', {project});

  const currentPeople = await knex
    .select(
      'person_id as personId',
      'role_cd as roleCode'
    )
    .from('project_person')
    .where({
      project_id: project.id,
      active: true
    });
  this.log.logVariable({currentPeople});

  if (!project.persons) {
    return currentPeople.map(person => person.personId);
  }

  const result = [];
  for (const person of currentPeople) {
    const newPerson = project.persons.find(p => p.personId == person.personId);
    this.log.logVariable({newPerson});

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
};

ProjectDB.didSponsorsChange = async function(knex, project) {
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
};

ProjectDB.saveProject = async function(knex, req, project) {
  this.log.logArguments('saveProject', {project});

  const existingProject = await ProjectDB.getExistingProject(knex, project);
  this.log.logVariable({existingProject});

  if (existingProject) {
    project.id = existingProject.id;
    project.isNewProject = false;
    project.peopleWhoChanged = await ProjectDB.getPeopleWhoChanged(
      knex,
      project
    );
    project.sponsorsChanged = await ProjectDB.didSponsorsChange(knex, project);

    if (project.sourceStatus != existingProject.sourceStatus) {
      project.statusChange = true;
    }

    return await ProjectDB.saveExistingProject(knex, project, req);
  }
  project.isNewProject = true;
  return await ProjectDB.saveNewProjects(knex, project, req);
};

ProjectDB.getDisclosureStatusForUser = async function(knex, user_id) {
  this.log.logArguments('getDisclosureStatusForUser', {user_id});

  if (!Number.isInteger(user_id) && typeof user_id !== 'string') {
    throw Error('invalid user id');
  }

  return await knex
    .first('ds.description as status', 'd.id')
    .from('disclosure as d')
    .innerJoin('disclosure_status as ds', 'ds.status_cd', 'd.status_cd')
    .where({user_id});
};

ProjectDB.projectHasDeclarations = async function(
    knex,
    disclosure_id,
    project_id
  ) {
  this.log.logArguments('projectHasDeclarations', {disclosure_id, project_id});

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
  this.log.logVariable({declarationRecord});

  if (declarationRecord) {
    return true;
  }
  return false;
};

ProjectDB.disclosureHasEntities = async function(knex, disclosure_id) {
  this.log.logArguments('disclosureHasEntities', {disclosure_id});

  if (!Number.isInteger(disclosure_id)) {
    throw Error('invalid disclosure id');
  }

  const entityRecord = await knex
    .first('id')
    .from('fin_entity')
    .where({disclosure_id});
  this.log.logVariable(entityRecord);

  if (entityRecord) {
    return true;
  }
  return false;
};

ProjectDB.getStatus = async function(knex, projectPerson, dbInfo, authHeader) {
  this.log.logArguments('getStatus', {projectPerson});

  const {
    disposition,
    person_id: userId,
    disclosureId,
    projectId
  } = projectPerson;

  const disclosureInfo = {
    userId,
    disposition: disposition ? disposition : NO_DISPOSITION_DESCRIPTION,
    annualDisclosureStatus: projectPerson.disclosureStatus
  };

  const isRequired = await ProjectService.isProjectRequired(
    dbInfo,
    projectPerson,
    authHeader
  );
  this.log.logVariable({isRequired});

  if (!isRequired) {
    disclosureInfo.status = DISCLOSURE_NOT_REQUIRED;
    return disclosureInfo;
  }

  const disclosureRecord = await ProjectDB.getDisclosureStatusForUser(
    knex,
    userId
  );
  this.log.logVariable({disclosureRecord});
  if (!disclosureRecord) {
    disclosureInfo.status = NOT_YET_DISCLOSED;
    return disclosureInfo;
  }

  const hasDeclarations = await ProjectDB.projectHasDeclarations(
    knex,
    disclosureId,
    projectId
  );
  this.log.logVariable({hasDeclarations});
  const hasEntities = await ProjectDB.disclosureHasEntities(
    knex,
    disclosureRecord.id
  );
  this.log.logVariable({hasEntities});
  const shouldUseDisclosuresStatus = hasDeclarations || !hasEntities;
  if (shouldUseDisclosuresStatus) {
    disclosureInfo.status = UP_TO_DATE;
  } else {
    disclosureInfo.status = UPDATE_NEEDED;
  }
  return disclosureInfo;
};

ProjectDB.getProjectInfos = async function(
    knex,
    sourceSystem,
    sourceIdentifier,
    personId
  ) {
  this.log.logArguments(
    'getProjectInfos',
    {sourceSystem, sourceIdentifier, personId}
  );

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
      'd.status_cd as disclosureStatusCd',
      'p.type_cd as typeCd',
      'pp.role_cd as roleCd',
      'dt.description as disposition'
    )
    .from('project as p')
    .innerJoin('project_person as pp', 'p.id', 'pp.project_id')
    .leftJoin('disclosure as d', 'd.user_id', 'pp.person_id')
    .leftJoin('disposition_type as dt', 'dt.type_cd', 'pp.disposition_type_cd')
    .where(criteria);
  this.log.logVariable({projectInfos});

  if (projectInfos.length === 0) {
    return [];
  }

  const projectIds = projectInfos.map(project => project.projectId);
  const uniqueProjectIds = uniq(projectIds);

  const sponsors = await ProjectDB.getSponsorsForProjects(
    knex,
    uniqueProjectIds
  );
  this.log.logVariable({sponsors});
  projectInfos = ProjectDB.associateSponsorsWithProject(sponsors, projectInfos);

  for (const projectInfo of projectInfos) {
    if (!projectInfo.disclosureStatusCd) {
      projectInfo.disclosureStatus = NOT_YET_DISCLOSED;
    }
    else {
      const disclosureStatus = await knex
        .select('description as status')
        .from('disclosure_status')
        .where({status_cd: projectInfo.disclosureStatusCd});
      projectInfo.disclosureStatus = disclosureStatus[0].status;
    }
  }

  return projectInfos;
};

ProjectDB.getProjectStatuses = async function(
    dbInfo,
    knex,
    sourceSystem,
    sourceIdentifier,
    authHeader
  ) {
  this.log.logArguments('getProjectStatuses', {sourceSystem, sourceIdentifier});

  const projectInfos = await ProjectDB.getProjectInfos(
    knex,
    sourceSystem,
    sourceIdentifier
  );
  this.log.logVariable({projectInfos});
  const results = [];
  if (Array.isArray(projectInfos)) {
    for (const projectInfo of projectInfos) {
      results.push(
        await ProjectDB.getStatus(knex, projectInfo, dbInfo, authHeader)
      );
    }
  }
  return results;
};

ProjectDB.getProjectStatus = async function(
    dbInfo,
    knex,
    sourceSystem,
    sourceIdentifier,
    personId,
    authHeader
  ) {
  this.log.logArguments(
    'getProjectStatus',
    {sourceSystem, sourceIdentifier, personId}
  );

  const projectInfos = await ProjectDB.getProjectInfos(
    knex,
    sourceSystem,
    sourceIdentifier,
    personId
  );
  this.log.logVariable({projectInfos});

  if (projectInfos[0]) {
    return await ProjectDB.getStatus(knex, projectInfos[0], dbInfo, authHeader);
  }

  return {};
};

ProjectDB.updateProjectPersonDispositionType = async function(
    knex,
    projectPerson,
    id
  ) {
  this.log.logArguments(
    'updateProjectPersonDispositionType',
    {projectPerson, id}
  );

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
};

ProjectDB.updateProjectSponsors = async function(knex, project_id, sponsors) {
  this.log.logArguments('updateProjectSponsors', {project_id, sponsors});

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
  this.log.logVariable({existingSponsors});

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
    this.log.logVariable({toDelete});
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
    this.log.logVariable({toAdd});
    await knex('project_sponsor').insert(toAdd);
  }
};

addLoggers({ProjectDB});
