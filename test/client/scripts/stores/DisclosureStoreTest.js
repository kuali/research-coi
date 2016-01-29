/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

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
  unSubmittedRelationshipStarted,
  entityRelationshipStepErrors
} from '../../../../client/scripts/stores/DisclosureStore';


describe('DisclosureStore', () => {
  describe('unsubmittedRelationshipStarted', () => {
    it('returns false for empty person string', () => {
      const result = unSubmittedRelationshipStarted({
        personCd: ''
      });

      assert.equal(result, false);
    });

    it('returns false for empty comment string', () => {
      const result = unSubmittedRelationshipStarted({
        comments: ''
      });

      assert.equal(result, false);
    });

    it('returns false for empty relationshipCd string', () => {
      const result = unSubmittedRelationshipStarted({
        relationshipCd: ''
      });

      assert.equal(result, false);
    });

    it('pass bad values', () => {
      let result = unSubmittedRelationshipStarted();
      assert.equal(result, false);

      result = unSubmittedRelationshipStarted({
      });
      assert.equal(result, false);
    });

    it('person has started', () => {
      const result = unSubmittedRelationshipStarted({
        personCd: 4
      });

      assert.equal(result, true);
    });

    it('relationship has started', () => {
      const result = unSubmittedRelationshipStarted({
        relationshipCd: 3
      });

      assert.equal(result, true);
    });

    it('comments has started', () => {
      const result = unSubmittedRelationshipStarted({
        comments: 'bla'
      });

      assert.equal(result, true);
    });

    it('no parts have started', () => {
      const result = unSubmittedRelationshipStarted({
      });

      assert.equal(result, false);
    });
  });

  describe('entityRelationshipStepErrors', () => {
    let potentialRelationship;
    let matrixTypes;

    beforeEach(() => {
      matrixTypes = [
        {
          typeCd: 2,
          typeEnabled: 1,
          amountEnabled: 1,
          description: 'Not Travel',
          destinationEnabled: 1,
          dateEnabled: 1,
          reasonEnabled: 1
        }
      ];

      potentialRelationship = {
        personCd: 56456,
        comments: 'commentary',
        relationshipCd: 2,
        travel: {
          amount: 88,
          destination: 'Hawaii',
          startDate: 456898,
          endDate: 1456898,
          reason: 'For fun'
        },
        amountCd: 304,
        typeCd: 2
      };
    });

    it('personCd is required', () => {
      delete potentialRelationship.personCd;
      const errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert(Object.keys(errors).length > 0);
      assert.equal(errors.person, 'Required Field');
    });

    it('comments are required', () => {
      delete potentialRelationship.comments;
      const errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert(Object.keys(errors).length > 0);
      assert.equal(errors.comment, 'Required Field');
    });

    it('relationshipCd is required', () => {
      delete potentialRelationship.relationshipCd;
      const errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert(Object.keys(errors).length > 0);
      assert.equal(errors.relation, 'Required Field');
    });

    it('no matching matrixType', () => {
      potentialRelationship.relationshipCd = 99;
      assert.throws(() => {
        entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      }, Error);
    });

    it('typeCd required when specified', () => {
      delete potentialRelationship.typeCd;
      let errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert(Object.keys(errors).length > 0);
      assert.equal(errors.type, 'Required Field');

      matrixTypes[0].typeEnabled = 0;
      errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert.equal(Object.keys(errors).length, 0);
      assert.equal(errors.type, undefined);
    });

    it('amountCd required when specified', () => {
      delete potentialRelationship.amountCd;
      let errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert(Object.keys(errors).length > 0);
      assert.equal(errors.amount, 'Required Field');

      matrixTypes[0].amountEnabled = 0;
      errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert.equal(Object.keys(errors).length, 0);
      assert.equal(errors.amount, undefined);
    });

    it('destination required when specified', () => {
      delete potentialRelationship.travel.destination;
      let errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert(Object.keys(errors).length > 0);
      assert.equal(errors.travelDestination, 'Required Field');

      matrixTypes[0].destinationEnabled = 0;
      errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert.equal(Object.keys(errors).length, 0);
      assert.equal(errors.travelDestination, undefined);
    });

    it('travel start date required when specified', () => {
      delete potentialRelationship.travel.startDate;
      let errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert(Object.keys(errors).length > 0);
      assert.equal(errors.travelStartDate, 'Required Field');

      matrixTypes[0].dateEnabled = 0;
      errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert.equal(Object.keys(errors).length, 0);
      assert.equal(errors.travelStartDate, undefined);
    });

    it('travel reason required when specified', () => {
      delete potentialRelationship.travel.reason;
      let errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert(Object.keys(errors).length > 0);
      assert.equal(errors.travelReason, 'Required Field');

      matrixTypes[0].reasonEnabled = 0;
      errors = entityRelationshipStepErrors(potentialRelationship, matrixTypes);
      assert.equal(Object.keys(errors).length, 0);
      assert.equal(errors.travelReason, undefined);
    });
  });
});
