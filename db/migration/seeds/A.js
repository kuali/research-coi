/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

/*eslint-disable camelcase, no-console, no-magic-numbers */

var hashCode = require('../../../hash');

var includeDemoData = process.argv[8] === 'demo';

function randomNumberBetween(lowest, highest) {
  return Math.floor(Math.random() * (highest - lowest + 1)) + lowest;
}

function getRandomLastName() {
  switch (randomNumberBetween(0, 33)) {
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
    case 20: return 'Dilly';
    case 21: return 'Day';
    case 22: return 'Somerset';
    case 23: return 'Blaney';
    case 24: return 'Soltesz';
    case 25: return 'Olausson';
    case 26: return 'Bowers';
    case 27: return 'Andrus';
    case 28: return 'Thacker';
    case 29: return 'Hunter';
    case 30: return 'Ferrell';
    case 31: return 'Bateman';
    case 32: return 'Wages';
    case 33: return 'Kang';
  }
}

function getRandomFirstName() {
  switch (randomNumberBetween(0, 33)) {
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
    case 19: return 'Harold';
    case 20: return 'Ben';
    case 21: return 'Lindsay';
    case 22: return 'Abby';
    case 23: return 'Melanie';
    case 24: return 'Emily';
    case 25: return 'Martina';
    case 26: return 'Heather';
    case 27: return 'Rick';
    case 28: return 'John';
    case 29: return 'Bryan';
    case 30: return 'Doug';
    case 31: return 'Travis';
    case 32: return 'Terry';
    case 33: return 'Sophie';
  }
}

function insertDeclaration(knex, disclosureId, entityId, projectId) {
  console.log('Demo data - Inserting declaration for disclosure ' + disclosureId);
  return Promise.all([
    knex('declaration').insert({
      disclosure_id: disclosureId,
      fin_entity_id: entityId,
      project_id: projectId,
      type_cd: knex('declaration_type').max('type_cd'),
      comments: ''
    })
  ], 'id');
}

function insertProject(knex, title) {
  console.log('Demo data - Inserting project ' + title);
  var startDate = new Date(new Date().getTime() - randomNumberBetween(1, 7606400000));
  var endDate = new Date(startDate.getTime() + 1000000000);

  return knex('project').insert({
    title: title,
    type_cd: 1,
    source_system: 'COI-SEED',
    source_identifier: randomNumberBetween(1, 9999999999),
    source_status: '1',
    sponsor_cd: '000010',
    sponsor_name: 'Air Force',
    start_date: startDate,
    end_date: endDate
  }, 'id');
}

function insertProjectPerson(knex, userId, role, projectId) {
  console.log('Demo data - Inserting project person for user ' + userId);
  return knex('project_person').insert({
    project_id: projectId,
    person_id: userId,
    source_person_type: 'COI-SEED',
    role_cd: role,
    active: true
  }, 'id');
}

function insertRelationship(knex, entityId) {
  console.log('Demo data - Inserting relationship for entity ' + entityId);
  var relationshipCd = randomNumberBetween(1, 5);
  return knex('relationship')
    .insert({
      fin_entity_id: entityId,
      relationship_cd: relationshipCd,
      person_cd: knex('relationship_person_type').max('type_cd'),
      type_cd: knex('relationship_type').max('type_cd').where('relationship_cd', relationshipCd),
      amount_cd: knex('relationship_amount_type').max('type_cd').where('relationship_cd', relationshipCd),
      comments: 'Rel 1 Comments',
      status: 'IN PROGRESS'
    }, 'id');
}

function insertEntity(knex, disclosureId, name, description) {
  console.log('Demo data - Inserting entity for disclosure ' + disclosureId);
  return knex('fin_entity')
    .insert({
      disclosure_id: disclosureId,
      active: true,
      name: name,
      description: description,
      status: 'IN PROGRESS'
    }, 'id')
    .then(function(entityId){
      return insertRelationship(knex, entityId[0]);
    });
}

