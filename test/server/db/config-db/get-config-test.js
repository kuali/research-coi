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

/*global describe, it */
/* eslint-disable no-magic-numbers, camelcase */

import assert from 'assert';
import * as ConfigDB from '../../../../server/db/config-db';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/connection-manager').default;
}
const knex = getKnex({});

describe('getConfig', () => {
  let config;
  before(async () => {
    await knex('project_role').insert({
      project_type_cd: 1,
      source_role_cd: 'PI',
      req_disclosure: true,
      description: 'Principal Investigator'
    });

    await knex('project_status').insert({
      project_type_cd: 1,
      source_status_cd: 1,
      req_disclosure: true,
      description: 'the status'
    });

    await knex('disposition_type').insert({
      description: 'test',
      order: 0,
      active: 1
    });

    config = await ConfigDB.getConfig({}, 'goblins-tst.kuali.dev');
  });

  describe('matrixTypes', () => {
    it('should get back some matrix types', async () => {
      const matrixType = config.matrixTypes[0];
      assert(matrixType !== undefined);
      assert(matrixType.typeCd !== undefined);
      assert(matrixType.description !== undefined);
      assert(matrixType.enabled !== undefined);
      assert(matrixType.typeEnabled !== undefined);
      assert(matrixType.amountEnabled !== undefined);
      assert(matrixType.destinationEnabled !== undefined);
      assert(matrixType.dateEnabled !== undefined);
      assert(matrixType.reasonEnabled !== undefined);
    });
    it('matrix types should have type options', () => {
      const typeOption = config.matrixTypes[0].typeOptions[0];
      assert(typeOption !== undefined);
      assert(typeOption.typeCd !== undefined);
      assert(typeOption.relationshipCd !== undefined);
      assert(typeOption.description !== undefined);
      assert(typeOption.active !== undefined);
    });
    it('matrix type should have amount options', () => {
      const amountOption = config.matrixTypes[0].amountOptions[0];
      assert(amountOption !== undefined);
      assert(amountOption.typeCd !== undefined);
      assert(amountOption.relationshipCd !== undefined);
      assert(amountOption.description !== undefined);
      assert(amountOption.active !== undefined);
    });
  });

  describe('relationshipPersonTypes', () => {
    it('should get back some person types', () => {
      const type = config.relationshipPersonTypes[0];
      assert.notEqual(undefined, type);
      assert.notEqual(undefined, type.typeCd);
      assert.notEqual(undefined, type.description);
      assert.notEqual(undefined, type.active);
    });
  });

  describe('declarationTypes', () => {
    it('should get back some declaration types', () => {
      const type = config.declarationTypes[0];
      assert.notEqual(undefined, type);
      assert.notEqual(undefined, type.typeCd);
      assert.notEqual(undefined, type.description);
      assert.notEqual(undefined, type.active);
      assert.notEqual(undefined, type.order);
    });
  });

  describe('dispositionTypes', () => {
    it('should get back some disposition types', () => {
      const type = config.dispositionTypes[0];
      assert.notEqual(undefined, type);
      assert.notEqual(undefined, type.typeCd);
      assert.notEqual(undefined, type.description);
      assert.notEqual(undefined, type.active);
      assert.notEqual(undefined, type.order);
    });
  });

  describe('disclosureTypes', () => {
    it('should get back some disclosure types', () => {
      const type = config.disclosureTypes[0];
      assert.notEqual(undefined, type);
      assert.notEqual(undefined, type.typeCd);
      assert.notEqual(undefined, type.description);
      assert.notEqual(undefined, type.enabled);
    });
  });

  describe('questions', () => {
    it('should get back some screening questions', () => {
      const question = config.questions.screening[0];
      assert.notEqual(undefined, question);
      assert.notEqual(undefined, question.id);
      assert.notEqual(undefined, question.active);
      assert.notEqual(undefined, question.questionnaireId);
      assert.equal(null, question.parent);
      assert.notEqual(undefined, question.question);
      assert.notEqual(undefined, question.question.order);
      assert.notEqual(undefined, question.question.text);
      assert.notEqual(undefined, question.question.type);
      assert.notEqual(undefined, question.question.numberToShow);
    });

    it('should get back some questionnaire questions', () => {
      const question = config.questions.screening[0];
      assert.notEqual(undefined, question);
      assert.notEqual(undefined, question.id);
      assert.notEqual(undefined, question.active);
      assert.notEqual(undefined, question.questionnaireId);
      assert.equal(null, question.parent);
      assert.notEqual(undefined, question.question);
      assert.notEqual(undefined, question.question.order);
      assert.notEqual(undefined, question.question.text);
      assert.notEqual(undefined, question.question.type);
      assert.notEqual(undefined, question.question.numberToShow);
    });
  });

  describe('disclosureStatus', () => {
    it('should get back some disclosure statuses', () => {
      const status = config.disclosureStatus[0];
      assert.notEqual(undefined, status);
      assert.notEqual(undefined, status.statusCd);
      assert.notEqual(undefined, status.description);
    });
  });

  describe('projectTypes', () => {
    it('should get back some projectTypes', () => {
      const type = config.projectTypes[0];
      assert.notEqual(undefined, type);
      assert.notEqual(undefined, type.typeCd);
      assert.notEqual(undefined, type.description);
      assert.notEqual(undefined, type.reqDisclosure);
    });
  });

  describe('projectRoles', () => {
    it('should get back some projectTypes', () => {
      const role = config.projectRoles[0];
      assert.notEqual(undefined, role);
      assert.notEqual(undefined, role.typeCd);
      assert.notEqual(undefined, role.projectTypeCd);
      assert.notEqual(undefined, role.sourceRoleCd);
      assert.notEqual(undefined, role.description);
      assert.notEqual(undefined, role.reqDisclosure);
      assert.notEqual(undefined, role.active);
    });
  });

  describe('projectStatuses', () => {
    it('should get back some projectTypes', () => {
      const status = config.projectStatuses[0];
      assert.notEqual(undefined, status);
      assert.notEqual(undefined, status.typeCd);
      assert.notEqual(undefined, status.projectTypeCd);
      assert.notEqual(undefined, status.sourceStatusCd);
      assert.notEqual(undefined, status.description);
      assert.notEqual(undefined, status.reqDisclosure);
      assert.notEqual(undefined, status.active);
    });
  });

  describe('notificationTemplates', () => {
    it('should get back some notification templates', () => {
      const template = config.notificationTemplates[0];
      assert.notEqual(undefined, template);
      assert.notEqual(undefined, template.templateId);
      assert.notEqual(undefined, template.description);
      assert.notEqual(undefined, template.active);
      assert.equal(null, template.coreTemplateId);
      assert.equal(null, template.value);
      assert.equal(null, template.period);
      assert.notEqual(undefined, template.subject);
      assert.notEqual(undefined, template.body);
    });
  });

  describe('general', () => {
    it('should have a notificationsMode', () => {
      assert.notEqual(undefined, config.notificationsMode);
    });
    it('should have a lane', () => {
      assert.notEqual(undefined, config.lane);
    });
    it('should have a general config', () => {
      const general = config.general;
      assert.notEqual(undefined, general);
      assert.notEqual(undefined, general.peopleEnabled);
      assert.notEqual(undefined, general.sponsorLookup);
      assert.notEqual(undefined, general.dueDate);
      assert.notEqual(undefined, general.instructions);
      assert.notEqual(undefined, general.certificationOptions);
      assert.notEqual(undefined, general.certificationOptions.text);
      assert.notEqual(undefined, general.certificationOptions.required);
    });
  });

  after(async function() {
    await knex('project_role').del();
    await knex('project_status').del();
    await knex('disposition_type').del();
  });
});
