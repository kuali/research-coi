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

/* eslint-disable no-magic-numbers, camelcase */

import { DISCLOSURE_TYPE } from '../coi-constants';

export function createProject(sourceIdentifier) {
  return {
    title: 'TEST TITLE',
    typeCode: 1,
    sourceSystem: 'KC-PD',
    sourceIdentifier,
    sourceStatus: 1,
    sponsors: [
      {
        sponsorCode: '000340',
        sponsorName: 'NIH',
        sourceSystem: 'KC-PD',
        sourceIdentifier
      }
    ],
    startDate: '2017-01-01',
    endDate: '2017-1-31'
  };
}

export async function insertProject(knex, project) {
  const id = await knex('project').insert({
    title: project.title,
    type_cd: project.typeCode,
    source_system: project.sourceSystem,
    source_identifier: project.sourceIdentifier,
    source_status: project.sourceStatus,
    start_date: new Date(project.startDate),
    end_date: new Date(project.endDate)
  }, 'id');

  await knex('project_sponsor').insert({
    project_id: id[0],
    source_identifier: project.sourceIdentifier,
    source_system: project.sourceSystem,
    sponsor_cd: project.sponsors[0].sponsorCode,
    sponsor_name: project.sponsors[0].sponsorName
  });

  return id[0];
}

export function createPerson(personId, roleCode, active) {
  return {
    personId,
    sourcePersonType: 'EMPLOYEE',
    roleCode,
    active
  };
}

export async function insertProjectPerson(knex, projectPerson, projectId, dispositionTypeCd, isNew) {
  const id = await knex('project_person')
    .insert({
      project_id: projectId,
      person_id: projectPerson.personId,
      source_person_type: projectPerson.sourcePersonType,
      role_cd: projectPerson.roleCode,
      active: projectPerson.active,
      disposition_type_cd: dispositionTypeCd,
      new: isNew !== undefined ? isNew : true
    },'id');
  return id[0];
}

export function createDisclosure(statusCd) {
  return {
    typeCd: DISCLOSURE_TYPE.ANNUAL,
    statusCd,
    startDate: new Date(),
    configId: 1
  };
}

export async function insertDisclosure(knex, disclosure, user_id) {
  const id = await knex('disclosure').insert({
    type_cd: disclosure.typeCd,
    status_cd: disclosure.statusCd,
    user_id,
    start_date: new Date(disclosure.startDate),
    config_id: disclosure.configId,
    submitted_by: user_id
  }, 'id');
  return id[0];
}

export function createDeclaration(disclosureId, finEntityId, projectId) {
  return {
    disclosureId,
    finEntityId,
    projectId
  };
}

export async function insertDeclaration(knex, declaration) {
  const id = await knex('declaration').insert({
    disclosure_id: declaration.disclosureId,
    fin_entity_id: declaration.finEntityId,
    project_id: declaration.projectId
  }, 'id');

  return id[0];
}

export function createEntity(disclosureId, status, active) {
  return {
    disclosureId,
    status,
    active
  };
}

export async function insertEntity(knex, entity) {
  const id = await knex('fin_entity')
    .insert({
      disclosure_id: entity.disclosureId,
      status: entity.status,
      active: entity.active
    }, 'id');

  return id[0];
}