function insertQuestionnaireSubquestion(knex, questionnaireId, parentId, numberToShow) {
  return knex('questionnaire_question').insert({
    questionnaire_id: questionnaireId,
    parent: parentId,
    active: true,
    question: JSON.stringify({
      order: 1,
      text: 'Please explain.',
      type: 'Text area',
      displayCriteria: 'Yes',
      numberToShow: numberToShow + '-A'
    })
  }, 'id');
}

function insertQuestionnaireQuestion(knex, questionnaireId, text, numberToShow, type, options, subquestion, requiredNumSelections) {
  var question = {
    order: numberToShow,
    text: text,
    type: type ? type : 'Yes/No',
    validations: ['required'],
    numberToShow: numberToShow
  };

  if (options) {
    question.options = options;
    question.requiredNumSelections = requiredNumSelections;
  }
  return knex('questionnaire_question').insert({
    questionnaire_id: questionnaireId,
    active: true,
    question: JSON.stringify(question)
  }, 'id').then(function (parentId) {
    if (subquestion) {
      return insertQuestionnaireSubquestion(knex, questionnaireId, parentId[0], numberToShow);
    }
  });
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
  console.log('Demo data - Inserting disclosure for user ' + userId);

  return knex('disclosure').insert({
    user_id: userId,
    submitted_by: getRandomFirstName() + ' ' + getRandomLastName(),
    type_cd: 2,
    title: 'Title - what is this?' + randomNumberBetween(1, 2000),
    submitted_date: submittedDate,
    revised_date: revisedDate,
    disposition_type_cd: 1,
    start_date: new Date(),
    expired_date: new Date(),
    status_cd: 1,
    last_review_date: new Date(),
    config_id: 1
  }, 'id').then(function(disclosureId) {
    return Promise.all([
      insertEntity(knex, disclosureId[0], 'Apple', 'A company that makes trendy things'),
      insertEntity(knex, disclosureId[0], 'Monsanto', 'An agro-business company'),
      insertEntity(knex, disclosureId[0], 'Xerox', 'This is a company that makes copiers and stuff like that'),
      insertProject(knex, 'Glucose levels in heirloom corn'),
      insertProject(knex, 'Longevity of car batteries')
    ]).then(function(results) {
      return Promise.all([
        insertDeclaration(knex, disclosureId[0], results[0][0], results[3][0]),
        insertDeclaration(knex, disclosureId[0], results[1][0], results[3][0]),
        insertDeclaration(knex, disclosureId[0], results[2][0], results[3][0]),
        insertDeclaration(knex, disclosureId[0], results[0][0], results[4][0]),
        insertDeclaration(knex, disclosureId[0], results[1][0], results[4][0]),
        insertDeclaration(knex, disclosureId[0], results[2][0], results[4][0]),
        insertProjectPerson(knex, userId, 'PI', results[3][0]),
        insertProjectPerson(knex, 123456, 'KP', results[3][0])
      ]);
    });
  });
}

function insertFakeProject(knex, userId) {
  return insertProject(knex, 'Longevity of car batteries').then(function(results) {
    return insertProjectPerson(knex, userId, 'PI', results[0]);
  });
}

