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

var migrationUtils = require('../migration-utils');

exports.up = function(knex) {
  return knex.schema.createTable('disclosure_type', function(table) {
    table.integer('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.boolean('enabled').notNullable();
    table.engine('InnoDB');
  })
  .createTable('config', function(table) {
    table.increments('id').notNullable();
    table.text('config'); //--json object with config elements
  })
  .createTable('disclosure_status', function(table) {
    table.integer('status_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.engine('InnoDB');
  })
  .createTable('disposition_type', function(table) {
    table.integer('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.engine('InnoDB');
  })
  .createTable('disclosure', function(table) {
    table.increments('id').notNullable();
    table.integer('type_cd').notNullable().references('type_cd').inTable('disclosure_type');
    table.string('title', 200);
    table.integer('disposition_type_cd').references('type_cd').inTable('disposition_type');
    table.integer('status_cd').notNullable().references('status_cd').inTable('disclosure_status');
    table.string('user_id', 40).notNullable();
    table.string('submitted_by', 200).index();
    table.dateTime('submitted_date', true).index();
    table.dateTime('revised_date', true).index();
    table.dateTime('start_date', true).notNullable();
    table.dateTime('expired_date', true);
    table.dateTime('last_review_date', true);
    table.integer('config_id').unsigned().notNullable().index().references('id').inTable('config');
    table.engine('InnoDB');
  })
  .createTable('disclosure_archive', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.string('approved_by', 200).notNullable();
    table.dateTime('approved_date', true).notNullable();
    table.text('disclosure').notNullable();
    table.engine('InnoDB');
  })
  .createTable('fin_entity', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.boolean('active');
    table.string('name', 200);
    table.string('description', 200);
    table.string('status', 40).notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship_person_type', function(table) {
    table.increments('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.boolean('active').notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship_category_type', function(table) {
    table.increments('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.boolean('enabled').notNullable();
    table.boolean('type_enabled').notNullable();
    table.boolean('amount_enabled').notNullable();
    table.boolean('destination_enabled').notNullable();
    table.boolean('date_enabled').notNullable();
    table.boolean('reason_enabled').notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship_type', function(table) {
    table.increments('type_cd').notNullable().primary();
    table.integer('relationship_cd').unsigned().notNullable().references('type_cd').inTable('relationship_category_type');
    table.string('description', 50).notNullable();
    table.boolean('active').notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship_amount_type', function(table) {
    table.increments('type_cd').notNullable().primary();
    table.integer('relationship_cd').unsigned().notNullable().references('type_cd').inTable('relationship_category_type');
    table.string('description', 50).notNullable();
    table.boolean('active').notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship', function(table) {
    table.increments('id').notNullable();
    table.integer('fin_entity_id').unsigned().notNullable().index().references('id').inTable('fin_entity');
    table.integer('relationship_cd').unsigned().notNullable().references('type_cd').inTable('relationship_category_type');
    table.integer('person_cd').unsigned().notNullable().index().references('type_cd').inTable('relationship_person_type');
    table.integer('type_cd').unsigned().index().references('type_cd').inTable('relationship_type');
    table.integer('amount_cd').unsigned().index().references('type_cd').inTable('relationship_amount_type');
    table.string('comments', 4000);
    table.boolean('active').notNullable().defaultTo(true);
    table.string('status', 40).notNullable();
    table.dateTime('disclosed_date', true);
    table.engine('InnoDB');
  })
  .createTable('project_type', function(table) {
    table.integer('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.engine('InnoDB');
  })
  // -- sponsor_cd comes from an external system.  no fk constraint.
  .createTable('project', function(table) {
    table.increments('id').notNullable();
    table.string('title', 200).notNullable();
    table.integer('type_cd').notNullable().references('type_cd').inTable('project_type');
    table.string('source_system', 20).notNullable();
    table.string('source_identifier', 50).notNullable();
    table.unique(['source_system', 'source_identifier']);
    table.string('source_status', 75);
    table.string('sponsor_cd', 6);
    table.string('sponsor_name', 200);
    table.dateTime('start_date', true);
    table.dateTime('end_date', true);
    table.engine('InnoDB');
  })
  .createTable('project_person', function(table) {
    table.increments('id').notNullable();
    table.integer('project_id').unsigned().notNullable().references('id').inTable('project');
    table.string('person_id', 40).notNullable();
    table.string('source_person_type', 20).notNullable();
    table.string('role_cd', 50).notNullable();
    table.unique(['project_id', 'person_id', 'source_person_type', 'role_cd'], 'proj_person_role_unqiue');
    table.boolean('active').notNullable();
    table.engine('InnoDB');
  })
  .createTable('declaration_type', function(table) {
    table.increments('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.boolean('enabled').notNullable();
    table.boolean('custom').notNullable();
    table.boolean('active').notNullable();
    table.engine('InnoDB');
  })
  .createTable('declaration', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.integer('fin_entity_id').unsigned().notNullable().index().references('id').inTable('fin_entity');
    table.integer('project_id').unsigned().notNullable().index().references('id').inTable('project');
    table.integer('type_cd').unsigned().index().references('type_cd').inTable('declaration_type');
    table.string('comments', 4000);
    table.engine('InnoDB');
  })
  .createTable('questionnaire_type', function(table) {
    table.integer('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.engine('InnoDB');
  })
  .createTable('questionnaire', function(table) {
    table.increments('id').notNullable();
    table.integer('type_cd').notNullable().references('type_cd').inTable('questionnaire_type');
    table.integer('version').unsigned().notNullable();
  })
  .createTable('questionnaire_question', function(table) {
    table.increments('id').notNullable();
    table.boolean('active').notNullable();
    table.integer('questionnaire_id').unsigned().notNullable().index().references('id').inTable('questionnaire');
    table.integer('parent').unsigned().index().references('id').inTable('questionnaire_question');
    table.text('question'); // -- json object containing question
  })
  .createTable('questionnaire_answer', function(table) {
    table.increments('id').notNullable();
    table.integer('question_id').unsigned().notNullable().index().references('id').inTable('questionnaire_question');
    table.text('answer'); // -- json object containing answer
  })
  .createTable('disclosure_answer', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.integer('questionnaire_answer_id').unsigned().notNullable().index().references('id').inTable('questionnaire_answer');
    table.unique(['disclosure_id', 'questionnaire_answer_id']);
  })
  .createTable('fin_entity_answer', function(table) {
    table.increments('id').notNullable();
    table.integer('fin_entity_id').unsigned().notNullable().index().references('id').inTable('fin_entity');
    table.integer('questionnaire_answer_id').unsigned().notNullable().index().references('id').inTable('questionnaire_answer');
    table.unique(['fin_entity_id', 'questionnaire_answer_id']);
  })
  .createTable('travel_relationship', function(table) {
    table.increments('id').notNullable();
    table.integer('relationship_id').unsigned().notNullable().index().references('id').inTable('relationship');
    table.decimal('amount', 12, 2);
    table.text('destination');
    table.date('start_date');
    table.date('end_date');
    table.text('reason');
  })
  .createTable('notification', function(table) {
    table.increments('id').notNullable();
    table.text('reminder_text');
    table.integer('warning_value');
    table.text('warning_period');
    table.boolean('active').notNullable();
  })
  .createTable('file', function(table) {
    table.increments('id').notNullable();
    table.string('file_type').notNullable();
    table.integer('ref_id').unsigned().notNullable();
    table.string('type').notNullable();
    table.string('key').notNullable();
    table.string('name').notNullable();
    table.string('user_id', 40).notNullable();
    table.string('uploaded_by').notNullable();
    table.dateTime('upload_date', true);
  })
  .createTable('comment', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.string('topic_section', 50).notNullable();
    table.integer('topic_id').unsigned().notNullable();
    table.text('text').notNullable();
    table.string('user_id', 40).notNullable();
    table.string('author', 50).notNullable();
    table.dateTime('date', true).notNullable();
    table.boolean('pi_visible').notNullable();
    table.boolean('reviewer_visible').notNullable();
  })
  .createTable('pi_review', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.string('target_type', 25).notNullable();
    table.integer('target_id').unsigned().notNullable();
    table.dateTime('reviewed_on', true);
    table.boolean('revised');
    table.boolean('responded_to');
  }).then(function() {
    return Promise.all([
      knex('disclosure_status').insert({status_cd: 1, description: 'In Progress'}),
      knex('disclosure_status').insert({status_cd: 2, description: 'Submitted for Approval'}),
      knex('disclosure_status').insert({status_cd: 3, description: 'Up to Date'}),
      knex('disclosure_status').insert({status_cd: 4, description: 'Updates Required'}),
      knex('disclosure_status').insert({status_cd: 5, description: 'Expired'}),
      knex('disclosure_status').insert({status_cd: 6, description: 'Resubmitted'})
    ]);
  }).then(function() {
    return Promise.all([
      knex('disclosure_type').insert({type_cd: 1, description: 'Manual Disclosure', enabled: false}),
      knex('disclosure_type').insert({type_cd: 2, description: 'Annual Disclosure', enabled: true}),
      knex('disclosure_type').insert({type_cd: 3, description: 'Project Disclosure', enabled: false}),
      knex('disclosure_type').insert({type_cd: 4, description: 'Travel Log', enabled: false})
    ]);
  }).then(function() {
    return Promise.all([
      knex('disposition_type').insert({type_cd: 1, description: '222'})
    ]);
  }).then(function() {
    return Promise.all([
      knex('project_type').insert({type_cd: 1, description: 'Proposal'}),
      knex('project_type').insert({type_cd: 2, description: 'Institutional Proposal'}),
      knex('project_type').insert({type_cd: 3, description: 'IRB Protocol'}),
      knex('project_type').insert({type_cd: 4, description: 'IACUC Protocol'}),
      knex('project_type').insert({type_cd: 5, description: 'Award'})
    ]);
  }).then(function() {
    return Promise.all([
      knex('relationship_person_type').insert({description: 'Self', active: true}),
      knex('relationship_person_type').insert({description: 'Spouse', active: true}),
      knex('relationship_person_type').insert({description: 'Other', active: true}),
      knex('relationship_person_type').insert({description: 'Entity', active: true})
    ]);
  }).then(function() {
    return Promise.all([
      knex('declaration_type').insert({type_cd: 1, description: 'No Conflict', enabled: true, custom: false, active: true}),
      knex('declaration_type').insert({type_cd: 2, description: 'Managed Relationship', enabled: true, custom: false, active: true}),
      knex('declaration_type').insert({type_cd: 3, description: 'Potential Relationship', enabled: true, custom: true, active: true})
    ]);
  }).then(function() {
    return Promise.all([
      knex('relationship_category_type')
        .insert({
          type_cd: 1,
          description: 'Ownership',
          enabled: true,
          type_enabled: true,
          amount_enabled: true,
          destination_enabled: false,
          date_enabled: false,
          reason_enabled: false
        })
        .then(function() {
          return Promise.all([
            knex('relationship_type').insert({relationship_cd: 1, description: 'Stock', active: true})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 1, description: 'Stock Options', active: true});})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 1, description: 'Other Ownership', active: true});}),
            knex('relationship_amount_type').insert({relationship_cd: 1, description: '$1 - $5,000', active: true})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 1, description: '$5,001 - $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 1, description: 'Over $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 1, description: 'Privately Held, no valuation', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 1, description: 'Does not apply', active: true});})
          ]);
        }),
      knex('relationship_category_type')
        .insert({
          type_cd: 2,
          description: 'Offices/Positions',
          enabled: true,
          type_enabled: true,
          amount_enabled: true,
          destination_enabled: false,
          date_enabled: false,
          reason_enabled: false
        })
        .then(function() {
          return Promise.all([
            knex('relationship_type').insert({relationship_cd: 2, description: 'Board Member', active: true})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 2, description: 'Partner', active: true});})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 2, description: 'Other Managerial Positions', active: true});})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 2, description: 'Founder', active: true});}),
            knex('relationship_amount_type').insert({relationship_cd: 2, description: '$1 - $5,000', active: true})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 2, description: '$5,001 - $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 2, description: 'Over $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 2, description: 'Privately Held, no valuation', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 2, description: 'Does not apply', active: true});})
          ]);
        }),
      knex('relationship_category_type')
        .insert({
          type_cd: 3,
          description: 'Paid Activities',
          enabled: true,
          type_enabled: false,
          amount_enabled: true,
          destination_enabled: false,
          date_enabled: false,
          reason_enabled: false
        })
        .then(function() {
          return knex('relationship_amount_type').insert({relationship_cd: 3, description: '$1 - $5,000', active: true})
            .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 3, description: '$5,001 - $10,000', active: true});})
            .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 3, description: 'Over $10,000', active: true});})
            .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 3, description: 'Privately Held, no valuation', active: true});})
            .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 3, description: 'Does not apply', active: true});});
        }),
      knex('relationship_category_type')
        .insert({
          type_cd: 4,
          description: 'Intellectual Property',
          enabled: true,
          type_enabled: true,
          amount_enabled: true,
          destination_enabled: false,
          date_enabled: false,
          reason_enabled: false
        })
        .then(function() {
          return Promise.all([
            knex('relationship_type').insert({relationship_cd: 4, description: 'Royalty Income', active: true})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 4, description: 'Intellectual Property Rights', active: true});}),
            knex('relationship_amount_type').insert({relationship_cd: 4, description: '$1 - $5,000', active: true})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 4, description: '$5,001 - $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 4, description: 'Over $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 4, description: 'Privately Held, no valuation', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 4, description: 'Does not apply', active: true});})
          ]);
        }),
      knex('relationship_category_type')
        .insert({type_cd: 5, description: 'Other', enabled: true, type_enabled: true, amount_enabled: true, destination_enabled: false, date_enabled: false, reason_enabled: false})
        .then(function() {
          return Promise.all([
            knex('relationship_type').insert({relationship_cd: 5, description: 'Contract', active: true})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 5, description: 'Other Transactions', active: true});}),
            knex('relationship_amount_type').insert({relationship_cd: 5, description: '$1 - $5,000', active: true})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 5, description: '$5,001 - $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 5, description: 'Over $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 5, description: 'Privately Held, no valuation', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 5, description: 'Does not apply', active: true});})
          ]);
        }),
      knex('relationship_category_type')
        .insert({type_cd: 6, description: 'Travel', enabled: false, type_enabled: false, amount_enabled: true, destination_enabled: true, date_enabled: true, reason_enabled: true})
    ]);
  }).then(function() {
    return Promise.all([
      knex('questionnaire_type').insert({type_cd: 1, description: 'Screening'}),
      knex('questionnaire_type').insert({type_cd: 2, description: 'Entity'})
    ]);
  }).then(function() {
    return knex('questionnaire').insert({
      version: 1,
      type_cd: 1
    }, 'id').options({rowMode: 'array'})
      .then(function(questionnaireId) {
        return Promise.all([
          migrationUtils.insertQuestionnaireQuestion(knex, questionnaireId[0], 'From any for-profit organization, did you receive in the last 12 months, or do you expect to receive in the next 12 months, salary, director\'s fees, consulting payments, honoraria, royalties; or other payments for patents, copyrights or other intellectual property; or other direct payments exceeding $5,000?', 1, undefined, undefined, true),
          migrationUtils.insertQuestionnaireQuestion(knex, questionnaireId[0], 'From any privately held organization, do you have stock, stock options, or other equity interest of any value?', 2),
          migrationUtils.insertQuestionnaireQuestion(knex, questionnaireId[0], 'Some publicly traded stock must be disclosed, but only in specific circumstances. Do you own stock, which in aggregate exceeds $5,000, in a company that provides funds to this institution in support of your Institutional Responsibilities (e.g. teaching, research, committee, or other administrative responsibilities)? When aggregating, please consider stock, stock options, warrants and other existing or contingent ownership interests in the publicly held company. Do not consider investments where you do not directly influence investment decisions, such as mutual funds and retirement accounts.', 3),
          migrationUtils.insertQuestionnaireQuestion(knex, questionnaireId[0], 'From US educational institutions, US teaching hospitals or US research institutions affiliated with US educational institutions: Did you receive in the last 12 months, or do you expect to receive in the next 12 months, payments for services, which in aggregate exceed $5,000 (e.g. payments for consulting, board positions, patents, copyrights or other intellectual property)? Exclude payments for scholarly or academic works (i.e. peer-reviewed (vs. editorial reviewed) articles or books based on original research or experimentation, published by an academic association or a university/academic press).', 4)
        ]);
      });
  }).then(function() {
    return knex('questionnaire').insert({
      version: 1,
      type_cd: 2
    }, 'id')
    .then(function(questionnaireId) {
      return Promise.all([
        migrationUtils.insertQuestionnaireQuestion(knex, questionnaireId[0], 'Type:', 1, 'Multiselect', ['State Government', 'County Government', 'Small Business'], false, 1),
        migrationUtils.insertQuestionnaireQuestion(knex, questionnaireId[0], 'Is this entity public?', 2, 'Yes/No'),
        migrationUtils.insertQuestionnaireQuestion(knex, questionnaireId[0], 'Does this entity sponsor any of your research?', 3),
        migrationUtils.insertQuestionnaireQuestion(knex, questionnaireId[0], 'Describe the entity\'s area of business and your relationship to it:', 4, 'Text area')
      ]);
    });
  }).then(function() {
    return migrationUtils.insertInitialArchiveConfig(knex);
  });
};

exports.down = function() {
};
