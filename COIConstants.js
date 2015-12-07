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

export let COIConstants = {
  DISCLOSURE_STEP: {
    QUESTIONNAIRE: 'Questionnaire',
    QUESTIONNAIRE_SUMMARY: 'questionnairesummary',
    ENTITIES: 'entities',
    PROJECTS: 'projects',
    MANUAL: 'manual',
    CERTIFY: 'certify'
  },
  INSTRUCTION_STEP: {
    SCREENING_QUESTIONNAIRE: 'Questionnaire',
    FINANCIAL_ENTITIES: 'Financial Entities',
    PROJECT_DECLARATIONS: 'Project Declaration',
    CERTIFICATION: 'Certification'
  },
  DISCLOSURE_STATUS: {
    IN_PROGRESS: 1,            // Admin: <not shown>
    SUBMITTED_FOR_APPROVAL: 2,
    UP_TO_DATE: 3,             // Admin: Approved
    UPDATES_REQUIRED: 4,       // Admin: Sent back
    EXPIRED: 5,
    RESUBMITTED: 6
  },
  FILE_TYPE: {
    FINANCIAL_ENTITY: 'financialEntity',
    DISCLOSURE: 'disclosure',
    MANAGEMENT_PLAN: 'managementPlan'
  },
  DISCLOSURE_TYPE: {
    MANUAL: '1',
    ANNUAL: '2',
    PROJECT: '3',
    TRAVEL: '4'
  },
  SORT_DIRECTION: {
    ASCENDING: 'ASCENDING',
    DESCENDING: 'DESCENDING'
  },
  ARCHIVE_SORT_FIELD: {
    TITLE: 'TITLE',
    SUBMITTED: 'SUBMITTED',
    APPROVED: 'APPROVED',
    START: 'START',
    TYPE: 'TYPE'
  },
  ENTITY_RELATIONSHIP: {
    OWNERSHIP: 1,
    OFFICES_POSITIONS: 2,
    PAID_ACTIVITIES: 3,
    INTELLECTUAL_PROPERTY: 4,
    OTHER: 5,
    TRAVEL: 6
  },
  QUESTION_TYPE: {
    YESNO: 'Yes/No',
    YESNONA: 'Yes/No/NA',
    NUMBER: 'Number',
    DATE: 'Date',
    TEXTAREA: 'Text area',
    MULTISELECT: 'Multiselect'
  },
  RETURN_KEY: 13,
  TMP_PLACEHOLDER: 'TMP',
  QUESTIONNAIRE_TYPE: {
    SCREENING: 'screening',
    ENTITY: 'entities'
  },
  ROLES: {
    ADMIN: 'admin',
    USER: 'user'
  },
  RELATIONSHIP_STATUS: {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN PROGRESS',
    DISCLOSED: 'DISCLOSED'
  },
  LOG_LEVEL: {
    INFO: 0,
    WARN: 1,
    ERROR: 2
  },
  STATE_TYPE: {
    ANNUAL_DISCLOSURE_STATE: 'annual_disclosure_state'
  }
};
