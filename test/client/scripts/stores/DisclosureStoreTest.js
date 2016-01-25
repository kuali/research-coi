import assert from 'assert';
import {unSubmittedRelationshipStarted} from '../../../../client/scripts/stores/DisclosureStore';


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
});
