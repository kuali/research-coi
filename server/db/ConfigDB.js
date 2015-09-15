/*eslint camelcase:0 */
import {camelizeJson, snakeizeJson} from './JsonUtils';

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

let createCollectionQueries = (dbInfo, collection, tableProps, callback, optionalTrx) => {
  let knex = getKnex(dbInfo);

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }

  return collection.map(line => {
    if (line[tableProps.pk] === undefined) {
      return query(tableProps.table)
      .insert(line, tableProps.pk)
      .then(pk=> {
        line[tableProps.pk] = pk[0];
      })
      .catch(function(err) {
        if (optionalTrx) {
          optionalTrx.rollback();
        }
        callback(err);
      });
    } else {
      return query(tableProps.table)
      .update(line)
      .where(tableProps.pk, line[tableProps.pk])
      .then(()=> {
      })
      .catch(function(err) {
        if (optionalTrx) {
          optionalTrx.rollback();
        }
        callback(err);
      });
    }
  });
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
    query.select('*').from('fin_entity_type'),
    query.select('*').from('relationship_category_type'),
    query.select('*').from('relationship_type'),
    query.select('*').from('relationship_amount_type'),
    query.select('*').from('relationship_person_type'),
    query.select('*').from('relationship_status')
  ])
  .then(result=>{
    config.questions = result[0].map(question => {
      question.text = JSON.parse(question.question).text;
      return question;
    });

    config.entityTypes = result[1];
    config.matrixTypes = result[2];
    config.matrixTypes.map(type => {
      type.typeOptions = result[3].filter(relationType =>{
        return relationType.relationship_cd === type.type_cd;
      });
      type.amountOptions = result[4].filter(amountType =>{
        return amountType.relationship_cd === type.type_cd;
      });
      return type;
    });
    config.relationshipPersonTypes = result[5];
    config.relationshipStatuses = result[6];
    callback(undefined, camelizeJson(config));
  })
  .catch(function(err) {
    if (optionalTrx) {
      optionalTrx.rollback();
    }
    callback(err);
  });
};

export let setConfig = (dbInfo, userId, body, callback, optionalTrx) => {
  let config = snakeizeJson(body);

  let knex = getKnex(dbInfo);

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }
  let queries = [];
  queries.push(config.matrix_types.map(type => {
    let matrixTypeQueries = [];

    let matrixTypeQuery = query('relationship_category_type').update({
      enabled: type.enabled,
      type_enabled: type.type_enabled,
      amount_enabled: type.amount_enabled
    })
    .where('type_cd', type.type_cd)
    .catch(function(err) {
      if (optionalTrx) {
        optionalTrx.rollback();
      }
      callback(err);
    });

    let typeOptionsQueries = createCollectionQueries(dbInfo, type.type_options, {pk: 'type_cd', table: 'relationship_type'}, callback);

    let amountOptionsQueries = createCollectionQueries(dbInfo, type.amount_options, {pk: 'type_cd', table: 'relationship_amount_type'}, callback);

    matrixTypeQueries.push(matrixTypeQuery);
    matrixTypeQueries.push(typeOptionsQueries);
    matrixTypeQueries.push(amountOptionsQueries);

    return matrixTypeQueries;
  }));

  queries.push(
    createCollectionQueries(dbInfo, config.relationship_person_types, {pk: 'type_cd', table: 'relationship_person_type'}, callback)
  );

  Promise.all(queries)
  .then(() =>{
    callback(undefined, camelizeJson(config));
  })
  .catch(function(err) {
    if (optionalTrx) {
      optionalTrx.rollback();
    }
    callback(err);
  });

};


