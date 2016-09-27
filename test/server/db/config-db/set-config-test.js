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
import * as ConfigDB from '../../../../server/db/config-db';
import getKnex from '../../../../server/db/connection-manager';

const knex = getKnex({});

describe('setConfig', () => {
  let parentId;

  describe('insert new question with child', async () => {
    let config;
    let parent;
    let child;
    before(async () => {
      config = await ConfigDB.getConfig({}, knex, 'goblins-tst.kuali.dev');
      config.questions.screening.push({
        question: 'parent',
        active: 1,
        id: 'TMP1234' });

      config.questions.screening.push({
        id: 'TMP5678',
        active: true,
        questionnaire_id: 1,
        parent: 'TMP1234',
        question: 'child'
      });

      config = await ConfigDB.setConfig({}, knex, '1234', config, 'goblins1-tst.kuali.dev');
      parent = config.questions.screening.find(question => question.tmpId === 'TMP1234');
      child = config.questions.screening.find(question => question.tmpId === 'TMP5678');
      parentId = parent.id;
    });

    it('it should return the inserted id for the parent', () => {
      assert(!isNaN(parent.id));
    });

    it('should return the inserted id for the child', () => {
      assert(!isNaN(child.id));
    });

    it('should set the childs parent id as the parents id', () => {
      assert.equal(child.parent, parent.id);
    });
  });

  describe('update question', async () => {
    let config;
    let parent;
    before(async () => {
      config = await ConfigDB.getConfig({}, knex, 'goblins-tst.kuali.dev');
      parent = config.questions.screening.find(question => question.id === parentId);
      parent.question = 'parent1234';
      config = await ConfigDB.setConfig({}, knex, '1234', config, 'goblins1-tst.kuali.dev');
      parent = config.questions.screening.find(question => question.id === parentId);
    });

    it('it should update the question', () => {
      assert.equal('"parent1234"', parent.question);
    });
  });

  describe('deactivate question', async () => {
    let config;
    before(async () => {
      config = await ConfigDB.getConfig({}, knex, 'goblins-tst.kuali.dev');
      const parentIndex = config.questions.screening.findIndex(question => {
        return String(question.id) === String(parentId);
      });
      config.questions.screening.splice(parentIndex,1);
      config = await ConfigDB.setConfig({}, knex, '1234', config, 'goblins1-tst.kuali.dev');
    });

    it('it should update the parent to be inactive', async () => {
      const question = await knex('questionnaire_question')
        .select('active')
        .where({id: parentId});
      assert.equal(0, question[0].active);
    });
  });

  after(async function() {
    await knex('questionnaire_question')
      .del()
      .where('question', 'like', '%child%');
    await knex('questionnaire_question')
      .del()
      .where('question', 'like', '%parent%');
  });
});