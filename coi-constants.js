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

export const DISCLOSURE_STEP = {
  QUESTIONNAIRE: 'Questionnaire',
  QUESTIONNAIRE_SUMMARY: 'questionnairesummary',
  ENTITIES: 'entities',
  PROJECTS: 'projects',
  MANUAL: 'manual',
  CERTIFY: 'certify'
};

export const INSTRUCTION_STEP = {
  SCREENING_QUESTIONNAIRE: 'Questionnaire',
  FINANCIAL_ENTITIES: 'Financial Entities',
  PROJECT_DECLARATIONS: 'Project Declaration',
  CERTIFICATION: 'Certification'
};

export const DISCLOSURE_STATUS = {
  IN_PROGRESS: 1,            // Admin: <not shown>
  SUBMITTED_FOR_APPROVAL: 2,
  UP_TO_DATE: 3,             // Admin: Approved
  REVISION_REQUIRED: 4,       // Admin: Sent back
  EXPIRED: 5,
  RESUBMITTED: 6,
  UPDATE_REQUIRED: 7
};

export const DATE_TYPE = {
  ASSIGNED: 'Assigned',
  COMPLETED: 'Completed'
};

export const FILE_TYPE = {
  FINANCIAL_ENTITY: 'financialEntity',
  DISCLOSURE: 'disclosure',
  MANAGEMENT_PLAN: 'managementPlan',
  ADMIN: 'admin'
};

export const DISCLOSURE_TYPE = {
  MANUAL: '1',
  ANNUAL: '2',
  PROJECT: '3',
  TRAVEL: '4'
};

export const SORT_DIRECTION = {
  ASCENDING: 'ASCENDING',
  DESCENDING: 'DESCENDING'
};

export const ARCHIVE_SORT_FIELD = {
  TITLE: 'TITLE',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  START: 'START',
  TYPE: 'TYPE'
};

export const ENTITY_RELATIONSHIP = {
  OWNERSHIP: 1,
  OFFICES_POSITIONS: 2,
  PAID_ACTIVITIES: 3,
  INTELLECTUAL_PROPERTY: 4,
  OTHER: 5,
  TRAVEL: 6
};

export const QUESTION_TYPE = {
  YESNO: 'Yes/No',
  YESNONA: 'Yes/No/NA',
  NUMBER: 'Number',
  DATE: 'Date',
  TEXTAREA: 'Text area',
  MULTISELECT: 'Multiselect'
};

export const RETURN_KEY = 13;

export const TMP_PLACEHOLDER = 'TMP';

export const QUESTIONNAIRE_TYPE = {
  SCREENING: 'screening',
  ENTITY: 'entities'
};

export const ROLES = {
  ADMIN: 'admin',
  REVIEWER: 'reviewer',
  USER: 'user'
};

export const RELATIONSHIP_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN PROGRESS',
  DISCLOSED: 'DISCLOSED'
};

export const LOG_LEVEL = {
  INFO: 0,
  WARN: 1,
  ERROR: 2
};

export const STATE_TYPE = {
  ANNUAL_DISCLOSURE_STATE: 'annual_disclosure_state'
};

export const NOT_YET_DISCLOSED = 'Not Yet Disclosed';

export const DISCLOSURE_NOT_REQUIRED = 'Disclosure Not Required';

export const SYSTEM_USER = 'system';

export const COI_ADMIN = 'COI Admin';

export const PI_ROLE_CODE = 'PI';

export const EDITABLE_STATUSES = [
  DISCLOSURE_STATUS.EXPIRED,
  DISCLOSURE_STATUS.IN_PROGRESS,
  DISCLOSURE_STATUS.UP_TO_DATE,
  DISCLOSURE_STATUS.UPDATE_REQUIRED
];

export const APPROVED_STATUSES = [
  DISCLOSURE_STATUS.EXPIRED,
  DISCLOSURE_STATUS.UP_TO_DATE,
  DISCLOSURE_STATUS.UPDATE_REQUIRED
];

export const NOTIFICATIONS_MODE = {
  OFF: 0,
  TEST: 1,
  PROD: 2
};

export const LANES = {
  TEST: 'tst',
  STAGE: 'stg',
  SANDBOX: 'sbx',
  PRODUCTION: 'prd'
};

export const NO_DISPOSITION = -1;

export const ADMIN_PAGE_SIZE = 40;

export const COIConstants = {
  DISCLOSURE_STEP,
  INSTRUCTION_STEP,
  DISCLOSURE_STATUS,
  FILE_TYPE,
  DISCLOSURE_TYPE,
  SORT_DIRECTION,
  ARCHIVE_SORT_FIELD,
  ENTITY_RELATIONSHIP,
  QUESTION_TYPE,
  RETURN_KEY,
  TMP_PLACEHOLDER,
  QUESTIONNAIRE_TYPE,
  ROLES,
  RELATIONSHIP_STATUS,
  LOG_LEVEL,
  STATE_TYPE,
  NOT_YET_DISCLOSED,
  DISCLOSURE_NOT_REQUIRED,
  SYSTEM_USER,
  DATE_TYPE,
  EDITABLE_STATUSES,
  APPROVED_STATUSES,
  COI_ADMIN,
  NOTIFICATIONS_MODE,
  PI_ROLE_CODE,
  LANES,
  NO_DISPOSITION,
  ADMIN_PAGE_SIZE
};
