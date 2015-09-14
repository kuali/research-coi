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

export let getConfig = (dbInfo, userId, callback, optionalTrx) => {
  var config = mockDB.UIT;
  let knex = getKnex(dbInfo);

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }
  Promise.all([
    query.select('*').from('questionnaire_question'),
    query.select('type_cd as typeCd', 'description').from('fin_entity_type'),
    query.select('type_cd as typeCd', 'description').from('relationship_category_type'),
    query.select('type_cd as typeCd', 'relationship_cd as relationshipTypeCd', 'description').from('relationship_type'),
    query.select('type_cd as typeCd', 'description').from('relationship_person_type'),
    query.select('type_cd as typeCd', 'description').from('relationship_amount_type'),
    query.select('status_cd as statusCd', 'description').from('relationship_status')
  ])
  .then(result=>{
    config.questions = result[0].map(question => {
      question.text = JSON.parse(question.question).text;
      return question;
    });

    config.entityTypes = result[1];
    config.relationshipCategoryTypes = result[2];
    config.relationshipTypes = result[3];
    config.relationshipPersonTypes = result[4];
    config.relationshipAmountTypes = result[5];
    config.relationshipStatuses = result[6];
    callback(undefined, config);
  })
  .catch(function(err) {
    if (optionalTrx) {
      optionalTrx.rollback();
    }
    callback(err);
  });
};

export let setConfig = (req, userId) => {
  mockDB.UIT = req.body;
};
