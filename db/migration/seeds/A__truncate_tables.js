/*eslint-disable camelcase */

exports.seed = function(knex, Promise) {
  console.log('Truncating tables');
  return Promise.join(
    knex('declaration').del(),
    knex('relationship').del(),
    knex('travel_log_entry').del(),
    knex('disclosure_answer').del()
  ).then(function() {
    return Promise.join(
      knex('project').del(),
      knex('questionnaire_answer').del(),
      knex('relationship_status').del(),
      knex('relationship_amount_type').del(),
      knex('relationship_person_type').del(),
      knex('relationship_category_type').del(),
      knex('fin_entity').del(),
      knex('questionnaire_question').update({parent: null})
    ).then(function() {
      return Promise.join(
        knex('project_role').del(),
        knex('project_type').del(),
        knex('questionnaire_question').del(),
        knex('relationship_type').del(),
        knex('fin_entity_type').del(),
        knex('disclosure').del()
      ).then(function() {
        Promise.join(
          knex('questionnaire').del(),
          knex('disclosure_status').del(),
          knex('disposition_type').del(),
          knex('disclosure_type').del()
        );
      });
    });
  });
};
