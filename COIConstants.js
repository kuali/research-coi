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
    OWNERSHIP: 'Ownership',
    OFFICES_POSITIONS: 'Offices/Positions',
    PAID_ACTIVITIES: 'Paid Activities',
    INTELLECTUAL_PROPERTY: 'Intellectual Property',
    OTHER: 'Other'
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
  }
};
