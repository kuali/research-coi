exports.seed = function(knex, Promise) {
  return Promise.join(
  knex('disclosure_answers').insert({
    disclosure_id: 1,
    questionnaire_answers_id: 1
  })
  );
};
