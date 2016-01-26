import assert from 'assert';
import {
  unSubmittedRelationshipStarted,
  entityRelationshipStepErrors
} from '../../../../client/scripts/stores/DisclosureStore';


describe('DisclosureStore', () => {
  describe('unsubmittedRelationshipStarted', () => {
    it('returns false for empty person string', () => {
      const result = unSubmittedRelationshipStarted({
        applicationState: {
          potentialRelationship: {
            personCd: ''
          }
        }
      });

      assert.equal(result, false);
    });

    it('returns false for empty comment string', () => {
      const result = unSubmittedRelationshipStarted({
        applicationState: {
          potentialRelationship: {
            comments: ''
          }
        }
      });

      assert.equal(result, false);
    });

    it('returns false for empty relationshipCd string', () => {
      const result = unSubmittedRelationshipStarted({
        applicationState: {
          potentialRelationship: {
            relationshipCd: ''
          }
        }
      });

      assert.equal(result, false);
    });

    it('pass bad values', () => {
      let result = unSubmittedRelationshipStarted();
      assert.equal(result, false);

      result = unSubmittedRelationshipStarted({
      });
      assert.equal(result, false);

      result = unSubmittedRelationshipStarted({
        applicationState: {}
      });
      assert.equal(result, false);
    });

    it('person has started', () => {
      const result = unSubmittedRelationshipStarted({
        applicationState: {
          potentialRelationship: {
            personCd: 4
          }
        }
      });

      assert.equal(result, true);
    });

    it('relationship has started', () => {
      const result = unSubmittedRelationshipStarted({
        applicationState: {
          potentialRelationship: {
            relationshipCd: 3
          }
        }
      });

      assert.equal(result, true);
    });

    it('comments has started', () => {
      const result = unSubmittedRelationshipStarted({
        applicationState: {
          potentialRelationship: {
            comments: 'bla'
          }
        }
      });

      assert.equal(result, true);
    });

    it('no parts have started', () => {
      const result = unSubmittedRelationshipStarted({
        applicationState: {
          potentialRelationship: {
          }
        }
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
