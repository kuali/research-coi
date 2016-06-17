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
/* eslint-disable no-magic-numbers */

import assert from 'assert';
import * as DisclosureDB from '../../../server/db/disclosure-db';
import { COIConstants } from '../../../coi-constants';
import hashCode from '../../../hash';
import { insertDisclosure, createDisclosure, insertComment, getComment } from '../../test-utils';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../../../server/db/connection-manager').default;
}
const knex = getKnex({});

describe('Disclosure', () => {
  it('expiration date year should equal approval year when approval month day is before expiration month day', () => {
    const expirationDate = DisclosureDB.getExpirationDate(new Date(2015, 3, 1), false, new Date(2001, 6, 31));
    assert.equal(expirationDate.toDateString(), new Date(2015, 6, 31).toDateString());
  });

  it('expiration date year should be approval year plus 1 when approval month day is after expiration month day', () => {
    const expirationDate = DisclosureDB.getExpirationDate(new Date(2015, 8, 1), false, new Date(2001, 6, 31));
    assert.equal(expirationDate.toDateString(), new Date(2016, 6, 31).toDateString());
  });

  it('expiration date year should be approval year plus 1 when rolling date is true', () => {
    const expirationDate = DisclosureDB.getExpirationDate(new Date(2015, 8, 1), true);
    assert.equal(expirationDate.toDateString(), new Date(2016, 8, 1).toDateString());
  });
});

describe('Comments', () => {
  let disclosureId;

  before(async () => {
    disclosureId = await insertDisclosure(knex, createDisclosure(COIConstants.DISCLOSURE_STATUS.IN_PROGRESS), hashCode('cate'));
  });

  after(async () => {
    knex('disclosure').where('id', disclosureId).delete();
  });

  describe('updating', () => {
    let comment;

    beforeEach(async () => {
      const commentId = await insertComment(knex, disclosureId, 'cate', 'This is great!');
      comment = await getComment(knex, commentId);
    });

    afterEach(async () => {
      await knex('comment').where('id', comment.id).delete();
      comment = undefined;
    });

    it('should update the comment', async () => {
      comment.text = 'I really like it.';
      DisclosureDB.updateComment(knex, {coiRole: 'reviewer'}, comment);
      comment = await getComment(knex, comment.id);
      assert.equal(comment.text, 'I really like it.');
    });
  });

  describe('updating another user\'s comment as an admin', () => {
    let comment;

    beforeEach(async () => {
      const commentId = await insertComment(knex, disclosureId, 'cate', 'This is great!');
      comment = await getComment(knex, commentId);
    });

    afterEach(async () => {
      await knex('comment').where('id', comment.id).delete();
      comment = undefined;
    });

    it('should not update the user', async () => {
      comment.piVisible = true;
      DisclosureDB.updateComment(knex, {coiRole: 'admin', firstName: 'Bill'}, comment);
      comment = await getComment(knex, comment.id);

      assert.equal(comment.pi_visible, true);
      assert.equal(comment.author, 'cate');
    });
  });
});
