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
    table.string('submitted_by', 40);
    table.dateTime('submitted_date');
    table.dateTime('start_date').notNullable();
    table.dateTime('expired_date');
    table.dateTime('last_review_date');
    table.dateTime('approved_date');
    table.engine('InnoDB');
  })
  .createTable('fin_entity_type', function(table) {
    table.integer('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.engine('InnoDB');
  })
  .createTable('fin_entity', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.boolean('active');
    table.boolean('is_public');
    table.integer('type_cd').references('type_cd').inTable('fin_entity_type');
    table.boolean('is_sponsor');
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
  .createTable('project_role', function(table) {
    table.string('role_cd', 5).notNullable().primary();
    table.string('description', 50).notNullable();
    table.engine('InnoDB');
  })
  // -- sponsor_cd comes from an external system.  no fk constraint.
  .createTable('project', function(table) {
    table.increments('id').notNullable();
    table.integer('disclosure_id').unsigned().notNullable().index().references('id').inTable('disclosure');
    table.string('name', 200).notNullable();
    table.integer('type_cd').notNullable().references('type_cd').inTable('project_type');
    table.string('role_cd', 50).notNullable().references('role_cd').inTable('project_role');
    table.string('sponsor_cd', 6).notNullable();
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
    table.string('instructions', 4000); // -- markdown
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
  .createTable('travel_log_entry', function(table) {
    table.increments('id').notNullable();
    table.integer('fin_entity_id').unsigned().notNullable().index().references('id').inTable('fin_entity');
    table.decimal('amount', 12, 2);
    table.text('destination');
    table.dateTime('start_date');
    table.dateTime('end_date');
    table.text('reason');
  })
  .createTable('notification', function(table) {
    table.increments('id').notNullable();
    table.text('reminder_text');
    table.integer('warning_value');
    table.text('warning_period');
    table.boolean('active').notNullable();
  });
};

exports.down = function(knex, Promise) { //eslint-disable-line no-unused-vars
};
