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
import {
  prepareScreeningQuestions,
  prepareEntityQuestions
} from '../../../../../../client/scripts/components/admin/detail-view/disclosure-detail';

describe('admin/detail-view/disclosure-detail', () => {
  describe('prepareScreeningQuestions', () => {
    it('returns the correct order', () => {
      const input = [
        {id: 4, active: 1, question: { order: 4}},
        {id: 3, active: 1, question: { order: 3}},
        {id: 2, active: 1, question: { order: 2}},
        {id: 1, active: 1, question: { order: 1}},
        {id: 5, active: 1, parent: 3, question: { order: 3}},
        {id: 6, active: 1, parent: 3, question: { order: 2}},
        {id: 7, active: 1, parent: 3, question: { order: 1}},
        {id: 8, active: 1, parent: 1, question: { order: 1}}
      ];
      const result = prepareScreeningQuestions(input);
      assert.equal(result[0].id, 1);
      assert.equal(result[2].id, 2);
      assert.equal(result[4].id, 7);
      assert.equal(result[6].id, 5);
    });
  });

  describe('prepareEntityQuestions', () => {
    it('Returns correct order', () => {
      const input = [
        {id: 4, active: 1, question: { order: 4}},
        {id: 3, active: 1, question: { order: 3}},
        {id: 9, active: 0, question: { order: 2}},
        {id: 2, active: 1, question: { order: 2}},
        {id: 1, active: 1, question: { order: 1}}
      ];
      const result = prepareEntityQuestions(input);
      assert.equal(result[1].id, 2);
      assert.equal(result[3].id, 4);
      assert.equal(result.length, 4);
    });
  });
});