function insertInitialArchiveConfig(query) {
  return Promise.all([
    query.select('type_cd as typeCd', 'description', 'enabled', 'type_enabled as typeEnabled', 'amount_enabled as amountEnabled', 'destination_enabled as destinationEnabled', 'date_enabled as dateEnabled', 'reason_enabled as reasonEnabled').from('relationship_category_type'),
    query.select('type_cd as typeCd', 'relationship_cd as relationshipCd', 'description', 'active').from('relationship_type').where('active', true),
    query.select('type_cd as typeCd', 'relationship_cd as relationshipCd', 'description', 'active').from('relationship_amount_type').where('active', true),
    query.select('type_cd as typeCd', 'description', 'active').from('relationship_person_type').where('active', true),
    query.select('type_cd as typeCd', 'description', 'enabled', 'custom', 'active').from('declaration_type').where('active', true),
    query.select('type_cd as typeCd', 'description', 'enabled').from('disclosure_type'),
    query.select('id', 'reminder_text as reminderText', 'warning_value as warningValue', 'warning_period as warningPeriod', 'active').from('notification'),
    query.select('id', 'type_cd as typeCd', 'version').from('questionnaire').limit(1).where('type_cd', 1).orderBy('version', 'desc').then(function(result) {
      if (result[0]) {
        return query.select('id', 'active', 'questionnaire_id as questionnaireId', 'parent', 'question').from('questionnaire_question as qq').where({questionnaire_id: result[0].id, active: true});
      }
    }),
    query.select('id', 'type_cd as typeCd', 'version').from('questionnaire').limit(1).where('type_cd', 2).orderBy('version', 'desc').then(function(result) {
      if (result[0]) {
        return query.select('id', 'active', 'questionnaire_id as questionnaireId', 'parent', 'question').from('questionnaire_question as qq').where({questionnaire_id: result[0].id, active: true});
      }
    }),
    query.select('status_cd as statusCd', 'description').from('disclosure_status'),
    query.select('type_cd as typeCd', 'description').from('project_type')
  ])
  .then(function(result) {
    var config = {};
    config.matrixTypes = result[0];
    config.matrixTypes.map(function(type) {
      type.typeOptions = result[1].filter(function(relationType) {
        return relationType.relationshipCd === type.typeCd;
      });
      type.amountOptions = result[2].filter(function(amountType) {
        return amountType.relationshipCd === type.typeCd;
      });
      return type;
    });
    config.relationshipPersonTypes = result[3];
    config.declarationTypes = result[4];
    config.disclosureTypes = result[5];
    config.notifications = result[6];
    config.questions = {};
    config.questions.screening = result[7] ? result[7].map(function(question) {
      question.question = JSON.parse(question.question);
      return question;
    }) : [];
    config.questions.entities = result[8] ? result[8].map(function(question) {
      question.question = JSON.parse(question.question);
      return question;
    }) : [];

    config.disclosureStatus = result[9];
    config.projectTypes = result[10];
    config.colors = {
      'one': '#348FF7',
      'two': '#0E4BB6',
      'three': '#048EAF',
      'four': '#EDF2F2'
    };
    config.general = {
      peopleEnabled: true,
      sponsorLookup: true,

      dueDate: new Date(2015, 1, 1),
      isRollingDueDate: false,
      instructions: {
        'Questionnaire': 'Please answer each question thoughtfully. You will have an opportunity to review and edit your answers after completing the questionnaire.',
        'Financial Entities': 'Please enter all your financial entities and the associated data, which are required. Then indicate the nature of each your relationships with each financial entity.',
        'Project Declaration': 'Select the appropriate project declaration for each of your financial entity-project relationships. You can use the "Set All" function to apply a declaration to all relationships at once.',
        'Certification': 'You may add any overall attachments for your annual disclosure.  Then please certify and submit your disclosure for review.'
      },
      certificationOptions: {
        text: 'In accordance with the University\'s policy on Disclosure of Financial Interests and Management of Conflict of Interest Related to Sponsored Projects, the Principal Investigator and all other Investigators who share responsibility for the design, conduct, or reporting of sponsored projects must disclose their personal SIGNIFICANT FINANCIAL INTERESTS in any non-profit foundation or for-profit company that might benefit from the predictable results of those proposed projects.  In addition, when the work to be performed under the proposed research project and the results of the proposed research project would reasonably appear to affect the Investigator\'s SIGNIFICANT FINANCIAL INTEREST, the interest is regarded as being related to the proposed research project and must be reported.',
        required: true
      }
    };

    return query('config').insert({config: JSON.stringify(config)}, 'id');
  });
}

