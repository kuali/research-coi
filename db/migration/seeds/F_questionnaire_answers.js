exports.seed = function(knex, Promise) {
  var answers = [
    {
      id: 1,
      value: 'yes'
    },
    {
      id: 2,
      value: 'no'
    },
    {
      id: 3,
      value: 'yes'
    },
    {
      id: 4,
      value: 'no'
    }
  ];

  return Promise.join(
  knex('questionnaire_answers').insert({
    questionnaire_id: 1,
    answers: JSON.stringify(answers)
  })
  );
};
