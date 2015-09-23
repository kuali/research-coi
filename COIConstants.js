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
    ENTITIES_QUESTIONNAIRE: 'Financial Entities Questionnaire',
    RELATIONSHIP_MATRIX: 'Relationship Matrix',
    PROJECT_DECLARATIONS: 'Project Declaration',
    CERTIFICATION: 'Certification'
  },
  DISCLOSURE_STATUS: {
    IN_PROGRESS: 1,
    IN_REVIEW: 2,
    APPROVED: 3,
    DISAPPROVED: 4
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
  TMP_PLACEHOLDER: 'TMP'
};
