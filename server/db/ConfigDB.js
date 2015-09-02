let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}
let mockDB = {
  'UIT': {
    colors: {
      'one': '#348FF7',
      'two': '#0E4BB6',
      'three': '#048EAF',
      'four': '#EDF2F2'
    },
    'instructions': {
      'questionnaire': 'For each question that is presented, choose the most appropriate answer. As you select answers the questionnaire will progress to the next step.',
      'questionnairesummary': 'Review your answers here. If an answer is wrong click edit and change your answer. Once all answers are correct, proceed to the next step.',
      'entities': 'Here you can add new financial entities and review existing ones. If an entity no longer applies click "Deactivate".',
      'projects': 'On this step you can review each of your projects and disclose if any of your financial entities have a conflict of interest with the project.',
      'manual': 'Manual instructions go here',
      'certify': 'Please read the certification text. If you agree with the statement, check the box and click "Certify"'
    }
  }
};

export let getConfig = (dbInfo, callback, optionalTrx) => {
  var config = mockDB.UIT;
  let knex = getKnex(dbInfo);

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }

  query.select('*')
  .from('questionnaire_question')
  .then( result => {
    let formattedQuestions = [];
    result.forEach(question => {
      let formattedQuestion = {};
      formattedQuestion.id = question.id;
      formattedQuestion.text = JSON.parse(question.question).text;
      formattedQuestions.push(formattedQuestion);
    })
    config.questions = formattedQuestions;
    callback(undefined, config);
  })
  .catch(function(err) {
    if (optionalTrx) {
      optionalTrx.rollback();
    }
    callback(err);
  });
};

export let setConfig = (req) => {
  mockDB.UIT = req.body;
};
