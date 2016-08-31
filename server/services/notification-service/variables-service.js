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

import {get, isString} from 'lodash';
import { formatDate } from '../../date-utils';
import { DATE_TYPE } from '../../../coi-constants';
const LEFT = '{{';
const RIGHT = '}}';

export function formatDateIfAvailable(date) {
  return date ? formatDate(date) : '';
}

export function getDefaultVariables(url) {
  if (!isString(url)) {
    throw Error('invalid url');
  }

  const result = {};
  result[`${LEFT}ADMIN_DASHBOARD${RIGHT}`] = `${url}/coi/admin`;
  result[`${LEFT}REPORTER_DASHBOARD${RIGHT}`] = `${url}/coi`;
  result[`${LEFT}NOW${RIGHT}`] = formatDate(new Date());
  return result;
}

export function getNamePartsFromString(approver) {
  if (!approver) {
    return {};
  }

  const names = approver.split(',');
  if (names.length > 2) {
    const result = {
      lastName: names.shift().trim()
    };
    result.firstName = names.join(',').trim();
    return result;
  }
  if (names.length > 1) {
    return {
      firstName: names[1].trim(),
      lastName: names[0].trim()
    };
  }

  return {
    firstName: names[0].trim()
  };
}

export function getDisclosureVariables(disclosure, url, variables) {
  if (!disclosure) {
    throw Error('disclosure is required');
  }
  if (!url) {
    throw Error('url is required');
  }
  const result = Object.assign({}, variables);

  result[`${LEFT}ADMIN_DETAIL_VIEW${RIGHT}`] =
    `${url}/coi/admin/detailview/${disclosure.id}/${disclosure.statusCd}`;
  result[`${LEFT}SUBMISSION_DATE${RIGHT}`] = formatDateIfAvailable(
    disclosure.submittedDate
  );
  result[`${LEFT}APPROVAL_DATE${RIGHT}`] = formatDateIfAvailable(
    disclosure.approvedDate
  );
  result[`${LEFT}EXPIRATION_DATE${RIGHT}`] = formatDateIfAvailable(
    disclosure.expiredDate
  );

  setReporterDetails(result, get(
      disclosure,
      'reporterInfo.firstName'
  ), get(
      disclosure,
      'reporterInfo.lastName'
  ));

  const approver = getNamePartsFromString(disclosure.approvedBy);
  result[`${LEFT}APPROVER_FIRST_NAME${RIGHT}`] = get(approver, 'firstName');
  result[`${LEFT}APPROVER_LAST_NAME${RIGHT}`] = get(approver, 'lastName');
  result[`${LEFT}DISPOSITION${RIGHT}`] = get(disclosure, 'disposition');

  return result;
}

export function setReporterDetails(result, firstName, lastName) {
  result[`${LEFT}REPORTER_FIRST_NAME${RIGHT}`] = firstName;
  result[`${LEFT}REPORTER_LAST_NAME${RIGHT}`] = lastName;
}

export function addProjectInformation(projectInformation, variables) {
  variables[`${LEFT}PROJECT_INFORMATION${RIGHT}`] = projectInformation;
  return variables;
}

export function getDate(dates, type) {
  if (!dates || !type) {
    return;
  }

  const date = dates.find(d => d.type === type);
  return date ? date.date : undefined;
}

export function getReviewerVariables(reviewer, variables) {
  if (!reviewer) {
    throw Error('reviewer is required');
  }
  const result = Object.assign({}, variables);

  const assigner = getNamePartsFromString(reviewer.assignedBy);
  result[`${LEFT}REVIEW_ASSIGNED${RIGHT}`] = formatDateIfAvailable(
    getDate(reviewer.dates, DATE_TYPE.ASSIGNED)
  );
  result[`${LEFT}REVIEW_COMPLETED${RIGHT}`] = formatDateIfAvailable(
    getDate(reviewer.dates, DATE_TYPE.COMPLETED)
  );
  result[`${LEFT}ASSIGNER_FIRST_NAME${RIGHT}`] = assigner.firstName;
  result[`${LEFT}ASSIGNER_LAST_NAME${RIGHT}`] = assigner.lastName;
  result[`${LEFT}REVIEWER_FIRST_NAME${RIGHT}`] = get(
    reviewer,
    'reviewerInfo.firstName'
  );
  result[`${LEFT}REVIEWER_LAST_NAME${RIGHT}`] = get(
    reviewer,
    'reviewerInfo.lastName'
  );
  return result;
}

export function getProjectVariables(project, variables) {
  if (!project) {
    throw Error('project is required');
  }
  const results = Object.assign({}, variables);

  results[`${LEFT}PROJECT_TITLE${RIGHT}`] = get(project, 'title');
  results[`${LEFT}PROJECT_TYPE${RIGHT}`] = get(project, 'type');
  results[`${LEFT}PROJECT_ROLE${RIGHT}`] = get(project, 'person.roleCode');
  if (project.sponsors && Array.isArray(project.sponsors)) {
    const names = project.sponsors.map(sponsor => sponsor.sponsorName);
    results[`${LEFT}PROJECT_SPONSOR${RIGHT}`] = names.join(', ');
  } else {
    results[`${LEFT}PROJECT_SPONSOR${RIGHT}`] = '';
  }
  results[`${LEFT}PROJECT_NUMBER${RIGHT}`] = get(project, 'sourceIdentifier');
  results[`${LEFT}PROJECT_PERSON_FIRST_NAME${RIGHT}`] = get(
    project,
    'person.info.firstName'
  );
  results[`${LEFT}PROJECT_PERSON_LAST_NAME${RIGHT}`] = get(
    project,
    'person.info.lastName'
  );
  results[`${LEFT}PI_FIRST_NAME${RIGHT}`] = get(project, 'piInfo.firstName');
  results[`${LEFT}PI_LAST_NAME${RIGHT}`] = get(project, 'piInfo.lastName');

  return results;
}