/*eslint-disable camelcase */

function getLastName(num) {
  switch (num % 20) {
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

function getFirstName(num) {
  switch (num % 20) {
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
    return knex('fin_entity_type').truncate();
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
    console.log('Seed - fin_entity_type');
    return Promise.all([
      knex('fin_entity_type').insert({type_cd: 1, description: 'State Government'}),
      knex('fin_entity_type').insert({type_cd: 2, description: 'County Government'}),
      knex('fin_entity_type').insert({type_cd: 3, description: 'Small Business'}),
      knex('fin_entity_type').insert({type_cd: 4, description: 'For-profit Organization'}),
      knex('fin_entity_type').insert({type_cd: 5, description: 'Individual'})
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
    console.log('Seed - disclosure');
    var disclosures = [];
    for (var i = 0; i < 172; i++) {
      disclosures.push(
        knex('disclosure').insert({
          user_id: Math.floor(Math.random() * 1000000),
          submitted_by: getFirstName(Math.floor(Math.random() * 20)) + ' ' + getLastName(Math.floor(Math.random() * 20)),
          type_cd: Math.floor(Math.random() * 3) + 1,
          title: 'Title - what is this?' + i,
          submitted_date: new Date(new Date() - Math.floor(Math.random() * 7606400000)),
          disposition_type_cd: 1,
          start_date: new Date(),
          expired_date: new Date(),
          status_cd: Math.floor(Math.random() * 3) + 1,
          last_review_date: new Date(),
          approved_date: new Date()
        })
      );
    }

    return Promise.all(disclosures);
  }).then(function() {
    console.log('Seed - project');
    return Promise.all([
      knex('disclosure').min('id as id')
      .then(function(row) {
        return knex('project').insert({
          disclosure_id: row[0].id,
          name: 'Molecular Disentropization',
          type_cd: 1,
          role_cd: 'PI',
          sponsor_cd: '000100'
        });
      })
    ]);
  }).then(function() {
    console.log('Seed - fin_entity');
    return Promise.all([
      knex('disclosure').min('id as id')
      .then(function(row) {
        return knex('fin_entity').insert({
          disclosure_id: row[0].id,
          active: true,
          is_public: true,
          type_cd: 1,
          is_sponsor: true,
          name: 'Apple',
          description: 'Entity 1 - Petroleum extraction in deep water'
        })
        .then(function(id){
          return knex('relationship').insert({
            fin_entity_id: id[0],
            relationship_cd: knex('relationship_category_type').max('type_cd'),
            person_cd: knex('relationship_person_type').max('type_cd'),
            type_cd: knex('relationship_type').max('type_cd'),
            amount_cd: knex('relationship_amount_type').max('type_cd'),
            comments: 'Rel 1 Comments'
          });
        });
      }),
      knex('fin_entity').insert({
        disclosure_id: knex('disclosure').max('id'),
        active: false,
        is_public: true,
        type_cd: 1,
        is_sponsor: true,
        name: 'Pfizer',
        description: 'Entity 2 - Petroleum extraction in deep water'
      }),
      knex('fin_entity').insert({
        disclosure_id: knex('disclosure').max('id'),
        active: false,
        is_public: true,
        type_cd: 1,
        is_sponsor: false,
        name: 'Johnson & Johnson',
        description: 'Entity 3 - Petroleum extraction in deep water'
      }),
      knex('fin_entity').insert({
        disclosure_id: knex('disclosure').max('id'),
        active: false,
        is_public: false,
        type_cd: 1,
        is_sponsor: false,
        name: 'PepsiCo',
        description: 'Entity 4 - Petroleum extraction in deep water'
      }),
      knex('fin_entity').insert({
        disclosure_id: knex('disclosure').max('id'),
        active: true,
        is_public: true,
        type_cd: 1,
        is_sponsor: true,
        name: 'Rockwell Collins',
        description: 'Entity 1 - Glyphosate as a carcinogen'
      })
    ]);
  }).then(function() {
    console.log('Seed - declaration');
    return Promise.all([
      knex('declaration').insert({
        fin_entity_id: knex('fin_entity').max('id'),
        project_id: knex('project').max('id'),
        type_cd: knex('declaration_type').max('type_cd'),
        comments: 'The Molecular Disentropization project has no conflict with Apple'
      })
    ]);
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
  }).then(function() {
    console.log('Seed - questionnaire_type');
    return Promise.all([
      knex('questionnaire_type').insert({type_cd: 1, description: 'Screening'}),
      knex('questionnaire_type').insert({type_cd: 2, description: 'Entity'})
    ]);
  }).then(function() {
    return Promise.all([
    knex('questionnaire').insert({
      instructions: 'Please fill out this questionnaire in order to document your disclosure activities. Thanks! No taking $$ from vendors.',
      version: 1,
      type_cd: 1
    })
    .then(function(questionnaireId) {
      return Promise.all([
        knex('questionnaire_question').insert({
          questionnaire_id: questionnaireId[0],
          active: true,
          question: JSON.stringify({
            order: 1,
            text: 'From any for-profit organization, did you receive in the last 12 months, or do you expect to receive in the next 12 months, salary, director\'s fees, consulting payments, honoraria, royalties; or other payments for patents, copyrights or other intellectual property; or other direct payments exceeding $5,000?',
            type: 'Yes/No',
            validations: ['required']
          })
        }).then(function (parentId) {
          return Promise.all([
            knex('questionnaire_question').insert({
              questionnaire_id: questionnaireId[0],
              parent: parentId[0],
              active: true,
              question: JSON.stringify({
                order: 1,
                text: 'If Yes, did the organization send you on vacation?',
                type: 'Text area',
                validations: ['select1', 'required'],
                displayCriteria: 'Yes'
              })
            }).then(function(questionId) {
              return knex('questionnaire_answer').insert({
                question_id: questionId[0],
                answer: JSON.stringify({
                  value: 'no'
                })
              })
              .then(function(questionnaireAnswerId){
                return knex('disclosure').min('id as id')
                .then(function(row) {
                  return knex('disclosure_answer').insert({
                    disclosure_id: row[0].id,
                    questionnaire_answer_id: questionnaireAnswerId[0]
                  });
                });
              });
            }),
            knex('questionnaire_answer').insert({
              question_id: parentId[0],
              answer: JSON.stringify({
                value: 'yes'
              })
            })
            .then(function(questionnaireAnswerId){
              return knex('disclosure').min('id as id')
              .then(function(row) {
                return knex('disclosure_answer').insert({
                  disclosure_id: row[0].id,
                  questionnaire_answer_id: questionnaireAnswerId[0]
                });
              });
            })
          ]);
        }),
        knex('questionnaire_question').insert({
          questionnaire_id: questionnaireId[0],
          active: true,
          question: JSON.stringify({
            order: 2,
            text: 'From any privately held organization, do you have stock, stock options, or other equity interest of any value?',
            type: 'Yes/No',
            validations: ['required']
          })
        })
          .then(function(questionId) {
          return knex('questionnaire_answer').insert({
            question_id: questionId[0],
            answer: JSON.stringify({
              value: 'no'
            })
          })
          .then(function(questionnaireAnswerId){
            return knex('disclosure').min('id as id')
            .then(function(row) {
              return knex('disclosure_answer').insert({
                disclosure_id: row[0].id,
                questionnaire_answer_id: questionnaireAnswerId[0]
              });
            });
          });
        }),
        knex('questionnaire_question').insert({
          questionnaire_id: questionnaireId[0],
          active: true,
          question: JSON.stringify({
            order: 3,
            text: 'Some publicly traded stock must be disclosed, but only in specific circumstances. Do you own stock, which in aggregate exceeds $5,000, in a company that provides funds to this institution in support of your Institutional Responsibilities (e.g. teaching, research, committee, or other administrative responsibilities)? When aggregating, please consider stock, stock options, warrants and other existing or contingent ownership interests in the publicly held company. Do not consider investments where you do not directly influence investment decisions, such as mutual funds and retirement accounts.',
            type: 'Yes/No',
            validations: ['required']
          })
        })
        .then(function(questionId) {
          return knex('questionnaire_answer').insert({
            question_id: questionId[0],
            answer: JSON.stringify({
              value: 'no'
            })
          })
          .then(function(questionnaireAnswerId){
            return knex('disclosure').min('id as id')
            .then(function(row) {
              return knex('disclosure_answer').insert({
                disclosure_id: row[0].id,
                questionnaire_answer_id: questionnaireAnswerId[0]
              });
            });
          });
        }),
        knex('questionnaire_question').insert({
          questionnaire_id: questionnaireId[0],
          active: true,
          question: JSON.stringify({
            order: 4,
            text: 'From US educational institutions, US teaching hospitals or US research institutions affiliated with US educational institutions: Did you receive in the last 12 months, or do you expect to receive in the next 12 months, payments for services, which in aggregate exceed $5,000 (e.g. payments for consulting, board positions, patents, copyrights or other intellectual property)? Exclude payments for scholarly or academic works (i.e. peer-reviewed (vs. editorial reviewed) articles or books based on original research or experimentation, published by an academic association or a university/academic press).',
            type: 'Yes/No',
            validations: ['required']
          })
        })
        .then(function(questionId) {
          return knex('questionnaire_answer').insert({
            question_id: questionId[0],
            answer: JSON.stringify({
              value: 'yes'
            })
          })
          .then(function(questionnaireAnswerId){
            return knex('disclosure').min('id as id')
            .then(function(row) {
              return knex('disclosure_answer').insert({
                disclosure_id: row[0].id,
                questionnaire_answer_id: questionnaireAnswerId[0]
              });
            });
          });
        })
      ]);
    })
    ]);
  });
};
