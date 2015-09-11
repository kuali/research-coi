/*eslint camelcase:0 */
import {camelizeJson} from './JsonUtils';
import {saveSingleRecord, getExistingSingleRecord, saveExistingSingleRecord, deleteExistingSingleRecord} from './CommonDB';

let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

let mockDB = new Map();
let lastId = 0;

export let wipeAll = () => {
  mockDB.clear();
};

export let save = (school, newDisclosure) => {
  if (!mockDB.has(school)) {
    mockDB.set(school, new Map());
  }
  mockDB.get(school).set(lastId, newDisclosure);
  return lastId++;
};

export let saveDisclosure = (dbInfo, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'disclosure', pk: 'id'}, optionalTrx);
};

export let getExistingDisclosure = (dbInfo, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'disclosure', pk: 'id'}, optionalTrx);
};

export let saveExistingDisclosure = (dbInfo, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'disclosure', pk: 'id'}, optionalTrx);
};

export let deleteExistingDisclosure = (dbInfo, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'disclosure', pk: 'id'}, optionalTrx);
};

export let saveFinEntity = (dbInfo, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'fin_entity', pk: 'id'}, optionalTrx);
};

export let saveNewFinancialEntity = (dbInfo, disclosureId, body, callback) => {
  let knex = getKnex(dbInfo);

  let financialEntity = body;
  knex('fin_entity')
  .insert({
    disclosure_id: disclosureId,
    active: financialEntity.active,
    is_public: financialEntity.isPublic,
    type_cd: financialEntity.type,
    is_sponsor: financialEntity.isSponsor,
    name: financialEntity.name,
    description: financialEntity.description
  })
  .then(id => {
    financialEntity.id = id[0];
    let relationshipQueries = financialEntity.relationships.map(relationship => {
      relationship.finEntityId = id[0];
      return knex('relationship')
      .insert({
        fin_entity_id: id[0],
        relationship_cd: relationship.relationshipCd,
        person_cd: relationship.personCd,
        type_cd: relationship.typeCd,
        amount_cd: relationship.amountCd,
        comments: relationship.comments
      })
      .then(relationshipId=>{
        relationship.id = relationshipId[0];
      })
      .catch(function(err) {
        callback(err);
      });
    });

    Promise.all(relationshipQueries)
    .then(()=>{
      callback(undefined, financialEntity);
    })
    .catch(function(err) {
      callback(err);
    });
  })
  .catch(function(err) {
    callback(err);
  });
};

export let saveExistingFinancialEntity = (dbInfo, disclosureId, body, callback) => {
  let knex = getKnex(dbInfo);

  let financialEntity = body;

  knex('fin_entity')
  .where('id', financialEntity.id)
  .update({
    disclosure_id: disclosureId,
    active: financialEntity.active,
    is_public: financialEntity.isPublic,
    type_cd: financialEntity.type,
    is_sponsor: financialEntity.isSponsor,
    name: financialEntity.name,
    description: financialEntity.description
  }).then(()=>{
    let relationshipQueries = financialEntity.relationships.map(relationship => {
      if (!relationship.id) {
        relationship.finEntityId = financialEntity.id;
        return knex('relationship')
        .insert({
          fin_entity_id: financialEntity.id,
          relationship_cd: relationship.relationshipCd,
          person_cd: relationship.personCd,
          type_cd: relationship.typeCd,
          amount_cd: relationship.amountCd,
          comments: relationship.comments
        })
        .then(relationshipId=>{
          relationship.id = relationshipId[0];
        })
        .catch(function(err) {
          callback(err);
        });
      }
    });

    Promise.all(relationshipQueries)
    .then(()=>{
      callback(undefined, financialEntity);
    })
    .catch(function(err) {
      callback(err);
    });
  })
  .catch(function(err) {
    callback(err);
  });
};

export let getExistingEntity = (dbInfo, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'fin_entity', pk: 'id'}, optionalTrx);
};

export let saveExistingFinEntity = (dbInfo, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'fin_entity', pk: 'id'}, optionalTrx);
};

export let deleteExistingEntity = (dbInfo, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'fin_entity', pk: 'id'}, optionalTrx);
};

