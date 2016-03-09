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

import assert from 'assert';
import * as ProjectService from '../../../../server/services/project-service/project-service';

describe('ProjectService', () => {
  describe('getSourceRoleCd', () => {
    const role = {
      protocolPersonRoleId: 'protocolPersonRoleId',
      code: 'code'
    };

    it('if project type is 1 it should get code', () => {
      const roleCd = ProjectService.getSourceRoleCd('1', role);
      assert('code', roleCd);
    });

    it('if project type is 2 it should get code', () => {
      const roleCd = ProjectService.getSourceRoleCd('2', role);
      assert('code', roleCd);
    });

    it('if project type is 3 it should get protocolPersonRoleId', () => {
      const roleCd = ProjectService.getSourceRoleCd('3', role);
      assert('protocolPersonRoleId', roleCd);
    });

    it('if project type is 4 it should get protocolPersonRoleId', () => {
      const roleCd = ProjectService.getSourceRoleCd('4', role);
      assert('protocolPersonRoleId', roleCd);
    });

    it('if project type is 5 it should get code', () => {
      const roleCd = ProjectService.getSourceRoleCd('5', role);
      assert('code', roleCd);
    });
  });

  describe('getSourceStatusCd', () => {
    const proposalStatusCode = 'proposalStatusCode';
    const protocolStatusCode = 'protocolStatusCode';
    const statusCode = 'statusCode';
    const code = 'code';

    const status = {
      proposalStatusCode,
      protocolStatusCode,
      statusCode,
      code
    };

    it('if project type is 1 it should get code', () => {
      const statusCd = ProjectService.getSourceStatusCd('1', status);
      assert.equal(code, statusCd);
    });

    it('if project type is 2 it should get proposalStatusCode', () => {
      const statusCd = ProjectService.getSourceStatusCd('2', status);
      assert.equal(proposalStatusCode, statusCd);
    });

    it('if project type is 3 it should get protocolStatusCode', () => {
      const statusCd = ProjectService.getSourceStatusCd('3', status);
      assert.equal(protocolStatusCode, statusCd);
    });

    it('if project type is 4 it should get protocolStatusCode', () => {
      const statusCd = ProjectService.getSourceStatusCd('4', status);
      assert.equal(protocolStatusCode, statusCd);
    });

    it('if project type is 5 it should get statusCode', () => {
      const statusCd = ProjectService.getSourceStatusCd('5', status);
      assert(statusCode, statusCd);
    });
  });

  describe('filterProposalRoles', () => {


    it('should combine duplicate role codes and include all descriptions in description', () => {
      const roles = [
        {
          sourceRoleCd: 'PI',
          description: 'Principle Investigator'
        },
        {
          sourceRoleCd: 'PI',
          description: 'PI/Contact'
        },
        {
          sourceRoleCd: 'COI',
          description: 'Co-Investigator'
        },
        {
          sourceRoleCd: 'COI',
          description: 'Co-Investigator'
        }
      ];

      const filteredRoles = ProjectService.filterProposalRoles(roles);
      assert.equal(2, filteredRoles.length);
      assert.equal('Principle Investigator, PI/Contact', roles.find(role => String(role.sourceRoleCd) === 'PI').description);
      assert.equal('Co-Investigator', roles.find(role => String(role.sourceRoleCd) === 'COI').description);
    });
  });

  describe('isRequired', () => {

    const requirements = {};
    requirements.roles = [
      {
        projectTypeCd: 1,
        sourceRoleCd: 'PI'
      },
      {
        projectTypeCd: 1,
        sourceRoleCd: 'COI'
      }
    ];
    requirements.types = [
      {typeCd: 1}
    ];
    requirements.statuses = [
      {
        projectTypeCd: 1,
        sourceStatusCd: '1'
      },
      {
        projectTypeCd: 1,
        sourceStatusCd: '2'
      }
    ];
    requirements.sponsors = ['000340','000500'];

    const projects = [
      {
        title: 'good project',
        typeCd: 1,
        roleCd: 'PI',
        statusCd: '1',
        sponsorCd : '000340'
      },
      {
        typeCd: 3,
        roleCd: 'PI',
        statusCd: '1',
        sponsorCd : '000340'
      },
      {
        typeCd: 1,
        roleCd: 'KP',
        statusCd: '1',
        sponsorCd : '000340'
      },
      {
        typeCd: 1,
        roleCd: 'PI',
        statusCd: '4',
        sponsorCd : '000340'
      },
      {
        typeCd: 1,
        roleCd: 'PI',
        statusCd: '1',
        sponsorCd : '000100'
      }
    ];

    it('should return true if type, role, status, and sponsor are required', () => {
      const isRequired = ProjectService.isRequired(requirements, projects[0]);
      assert.equal(true, isRequired);
    });

    it('should return false if type is not required', () => {
      const isRequired = ProjectService.isRequired(requirements, projects[1]);
      assert.equal(false, isRequired);
    });

    it('should return false if role is not required', () => {
      const isRequired = ProjectService.isRequired(requirements, projects[2]);
      assert.equal(false, isRequired);
    });

    it('should return false if status is not required', () => {
      const isRequired = ProjectService.isRequired(requirements, projects[3]);
      assert.equal(false, isRequired);
    });

    it('should return false if sponsor is not required', () => {
      const isRequired = ProjectService.isRequired(requirements, projects[4]);
      assert.equal(false, isRequired);
    });
  });
});
