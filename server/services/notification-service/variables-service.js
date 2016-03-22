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

import { formatDate } from '../../date-utils';

const LEFT = '{{';
const RIGHT = '}}';

function formatDateIfAvailable(date) {
  return date ? formatDate(date) : '';
}
export function getDefaultVariables(url) {
  const variables = {};
  variables[`${LEFT}ADMIN_DASHBOARD${RIGHT}`] = `${url}/coi/admin`;
  variables[`${LEFT}REPORTER_DASHBOARD${RIGHT}`] = `${url}/coi`;
  variables[`${LEFT}NOW${RIGHT}`] = formatDate(new Date());
  return variables;
}

export function getDisclosureVariables(disclosure, url, variables) {
  variables[`${LEFT}ADMIN_DETAIL_VIEW${RIGHT}`] = `${url}/coi/admin/detailview/${disclosure.id}/${disclosure.statusCd}`;
  variables[`${LEFT}SUBMISSION_DATE${RIGHT}`] = formatDateIfAvailable(disclosure.submittedDate);
  variables[`${LEFT}APPROVAL_DATE${RIGHT}`] = formatDateIfAvailable(disclosure.approvedDate);
  variables[`${LEFT}EXPIRATION_DATE${RIGHT}`] = formatDateIfAvailable(disclosure.expiredDate);
  variables[`${LEFT}REPORTER_FIRST_NAME${RIGHT}`] = disclosure.reporterInfo.firstName;
  variables[`${LEFT}REPORTER_LAST_NAME${RIGHT}`] = disclosure.reporterInfo.lastName;
  return variables;
}

