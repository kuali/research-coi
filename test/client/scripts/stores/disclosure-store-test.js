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
  unSubmittedRelationshipStarted,
  entityRelationshipStepErrors,
  DisclosureStore
} from '../../../../client/scripts/stores/disclosure-store';
import { QUESTION_TYPE } from '../../../../coi-constants';
import alt from '../../../../client/scripts/alt';
import { DisclosureActions } from '../../../../client/scripts/actions/disclosure-actions';

import _ from 'lodash';

function createDisclosure(active, answer, questionId) {
  const disclosure = {};
  _.set(disclosure,'entities[0].active',active);
  _.set(disclosure,'answers[0].answer.value', answer);
  _.set(disclosure,'answers[0].questionId', questionId);
  return disclosure;
}

function createConfig() {
  return {
    questions: {
      screening: [
        {
          id: 1,
          question: {
            type: QUESTION_TYPE.YESNO
          }
        }
      ]
    },
    general: {
      enforceFinancialEntities: true,
      skipFinancialEntities: true
    }
  };
}

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

  describe('canSkipEntities', () => {
    it('should return false if skipFinancialEntities is false', () => {
      const config = createConfig();
      config.general.skipFinancialEntities = false;
      const value = DisclosureStore.canSkipEntities(createDisclosure(0,'No',1), config);
      assert.equal(false, value);
    });

    it('should return false if an active financial entity exists', () => {
      const value = DisclosureStore.canSkipEntities(createDisclosure(1,'No',1), createConfig());
      assert.equal(false, value);
    });

    it('should return false if a yes/no question is answered yes', () => {
      const value = DisclosureStore.canSkipEntities(createDisclosure(0,'Yes',1), createConfig());
      assert.equal(false, value);
    });

    it('should return true if yes/no questions are no and no active entities exists', () => {
      const value = DisclosureStore.canSkipEntities(createDisclosure(0,'No',1), createConfig());
      assert.equal(true, value);
    });

    it('should return true if no yes/no questions are provided', () => {
      const config = createConfig();
      config.questions.screening.push({
        id: 2,
        question: {
          type: QUESTION_TYPE.TEXTAREA
        }
      });
      const value = DisclosureStore.canSkipEntities(createDisclosure(0,'Dragon Cat',2), config);
      assert.equal(true, value);
    });
  });

  describe('enforceEntities', () => {
    it('should return true enforceFinancialEntities is true, a question is answered yes, and no active entities exist', () => {
      const enforceEntities = DisclosureStore.enforceEntities(createDisclosure(0, 'Yes', 1), createConfig());
      assert.equal(true, enforceEntities);
    });

    it('should return false an active entity exists', () => {
      const enforceEntities = DisclosureStore.enforceEntities(createDisclosure(1, 'Yes', 1), createConfig());
      assert.equal(false, enforceEntities);
    });

    it('should return false if all questions are answered no', () => {
      const enforceEntities = DisclosureStore.enforceEntities(createDisclosure(1, 'No', 1), createConfig());
      assert.equal(false, enforceEntities);
    });

    it('should return false if enforceFinancialEntities is false', () => {
      const config = createConfig();
      config.general.enforceFinancialEntities = false;
      const enforceEntities = DisclosureStore.enforceEntities(createDisclosure(0, 'Yes', 1), config);
      assert.equal(false, enforceEntities);
    });

    it('should return false if question type is not yes no but answered yes', () => {
      const config = createConfig();
      config.questions.screening[0].question.type = QUESTION_TYPE.YESNONA;
      const enforceEntities = DisclosureStore.enforceEntities(createDisclosure(0, 'Yes', 1), config);
      assert.equal(false, enforceEntities);
    });
  });

  describe('warnActiveEntity', () => {
    it('should return true if all yes no question are no an active entity exists', () => {
      const warnActiveEntity = DisclosureStore.warnActiveEntity(createDisclosure(1, 'No', 1), createConfig());
      assert.equal(true, warnActiveEntity);
    });

    it('should return false if skipFinancialEntites is false', () => {
      const config = createConfig();
      config.general.skipFinancialEntities = false;
      const warnActiveEntity = DisclosureStore.warnActiveEntity(createDisclosure(1, 'No', 1), config);
      assert.equal(false, warnActiveEntity);
    });

    it('should return false if no active entity exists', () => {
      const warnActiveEntity = DisclosureStore.warnActiveEntity(createDisclosure(0, 'No', 1), createConfig());
      assert.equal(false, warnActiveEntity);
    });

    it('should return false if a question is answered yes', () => {
      const warnActiveEntity = DisclosureStore.warnActiveEntity(createDisclosure(0, 'Yes', 1), createConfig());
      assert.equal(false, warnActiveEntity);
    });
  });

  describe('resetPotentialEntity', () => {
    before(() => {
      const data = {
        key: 'applicationState',
        value: {
          potentialRelationships: {
            new: {},
            1: {}
          }
        }
      };

      alt.dispatcher.dispatch({
        action: DisclosureActions.SET_STATE_FOR_TEST, data
      });
    });

    it('should delete potential relationship', () => {
      alt.dispatcher.dispatch({
        action: DisclosureActions.RESET_POTENTIAL_RELATIONSHIP, data: 'new'
      });
      const potentialRelationships = DisclosureStore.getState().applicationState.potentialRelationships;
      assert(potentialRelationships.new === undefined);
      assert(potentialRelationships['1'] !== undefined);
    });
  });

  describe('getWorstDeclaration', () => {
    it('should return the highest ordered declarationType description', () => {
      const declarations = [
        {
          typeCd: 1
        },
        {
          typeCd: 2
        }
      ];

      const declarationTypes = [
        {
          typeCd: 3,
          order: 0,
          description: 'Three'
        },
        {
          typeCd: 1,
          order: 2,
          description: 'Two'
        },
        {
          typeCd: 1,
          order: 1,
          description: 'One'
        }
      ];

      const worstDeclaration = DisclosureStore.getWorstDeclaration(declarations, declarationTypes);
      assert.equal('Two',worstDeclaration);
    });
  });
});
