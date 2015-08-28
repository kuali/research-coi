exports.up = function(knex, Promise) { //eslint-disable-line no-unused-vars
  return knex.schema.createTable('disclosure_type', function(table) {
    table.integer('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
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
    table.boolean('public');
    table.integer('type_cd').references('type_cd').inTable('fin_entity_type');
    table.boolean('sponsor');
    table.string('name', 200);
    table.string('description', 200);
    table.engine('InnoDB');
  })
  .createTable('relationship_person_type', function(table) {
    table.integer('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship_type', function(table) {
    table.integer('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship_category_type', function(table) {
    table.integer('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship_amount_type', function(table) {
    table.integer('type_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship', function(table) {
    table.increments('id').notNullable();
    table.integer('fin_entity_id').unsigned().notNullable().index().references('id').inTable('fin_entity');
    table.integer('type_cd').references('type_cd').inTable('relationship_type');
    table.integer('person_type_cd').notNullable().references('type_cd').inTable('relationship_person_type');
    table.integer('relationship_category_cd').references('type_cd').inTable('relationship_category_type');
    table.integer('amount_cd').references('type_cd').inTable('relationship_amount_type');
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
    table.string('name', 200).notNullable();
    table.integer('type_cd').notNullable().references('type_cd').inTable('project_type');
    table.string('role_cd', 50).notNullable().references('role_cd').inTable('project_role');
    table.string('sponsor_cd', 6).notNullable();
    table.engine('InnoDB');
  })
  .createTable('relationship_status', function(table) {
    table.integer('status_cd').notNullable().primary();
    table.string('description', 50).notNullable();
    table.engine('InnoDB');
  })
  .createTable('declaration', function(table) {
    table.increments('id').notNullable();
    table.integer('fin_entity_id').unsigned().notNullable().index().references('id').inTable('fin_entity');
    table.integer('project_id').unsigned().notNullable().index().references('id').inTable('project');
    table.integer('relationship_status_cd').notNullable().references('status_cd').inTable('relationship_status');
    table.string('comments', 4000);
    table.engine('InnoDB');
  })
  .createTable('questionnaire', function(table) {
    table.increments('id').notNullable();
    table.string('instructions', 4000); // -- markdown
    table.integer('version').unsigned().notNullable();
    table.text('questions'); // -- json object containing questions
  })
  .createTable('questionnaire_answers', function(table) {
    table.increments('id').notNullable();
    table.integer('questionnaire_id').unsigned().notNullable().index().references('id').inTable('questionnaire').onDelete('NO ACTION').onUpdate('NO ACTION');
    table.text('answers'); // -- json object containing answers
  })
  .createTable('travel_log_entry', function(table) {
    table.increments('id').notNullable();
    table.integer('fin_entity_id').unsigned().notNullable().index().references('id').inTable('fin_entity');
    table.decimal('amount', 12, 2);
    table.text('destination');
    table.dateTime('start_date');
    table.dateTime('end_date');
    table.text('reason');
  });
};

exports.down = function(knex, Promise) { //eslint-disable-line no-unused-vars
};
