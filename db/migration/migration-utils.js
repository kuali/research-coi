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

/*  eslint-disable
 camelcase,
 no-console,
 no-magic-numbers,
 no-var,
 object-shorthand,
 prefer-template,
 prefer-arrow-callback,
 max-len
 */
var moment = require('moment');

function insertQuestionnaireSubquestion(knex, questionnaireId, parentId, numberToShow) {
  return knex('questionnaire_question').insert({
    questionnaire_id: questionnaireId,
    parent: parentId,
    active: true,
    question: JSON.stringify({
      order: 1,
      text: 'Please explain.',
      type: 'Text area',
      displayCriteria: 'Yes',
      numberToShow: numberToShow + '-A'
    })
  }, 'id');
}

module.exports = {
  insertQuestionnaireQuestion: function(knex, questionnaireId, text, numberToShow, type, options, subquestion, requiredNumSelections) {
    var question = {
      order: numberToShow,
      text: text,
      type: type ? type : 'Yes/No',
      validations: ['required'],
      numberToShow: numberToShow
    };

    if (options) {
      question.options = options;
      question.requiredNumSelections = requiredNumSelections;
    }
    return knex('questionnaire_question').insert({
      questionnaire_id: questionnaireId,
      active: true,
      question: JSON.stringify(question)
    }, 'id').then(function (parentId) {
      if (subquestion) {
        return insertQuestionnaireSubquestion(knex, questionnaireId, parentId[0], numberToShow);
      }
    });
  },

  insertInitialArchiveConfig: function(query) {
    return Promise.all([
      query
        .select(
          'type_cd as typeCd',
          'description',
          'enabled',
          'type_enabled as typeEnabled',
          'amount_enabled as amountEnabled',
          'destination_enabled as destinationEnabled',
          'date_enabled as dateEnabled',
          'reason_enabled as reasonEnabled'
        )
        .from('relationship_category_type'),
      query.select('type_cd as typeCd', 'relationship_cd as relationshipCd', 'description', 'active').from('relationship_type').where('active', true),
      query.select('type_cd as typeCd', 'relationship_cd as relationshipCd', 'description', 'active').from('relationship_amount_type').where('active', true),
      query.select('type_cd as typeCd', 'description', 'active').from('relationship_person_type').where('active', true),
      query.select('type_cd as typeCd', 'description', 'active').from('declaration_type').where('active', true),
      query.select('type_cd as typeCd', 'description', 'enabled').from('disclosure_type'),
      query.select('id', 'reminder_text as reminderText', 'warning_value as warningValue', 'warning_period as warningPeriod', 'active').from('notification'),
      query.select('id', 'type_cd as typeCd', 'version').from('questionnaire').limit(1).where('type_cd', 1).orderBy('version', 'desc').then(function (result) {
        if (result[0]) {
          return query
            .select(
              'id',
              'active',
              'questionnaire_id as questionnaireId',
              'parent',
              'question'
            )
            .from(
              'questionnaire_question as qq'
            )
            .where({
              questionnaire_id: result[0].id,
              active: true
            });
        }
      }),
      query.select('id', 'type_cd as typeCd', 'version').from('questionnaire').limit(1).where('type_cd', 2).orderBy('version', 'desc').then(function (result) {
        if (result[0]) {
          return query
            .select(
              'id',
              'active',
              'questionnaire_id as questionnaireId',
              'parent',
              'question'
            )
            .from('questionnaire_question as qq')
            .where({
              questionnaire_id: result[0].id,
              active: true
            });
        }
      }),
      query.select('status_cd as statusCd', 'description').from('disclosure_status'),
      query.select('type_cd as typeCd', 'description').from('project_type')
    ])
    .then(function (result) {
      var config = {};
      config.matrixTypes = result[0];
      config.matrixTypes.map(function (type) {
        type.typeOptions = result[1].filter(function (relationType) {
          return relationType.relationshipCd === type.typeCd;
        });
        type.amountOptions = result[2].filter(function (amountType) {
          return amountType.relationshipCd === type.typeCd;
        });
        return type;
      });
      config.relationshipPersonTypes = result[3];
      config.declarationTypes = result[4];
      config.disclosureTypes = result[5];
      config.notifications = result[6];
      config.questions = {};
      config.questions.screening = result[7] ? result[7].map(function (question) {
        question.question = JSON.parse(question.question);
        return question;
      }) : [];
      config.questions.entities = result[8] ? result[8].map(function (question) {
        question.question = JSON.parse(question.question);
        return question;
      }) : [];

      config.disclosureStatus = result[9];
      config.projectTypes = result[10];
      config.colors = {
        one: '#348FF7',
        two: '#0E4BB6',
        three: '#048EAF',
        four: '#EDF2F2'
      };
      config.general = {
        peopleEnabled: true,
        sponsorLookup: true,

        dueDate: moment().add(6, 'months').toDate(),
        isRollingDueDate: false,
        instructions: {
          Questionnaire: 'Please answer each question thoughtfully. You will have an opportunity to review and edit your answers after completing the questionnaire.',
          'Financial Entities': 'Please enter all your financial entities and the associated data, which are required. Then indicate the nature of each your relationships with each financial entity.',
          'Project Declaration': 'Select the appropriate project declaration for each of your financial entity-project relationships. You can use the "Set All" function to apply a declaration to all relationships at once.',
          Certification: 'You may add any overall attachments for your annual disclosure.  Then please certify and submit your disclosure for review.'
        },
        certificationOptions: {
          text: 'In accordance with the University\'s policy on Disclosure of Financial Interests and Management of Conflict of Interest Related to Sponsored Projects, the Principal Investigator and all other Investigators who share responsibility for the design, conduct, or reporting of sponsored projects must disclose their personal SIGNIFICANT FINANCIAL INTERESTS in any non-profit foundation or for-profit company that might benefit from the predictable results of those proposed projects.  In addition, when the work to be performed under the proposed research project and the results of the proposed research project would reasonably appear to affect the Investigator\'s SIGNIFICANT FINANCIAL INTEREST, the interest is regarded as being related to the proposed research project and must be reported.',
          required: true
        }
      };

      return query('config').insert({config: JSON.stringify(config)}, 'id');
    });
  }
};

