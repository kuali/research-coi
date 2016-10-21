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
import * as DisclosureDB from '../../../server/db/disclosure-db';
import { DISCLOSURE_STATUS } from '../../../coi-constants';
import hashCode from '../../../hash';
import { insertDisclosure, createDisclosure, insertComment, getComment } from '../../test-utils';
import getKnex from '../../../server/db/connection-manager';

const knex = getKnex({});

describe('Disclosure', () => {
  it('expiration date year should equal approval year when approval month day is before expiration month day', () => {
    const expirationDate = DisclosureDB.getStaticExpirationDate(new Date(2015, 3, 1), new Date(2001, 6, 31));
    assert.equal(expirationDate.toDateString(), new Date(2015, 6, 31).toDateString());
  });

  it('expiration date year should be approval year plus 1 when approval month day is after expiration month day', () => {
    const expirationDate = DisclosureDB.getStaticExpirationDate(new Date(2015, 8, 1), new Date(2001, 6, 31));
    assert.equal(expirationDate.toDateString(), new Date(2016, 6, 31).toDateString());
  });

  it('rolling expiration date year should be approval year plus 1', () => {
    const expirationDate = DisclosureDB.getRollingExpirationDate(new Date(2015, 8, 1));
    assert.equal(expirationDate.toDateString(), new Date(2016, 8, 1).toDateString());
  });
});

describe('Comments', () => {
  let disclosureId;

  before(async () => {
    disclosureId = await insertDisclosure(knex, createDisclosure(DISCLOSURE_STATUS.IN_PROGRESS), hashCode('cate'));
  });

  after(async () => {
    knex('disclosure')
      .where('id', disclosureId)
      .delete();
  });

  describe('updating', () => {
    let comment;

    beforeEach(async () => {
      const commentId = await insertComment(knex, disclosureId, 'cate', 'This is great!');
      comment = await getComment(knex, commentId);
    });

    afterEach(async () => {
      await knex('pi_review')
        .where('disclosure_id', disclosureId)
        .delete();
      await knex('review_comment')
        .where('id', comment.id)
        .delete();
      comment = undefined;
    });

    it('should update the comment', async () => {
      comment.text = 'I really like it.';
      await DisclosureDB.updateComment(knex, {coiRole: 'reviewer', schoolId: '1234'}, comment);
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
      await knex('pi_review')
        .where('disclosure_id', disclosureId)
        .delete();
      await knex('review_comment')
        .where('id', comment.id)
        .delete();
      comment = undefined;
    });

    it('should not update the user', async () => {
      comment.piVisible = true;
      await DisclosureDB.updateComment(knex, {coiRole: 'admin', firstName: 'Bill'}, comment);
      comment = await getComment(knex, comment.id);

      assert.equal(comment.piVisible, true);
      assert.equal(comment.author, 'cate');
    });

    it('should flag the comment as needing review by the PI', async () => {
      comment.piVisible = true;
      await DisclosureDB.updateComment(knex, {coiRole: 'admin', firstName: 'Bill'}, comment);

      const results = await knex('pi_review')
        .where('disclosure_id', disclosureId)
        .count();
      const piReviewCount = results[0]['count(*)'];
      assert.equal(piReviewCount, 1);
    });

    context('and the comment is already visisble to the PI', async() => {
      beforeEach(async() => {
        comment.piVisible = true;
        await DisclosureDB.updateComment(knex, {coiRole: 'admin', firstName: 'Bill'}, comment);
      });

      it('should remove the pi_review flag if the comment is no longer visisble to the PI', async() => {
        comment.piVisible = false;
        await DisclosureDB.updateComment(knex, {coiRole: 'admin', firstName: 'Bill'}, comment);

        const results = await knex('pi_review')
          .where('disclosure_id', disclosureId)
          .count();
        const piReviewCount = results[0]['count(*)'];
        assert.equal(piReviewCount, 0);
      });
    });
  });
});
