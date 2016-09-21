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

/* eslint {max-len: [2, 80]} */

import assert from 'assert';
import * as ProjectDB from '../../../server/db/project-db';
import {
  RELATIONSHIP_STATUS,
  DISCLOSURE_TYPE,
  DISCLOSURE_STATUS
} from '../../../coi-constants';
import { randomInteger, asyncThrows } from '../../test-utils';
import getKnex from '../../../server/db/connection-manager';

const knex = getKnex({});

async function setConfig(config) {
  const newConfigRow = await knex('config')
    .insert({config}, 'id');

  return newConfigRow[0];
}

async function deleteConfig(id) {
  return await knex('config')
    .del()
    .where({id});
}

async function setNoEntityConfig(value) {
  return await setConfig(`
    {
      "general": {
        "disableNewProjectStatusUpdateWhenNoEntities": ${value}
      }
    }`
  );
}

describe('Project DB', () => {
  describe('getSponsorsForProjects', () => {
    const sponsorIds = [];
    let projectId;

    before(async function() {
      const projectRow = await knex('project')
        .insert({
          type_cd: 1,
          source_system: 'ss',
          source_identifier: 'si'
        }, 'id');
      projectId = projectRow[0];
      
      let sponsorRow = await knex('project_sponsor')
        .insert({
          project_id: projectId,
          source_system: 'ss',
          source_identifier: 'si',
          sponsor_cd: 'sc1',
          sponsor_name: 'sn1'
        }, 'id');
      sponsorIds.push(sponsorRow[0]);

      sponsorRow = await knex('project_sponsor')
        .insert({
          project_id: projectId,
          source_system: 'ss',
          source_identifier: 'si',
          sponsor_cd: 'sc2',
          sponsor_name: 'sn2'
        }, 'id');
      sponsorIds.push(sponsorRow[0]);
    });

    after(async function() {
      await knex('project_sponsor')
        .del()
        .whereIn('id', sponsorIds);

      await knex('project')
        .del()
        .where('id', projectId);
    });

    it('should return the correct sponsors', async function() {
      const result = await ProjectDB.getSponsorsForProjects(knex, [projectId]);
      assert.equal(result.length, 2);
      assert.equal(result[0].projectId, projectId);
    });

    it('should return no sponsors for an invalid project id', async function() {
      const result = await ProjectDB.getSponsorsForProjects(knex, [9897878]);
      assert.equal(result.length, 0);
    });

    it('should throw an error on an invalid argument', async function() {
      assert(
        await asyncThrows(ProjectDB.getSponsorsForProjects, knex, 'foo')
      );
    });
  });

  describe('getActiveProjectsForUser', () => {
    let projectPersonId;
    let projectId;
    const person_id = randomInteger();

    before(async function() {
      const projectRow = await knex('project')
        .insert({
          type_cd: 1,
          source_system: 'ss',
          source_identifier: 'si'
        }, 'id');
      projectId = projectRow[0];
      
      const personRow = await knex('project_person')
        .insert({
          project_id: projectId,
          person_id,
          source_person_type: 'spt',
          role_cd: 'rc',
          active: true,
          new: true
        }, 'id');
      projectPersonId = personRow[0];
    });

    after(async function() {
      await knex('project_person')
        .del()
        .where('id', projectPersonId);

      await knex('project')
        .del()
        .where('id', projectId);
    });

    it('should return correct projects', async function() {
      let result = await ProjectDB.getActiveProjectsForUser(knex, person_id);
      assert.equal(result.length, 1);
      assert.equal(result[0].id, projectId);

      result = await ProjectDB.getActiveProjectsForUser(knex, 9393833);
      assert.equal(result.length, 0);
    });

    it('should throw on invalid argument', async function() {
      assert(
        await asyncThrows(ProjectDB.getActiveProjectsForUser, knex, {})
      );
    });
  });

  describe('associateSponsorsWithProject', () => {
    it('should associate correctly', () => {
      const sponsors = [
        {
          projectId: 1,
          name: 'sponsor 1'
        },
        {
          projectId: 2,
          name: 'sponsor 2'
        },
        {
          projectId: 3,
          name: 'sponsor 3'
        }
      ];
      const projects = [
        {
          id: 1,
          name: 'project 1'
        },
        {
          id: 2,
          name: 'project 2'
        },
        {
          id: 3,
          name: 'project 3'
        },
        {
          id: 4,
          name: 'project 4'
        }
      ];

      const result = ProjectDB.associateSponsorsWithProject(sponsors, projects);
      assert.equal(result[0].sponsors.length, 1);
      assert.equal(result[1].sponsors.length, 1);
      assert.equal(result[2].sponsors.length, 1);
      assert.equal(result[3].sponsors, undefined);
      assert.equal(result[0].sponsors[0].name, 'sponsor 1');
      assert.equal(result[1].sponsors[0].name, 'sponsor 2');
      assert.equal(result[2].sponsors[0].name, 'sponsor 3');
    });

    it('should throw on invalid arguments', () => {
      assert.throws(() => {
        ProjectDB.associateSponsorsWithProject([], 'foo');
      });

      assert.throws(() => {
        ProjectDB.associateSponsorsWithProject('bar', []);
      });
    });
  });

  describe('getProjects', () => {
    let project_id;
    const sponsorIds = [];
    const user_id = randomInteger();
    let projectPersonId;

    before(async function() {
      const projectRow = await knex('project')
        .insert({
          type_cd: 1,
          source_system: 'ss',
          source_identifier: 'si'
        }, 'id');
      project_id = projectRow[0];
      
      let sponsorRow = await knex('project_sponsor')
        .insert({
          project_id,
          source_system: 'ss',
          source_identifier: 'si',
          sponsor_cd: 'sc1',
          sponsor_name: 'sn1'
        }, 'id');
      sponsorIds.push(sponsorRow[0]);

      sponsorRow = await knex('project_sponsor')
        .insert({
          project_id,
          source_system: 'ss',
          source_identifier: 'si',
          sponsor_cd: 'sc2',
          sponsor_name: 'sn2'
        }, 'id');
      sponsorIds.push(sponsorRow[0]);

      const personRow = await knex('project_person')
        .insert({
          project_id,
          person_id: user_id,
          source_person_type: 'spt',
          role_cd: 'role',
          active: true,
          new: true
        }, 'id');
      projectPersonId = personRow[0];
    });

    after(async function() {
      await knex('project_sponsor')
        .del()
        .whereIn('id', sponsorIds);

      await knex('project_person')
        .del()
        .whereIn('id', [projectPersonId]);

      await knex('project')
        .del()
        .where('id', project_id);
    });

    it('should return the correct projects', async function() {
      const result = await ProjectDB.getProjects(knex, user_id);
      assert.equal(result.length, 1);
      assert.equal(result[0].id, project_id);
    });

    it('should return no project for an invalid user id', async function() {
      const result = await ProjectDB.getProjects(knex, 989898989);
      assert.equal(result.length, 0);
    });

    it('should have correct sponsors on the projects', async function() {
      const result = await ProjectDB.getProjects(knex, user_id);
      assert.equal(result[0].sponsors.length, 2);
      assert.equal(result[0].sponsors[0].sponsorName, 'sn1');
    });
  });

  describe('shouldUpdateStatus', () => {
    it(
      'should always return true if the "no entities" config is off',
      async function() {
        const configId = await setNoEntityConfig(false);
        assert.equal(await ProjectDB.shouldUpdateStatus(knex, 3), true);
        await deleteConfig(configId);
      }
    );

    it(
      'should return true if the "no entities" config is on and there are entities', // eslint-disable-line max-len
      async function() {
        const configId = await setNoEntityConfig(true);

        const disclosureId = await knex('disclosure')
          .insert({
            type_cd: DISCLOSURE_TYPE.ANNUAL,
            status_cd: DISCLOSURE_STATUS.UP_TO_DATE,
            user_id: randomInteger(),
            start_date: new Date(),
            config_id: configId
          }, 'id');
        const entityId = await knex('fin_entity')
          .insert({
            disclosure_id: disclosureId[0],
            active: true,
            name: 'test entity',
            status: RELATIONSHIP_STATUS.PENDING
          }, 'id');

        assert.equal(
          await ProjectDB.shouldUpdateStatus(knex, disclosureId[0]),
          true
        );

        await knex('fin_entity')
          .del()
          .where({id: entityId[0]});
        await knex('disclosure')
          .del()
          .where({id: disclosureId[0]});
        await deleteConfig(configId);
      }
    );

    it(
      'should return false if the "no entities" config is on and there are no entities', // eslint-disable-line max-len
      async function() {
        const configId = await setNoEntityConfig(true);

        const disclosureId = randomInteger();
        assert.equal(
          await ProjectDB.shouldUpdateStatus(knex, disclosureId),
          false
        );
        await deleteConfig(configId);
      }
    );

    it('should throw errors for invalid parameters', async function() {
      assert(
        await asyncThrows(ProjectDB.shouldUpdateStatus, knex, 'foo')
      );
    });
  });

  describe('getDisclosureForUser', () => {
    let disclosureId;
    let configId;
    const user_id = randomInteger();
    before(async function() {
      configId = await setConfig('{}');
      const disclosureRow = await knex('disclosure')
        .insert({
          type_cd: DISCLOSURE_TYPE.ANNUAL,
          status_cd: DISCLOSURE_STATUS.IN_PROGRESS,
          user_id,
          start_date: new Date(),
          config_id: configId
        }, 'id');
      disclosureId = disclosureRow[0];
    });

    after(async function() {
      await knex('disclosure')
        .del()
        .where({id: disclosureId});

      await deleteConfig(configId);
    });

    it('should throw given invalid arguments', async function() {
      assert(
        await asyncThrows(ProjectDB.getDisclosureForUser, knex, {})
      );
    });

    it('should return undefined if user has no disclosure', async function() {
      const result = await ProjectDB.getDisclosureForUser(knex, 9999);
      assert.equal(result, undefined);
    });

    it('should return the correct disclosure', async function() {
      const result = await ProjectDB.getDisclosureForUser(knex, user_id);
      assert.notEqual(result, undefined);
      assert.equal(result.typeCd, DISCLOSURE_TYPE.ANNUAL);
      assert.equal(result.id, disclosureId);
    });
  });

  describe('markDisclosureAsUpToDate', async function() {
    let configId;
    const user_id1 = randomInteger();
    const user_id2 = randomInteger();
    const disclosures = [];

    before(async function() {
      configId = await setConfig('{}');
      let disclosureRow = await knex('disclosure')
        .insert({
          type_cd: DISCLOSURE_TYPE.ANNUAL,
          status_cd: DISCLOSURE_STATUS.UPDATE_REQUIRED,
          user_id: user_id1,
          start_date: new Date(),
          config_id: configId
        }, 'id');
      disclosures.push(disclosureRow[0]);

      disclosureRow = await knex('disclosure')
        .insert({
          type_cd: DISCLOSURE_TYPE.ANNUAL,
          status_cd: DISCLOSURE_STATUS.UPDATE_REQUIRED,
          user_id: user_id2,
          start_date: new Date(),
          config_id: configId
        }, 'id');
      disclosures.push(disclosureRow[0]);
    });

    after(async function() {
      await knex('disclosure')
        .del()
        .whereIn('id', disclosures);

      await deleteConfig(configId);
    });

    it('should mark the correct disclosure', async() => {
      await ProjectDB.markDisclosureAsUpToDate(knex, user_id2);

      let disclosureRow = await knex
        .first('status_cd')
        .from('disclosure')
        .where('user_id', user_id1);

      assert.equal(disclosureRow.status_cd, DISCLOSURE_STATUS.UPDATE_REQUIRED);

      disclosureRow = await knex
        .first('status_cd')
        .from('disclosure')
        .where('user_id', user_id2);

      assert.equal(disclosureRow.status_cd, DISCLOSURE_STATUS.UP_TO_DATE);
    });

    it('should throw an invalid arguments', async function() {
      assert(
        await asyncThrows(ProjectDB.markDisclosureAsUpToDate, knex, {})
      );
    });
  });

  describe('deactivateAllProjectPeople', () => {
    let project_id;
    const personIds = [];

    before(async function() {
      const projectRow = await knex('project')
        .insert({
          type_cd: 1,
          source_system: 'ss',
          source_identifier: 'si'
        }, 'id');
      project_id = projectRow[0];

      let person_id = await knex('project_person')
        .insert({
          project_id,
          person_id: 9991,
          source_person_type: 'spt',
          role_cd: 'rc',
          active: true,
          new: true
        });
      personIds.push(person_id[0]);

      person_id = await knex('project_person')
        .insert({
          project_id,
          person_id: 9992,
          source_person_type: 'spt',
          role_cd: 'rc',
          active: true,
          new: true
        });
      personIds.push(person_id[0]);
    });

    after(async function() {
      await knex('project_person')
        .del()
        .whereIn('id', personIds);

      await knex('project')
        .del()
        .where('id', project_id);
    });

    it('should deactivate all the right project persons', async function() {
      await ProjectDB.deactivateAllProjectPeople(knex, project_id);

      const result = await knex
        .count('project_id as count')
        .from('project_person')
        .where({
          active: true,
          project_id
        });

      assert.equal(result[0].count, 0);
    });

    it('should throw an invalid arguments', async function() {
      assert(
        await asyncThrows(ProjectDB.deactivateAllProjectPeople, knex, 'foo')
      );
    });
  });

  describe('updateProjectPersonDispositionType', () => {
    let project_id;
    const personIds = [];

    before(async function() {
      const projectRow = await knex('project')
        .insert({
          type_cd: 1,
          source_system: 'ss',
          source_identifier: 'si'
        }, 'id');
      project_id = projectRow[0];

      await knex('disposition_type')
        .insert([
          {
            type_cd: 1,
            order: 1,
            active: true
          },
          {
            type_cd: 99,
            order: 2,
            active: true
          }
        ]);

      let person_id = await knex('project_person')
        .insert({
          project_id,
          person_id: 9991,
          source_person_type: 'spt',
          role_cd: 'rc',
          active: true,
          new: true,
          disposition_type_cd: 1
        });
      personIds.push(person_id[0]);

      person_id = await knex('project_person')
        .insert({
          project_id,
          person_id: 9992,
          source_person_type: 'spt',
          role_cd: 'rc',
          active: true,
          new: true,
          disposition_type_cd: 1
        });
      personIds.push(person_id[0]);
    });

    after(async function() {
      await knex('project_person')
        .del()
        .whereIn('id', personIds);

      await knex('disposition_type')
        .del()
        .whereIn('type_cd', [1, 99]);

      await knex('project')
        .del()
        .where('id', project_id);
    });

    it('should throw errors on invalid arguments', async function() {
      assert(
        await asyncThrows(ProjectDB.updateProjectPersonDispositionType, 'f', 2)
      );

      assert(
        await asyncThrows(ProjectDB.updateProjectPersonDispositionType, {}, 'f')
      );
    });

    it('should update disposition type correctly to null', async function() {
      await ProjectDB.updateProjectPersonDispositionType(
        knex,
        {},
        personIds[0]
      );

      const personRow = await knex
        .first('disposition_type_cd')
        .from('project_person')
        .where('id', personIds[0]);

      assert.equal(personRow.disposition_type_cd, null);
    });

    it('should update disposition type correctly', async function() {
      await ProjectDB.updateProjectPersonDispositionType(
        knex,
        {dispositionTypeCd: 99},
        personIds[0]
      );

      const personRow = await knex
        .first('disposition_type_cd')
        .from('project_person')
        .where('id', personIds[0]);

      assert.equal(personRow.disposition_type_cd, 99);
    });

    it('should not update disposition for other people', async function() {
      await ProjectDB.updateProjectPersonDispositionType(
        knex,
        {dispositionTypeCd: 99},
        personIds[0]
      );

      const personRow = await knex
        .first('disposition_type_cd')
        .from('project_person')
        .where('id', personIds[1]);

      assert.equal(personRow.disposition_type_cd, 1);
    });
  });

  describe('getProjectInfos', () => {
    let project_id;
    let disclosureId;
    let disposition_type_cd;
    let configId;
    const personIds = [];
    const user1Id = randomInteger();
    const user2Id = randomInteger();
    const sponsors = [];

    before(async function() {
      const projectRow = await knex('project')
        .insert({
          type_cd: 1,
          source_system: 'ss',
          source_identifier: 'si',
          source_status: 'src status'
        }, 'id');
      project_id = projectRow[0];

      const dispositionTypeRow = await knex('disposition_type')
        .insert([
          {
            order: 1,
            active: true,
            description: 'the disposition type'
          }
        ], 'type_cd');
      disposition_type_cd = dispositionTypeRow[0];

      let person_id = await knex('project_person')
        .insert({
          project_id,
          person_id: user1Id,
          source_person_type: 'spt',
          role_cd: 'rc',
          active: true,
          new: true,
          disposition_type_cd
        });
      personIds.push(person_id[0]);

      person_id = await knex('project_person')
        .insert({
          project_id,
          person_id: user2Id,
          source_person_type: 'spt',
          role_cd: 'rc',
          active: true,
          new: true,
          disposition_type_cd
        });
      personIds.push(person_id[0]);

      configId = await setConfig('{}');

      const disclosureRow = await knex('disclosure')
        .insert({
          type_cd: DISCLOSURE_TYPE.ANNUAL,
          status_cd: DISCLOSURE_STATUS.IN_PROGRESS,
          user_id: user1Id,
          start_date: new Date(),
          config_id: configId
        }, 'id');
      disclosureId = disclosureRow[0];

      let sponsorRow = await knex('project_sponsor')
        .insert({
          project_id,
          source_system: 'ss',
          source_identifier: 'si',
          sponsor_cd: 'sc',
          sponsor_name: 'sn'
        },
        'id'
      );
      sponsors.push(sponsorRow[0]);

      sponsorRow = await knex('project_sponsor')
        .insert({
          project_id,
          source_system: 'ss2',
          source_identifier: 'si2',
          sponsor_cd: 'sc2',
          sponsor_name: 'sn2'
        },
        'id'
      );
      sponsors.push(sponsorRow[0]);
    });

    after(async function() {
      await knex('project_sponsor')
        .del()
        .whereIn('id', sponsors);

      await knex('disclosure')
        .del()
        .where('id', disclosureId);

      await deleteConfig(configId);

      await knex('project_person')
        .del()
        .whereIn('id', personIds);

      await knex('disposition_type')
        .del()
        .whereIn('type_cd', disposition_type_cd);

      await knex('project')
        .del()
        .where('id', project_id);
    });

    it('should have the sponsors on each info', async function() {
      const results = await ProjectDB.getProjectInfos(
        knex,
        'ss',
        'si'
      );

      for (const result of results) {
        assert(result.sponsors !== undefined);
        assert.equal(result.sponsors.length, 2);
      }
    });

    it('should have the correct properties', async function() {
      const results = await ProjectDB.getProjectInfos(
        knex,
        'ss',
        'si'
      );

      for (const result of results) {
        assert.equal(result.id, project_id, 'project id doesnt match');
        assert.equal(result.projectId, project_id, 'project id doesnt match');
        assert(
          result.disclosureId === disclosureId || result.disclosureId === null,
          'disclosure id doesnt match'
        );
        assert.equal(result.statusCd, 'src status', 'status code doesnt match');
        assert.equal(result.roleCd, 'rc', 'role code doesnt match');
        assert.equal(
          result.disposition,
          'the disposition type',
          'disposition doesnt match'
        );
      }
    });

    it('should return nothing for invalid source system', async function() {
      const results = await ProjectDB.getProjectInfos(
        knex,
        'ss foo',
        'si'
      );

      assert.equal(results.length, 0);
    });

    it(
      'should return nothing for an invalid source identifier',
      async function() {
        const results = await ProjectDB.getProjectInfos(
          knex,
          'ss',
          'si bar'
        );

        assert.equal(results.length, 0);
      }
    );

    it('should restrict appropriately based on user', async function() {
      let results = await ProjectDB.getProjectInfos(
        knex,
        'ss',
        'si',
        user2Id
      );

      assert.equal(results.length, 1);

      results = await ProjectDB.getProjectInfos(
        knex,
        'ss',
        'si',
        98989898989
      );

      assert.equal(results.length, 0);
    });
  });

  describe('insertProject', () => {
    let projectId;

    after(async function() {
      await knex('project')
        .del()
        .where('id', projectId);
    });

    it('should throw errors on invalid args', async function() {
      assert(await asyncThrows(ProjectDB.insertProject, knex, 'foo'));
      assert(await asyncThrows(ProjectDB.insertProject, knex, {}));
    });

    it('should insert the project', async function() {
      projectId = await ProjectDB.insertProject(knex, {
        title: 'insertProjectTest',
        typeCode: 1,
        sourceSystem: 'ss',
        sourceIdentifier: 'si',
        sourceStatus: 'sta',
        startDate: 23434343,
        endDate: 55555555
      });

      const projRows = await knex
        .select('title')
        .from('project')
        .where('id', projectId);

      assert.equal(projRows[0].title, 'insertProjectTest');
    });
  });

  describe('getExistingProjectId', () => {
    let project_id;

    before(async function() {
      const projectRow = await knex('project')
        .insert({
          type_cd: 1,
          source_system: 'ss3',
          source_identifier: 'si',
          source_status: 'src status'
        }, 'id');
      project_id = projectRow[0];
    });

    after(async function() {
      await knex('project')
        .del()
        .where('id', project_id);
    });

    it('should return the correct id', async function() {
      const result = await ProjectDB.getExistingProjectId(
        knex,
        {
          sourceSystem: 'ss3',
          sourceIdentifier: 'si'
        }
      );

      assert.equal(result, project_id);
    });

    it('should throw an error with invalid arguments', async function() {
      assert(
        await asyncThrows(ProjectDB.getExistingProjectId, 'foo')
      );
    });
  });

  describe('getDisclosureStatusForUser', () => {
    let disclosureId;
    let configId;
    const user_id = randomInteger();

    before(async function() {
      configId = await setConfig('{}');
      const disclosureRow = await knex('disclosure')
        .insert({
          type_cd: DISCLOSURE_TYPE.ANNUAL,
          status_cd: DISCLOSURE_STATUS.IN_PROGRESS,
          user_id,
          start_date: new Date(),
          config_id: configId
        }, 'id');
      disclosureId = disclosureRow[0];
    });

    after(async function() {
      await knex('disclosure')
        .del()
        .where({id: disclosureId});

      await deleteConfig(configId);
    });

    it('should throw given invalid arguments', async function() {
      assert(
        await asyncThrows(ProjectDB.getDisclosureStatusForUser, knex, {})
      );
    });

    it('should return undefined if user has no disclosure', async function() {
      const result = await ProjectDB.getDisclosureStatusForUser(knex, 9999);
      assert.equal(result, undefined);
    });

    it('should return the correct disclosure', async function() {
      const result = await ProjectDB.getDisclosureStatusForUser(knex, user_id);
      assert.notEqual(result, 'In Progress');
      assert.equal(result.id, disclosureId);
    });
  });

  describe('projectHasDeclarations', () => {
    let project_id;
    let disclosure_id;
    let declarationId;
    let config_id;
    let entityId;

    before(async function() {
      const projectRow = await knex('project')
        .insert({
          type_cd: 1,
          source_system: 'ss',
          source_identifier: 'si',
          source_status: 'src status'
        }, 'id');
      project_id = projectRow[0];

      config_id = await setConfig('{}');

      const disclosureRow = await knex('disclosure')
        .insert({
          type_cd: DISCLOSURE_TYPE.ANNUAL,
          status_cd: DISCLOSURE_STATUS.IN_PROGRESS,
          user_id: randomInteger(),
          start_date: new Date(),
          config_id
        }, 'id');
      disclosure_id = disclosureRow[0];

      const entityRow = await knex('fin_entity')
        .insert({
          disclosure_id,
          status: 'stat'
        }, 'id');
      entityId = entityRow[0];

      const declarationRow = await knex('declaration')
        .insert({
          disclosure_id,
          fin_entity_id: entityId,
          project_id
        }, 'id');
      declarationId = declarationRow[0];
    });

    after(async function() {
      await knex('declaration')
        .del()
        .where('id', declarationId);

      await knex('fin_entity')
        .del()
        .where('id', entityId);

      await knex('disclosure')
        .del()
        .where('id', disclosure_id);

      await deleteConfig(config_id);

      await knex('project')
        .del()
        .where('id', project_id);
    });

    it('should throw with invalid arguments', async function() {
      assert(await asyncThrows(ProjectDB.projectHasDeclarations, 'foo', 1));
      assert(await asyncThrows(ProjectDB.projectHasDeclarations, 2, 'foo'));
    });

    it(
      'should correctly determine of a project/disclosure combination has any declarations', // eslint-disable-line max-len
      async function() {
        assert(
          await ProjectDB.projectHasDeclarations(
            knex,
            disclosure_id,
            project_id
          )
        );
        assert(
          !(await ProjectDB.projectHasDeclarations(knex, disclosure_id, 999))
        );
        assert(
          !(await ProjectDB.projectHasDeclarations(knex, 345, project_id))
        );
      }
    );
  });

  describe('disclosureHasEntities', () => {
    let config_id;
    let disclosure_id;
    let entityId;

    before(async function() {
      config_id = await setConfig('{}');

      const disclosureRow = await knex('disclosure')
        .insert({
          type_cd: DISCLOSURE_TYPE.ANNUAL,
          status_cd: DISCLOSURE_STATUS.IN_PROGRESS,
          user_id: randomInteger(),
          start_date: new Date(),
          config_id
        }, 'id');
      disclosure_id = disclosureRow[0];

      const entityRow = await knex('fin_entity')
        .insert({
          disclosure_id,
          status: 'stat'
        }, 'id');
      entityId = entityRow[0];
    });

    after(async function() {
      await knex('fin_entity')
        .del()
        .where('id', entityId);

      await knex('disclosure')
        .del()
        .where('id', disclosure_id);

      await deleteConfig(config_id);
    });

    it('should throw error with invalid arguments', async function() {
      assert(await asyncThrows(ProjectDB.disclosureHasEntities, '3'));
    });

    it('should determine if the disclosure has entities', async function() {
      assert(await ProjectDB.disclosureHasEntities(knex, disclosure_id));
      assert(!(await ProjectDB.disclosureHasEntities(knex, 4545)));
    });
  });

  describe('updateProjectSponsors', () => {
    let project_id;
    const originalSponsorIds = [];

    before(async function() {
      const projectRow = await knex('project')
        .insert({
          type_cd: 1,
          source_system: 'ss',
          source_identifier: 'si'
        }, 'id');
      project_id = projectRow[0];
      
      let sponsorRow = await knex('project_sponsor')
        .insert({
          project_id,
          source_system: 'ss',
          source_identifier: 'si',
          sponsor_cd: 'sc1',
          sponsor_name: 'sn1'
        }, 'id');
      originalSponsorIds.push(sponsorRow[0]);

      sponsorRow = await knex('project_sponsor')
        .insert({
          project_id,
          source_system: 'ss',
          source_identifier: 'si',
          sponsor_cd: 'sc2',
          sponsor_name: 'sn2'
        }, 'id');
      originalSponsorIds.push(sponsorRow[0]);
    });

    after(async function() {
      await knex('project_sponsor')
        .del()
        .where('project_id', project_id);

      await knex('project')
        .del()
        .where('id', project_id);
    });

    it('should throw errors with invalid arguments', async function() {
      assert(
        await asyncThrows(ProjectDB.updateProjectSponsors, 'foo', [])
      );
      assert(
        await asyncThrows(ProjectDB.updateProjectSponsors, 8, 'foo')
      );
    });

    it('should set the sponsors correctly', async function() {
      const newSponsors = [
        {
          sourceSystem: 'ss',
          sourceIdentifier: 'si',
          sponsorCode: 'sc3',
          sponsorName: 'sn3'
        },
        {
          sourceSystem: 'ss',
          sourceIdentifier: 'si',
          sponsorCode: 'sc1',
          sponsorName: 'sn1'
        }
      ];
      await ProjectDB.updateProjectSponsors(knex, project_id, newSponsors);

      const results = await knex
        .select('sponsor_cd')
        .from('project_sponsor')
        .where('project_id', project_id);

      assert.equal(results.length, 2);
      assert(
        results[0].sponsor_cd == 'sc1' || results[0].sponsor_cd == 'sc3'
      );
      assert(
        results[1].sponsor_cd == 'sc1' || results[1].sponsor_cd == 'sc3'
      );
    });
  });
});