export let saveRelationship = (dbInfo, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'relationship', pk: 'id'}, optionalTrx);
};

export let getExistingRelationship = (dbInfo, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'relationship', pk: 'id'}, optionalTrx);
};

export let saveExistingRelationship = (dbInfo, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'relationship', pk: 'id'}, optionalTrx);
};

export let deleteExistingRelationship = (dbInfo, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'relationship', pk: 'id'}, optionalTrx);
};

export let saveDeclaration = (dbInfo, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'declaration', pk: 'id'}, optionalTrx);
};

export let getExistingDeclaration = (dbInfo, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'declaration', pk: 'id'}, optionalTrx);
};

export let saveExistingDeclaration = (dbInfo, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'declaration', pk: 'id'}, optionalTrx);
};

export let deleteExistingDeclaration = (dbInfo, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'declaration', pk: 'id'}, optionalTrx);
};

export let saveDisclosureNested = (dbInfo, record, callback) => {
  //implement
};

export let saveExistingDisclosureNested = (dbInfo, record, callback) => {
  //implement
};


// this need not be implemented, just demo data for now
// until get by disclosure id is implemented.
export let getSampleDisclosures = () => {
  let results = [{
    type: 'ANNUAL',
    disposition: 222,
    id: 3,
    name: 'Research 1',
    submittedBy: 'Johnny Jack',
    submittedOn: 1434148767062,
    startDate: 1434148767062,
    status: 'IN_PROGRESS',
    questionnaire: {
      '1': 'Yes',
      '2': 'No',
      '3': 'Yes'
     },
    entities: [
      {
        'id': 61709,
        'name': 'Avaya Inc.',
        'status': 'Active',
        'public': true,
        'type': 'Large Corporation',
        'sponsorResearch': false,
        'description': 'A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS',
        'relationships': [
          {
            'person': 'Self',
            'relationship': 'Other',
            'type': 'Other Transactions',
            'amount': '$1-$5,000',
            'comments': 'This organization consults with me weekly via phone'
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 1'
    }]
  },
  {
    type: 'ANNUAL',
    disposition: 222,
    id: 32432,
    name: 'Research 2',
    submittedBy: 'Kim Kiera',
    submittedOn: 1434948767062,
    startDate: 1434143767062,
    status: 'AWAITING_REVIEW',
    questionnaire: {
      '1': 'Yes',
      '2': 'No',
      '3': 'Yes'
     },
    entities: [
      {
        'id': 61709,
        'name': 'Avaya Inc.',
        'status': 'Active',
        'public': true,
        'type': 'Large Corporation',
        'sponsorResearch': false,
        'description': 'A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS',
        'relationships': [
          {
            'person': 'Self',
            'relationship': 'Other',
            'type': 'Other Transactions',
            'amount': '$1-$5,000',
            'comments': 'This organization consults with me weekly via phone'
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 2'
    }]
  },
  {
    type: 'PROJECT',
    disposition: 222,
    id: 54364,
    name: 'Research 3',
    submittedBy: 'Lara Lant',
    submittedOn: 1432148767062,
    startDate: 1434448767062,
    status: 'IN_PROGRESS',
    questionnaire: {
      '1': 'Yes',
      '2': 'No',
      '3': 'Yes'
     },
    entities: [
      {
        'id': 61709,
        'name': 'Avaya Inc.',
        'status': 'Active',
        'public': true,
        'type': 'Large Corporation',
        'sponsorResearch': false,
        'description': 'A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS',
        'relationships': [
          {
            'person': 'Self',
            'relationship': 'Other',
            'type': 'Other Transactions',
            'amount': '$1-$5,000',
            'comments': 'This organization consults with me weekly via phone'
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 3'
    }]
  },
  {
    type: 'ANNUAL',
    disposition: 222,
    id: 76576,
    name: 'Research 4',
    submittedBy: 'Mark Millburn',
    submittedOn: 1434748767062,
    startDate: 1434188767062,
    status: 'REVISION_NECESSARY',
    'questionnaire': {
      '1': 'Yes',
      '2': 'No',
      '3': 'Yes'
     },
    'entities': [
      {
        'id': 61709,
        'name': 'Avaya Inc.',
        'status': 'Active',
        'public': true,
        'type': 'Large Corporation',
        'sponsorResearch': false,
        'description': 'A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS',
        'relationships': [
          {
            'person': 'Self',
            'relationship': 'Other',
            'type': 'Other Transactions',
            'amount': '$1-$5,000',
            'comments': 'This organization consults with me weekly via phone'
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 4'
    }]
  },
  {
    type: 'PROJECT',
    disposition: 222,
    id: 9769,
    name: 'Research 5',
    submittedBy: 'Nate Niter',
    submittedOn: 1432148767062,
    startDate: 1434248767062,
    status: 'REVISION_NECESSARY',
    'questionnaire': {
      '1': 'Yes',
      '2': 'No',
      '3': 'Yes'
     },
    'entities': [
      {
        'id': 61709,
        'name': 'Avaya Inc.',
        'status': 'Active',
        'public': true,
        'type': 'Large Corporation',
        'sponsorResearch': false,
        'description': 'A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS',
        'relationships': [
          {
            'person': 'Self',
            'relationship': 'Other',
            'type': 'Other Transactions',
            'amount': '$1-$5,000',
            'comments': 'This organization consults with me weekly via phone'
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 5'
    }]
  },
  {
    type: 'ANNUAL',
    disposition: 222,
    id: 8987,
    name: 'Research 6',
    submittedBy: 'Oliver Osmond',
    submittedOn: 1432148767062,
    startDate: 1434248767062,
    status: 'AWAITING_REVIEW',
    'questionnaire': {
      '1': 'Yes',
      '2': 'No',
      '3': 'Yes'
     },
    'entities': [
      {
        'id': 61709,
        'name': 'Avaya Inc.',
        'status': 'Active',
        'public': true,
        'type': 'Large Corporation',
        'sponsorResearch': false,
        'description': 'A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS',
        'relationships': [
          {
            'person': 'Self',
            'relationship': 'Other',
            'type': 'Other Transactions',
            'amount': '$1-$5,000',
            'comments': 'This organization consults with me weekly via phone'
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 6'
    }]
  },
  {
    type: 'PROJECT',
    disposition: 222,
    id: 113232,
    name: 'Research 7',
    submittedBy: 'Peter Pratan',
    submittedOn: 1434948767062,
    startDate: 1434548767062,
    status: 'REVISION_NECESSARY',
    'questionnaire': {
      '1': 'Yes',
      '2': 'No',
      '3': 'Yes'
     },
    'entities': [
      {
        'id': 61709,
        'name': 'Avaya Inc.',
        'status': 'Active',
        'public': true,
        'type': 'Large Corporation',
        'sponsorResearch': false,
        'description': 'A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS',
        'relationships': [
          {
            'person': 'Self',
            'relationship': 'Other',
            'type': 'Other Transactions',
            'amount': '$1-$5,000',
            'comments': 'This organization consults with me weekly via phone'
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 7'
    }]
  }];
  return results;
};

export let saveNewQuestionAnswer = (dbInfo, disclosureId, body) => {
  let knex = getKnex(dbInfo);
  knex('questionnaire_answer').insert({
    question_id: body.id,
    answer: JSON.stringify(body.answer)
  }).then(result =>{
    return knex('disclosure_answer').insert({
      disclosure_id: disclosureId,
      questionnaire_answer_id: result[0]});
  });
};

export let saveExistingQuestionAnswer = (dbInfo, disclosureId, body) => {
  let knex = getKnex(dbInfo);
  knex.select('qa.id')
  .from('disclosure_answer as da')
  .innerJoin('questionnaire_answer as qa', 'da.questionnaire_answer_id', 'qa.id')
  .where('da.disclosure_id', disclosureId)
  .andWhere('qa.question_id', body.id).then(result => {
    return knex('questionnaire_answer')
    .where('id', result[0].id)
    .update('answer', JSON.stringify(body.answer));
  });
};

export let get = (dbInfo, disclosureId, callback) => {
  var disclosure;
  let knex = getKnex(dbInfo);
  Promise.all([
    knex.select('de.id', 'de.type_cd', 'de.title', 'de.disposition_type_cd', 'de.status_cd', 'de.submitted_by', 'de.submitted_date', 'de.start_date', 'de.expired_date', 'de.last_review_date')
      .from('disclosure as de')
      .where('id', disclosureId),
    knex.select('e.id', 'e.disclosure_id', 'e.active', 'e.is_public as isPublic', 'e.type_cd as type', 'e.is_sponsor as isSponsor', 'e.name', 'e.description')
      .from('fin_entity as e')
      .where('disclosure_id', disclosureId),
    knex.select('qa.id as id', 'qa.answer as answer')
      .from('disclosure_answer as da')
      .innerJoin('questionnaire_answer as qa', 'qa.id', 'da.questionnaire_answer_id')
      .where('da.disclosure_id', disclosureId),
    knex.select('p.name as title', 'pt.description as type', 'p.role_cd as role', 'p.sponsor_cd as sponsorCd')
      .from('project as p')
      .innerJoin('project_type as pt', 'pt.type_cd', 'p.type_cd' )
      .where('disclosure_id', disclosureId)
  ]).then(result => {
    if (result[0].length === 0) { // There should be more checks like this
      callback(new Error('invalid disclosure id'));
    }

    disclosure = result[0][0];
    disclosure.entities = result[1];
    disclosure.answers = result[2];
    disclosure.projects = result[3];
    disclosure.answers.forEach(answer =>{
      answer.answer = JSON.parse(answer.answer);
    });
    knex.select('r.id', 'r.fin_entity_id', 'r.relationship_cd as relationshipCd', 'rc.description as relationship', 'r.person_cd as personCd', 'rp.description as person', 'r.type_cd as typeCd', 'rt.description as type', 'r.amount_cd as amountCd', 'ra.description as amount', 'r.comments')
      .from('relationship as r')
      .innerJoin('relationship_person_type as rp', 'r.person_cd', 'rp.type_cd')
      .innerJoin('relationship_category_type as rc', 'r.relationship_cd', 'rc.type_cd')
      .innerJoin('relationship_type as rt', 'r.type_cd', 'rt.type_cd' )
      .innerJoin('relationship_amount_type as ra', 'r.amount_cd', 'ra.type_cd')
      .whereIn('fin_entity_id', disclosure.entities.map(entity => { return entity.id; }))
      .then(relationships => {
        disclosure.entities.forEach(entity => {
          entity.relationships = relationships.filter(relationship => {
            return relationship.fin_entity_id === entity.id;
          });
        });

        return knex.select('id', 'fin_entity_id', 'project_id', 'relationship_status_cd')
          .from('declaration')
          .whereIn('fin_entity_id', disclosure.entities.map(entity => { return entity.fin_entity_id; }));
      })
      .then(declarations => {
        disclosure.entities.forEach(entity => {
          entity.declarations = declarations.filter(declaration => {
            return declaration.fin_entity_id === entity.id;
          });
        });
        callback(undefined, camelizeJson(disclosure));
      })
      .catch(err => {
        callback(err);
      });
  })
  .catch(err => {
    callback(err);
  });
};

export let getMinDisclosure = (dbInfo, callback) => {
  let knex = getKnex(dbInfo);
  knex('disclosure').min('id as id')
  .then(result => {
    get(dbInfo, result[0].id, callback);
  });
};

export let getSummariesForReview = (school, sortColumn, sortDirection, query) => {
  let results = [{
    type: 'ANNUAL',
    disposition: 222,
    id: 3,
    name: 'Research 1',
    submittedBy: 'Johnn Jack',
    submittedOn: 1434148767062,
    startDate: 1434148767062,
    status: 'IN_PROGRESS',
    projects: [{
      'name': 'Project 1'
    }]
  },
  {
    type: 'ANNUAL',
    disposition: 222,
    id: 32432,
    name: 'Research 2',
    submittedBy: 'Kim Kiera',
    submittedOn: 1434948767062,
    startDate: 1434143767062,
    status: 'AWAITING_REVIEW',
    projects: [{
      'name': 'Project 2'
    }]
  },
  {
    type: 'PROJECT',
    disposition: 222,
    id: 54364,
    name: 'Research 3',
    submittedBy: 'Lara Lant',
    submittedOn: 1432148767062,
    startDate: 1434448767062,
    status: 'IN_PROGRESS',
    projects: [{
      'name': 'Project 3'
    }]
  },
  {
    type: 'ANNUAL',
    disposition: 222,
    id: 76576,
    name: 'Research 4',
    submittedBy: 'Mark Millburn',
    submittedOn: 1434748767062,
    startDate: 1434188767062,
    status: 'REVISION_NECESSARY',
    projects: [{
      'name': 'Project 4'
    }]
  },
  {
    type: 'PROJECT',
    disposition: 222,
    id: 9769,
    name: 'Research 5',
    submittedBy: 'Nate Niter',
    submittedOn: 1432148767062,
    startDate: 1434248767062,
    status: 'REVISION_NECESSARY',
    projects: [{
      'name': 'Project 5'
    }]
  },
  {
    type: 'ANNUAL',
    disposition: 222,
    id: 8987,
    name: 'Research 6',
    submittedBy: 'Oliver Osmond',
    submittedOn: 1432148767062,
    startDate: 1434248767062,
    status: 'AWAITING_REVIEW',
    projects: [{
      'name': 'Project 6'
    }]
  },
  {
    type: 'PROJECT',
    disposition: 222,
    id: 113232,
    name: 'Research 7',
    submittedBy: 'Peter Pratan',
    submittedOn: 1434948767062,
    startDate: 1434548767062,
    status: 'REVISION_NECESSARY',
    projects: [{
      'name': 'Project 7'
    }]
  }];

  let lowerCaseQuery = query.toLowerCase();
  results = results.filter((disclosure) => {
    return disclosure.projects[0].name.toLowerCase().indexOf(lowerCaseQuery) === 0 ||
           disclosure.submittedBy.toLowerCase().indexOf(lowerCaseQuery) === 0;
  });

  return results.sort((a, b) => {
    switch (sortColumn) {
      case 'DISPOSITION':
        return sortDirection === 'DESCENDING' ? a.disposition < b.disposition : a.disposition > b.disposition;
      case 'PROJECT_TITLE':
        return sortDirection === 'DESCENDING' ? a.name < b.name : a.name > b.name;
      case 'PI':
        return sortDirection === 'DESCENDING' ? a.submittedBy < b.submittedBy : a.submittedBy > b.submittedBy;
      case 'DATE_SUBMITTED':
        return sortDirection === 'DESCENDING' ? a.submittedOn < b.submittedOn : a.submittedOn > b.submittedOn;
      case 'STATUS':
        return sortDirection === 'DESCENDING' ? a.status < b.status : a.status > b.status;
      case 'PROJECT_START_DATE':
        return sortDirection === 'DESCENDING' ? a.startDate < b.startDate : a.startDate > b.startDate;
    }
  });
};

export let getSummariesForUser = (dbInfo, userId, callback) => {
  let knex = getKnex(dbInfo);
  knex.select('t.description as type', 'd.expired_date as expired_date', 'd.title', 's.description as status', 'd.last_review_date as last_review_date', 'd.id')
    .from('disclosure as d')
    .innerJoin('disposition_type as t', 'd.disposition_type_cd', 't.type_cd')
    .innerJoin('disclosure_status as s', 'd.status_cd', 's.status_cd')
    .then(function (rows) {
      callback(undefined, rows);
    })
    .catch(function (err) {
      callback(err);
    });
};

export let getArchivedDisclosures = (dbInfo, userId, callback) => {
  let knex = getKnex(dbInfo);
  knex.select('de.id', 'de.type_cd as type', 'de.title', 'submitted_date as submitted_date', 'dn.description as disposition', 'de.start_date')
    .from('disclosure as de')
    .innerJoin('disposition_type as dn', 'de.disposition_type_cd', 'dn.type_cd')
    .then(function (rows) {
      callback(undefined, rows);
    })
    .catch(function (err) {
      callback(err);
    });
};

export let getEntityTypes = (dbInfo, callback) => {
  let knex = getKnex(dbInfo);
  knex.select('type_cd as typeCd', 'description')
  .from('fin_entity_type')
  .then(results => {
    callback(undefined, results);
  })
  .catch(function (err) {
    callback(err);
  });
};

export let getRelationshipCategoryTypes = (dbInfo, callback) => {
  let knex = getKnex(dbInfo);
  knex.select('type_cd as typeCd', 'description')
  .from('relationship_category_type')
  .then(results => {
    callback(undefined, results);
  })
  .catch(function (err) {
    callback(err);
  });
};

export let getRelationshipTypes = (dbInfo, callback) => {
  let knex = getKnex(dbInfo);
  knex.select('type_cd as typeCd', 'relationship_cd as relationshipTypeCd', 'description')
  .from('relationship_type')
  .then(results => {
    callback(undefined, results);
  })
  .catch(function (err) {
    callback(err);
  });
};

export let getRelationshipPersonTypes = (dbInfo, callback) => {
  let knex = getKnex(dbInfo);
  knex.select('type_cd as typeCd', 'description')
  .from('relationship_person_type')
  .then(results => {
    callback(undefined, results);
  })
  .catch(function (err) {
    callback(err);
  });
};

export let getRelationshipAmountTypes = (dbInfo, callback) => {
  let knex = getKnex(dbInfo);
  knex.select('type_cd as typeCd', 'description')
  .from('relationship_amount_type')
  .then(results => {
    callback(undefined, results);
  })
  .catch(function (err) {
    callback(err);
  });
};

export let getRelationshipStatuses = (dbInfo, callback) => {
  let knex = getKnex(dbInfo);
  knex.select('status_cd as statusCd', 'description')
  .from('relationship_status')
  .then(results => {
    callback(undefined, results);
  })
  .catch(function (err) {
    callback(err);
  });
};

export let approve = (school, disclosureId) => {
  let disclosure = get(school, disclosureId);
  disclosure.status = 'APPROVED';
};

export let sendBack = (school, disclosureId) => {
  let disclosure = get(school, disclosureId);
  disclosure.status = 'RETURNED';
};

export let addReviewer = (school, disclosureId, reviewerName) => {
  let disclosure = get(school, disclosureId);
  if (!disclosure.reviewers) { disclosure.reviewers = []; }
  disclosure.reviewers.push(reviewerName);
};

export let addQuestionnaireComment = (school, disclosureId, comment) => {
  let disclosure = get(school, disclosureId);
  if (!disclosure.questionnaire) { disclosure.questionnaire = {comments: []}; }
  disclosure.questionnaire.comments.push(comment);
};

export let addEntityComment = (school, disclosureId, comment) => {
  let disclosure = get(school, disclosureId);
  if (!disclosure.entity) { disclosure.entity = {comments: []}; }
  disclosure.entity.comments.push(comment);
};

export let addDeclarationComment = (school, disclosureId, comment) => {
  let disclosure = get(school, disclosureId);
  if (!disclosure.declarations) { disclosure.declarations = {comments: []}; }
  disclosure.declarations.comments.push(comment);
};

export let searchByDate = (school, start, end) => {
  let schoolMap = mockDB.get(school);
  let matches = [];
  schoolMap.forEach((value) => {
    if (value.submittedDate >= start && value.submittedDate <= end) {
      matches.push(value);
    }
  });

  return matches;
};

export let searchByType = (school, type) => {
  let schoolMap = mockDB.get(school);
  let matches = [];
  schoolMap.forEach((value) => {
    if (value.type === type) {
      matches.push(value);
    }
  });

  return matches;
};

export let searchByDisposition = (school, disposition) => {
  let schoolMap = mockDB.get(school);
  let matches = [];
  schoolMap.forEach((value) => {
    if (value.disposition === disposition) {
      matches.push(value);
    }
  });

  return matches;
};

export let searchByStatus = (school, status) => {
  let schoolMap = mockDB.get(school);
  let matches = [];
  schoolMap.forEach((value) => {
    if (value.status === status) {
      matches.push(value);
    }
  });

  return matches;
};

export let searchByUnit = (school, unit) => {
  let schoolMap = mockDB.get(school);
  let matches = [];
  schoolMap.forEach((value) => {
    if (value.unit === unit) {
      matches.push(value);
    }
  });

  return matches;
};

export let search = (school, query) => {
  let schoolMap = mockDB.get(school);
  let matches = [];
  schoolMap.forEach((value) => {
    if (value.name.startsWith(query)) {
      matches.push(value);
    }
  });

  return matches;
};
