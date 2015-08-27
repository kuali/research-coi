exports.seed = function(knex, Promise) {
  var questions = [
    {
      id: 1,
      text: 'Is the best Rock band Guns N\' Roses?',
      type: 'boolean',
      validations: ['required'],
      subQuestions: [
        {
          id: 11,
          text: 'Who is to blame?',
          type: 'text',
          validations: ['select1', 'required'],
          displayCriteria: {
            value: 'true'
          }
        },
        {
          id: 12,
          text: 'Best drummer?',
          type: 'text',
          validations: ['select1'],
          displayCriteria: {
            value: 'true'
          }
        }
      ]
    },
    {
      id: 2,
      text: 'Is pizza yummy?',
      type: 'boolean',
      validations: ['required'],
      subQuestions: [
      ]
    },
    {
      id: 3,
      text: 'Do you like Star Trek?',
      type: 'boolean',
      validations: ['required'],
      subQuestions: [
      ]
    }
  ];

  return Promise.join(
    knex('questionnaire').insert({
      instructions: 'Please fill out this questionnaire in order to document your disclosure activities. Thanks! No taking $$ from vendors.',
      version: 1,
      questions: JSON.stringify(questions)
    })
  );
};
