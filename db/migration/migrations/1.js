exports.up = function(knex, Promise) { //eslint-disable-line no-unused-vars
  return knex.schema.createTable('disclosure_type', function(table) {
    table.integer('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.boolean('enabled').notNullable();
    table.engine('InnoDB');
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
    table.integer('user_id').notNullable();
    table.string('submitted_by', 200).index();
    table.dateTime('submitted_date').index();
    table.dateTime('revised_date').index();
    table.dateTime('start_date').notNullable();
    table.dateTime('expired_date');
    table.dateTime('last_review_date');
    table.engine('InnoDB');
  })
  .createTable('disclosure_archive', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.string('approved_by', 200).notNullable();
    table.dateTime('approved_date').notNullable();
    table.text('disclosure').notNullable();
    table.engine('InnoDB');
  })
  .createTable('fin_entity', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.boolean('active');
    table.string('name', 200);
    table.string('description', 200);
    table.engine('InnoDB');
  })
  .createTable('relationship_person_type', function(table) {
    table.increments('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.boolean('active').notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship_category_type', function(table) {
    table.integer('type_cd').notNullable().primary();
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
    table.integer('relationship_cd').notNullable().references('type_cd').inTable('relationship_category_type');
    table.string('description', 50).notNullable();
    table.boolean('active').notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship_amount_type', function(table) {
    table.increments('type_cd').notNullable().primary();
    table.integer('relationship_cd').notNullable().references('type_cd').inTable('relationship_category_type');
    table.string('description', 50).notNullable();
    table.boolean('active').notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship', function(table) {
    table.increments('id').notNullable();
    table.integer('fin_entity_id').unsigned().notNullable().index().references('id').inTable('fin_entity');
    table.integer('relationship_cd').references('type_cd').inTable('relationship_category_type');
    table.integer('person_cd').unsigned().notNullable().index().references('type_cd').inTable('relationship_person_type');
    table.integer('type_cd').unsigned().index().references('type_cd').inTable('relationship_type');
    table.integer('amount_cd').unsigned().index().references('type_cd').inTable('relationship_amount_type');
    table.string('comments', 4000);
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
    table.dateTime('start_date');
    table.dateTime('end_date');
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
    table.integer('questionnaire_id').unsigned().notNullable().index().references('id').inTable('questionnaire').onDelete('NO ACTION').onUpdate('NO ACTION');
    table.integer('parent').unsigned().index().references('id').inTable('questionnaire_question').onDelete('NO ACTION').onUpdate('NO ACTION');
    table.text('question'); // -- json object containing question
  })
  .createTable('questionnaire_answer', function(table) {
    table.increments('id').notNullable();
    table.integer('question_id').unsigned().notNullable().index().references('id').inTable('questionnaire_question').onDelete('NO ACTION').onUpdate('NO ACTION');
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
    table.string('uploaded_by').notNullable();
    table.dateTime('upload_date');
  })
  .createTable('config', function(table) {
    table.text('name');
    table.text('config'); //--json object with config elements
  })
  .createTable('comment', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.string('topic_section', 50).notNullable();
    table.integer('topic_id').unsigned().notNullable();
    table.text('text').notNullable();
    table.integer('user_id').notNullable();
    table.string('author', 50).notNullable();
    table.dateTime('date').notNullable();
    table.boolean('pi_visible').notNullable();
    table.boolean('reviewer_visible').notNullable();
  })
  .createTable('pi_review', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.string('target_type', 25).notNullable();
    table.integer('target_id').unsigned().notNullable();
    table.dateTime('reviewed_on');
    table.boolean('revised');
    table.boolean('responded_to');
  });
};

exports.down = function(knex, Promise) { //eslint-disable-line no-unused-vars
};
