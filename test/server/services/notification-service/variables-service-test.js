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
  formatDateIfAvailable,
  getDefaultVariables,
  getNamePartsFromString,
  getDisclosureVariables,
  getDate,
  getReviewerVariables,
  getProjectVariables
} from '../../../../server/services/notification-service/variables-service';

describe('variable-service', () => {
  describe('formatDateIfAvailable', () => {
    it('should return a empty string for no date', () => {
      assert.equal(formatDateIfAvailable(), '');
      assert.equal(formatDateIfAvailable(null), '');
      assert.equal(formatDateIfAvailable(undefined), '');
    });

    it('should return an invalid date string for an invalid date', () => {
      assert.equal(formatDateIfAvailable('bla'), 'Invalid date');
    });

    it('should return a formatted date for a valid date', () => {
      assert.equal(formatDateIfAvailable(1470413761517), 'Aug 5, 2016');
    });
  });

  describe('getDefaultVariables', () => {
    it('should fail with no url', () => {
      let errorThrown = false;
      try {
        getDefaultVariables();
      } catch (err) {
        errorThrown = true;
      }

      assert(errorThrown);
    });

    it('should return the correct variables', () => {
      const result = getDefaultVariables('https://testing-kuali.co/api');
      assert.equal(
        result['{{ADMIN_DASHBOARD}}'],
        'https://testing-kuali.co/api/coi/admin'
      );
      assert.equal(
        result['{{REPORTER_DASHBOARD}}'],
        'https://testing-kuali.co/api/coi'
      );
      assert.notEqual(Date.parse(result['{{NOW}}']), NaN);
    });
  });

  describe('getNamePartsFromString', () => {
    it('should handle empty strings', () => {
      assert.equal(getNamePartsFromString('').firstName, undefined);
      assert.equal(getNamePartsFromString('').lastName, undefined);
      assert.equal(getNamePartsFromString().firstName, undefined);
      assert.equal(getNamePartsFromString().lastName, undefined);
      assert.equal(getNamePartsFromString(null).firstName, undefined);
      assert.equal(getNamePartsFromString(null).lastName, undefined);
    });

    it('should return the correct names given valid input', () => {
      assert.equal(getNamePartsFromString('Lasto, Firsto').firstName, 'Firsto');
      assert.equal(getNamePartsFromString('Lasto, Firsto').lastName, 'Lasto');
    });

    it('should return the correct names given only one name', () => {
      assert.equal(getNamePartsFromString('Uno').firstName, 'Uno');
      assert.equal(getNamePartsFromString('Uno').lastName, undefined);
      assert.equal(getNamePartsFromString('Uno,').firstName, '');
      assert.equal(getNamePartsFromString('Uno,').lastName, 'Uno');
    });

    it('should return the correct names given three name', () => {
      assert.equal(
        getNamePartsFromString('Anne, Bill, Calvin').firstName,
        'Bill, Calvin'
      );
      assert.equal(
        getNamePartsFromString('Anne, Bill, Calvin').lastName,
        'Anne'
      );
    });

    it('should trim appropriately', () => {
      assert.equal(getNamePartsFromString('Space ,  Mucho ').firstName, 'Mucho');
      assert.equal(getNamePartsFromString('Space ,  Mucho ').lastName, 'Space');
    });
  });

  describe('getDisclosureVariables', () => {
    const testDisclosure = {
      id: 3,
      statusCd: 1,
      submittedDate: 34543543,
      approvedDate: 22222222,
      expiredDate: 83838388,
      reporterInfo: {
        firstName: 'fn',
        lastName: 'ln'
      },
      approvedBy: 'Omega, Alpha',
      disposition: 44
    };

    it('should create a new variables object if not passed in', () => {
      const result = getDisclosureVariables(testDisclosure, 'theurl');
      assert.equal(
        result['{{ADMIN_DETAIL_VIEW}}'],
        'theurl/coi/admin/detailview/3/1'
      );
      assert.equal(result['{{SUBMISSION_DATE}}'], 'Jan 1, 1970');
      assert.equal(result['{{APPROVAL_DATE}}'], 'Dec 31, 1969');
      assert.equal(result['{{EXPIRATION_DATE}}'], 'Jan 1, 1970');
      assert.equal(result['{{REPORTER_FIRST_NAME}}'], 'fn');
      assert.equal(result['{{REPORTER_LAST_NAME}}'], 'ln');
      assert.equal(result['{{APPROVER_FIRST_NAME}}'], 'Alpha');
      assert.equal(result['{{APPROVER_LAST_NAME}}'], 'Omega');
      assert.equal(result['{{DISPOSITION}}'], 44);
    });

    it('should throw errors on invalid arguments', () => {
      let errorThrown = false;
      try {
        getDisclosureVariables(undefined, 'theurl', {});
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);

      errorThrown = false;
      try {
        getDisclosureVariables(null, 'theurl', {});
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);

      errorThrown = false;
      try {
        getDisclosureVariables(testDisclosure, undefined, {});
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);

      errorThrown = false;
      try {
        getDisclosureVariables(testDisclosure, null, {});
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should give correct values', () => {
      const result = getDisclosureVariables(
        testDisclosure,
        'theurl',
        {
          stillThere: true
        }
      );
      assert.equal(
        result['{{ADMIN_DETAIL_VIEW}}'],
        'theurl/coi/admin/detailview/3/1'
      );
      assert.equal(result['{{SUBMISSION_DATE}}'], 'Jan 1, 1970');
      assert.equal(result['{{APPROVAL_DATE}}'], 'Dec 31, 1969');
      assert.equal(result['{{EXPIRATION_DATE}}'], 'Jan 1, 1970');
      assert.equal(result['{{REPORTER_FIRST_NAME}}'], 'fn');
      assert.equal(result['{{REPORTER_LAST_NAME}}'], 'ln');
      assert.equal(result['{{APPROVER_FIRST_NAME}}'], 'Alpha');
      assert.equal(result['{{APPROVER_LAST_NAME}}'], 'Omega');
      assert.equal(result['{{DISPOSITION}}'], 44);
      assert.equal(result.stillThere, true);
    });
  });

  describe('getDate', () => {
    const dates = [
      {
        type: 1,
        date: 'Nov 1, 2016'
      },
      {
        type: 2,
        date: 'Dec 2, 2017'
      },
      {
        type: 3,
        date: 'Jan 3 2018'
      }
    ];

    it('should fail on invalid inputs', () => {
      let result = getDate(undefined, 1);
      assert.equal(result, undefined);

      result = getDate([], 2);
      assert.equal(result, undefined);

      result = getDate(dates);
      assert.equal(result, undefined);
    });

    it('should return correct date', () => {
      const result = getDate(dates, 2);
      assert.equal(result, 'Dec 2, 2017');
    });
  });

  describe('getReviewerVariables', () => {
    const testReviewer = {
      assignedBy: 'Xyz, Abc',
      dates: [
        {
          date: 3333333333,
          type: 'Something else'
        },
        {
          date: 765756765765,
          type: 'Assigned'
        },
        {
          date: 45466333433,
          type: 'Completed'
        }
      ],
      reviewerInfo: {
        firstName: 'Twi',
        lastName: 'Yez'
      }
    };

    it('should create a new variables object if not passed in', () => {
      const result = getReviewerVariables(testReviewer);
      assert.equal(result['{{REVIEW_ASSIGNED}}'], 'Apr 7, 1994');
      assert.equal(result['{{REVIEW_COMPLETED}}'], 'Jun 10, 1971');
      assert.equal(result['{{ASSIGNER_FIRST_NAME}}'], 'Abc');
      assert.equal(result['{{ASSIGNER_LAST_NAME}}'], 'Xyz');
      assert.equal(result['{{REVIEWER_FIRST_NAME}}'], 'Twi');
      assert.equal(result['{{REVIEWER_LAST_NAME}}'], 'Yez');
    });

    it('should throw errors on invalid arguments', () => {
      let errorThrown = false;
      try {
        getReviewerVariables(undefined);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should give correct values', () => {
      const result = getReviewerVariables(
        testReviewer,
        {
          stillThere: true
        }
      );
      assert.equal(result['{{REVIEW_ASSIGNED}}'], 'Apr 7, 1994');
      assert.equal(result['{{REVIEW_COMPLETED}}'], 'Jun 10, 1971');
      assert.equal(result['{{ASSIGNER_FIRST_NAME}}'], 'Abc');
      assert.equal(result['{{ASSIGNER_LAST_NAME}}'], 'Xyz');
      assert.equal(result['{{REVIEWER_FIRST_NAME}}'], 'Twi');
      assert.equal(result['{{REVIEWER_LAST_NAME}}'], 'Yez');
      assert.equal(result.stillThere, true);
    });
  });

  describe('getProjectVariables', () => {
    const testProject = {
      title: 'theTitle',
      type: 'theType',
      person: {
        roleCode: 987,
        roleDescription: 'The correct role',
        info: {
          firstName: 'firsty',
          lastName: 'lasty'
        }
      },
      sponsors: [
        {
          sponsorName: 'Hhh'
        },
        {
          sponsorName: 'Jjj'
        },
        {
          sponsorName: 'Kkk'
        }
      ],
      sourceIdentifier: 4444,
      piInfo: {
        firstName: 'pif',
        lastName: 'pil'
      }
    };

    it('should create a new variables object if not passed in', () => {
      const result = getProjectVariables(testProject);
      assert.equal(result['{{PROJECT_TITLE}}'], testProject.title);
      assert.equal(result['{{PROJECT_TYPE}}'], testProject.type);
      assert.equal(result['{{PROJECT_ROLE}}'], 'The correct role');
      assert.equal(result['{{PROJECT_SPONSOR}}'], 'Hhh, Jjj, Kkk');
      assert.equal(result['{{PROJECT_NUMBER}}'], 4444);
      assert.equal(result['{{PROJECT_PERSON_FIRST_NAME}}'], 'firsty');
      assert.equal(result['{{PROJECT_PERSON_LAST_NAME}}'], 'lasty');
      assert.equal(result['{{PI_FIRST_NAME}}'], 'pif');
      assert.equal(result['{{PI_LAST_NAME}}'], 'pil');
    });

    it('should throw errors on invalid arguments', () => {
      let errorThrown = false;
      try {
        getProjectVariables(undefined);
      } catch (err) {
        errorThrown = true;
      }
      assert(errorThrown);
    });

    it('should give correct values', () => {
      const result = getProjectVariables(
        testProject,
        {
          stillThere: true
        }
      );
      assert.equal(result['{{PROJECT_TITLE}}'], testProject.title);
      assert.equal(result['{{PROJECT_TYPE}}'], testProject.type);
      assert.equal(result['{{PROJECT_ROLE}}'], 'The correct role');
      assert.equal(result['{{PROJECT_SPONSOR}}'], 'Hhh, Jjj, Kkk');
      assert.equal(result['{{PROJECT_NUMBER}}'], 4444);
      assert.equal(result['{{PROJECT_PERSON_FIRST_NAME}}'], 'firsty');
      assert.equal(result['{{PROJECT_PERSON_LAST_NAME}}'], 'lasty');
      assert.equal(result['{{PI_FIRST_NAME}}'], 'pif');
      assert.equal(result['{{PI_LAST_NAME}}'], 'pil');
      assert.equal(result.stillThere, true);
    });

    it('should give correct values', () => {
      const result = getProjectVariables(
        Object.assign({}, testProject, {sponsors: undefined})
      );
      assert.equal(result['{{PROJECT_SPONSOR}}'], '');
    });
  });
});