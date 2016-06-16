/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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

/*  eslint-disable
      camelcase,
      no-console,
      no-magic-numbers,
      no-var,
      object-shorthand,
      prefer-template,
      prefer-arrow-callback,
      max-len
*/

var hashCode = require('../../../hash');
var migrationUtils = require('../migration-utils');

var includeDemoData = process.argv[8] === 'demo';

function randomNumberBetween(lowest, highest) {
  return Math.floor(Math.random() * (highest - lowest + 1)) + lowest;
}

function getRandomLastName() { //eslint-disable-line complexity
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

function getRandomFirstName() { //eslint-disable-line complexity
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
    start_date: startDate,
    end_date: endDate
  }, 'id').then(function(insertedRow) {
    return knex('project_sponsor').insert({
      project_id: insertedRow[0],
      sponsor_cd: '000010',
      sponsor_name: 'Air Force',
      source_identifier: randomNumberBetween(1, 9999999999),
      source_system: 'COI-SEED'
    });
  });
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

function insertEntity(knex, disclosureId, name) {
  console.log('Demo data - Inserting entity for disclosure ' + disclosureId);
  return knex('fin_entity')
    .insert({
      disclosure_id: disclosureId,
      active: true,
      name: name,
      status: 'IN PROGRESS'
    }, 'id')
    .then(function(entityId) {
      return insertRelationship(knex, entityId[0]);
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
    start_date: new Date(),
    expired_date: new Date(),
    status_cd: 1,
    last_review_date: new Date(),
    config_id: 1
  }, 'id').then(function(disclosureId) {
    return Promise.all([
      insertEntity(knex, disclosureId[0], 'Apple'),
      insertEntity(knex, disclosureId[0], 'Monsanto'),
      insertEntity(knex, disclosureId[0], 'Xerox'),
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

exports.seed = function(knex, Promise) {
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
      return migrationUtils.insertInitialArchiveConfig(knex);
    }).then(function() {
      console.log('Demo data - Archived config 2');
      return migrationUtils.insertInitialArchiveConfig(knex);
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
    }).then(function() {
      console.log('Demo data - Project Roles');
      return knex('project_role').insert([
        {
          project_type_cd: 1,
          source_role_cd: 'PI',
          description: 'Principle Investigator',
          req_disclosure: 0
        },
        {
          project_type_cd: 1,
          source_role_cd: 'COI',
          description: 'Co-Investigator',
          req_disclosure: 0
        },
        {
          project_type_cd: 2,
          source_role_cd: 'PI',
          description: 'Principle Investigator',
          req_disclosure: 0
        },
        {
          project_type_cd: 2,
          source_role_cd: 'COI',
          description: 'Co-Investigator',
          req_disclosure: 0
        },
        {
          project_type_cd: 3,
          source_role_cd: 'PI',
          description: 'Principle Investigator',
          req_disclosure: 0
        },
        {
          project_type_cd: 3,
          source_role_cd: 'COI',
          description: 'Co-Investigator',
          req_disclosure: 0
        },
        {
          project_type_cd: 4,
          source_role_cd: 'PI',
          description: 'Principle Investigator',
          req_disclosure: 0
        },
        {
          project_type_cd: 4,
          source_role_cd: 'COI',
          description: 'Co-Investigator',
          req_disclosure: 0
        },
        {
          project_type_cd: 5,
          source_role_cd: 'PI',
          description: 'Principle Investigator',
          req_disclosure: 0
        },
        {
          project_type_cd: 5,
          source_role_cd: 'COI',
          description: 'Co-Investigator',
          req_disclosure: 0
        }
      ]);
    }).then(function() {
      console.log('Project Statuses');
      return knex('project_status').insert([
        {
          project_type_cd: 1,
          source_status_cd: 1,
          description: 'IN PROGRESS',
          req_disclosure: 0
        },
        {
          project_type_cd: 2,
          source_status_cd: 1,
          description: 'IN PROGRESS',
          req_disclosure: 0
        },
        {
          project_type_cd: 3,
          source_status_cd: 1,
          description: 'IN PROGRESS',
          req_disclosure: 0
        },
        {
          project_type_cd: 4,
          source_status_cd: 1,
          description: 'IN PROGRESS',
          req_disclosure: 0
        },
        {
          project_type_cd: 5,
          source_status_cd: 1,
          description: 'IN PROGRESS',
          req_disclosure: 0
        },
        {
          project_type_cd: 1,
          source_status_cd: 2,
          description: 'APPROVAL PENDING',
          req_disclosure: 0
        },
        {
          project_type_cd: 2,
          source_status_cd: 2,
          description: 'APPROVAL PENDING',
          req_disclosure: 0
        },
        {
          project_type_cd: 3,
          source_status_cd: 2,
          description: 'APPROVAL PENDING',
          req_disclosure: 0
        },
        {
          project_type_cd: 4,
          source_status_cd: 2,
          description: 'APPROVAL PENDING',
          req_disclosure: 0
        },
        {
          project_type_cd: 5,
          source_status_cd: 2,
          description: 'APPROVAL PENDING',
          req_disclosure: 0
        }
      ]);
    });
  });
};