exports.seed = function(knex, Promise) {
  /*
    1 = PI: In Progress            , Admin: <not shown>
    2 = PI: Submitted for Approval , Admin: Submitted for Approval
    3 = PI: Up to date             , Admin: Approved
    4 = PI: Updates Required       , Admin: Sent back
    5 = PI: Expired                , Admin: Expired
    6 = PI: Resubmitted            , Admin: Resubmitted
  */
  console.log('Seed - disclosure_status');
  return Promise.all([
    knex('disclosure_status').insert({status_cd: 1, description: 'In Progress'}),
    knex('disclosure_status').insert({status_cd: 2, description: 'Submitted for Approval'}),
    knex('disclosure_status').insert({status_cd: 3, description: 'Up to Date'}),
    knex('disclosure_status').insert({status_cd: 4, description: 'Updates Required'}),
    knex('disclosure_status').insert({status_cd: 5, description: 'Expired'}),
    knex('disclosure_status').insert({status_cd: 6, description: 'Resubmitted'})
  ]).then(function() {
    console.log('Seed - disclosure_type');
    return Promise.all([
      knex('disclosure_type').insert({type_cd: 1, description: 'Manual Disclosure', enabled: false}),
      knex('disclosure_type').insert({type_cd: 2, description: 'Annual Disclosure', enabled: true}),
      knex('disclosure_type').insert({type_cd: 3, description: 'Project Disclosure', enabled: false}),
      knex('disclosure_type').insert({type_cd: 4, description: 'Travel Log', enabled: false})
    ]);
  }).then(function() {
    console.log('Seed - disposition_type');
    return Promise.all([
      knex('disposition_type').insert({type_cd: 1, description: '222'})
    ]);
  }).then(function() {
    console.log('Seed - project_type');
    return Promise.all([
      knex('project_type').insert({type_cd: 1, description: 'Proposal'}),
      knex('project_type').insert({type_cd: 2, description: 'Institutional Proposal'}),
      knex('project_type').insert({type_cd: 3, description: 'IRB Protocol'}),
      knex('project_type').insert({type_cd: 4, description: 'IACUC Protocol'}),
      knex('project_type').insert({type_cd: 5, description: 'Award'})
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
        .insert({type_cd: 1, description: 'Ownership', enabled: true, type_enabled: true, amount_enabled: true, destination_enabled: false, date_enabled: false, reason_enabled: false})
        .then(function(){
          return Promise.all([
            knex('relationship_type').insert({relationship_cd: 1, description: 'Stock', active: true})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 1, description: 'Stock Options', active: true});})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 1, description: 'Other Ownership', active: true});}),
            knex('relationship_amount_type').insert({relationship_cd: 1, description: '$1 - $5,000', active: true})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 1, description: '$5,001 - $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 1, description: 'Over $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 1, description: 'Privately Held, no valuation', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 1, description: 'Does not apply', active: true});})
          ]);
        }),
      knex('relationship_category_type')
        .insert({type_cd: 2, description: 'Offices/Positions', enabled: true, type_enabled: true, amount_enabled: true, destination_enabled: false, date_enabled: false, reason_enabled: false})
        .then(function() {
          return Promise.all([
            knex('relationship_type').insert({relationship_cd: 2, description: 'Board Member', active: true})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 2, description: 'Partner', active: true});})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 2, description: 'Other Managerial Positions', active: true});})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 2, description: 'Founder', active: true});}),
            knex('relationship_amount_type').insert({relationship_cd: 2, description: '$1 - $5,000', active: true})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 2, description: '$5,001 - $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 2, description: 'Over $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 2, description: 'Privately Held, no valuation', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 2, description: 'Does not apply', active: true});})
          ]);
        }),
      knex('relationship_category_type')
        .insert({type_cd: 3, description: 'Paid Activities', enabled: true, type_enabled: false, amount_enabled: true, destination_enabled: false, date_enabled: false, reason_enabled: false})
        .then(function() {
          return knex('relationship_amount_type').insert({relationship_cd: 3, description: '$1 - $5,000', active: true})
            .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 3, description: '$5,001 - $10,000', active: true});})
            .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 3, description: 'Over $10,000', active: true});})
            .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 3, description: 'Privately Held, no valuation', active: true});})
            .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 3, description: 'Does not apply', active: true});});
        }),
      knex('relationship_category_type')
        .insert({type_cd: 4, description: 'Intellectual Property', enabled: true, type_enabled: true, amount_enabled: true, destination_enabled: false, date_enabled: false, reason_enabled: false})
        .then(function() {
          return Promise.all([
            knex('relationship_type').insert({relationship_cd: 4, description: 'Royalty Income', active: true})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 4, description: 'Intellectual Property Rights', active: true});}),
            knex('relationship_amount_type').insert({relationship_cd: 4, description: '$1 - $5,000', active: true})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 4, description: '$5,001 - $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 4, description: 'Over $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 4, description: 'Privately Held, no valuation', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 4, description: 'Does not apply', active: true});})
          ]);
        }),
      knex('relationship_category_type')
        .insert({type_cd: 5, description: 'Other', enabled: true, type_enabled: true, amount_enabled: true, destination_enabled: false, date_enabled: false, reason_enabled: false})
        .then(function() {
          return Promise.all([
            knex('relationship_type').insert({relationship_cd: 5, description: 'Contract', active: true})
              .then(function() {return knex('relationship_type').insert({relationship_cd: 5, description: 'Other Transactions', active: true});}),
            knex('relationship_amount_type').insert({relationship_cd: 5, description: '$1 - $5,000', active: true})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 5, description: '$5,001 - $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 5, description: 'Over $10,000', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 5, description: 'Privately Held, no valuation', active: true});})
              .then(function() {return knex('relationship_amount_type').insert({relationship_cd: 5, description: 'Does not apply', active: true});})
          ]);
        }),
      knex('relationship_category_type')
        .insert({type_cd: 6, description: 'Travel', enabled: false, type_enabled: false, amount_enabled: true, destination_enabled: true, date_enabled: true, reason_enabled: true})
    ]);
  }).then(function() {
    console.log('Seed - questionnaire_type');
    return Promise.all([
      knex('questionnaire_type').insert({type_cd: 1, description: 'Screening'}),
      knex('questionnaire_type').insert({type_cd: 2, description: 'Entity'})
    ]);
  }).then(function() {
    return knex('questionnaire').insert({
      version: 1,
      type_cd: 1
    }, 'id').options({rowMode: 'array'})
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
      version: 1,
      type_cd: 2
    }, 'id')
    .then(function(questionnaireId) {
      return Promise.all([
        insertQuestionnaireQuestion(knex, questionnaireId[0], 'Type:', 1, 'Multiselect', ['State Government', 'County Government', 'Small Business'], false, 1),
        insertQuestionnaireQuestion(knex, questionnaireId[0], 'Is this entity public?', 2, 'Yes/No'),
        insertQuestionnaireQuestion(knex, questionnaireId[0], 'Does this entity sponsor any of your research?', 3),
        insertQuestionnaireQuestion(knex, questionnaireId[0], 'Describe the entity\'s area of business and your relationship to it:', 4, 'Text area')
      ]);
    });
  }).then(function() {
    console.log('Seed - config');
    return insertInitialArchiveConfig(knex);
  }).then(function() {
    if (!includeDemoData) {
      return undefined;
    }
    console.log('Demo data - disclosure');
    var disclosures = [];
    for (var i = 0; i < 10; i++) {
      disclosures.push(insertDisclosure(knex));
    }
    return Promise.all(disclosures).then(function() {
      console.log('Demo data - travel_relationship');
      return Promise.all([
        knex('travel_relationship').insert({
          relationship_id: knex('relationship').min('id'),
          amount: 1000.00,
          destination: 'Hilo, HI',
          start_date: new Date(2015, 4, 2),
          end_date: new Date(2015, 4, 5),
          reason: 'To give a talk on dark matter'
        }),
        knex('travel_relationship').insert({
          relationship_id: knex('relationship').max('id'),
          amount: 2000.00,
          destination: 'Atlanta, GA',
          start_date: new Date(2015, 4, 13),
          end_date: new Date(2015, 4, 16),
          reason: 'To give a talk on quasars'
        }),
        knex('travel_relationship').insert({
          relationship_id: knex('relationship').max('id'),
          amount: 3000.00,
          destination: 'Atlanta, GA',
          start_date: new Date(2015, 7, 1),
          end_date: new Date(2015, 7, 3),
          reason: 'To give a talk on string theory'
        })
      ]).then(function() {
        console.log('Demo data - Lots of fake projects');
        return Promise.all([
          insertFakeProject(knex, 100000000008),
          insertFakeProject(knex, 10000000005),
          insertFakeProject(knex, 10000000007),
          insertFakeProject(knex, 10000000030),
          insertFakeProject(knex, 10000000002)
        ]);
      }).then(function() {
        console.log('Demo data - Archived config 1');
        return insertInitialArchiveConfig(knex);
      }).then(function() {
        console.log('Demo data - Archived config 2');
        return insertInitialArchiveConfig(knex);
      }).then(function() {
        console.log('Demo data - Archived disclosure 1');
        return knex('disclosure_archive').insert({
          disclosure_id: 1,
          approved_by: 'Test Admin',
          approved_date: new Date(),
          disclosure: '{"id":11,"typeCd":2,"title":null,"dispositionTypeCd":null,"statusCd":3,"submittedBy":"User p999","submittedDate":"2015-11-27T05:05:29.000Z","revisedDate":null,"startDate":"2015-11-27T05:04:59.000Z","expiredDate":null,"lastReviewDate":"2015-11-27T05:05:58.950Z","configId":804,"entities":[{"id":31,"disclosureId":11,"active":1,"name":"hjkhjk","description":null,"answers":[{"questionId":7,"answer":{"value":"No"},"finEntityId":31},{"questionId":6,"answer":{"value":["County Government"]},"finEntityId":31},{"questionId":8,"answer":{"value":"Yes"},"finEntityId":31},{"questionId":9,"answer":{"value":"bnmb"},"finEntityId":31}],"files":[],"relationships":[{"id":31,"finEntityId":31,"relationshipCd":1,"personCd":2,"typeCd":5,"amountCd":11,"comments":"bnmbmn","travel":{}}]}],"answers":[{"id":1,"questionId":3,"answer":{"value":"No"}},{"id":2,"questionId":4,"answer":{"value":"No"}},{"id":3,"questionId":1,"answer":{"value":"No"}},{"id":4,"questionId":2,"answer":{"value":"No"}}],"declarations":[],"comments":[],"files":[],"managementPlan":[]}'
        });
      }).then(function() {
        console.log('Demo data - Archived disclosure 2');
        return knex('disclosure_archive').insert({
          disclosure_id: 2,
          approved_by: 'Test Admin',
          approved_date: new Date(),
          disclosure: '{"id":11,"typeCd":2,"title":null,"dispositionTypeCd":null,"statusCd":3,"submittedBy":"User p999","submittedDate":"2015-11-27T05:05:29.000Z","revisedDate":null,"startDate":"2015-11-27T05:04:59.000Z","expiredDate":null,"lastReviewDate":"2015-11-27T05:05:58.950Z","configId":804,"entities":[{"id":31,"disclosureId":11,"active":1,"name":"hjkhjk","description":null,"answers":[{"questionId":7,"answer":{"value":"No"},"finEntityId":31},{"questionId":6,"answer":{"value":["County Government"]},"finEntityId":31},{"questionId":8,"answer":{"value":"Yes"},"finEntityId":31},{"questionId":9,"answer":{"value":"bnmb"},"finEntityId":31}],"files":[],"relationships":[{"id":31,"finEntityId":31,"relationshipCd":1,"personCd":2,"typeCd":5,"amountCd":11,"comments":"bnmbmn","travel":{}}]}],"answers":[{"id":1,"questionId":3,"answer":{"value":"No"}},{"id":2,"questionId":4,"answer":{"value":"No"}},{"id":3,"questionId":1,"answer":{"value":"No"}},{"id":4,"questionId":2,"answer":{"value":"No"}}],"declarations":[],"comments":[],"files":[],"managementPlan":[]}'
        });
      });
    });
  });
};
