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
  getCodeMap,
  mapCodes,
  getCodeMapsFromState,
  getDisclosureTypeString,
  getStringFromCodeMap,
  getDisclosureStatusString,
  getAdminDisclosureStatusString,
  getRelationshipPersonTypeString,
  getRelationshipCategoryTypeString,
  getProjectTypeString,
  getDeclarationTypeString,
  getDispositionTypeString,
  getDispositionsEnabled,
  getLane,
  getNotificationsMode,
  getQuestionNumberToShow,
  getRelationshipAmountString,
  getRelationshipTypeString
} from '../../../../client/scripts/stores/config-store';
import { QUESTIONNAIRE_TYPE } from '../../../../coi-constants';

function generateStateWithCodeMap(codeMapName) {
  return {
    config: {
      id: 43,
      codeMaps: {
        [codeMapName]: {
          2: {
            description: 'current config 2'
          },
          3: {
            description: 'current config 3'
          }
        }
      }
    }
  };
}

describe('ConfigStore helper functions', () => {
  describe('getCodeMap', () => {
    const items = [
      {
        id: 1,
        name: 'frog'
      },
      {
        id: 2,
        name: 'bear'
      },
      {
        id: 3,
        name: 'hampster'
      }
    ];

    it('should return an empty object if an invalid array is passed', () => {
      const result = getCodeMap(1, 'typeCd');

      assert.equal(typeof result, 'object');
      assert.equal(Object.keys(result).length, 0);
    });

    it('should throw an error if an invalid codeField is passed', () => {
      let errorThrown = false;
      try {
        getCodeMap(items, 'typeCd');
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should return the a valid map', () => {
      const result = getCodeMap(items, 'id');
      assert.equal(result[3].name, 'hampster');
      assert.equal(result[2].name, 'bear');
      assert.equal(result[1].name, 'frog');
    });
  });

  describe('mapCodes', () => {
    it('should throw an error if an invalid config is passed', () => {
      let errorThrown = false;
      try {
        mapCodes(undefined);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);

      errorThrown = false;
      try {
        mapCodes(1);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should return valid maps with a valid config', () => {
      const config = {
        declarationTypes: [
          { typeCd: 1, name: 'uno' },
          { typeCd: 2, name: 'dos' },
          { typeCd: 3, name: 'tres' }
        ],
        disclosureStatus: [
          { statusCd: 1, name: '111' },
          { statusCd: 2, name: '222' },
          { statusCd: 3, name: '333' }
        ],
        matrixTypes: [
          { typeCd: 1, name: 'one' },
          { typeCd: 2, name: 'two' },
          { typeCd: 3, name: 'three' }
        ]
      };

      const result = mapCodes(config);

      assert.equal(typeof result, 'object');
      assert.equal(result.declarationType[2].name, 'dos');
      assert.equal(result.disclosureStatus[3].name, '333');
      assert.equal(Object.keys(result.dispositionTypes).length, 0);
      assert.equal(result.relationshipCategoryType[1].name, 'one');
    });
  });
  
  describe('getCodeMapsFromState', () => {
    const state = {
      config: {
        id: 43,
        codeMaps: {
          text: 'current config'
        }
      },
      archivedConfigs: {
        23: {
          codeMaps: {
            text: 'archived'
          }
        }
      }
    };

    it('should should throw an error with an invalid state', () => {
      let errorThrown = false;
      try {
        getCodeMapsFromState({}, 3);
      } catch (err) {
        errorThrown = true;
      }
      
      assert(errorThrown);
    });

    it('should return null for an invalid configId', () => {
      assert.equal(getCodeMapsFromState(state, 999), null);
    });

    it('should return correct maps for a valid id', () => {
      let result = getCodeMapsFromState(state, 43);
      assert.equal(result.text, 'current config');

      result = getCodeMapsFromState(state, 23);
      assert.equal(result.text, 'archived');
    });
  });

  describe('getStringFromCodeMap', () => {
    const state = {
      config: {
        id: 43,
        codeMaps: {
          mickey: {
            1: {
              description: 'current config 1'
            },
            2: {
              description: 'current config 2'
            }
          }
        }
      },
      archivedConfigs: {
        23: {
          codeMaps: {
            mickey: {
              1: {
                description: 'archived 23 config 1'
              },
              2: {
                description: 'archived 23 config 2'
              }
            }
          }
        }
      }
    };

    it('should throw errors with invalid params', () => {
      let errorThrown = false;
      try {
        getStringFromCodeMap(undefined, 1, 43, 'mickey');
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);

      errorThrown = false;
      try {
        getStringFromCodeMap(state, 1, 43, 'minnie');
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should return correct string', () => {
      assert.equal(
        'current config 2',
        getStringFromCodeMap(state, 2, 43, 'mickey')
      );
      assert.equal(
        'archived 23 config 1',
        getStringFromCodeMap(state, 1, 23, 'mickey')
      );
    });
    
    it('should return an empty string for an unmatched code', () => {
      assert.equal(
        '',
        getStringFromCodeMap(state, 9, 23, 'mickey')
      );
    });
  });

  describe('getDisclosureTypeString', () => {
    const state = generateStateWithCodeMap('disclosureType');

    it('should return correct string', () => {
      assert.equal('current config 2', getDisclosureTypeString(state, 2, 43));
    });
  });

  describe('getDispositionsEnabled', () => {
    const state = {
      config: {
        general: {
          dispositionsEnabled: true
        }
      }
    };

    it('should return correct value', () => {
      assert.equal(getDispositionsEnabled(state), true);
    });

    it('should throw an error with an invalid state', () => {
      let errorThrown = false;
      try {
        getDispositionsEnabled(undefined);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });
  });

  describe('getDisclosureStatusString', () => {
    const state = generateStateWithCodeMap('disclosureStatus');

    it('should return correct string', () => {
      assert.equal('current config 2', getDisclosureStatusString(state, 2, 43));
    });
  });

  describe('getAdminDisclosureStatusString', () => {
    const state = generateStateWithCodeMap('disclosureStatus');

    it('should return correct string', () => {
      assert.equal('current config 2', getAdminDisclosureStatusString(state, 2, 43));
      assert.equal('Approved', getAdminDisclosureStatusString(state, 3, 43));
    });
  });

  describe('getRelationshipPersonTypeString', () => {
    const state = generateStateWithCodeMap('relationshipPersonType');

    it('should return correct string', () => {
      assert.equal('current config 2', getRelationshipPersonTypeString(state, 2, 43));
    });
  });

  describe('getRelationshipCategoryTypeString', () => {
    const state = generateStateWithCodeMap('relationshipCategoryType');

    it('should return correct string', () => {
      assert.equal('current config 2', getRelationshipCategoryTypeString(state, 2, 43));
    });
  });

  describe('getProjectTypeString', () => {
    const state = generateStateWithCodeMap('projectType');

    it('should return correct string', () => {
      assert.equal('current config 2', getProjectTypeString(state, 2, 43));
    });
  });

  describe('getDeclarationTypeString', () => {
    const state = generateStateWithCodeMap('declarationType');

    it('should return correct string', () => {
      assert.equal('current config 2', getDeclarationTypeString(state, 2, 43));
    });
  });

  describe('getDispositionTypeString', () => {
    const state = generateStateWithCodeMap('dispositionTypes');

    it('should return correct string', () => {
      assert.equal('current config 2', getDispositionTypeString(state, 2, 43));
    });
  });

  describe('getRelationshipTypeString', () => {
    const state = {
      config: {
        id: 1,
        codeMaps: {
          relationshipCategoryType: {
            3: {
              typeOptions: [
                {
                  typeCd: 9,
                  description: 'nueve'
                }
              ]
            }
          }
        }
      }
    };

    it('should get the correct value', () => {
      assert.equal(getRelationshipTypeString(state, 3, 9, 1), 'nueve');
    });
  });

  describe('getRelationshipAmountString', () => {
    const state = {
      config: {
        id: 1,
        codeMaps: {
          relationshipCategoryType: {
            3: {
              amountOptions: [
                {
                  typeCd: 9,
                  description: 'nueve'
                }
              ]
            }
          }
        }
      }
    };

    it('should throw an error on invalid state', () => {
      let errorThrown = false;
      try {
        getRelationshipAmountString(undefined);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should throw an error on invalid categoryCode', () => {
      let errorThrown = false;
      try {
        getRelationshipAmountString(state, 2, 9, 1);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should throw an error on invalid typeCode', () => {
      let errorThrown = false;
      try {
        getRelationshipAmountString(state, 3, 90, 1);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should get the correct value', () => {
      assert.equal(getRelationshipAmountString(state, 3, 9, 1), 'nueve');
    });
  });

  describe('getNotificationsMode', () => {
    const state = {
      config: {
        notificationsMode: 'On'
      }
    };

    it('should throw an error on invalid state', () => {
      let errorThrown = false;
      try {
        getNotificationsMode(undefined);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should return the correct value', () => {
      assert.equal(getNotificationsMode(state), 'On');
    });
  });

  describe('getQuestionNumberToShow', () => {
    const state = {
      config: {
        id: 99,
        questions: {
          screening: [
            {
              id: 1,
              numberToShow: 'Uno'
            },
            {
              id: 2,
              numberToShow: 'Dos'
            }
          ],
          entities: [
            {
              id: 3,
              question: {
                numberToShow: 'Tres'
              }
            },
            {
              id: 4,
              question: {
                numberToShow: 'Quatro'
              }
            }
          ]
        }
      }
    };

    it('should throw an error on invalid state', () => {
      let errorThrown = false;
      try {
        getQuestionNumberToShow(undefined);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should throw an error on invalid type', () => {
      let errorThrown = false;
      try {
        getQuestionNumberToShow(state, 333, 1, 99);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should throw an error on invalid questionId', () => {
      let errorThrown = false;
      try {
        getQuestionNumberToShow(state, 'entities', 9, 99);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should return the correct value', () => {
      const result = getQuestionNumberToShow(
        state,
        QUESTIONNAIRE_TYPE.ENTITIES,
        3,
        99
      );
      assert.equal(result, 'Tres');
    });
  });

  describe('getLane', () => {
    const state = {
      config: {
        lane: 'green'
      }
    };

    it('should throw an error on invalid state', () => {
      let errorThrown = false;
      try {
        getLane(undefined);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should return the correct value', () => {
      assert.equal(getLane(state), 'green');
    });
  });
});
