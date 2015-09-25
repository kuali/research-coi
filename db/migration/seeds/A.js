/*eslint-disable camelcase */

function randomNumberBetween(lowest, highest) {
  return Math.floor(Math.random() * (highest - lowest + 1)) + lowest;
}

function getRandomLastName() {
  switch (randomNumberBetween(0, 19) % 20) {
    case 0: return 'Anderson';
    case 1: return 'Carhart';
    case 2: return 'Edmunds';
    case 3: return 'Grover';
    case 4: return 'Martin';
    case 5: return 'Pasker';
    case 6: return 'Daniels';
    case 7: return 'Ditto';
    case 8: return 'Simmons';
    case 9: return 'Tremon';
    case 10: return 'Wilkerson';
    case 11: return 'Nicholls';
    case 12: return 'Williams';
    case 13: return 'Dehlin';
    case 14: return 'Jackman';
    case 15: return 'Foxley';
    case 16: return 'Osmun';
    case 17: return 'Giles';
    case 18: return 'Boudwin';
    case 19: return 'Williams';
  }
}

function getRandomFirstName() {
  switch (randomNumberBetween(0, 19) % 20) {
    case 0: return 'Chloe';
    case 1: return 'James';
    case 2: return 'Eleanor';
    case 3: return 'Todd';
    case 4: return 'Ross';
    case 5: return 'Ben';
    case 6: return 'Lark';
    case 7: return 'Ann';
    case 8: return 'Nigel';
    case 9: return 'Evan';
    case 10: return 'Joel';
    case 11: return 'Brandon';
    case 12: return 'Drew';
    case 13: return 'Derrick';
    case 14: return 'Gary';
    case 15: return 'Jennie';
    case 16: return 'Hannah';
    case 17: return 'Joe';
    case 18: return 'Chris';
    case 19: return 'Terry';
  }
}

function insertDeclaration(knex, disclosureId, entityId, projectId) {
  return Promise.all([
    knex('declaration').insert({
      disclosure_id: disclosureId,
      fin_entity_id: entityId,
      project_id: projectId,
      type_cd: knex('declaration_type').max('type_cd'),
      comments: 'I need help deciding'
    })
  ]);
}

function insertProject(knex, userId, title) {
  return knex('project').insert({
    user_id: userId,
    name: title,
    type_cd: 1,
    role_cd: 'PI',
    sponsor_cd: '000100'
  });
}

function insertRelationship(knex, entityId) {
  return knex('relationship').insert({
    fin_entity_id: entityId,
    relationship_cd: knex('relationship_category_type').max('type_cd'),
    person_cd: knex('relationship_person_type').max('type_cd'),
    type_cd: knex('relationship_type').max('type_cd'),
    amount_cd: knex('relationship_amount_type').max('type_cd'),
    comments: 'Rel 1 Comments'
  });
}

function insertEntity(knex, disclosureId, name, description) {
  return knex('fin_entity').insert({
    disclosure_id: disclosureId,
    active: true,
    name: name,
    description: description
  })
  .then(function(entityId){
    return insertRelationship(knex, entityId);
  });
}

function insertQuestionnaireSubquestion(knex, questionnaireId, parentId, numberToShow) {
  return knex('questionnaire_question').insert({
    questionnaire_id: questionnaireId,
    parent: parentId,
    active: true,
    question: JSON.stringify({
      order: 1,
      text: 'If Yes, did the organization send you on vacation?',
      type: 'Text area',
      displayCriteria: 'Yes',
      numberToShow: numberToShow + '-A'
    })
  });
}

function insertDisclosureAnswer(knex, disclosureId, questionnaireAnswerId) {
  return knex('disclosure_answer').insert({
    disclosure_id: disclosureId,
    questionnaire_answer_id: questionnaireAnswerId
  });
}

function insertQuestionnaireAnswer(knex, disclosureId, questionnaireId, questionId) {
  return knex('questionnaire_answer').insert({
    question_id: questionId,
    answer: JSON.stringify({
      value: 'no'
    })
  }).then(function(questionnaireAnswerId){
    return insertDisclosureAnswer(knex, disclosureId, questionnaireAnswerId[0]);
  });
}

function insertQuestionnaireQuestion(knex, questionnaireId, text, numberToShow, type, options, subquestion, requiredNumSelections) {
  question = {
    order: numberToShow,
    text: text,
    type: type ? type : 'Yes/No',
    validations: ['required'],
    numberToShow: numberToShow

  }
  if (options) {
    question.options = options;
    question.requiredNumSelections = requiredNumSelections;
  }
  return knex('questionnaire_question').insert({
    questionnaire_id: questionnaireId,
    active: true,
    question: JSON.stringify(question)
  }).then(function (parentId) {
    if (subquestion) {
      return insertQuestionnaireSubquestion(knex, questionnaireId, parentId[0], numberToShow);
    }
  });
}

function insertQuestionAnswers(knex, disclosureId) {
  return knex('questionnaire_question').count('id as count').then(function(count) {
    var statements = [];
    for (var i = 1; i < count[0].count; i++) {
      statements.push(insertQuestionnaireAnswer(knex, disclosureId, 1, i));
    }

    return Promise.all(statements);
  });
}

function hashCode(toHash){
  var hash = 0;
  if (toHash.length === 0) { return hash; }
  for (var i = 0; i < toHash.length; i++) {
    var char = toHash.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

var userNumber = 0;
function getNextUserId() {
  userNumber++;
  return hashCode('p' + userNumber);
}

function insertDisclosure(knex) {
  var submittedDate = new Date(new Date().getTime() - randomNumberBetween(1, 7606400000));
  var revisedDate = null;
  if (randomNumberBetween(1, 4) === 1) {
    revisedDate = new Date(submittedDate.getTime() + 259200000);
  }
  var userId = getNextUserId();

  return knex('disclosure').insert({
    user_id: userId,
    submitted_by: getRandomFirstName() + ' ' + getRandomLastName(),
    type_cd: randomNumberBetween(1, 4),
    title: 'Title - what is this?' + randomNumberBetween(1, 2000),
    submitted_date: submittedDate,
    revised_date: revisedDate,
    disposition_type_cd: 1,
    start_date: new Date(),
    expired_date: new Date(),
    status_cd: randomNumberBetween(1, 4),
    last_review_date: new Date(),
    approved_date: new Date()
  }).then(function(disclosureId) {
    return Promise.all([
      Promise.all([
        insertEntity(knex, disclosureId, 'Apple', 'A company that makes trendy things'),
        insertEntity(knex, disclosureId, 'Monsanto', 'Crazy company that wants to patent life'),
        insertEntity(knex, disclosureId, 'Xerox', 'This is a company that makes copiers and stuff like that'),
        insertProject(knex, userId, 'Glucose levels in heirloom corn'),
        insertProject(knex, userId, 'Longevity of car batteries')
      ]).then(function(results) {
        return Promise.all([
          insertDeclaration(knex, disclosureId, results[0], results[3]),
          insertDeclaration(knex, disclosureId, results[1], results[3]),
          insertDeclaration(knex, disclosureId, results[2], results[3]),
          insertDeclaration(knex, disclosureId, results[0], results[4]),
          insertDeclaration(knex, disclosureId, results[1], results[4]),
          insertDeclaration(knex, disclosureId, results[2], results[4])
        ]);
      }),
      insertQuestionAnswers(knex, disclosureId)
    ]);
  });
}

exports.seed = function(knex, Promise) {
  console.log('Truncating tables');
  //temp raw statement to get seed data working
  return knex.raw('SET FOREIGN_KEY_CHECKS=0').then(function(){
    return knex('declaration').truncate();
  }).then(function() {
    return knex('relationship').truncate();
  }).then(function() {
    return knex('travel_log_entry').truncate();
  }).then(function() {
    return knex('disclosure_answer').truncate();
  }).then(function() {
    return knex('project').truncate();
  }).then(function() {
    return knex('questionnaire_answer').truncate();
  }).then(function() {
    return knex('declaration_type').truncate();
  }).then(function() {
    return knex('relationship_type').truncate();
  }).then(function() {
    return knex('relationship_amount_type').truncate();
  }).then(function() {
    return knex('relationship_person_type').truncate();
  }).then(function() {
    return knex('relationship_category_type').truncate();
  }).then(function() {
    return knex('fin_entity').truncate();
  }).then(function() {
    return knex('questionnaire_question').update({parent: null});
  }).then(function() {
    return knex('project_role').truncate();
  }).then(function() {
    return knex('project_type').truncate();
  }).then(function() {
    return knex('questionnaire_question').truncate();
  }).then(function() {
    return knex('disclosure').truncate();
  }).then(function() {
    return knex('questionnaire').truncate();
  }).then(function() {
    return knex('questionnaire_type').truncate();
  }).then(function() {
    return knex('disclosure_status').truncate();
  }).then(function() {
    return knex('disposition_type').truncate();
  }).then(function() {
    return knex('disclosure_type').truncate();
  }).then(function() {
    return knex('fin_entity_answer').truncate();
  }).then(function() {
    knex.raw('SET FOREIGN_KEY_CHECKS=1');
  }).then(function() {
    console.log('Seed - disclosure_status');
    return Promise.all([
      knex('disclosure_status').insert({status_cd: 1, description: 'In progress'}),
      knex('disclosure_status').insert({status_cd: 2, description: 'Routed for Review'}),
      knex('disclosure_status').insert({status_cd: 3, description: 'Approved'}),
      knex('disclosure_status').insert({status_cd: 4, description: 'Disapproved'})
    ]);
  }).then(function() {
    console.log('Seed - disclosure_type');
    return Promise.all([
      knex('disclosure_type').insert({type_cd: 1, description: 'Manual Disclosure', enabled: true}),
      knex('disclosure_type').insert({type_cd: 2, description: 'Annual Disclosure', enabled: true}),
      knex('disclosure_type').insert({type_cd: 3, description: 'Project Disclosure', enabled: true}),
      knex('disclosure_type').insert({type_cd: 4, description: 'Travel Log', enabled: true})
    ]);
  }).then(function() {
    console.log('Seed - disposition_type');
    return Promise.all([
      knex('disposition_type').insert({type_cd: 1, description: '222'})
    ]);
  }).then(function() {
    console.log('Seed - project_role');
    return Promise.all([
      knex('project_role').insert({role_cd: 'PI', description: 'Principal Investigator'})
    ]);
  }).then(function() {
    console.log('Seed - project_type');
    return Promise.all([
      knex('project_type').insert({type_cd: 1, description: 'Research'}),
      knex('project_type').insert({type_cd: 2, description: 'Administration'}),
      knex('project_type').insert({type_cd: 3, description: 'Resubmission'}),
      knex('project_type').insert({type_cd: 4, description: 'Classification'})
    ]);
  }).then(function() {
    console.log('Seed - relationship_person_type');
    return Promise.all([
      knex('relationship_person_type').insert({description: 'Self', active: true}),
      knex('relationship_person_type').insert({description: 'Spouse', active: true}),
      knex('relationship_person_type').insert({description: 'Other', active: true}),
      knex('relationship_person_type').insert({description: 'Entity', active: true})
    ]);
  }).then(function() {
    console.log('Seed - declaration_type');
    return Promise.all([
      knex('declaration_type').insert({type_cd: 1, description: 'No Conflict', enabled: true, custom: false, active: true}),
      knex('declaration_type').insert({type_cd: 2, description: 'Managed Relationship', enabled: true, custom: false, active: true}),
      knex('declaration_type').insert({type_cd: 3, description: 'Potential Relationship', enabled: true, custom: true, active: true})
    ]);
  }).then(function() {
    console.log('Seed - relationship_type');
    return Promise.all([
      knex('relationship_category_type')
      .insert({type_cd: 1, description: 'Ownership', enabled: true, type_enabled: true, amount_enabled: true})
      .then(function(){
        return Promise.all([
        knex('relationship_type').insert({relationship_cd: 1, description: 'Stock', active: true}),
        knex('relationship_type').insert({relationship_cd: 1, description: 'Stock Options', active: true}),
        knex('relationship_type').insert({relationship_cd: 1, description: 'Other Ownership', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 1, description: '$1 - $5,000', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 1, description: '$5,001 - $10,000', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 1, description: 'Over $10,000', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 1, description: 'Privately Held, no valuation', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 1, description: 'Does not apply', active: true})]);
      }),
      knex('relationship_category_type')
      .insert({type_cd: 2, description: 'Offices/Positions', enabled: true, type_enabled: true, amount_enabled: true})
      .then(function() {
        return Promise.all([
        knex('relationship_type').insert({relationship_cd: 2, description: 'Board Member', active: true}),
        knex('relationship_type').insert({relationship_cd: 2, description: 'Partner', active: true}),
        knex('relationship_type').insert({relationship_cd: 2, description: 'Other Managerial Positions', active: true}),
        knex('relationship_type').insert({relationship_cd: 2, description: 'Founder', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 2, description: '$1 - $5,000', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 2, description: '$5,001 - $10,000', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 2, description: 'Over $10,000', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 2, description: 'Privately Held, no valuation', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 2, description: 'Does not apply', active: true})]);
      }),
      knex('relationship_category_type')
      .insert({type_cd: 3, description: 'Paid Activities', enabled: true, type_enabled: false, amount_enabled: true})
      .then(function() {
        return Promise.all([
          knex('relationship_amount_type').insert({relationship_cd: 3, description: '$1 - $5,000', active: true}),
          knex('relationship_amount_type').insert({relationship_cd: 3, description: '$5,001 - $10,000', active: true}),
          knex('relationship_amount_type').insert({relationship_cd: 3, description: 'Over $10,000', active: true}),
          knex('relationship_amount_type').insert({relationship_cd: 3, description: 'Privately Held, no valuation', active: true}),
          knex('relationship_amount_type').insert({relationship_cd: 3, description: 'Does not apply', active: true})
        ]);
      }),
      knex('relationship_category_type')
      .insert({type_cd: 4, description: 'Intellectual Property', enabled: true, type_enabled: true, amount_enabled: true})
      .then(function() {
        return Promise.all([
        knex('relationship_type').insert({relationship_cd: 4, description: 'Royalty Income', active: true}),
        knex('relationship_type').insert({relationship_cd: 4, description: 'Intellectual Property Rights', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 4, description: '$1 - $5,000', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 4, description: '$5,001 - $10,000', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 4, description: 'Over $10,000', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 4, description: 'Privately Held, no valuation', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 4, description: 'Does not apply', active: true})]);
      }),
      knex('relationship_category_type')
      .insert({type_cd: 5, description: 'Other', enabled: true, type_enabled: true, amount_enabled: true})
      .then(function() {
        return Promise.all([
        knex('relationship_type').insert({relationship_cd: 5, description: 'Contract', active: true}),
        knex('relationship_type').insert({relationship_cd: 5, description: 'Other Transactions', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 5, description: '$1 - $5,000', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 5, description: '$5,001 - $10,000', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 5, description: 'Over $10,000', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 5, description: 'Privately Held, no valuation', active: true}),
        knex('relationship_amount_type').insert({relationship_cd: 5, description: 'Does not apply', active: true})]);
      })
    ]);
  }).then(function() {
    console.log('Seed - questionnaire_type');
    return Promise.all([
      knex('questionnaire_type').insert({type_cd: 1, description: 'Screening'}),
      knex('questionnaire_type').insert({type_cd: 2, description: 'Entity'})
    ]);
  }).then(function() {
    return knex('questionnaire').insert({
      instructions: 'Please fill out this questionnaire in order to document your disclosure activities. Thanks! No taking $$ from vendors.',
      version: 1,
      type_cd: 1
    })
    .then(function(questionnaireId) {
      return Promise.all([
        insertQuestionnaireQuestion(knex, questionnaireId[0], 'From any for-profit organization, did you receive in the last 12 months, or do you expect to receive in the next 12 months, salary, director\'s fees, consulting payments, honoraria, royalties; or other payments for patents, copyrights or other intellectual property; or other direct payments exceeding $5,000?', 1, undefined, undefined, true),
        insertQuestionnaireQuestion(knex, questionnaireId[0], 'From any privately held organization, do you have stock, stock options, or other equity interest of any value?', 2),
        insertQuestionnaireQuestion(knex, questionnaireId[0], 'Some publicly traded stock must be disclosed, but only in specific circumstances. Do you own stock, which in aggregate exceeds $5,000, in a company that provides funds to this institution in support of your Institutional Responsibilities (e.g. teaching, research, committee, or other administrative responsibilities)? When aggregating, please consider stock, stock options, warrants and other existing or contingent ownership interests in the publicly held company. Do not consider investments where you do not directly influence investment decisions, such as mutual funds and retirement accounts.', 3),
        insertQuestionnaireQuestion(knex, questionnaireId[0], 'From US educational institutions, US teaching hospitals or US research institutions affiliated with US educational institutions: Did you receive in the last 12 months, or do you expect to receive in the next 12 months, payments for services, which in aggregate exceed $5,000 (e.g. payments for consulting, board positions, patents, copyrights or other intellectual property)? Exclude payments for scholarly or academic works (i.e. peer-reviewed (vs. editorial reviewed) articles or books based on original research or experimentation, published by an academic association or a university/academic press).', 4)
      ]);
    });
  }).then(function() {
    return knex('questionnaire').insert({
      instructions: 'Please fill out this questionnaire in order to document your disclosure activities. Thanks! No taking $$ from vendors.',
      version: 1,
      type_cd: 2
    })
    .then(function(questionnaireId) {
      return Promise.all([
        insertQuestionnaireQuestion(knex, questionnaireId[0], 'Type:', 1, "Multiselect", ['State Government', 'County Government', 'Small Business'],false,1),
        insertQuestionnaireQuestion(knex, questionnaireId[0], 'Is this entity public?', 2, 'Yes/No'),
        insertQuestionnaireQuestion(knex, questionnaireId[0], 'Does this entity sponsor any', 3),
        insertQuestionnaireQuestion(knex, questionnaireId[0], 'Describe the entity\'s area of business and your relationship to it:', 4, 'Text area')
      ]);
    });
  }).then(function() {
    console.log('Seed - disclosure');
    var disclosures = [];
    for (var i = 0; i < 172; i++) {
      disclosures.push(insertDisclosure(knex));
    }
    return Promise.all(disclosures);
  }).then(function() {
    console.log('Seed - config');
    return knex('config').insert({
      name: 'General Config',
      config: JSON.stringify({
        peopleEnabled: true,
        sponsorLookup: true,

        dueDate: new Date(2015, 1, 1),
        isRollingDueDate: false,
        instructions: {
          'Questionnaire': 'Questionnaire Instructions',
          'Financial Entities Questionnaire': 'Financial Entities Questionnaire Instructions',
          'Relationship Matrix': 'Relationship Matrix Instructions',
          'Project Declaration': 'Project Declaration Instructions',
          'Certification': 'Certification Instructions'
        },
        certificationOptions: {
          text: 'Certification Text',
          required: true
        }
      })
    });
  }).then(function() {
    console.log('Seed - travel_log_entry');
    return Promise.all([
      knex('travel_log_entry').insert({
        fin_entity_id: knex('fin_entity').min('id'),
        amount: 1000.00,
        destination: 'Hilo, HI',
        start_date: new Date(2015, 4, 2),
        end_date: new Date(2015, 4, 5),
        reason: 'To give a talk on dark matter'
      }),
      knex('travel_log_entry').insert({
        fin_entity_id: knex('fin_entity').max('id'),
        amount: 2000.00,
        destination: 'Atlanta, GA',
        start_date: new Date(2015, 4, 13),
        end_date: new Date(2015, 4, 16),
        reason: 'To give a talk on quasars'
      }),
      knex('travel_log_entry').insert({
        fin_entity_id: knex('fin_entity').max('id'),
        amount: 3000.00,
        destination: 'Atlanta, GA',
        start_date: new Date(2015, 7, 1),
        end_date: new Date(2015, 7, 3),
        reason: 'To give a talk on string theory'
      })
    ]);
  });
};
