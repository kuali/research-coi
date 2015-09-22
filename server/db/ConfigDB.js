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

  let queries = [];

  let sel = {};
  if (tableProps.where) {
    sel = query(tableProps.table).select(tableProps.pk).where(tableProps.where.key, tableProps.where.value);
  } else {
    sel = query(tableProps.table).select(tableProps.pk);
  }

  queries.push(sel.then(results=>{
    results.forEach(result=>{
      let match = collection.find(item=>{
        return item[tableProps.pk] && (item[tableProps.pk] === result[tableProps.pk]);
      });
      if (!match) {
        queries.push(query(tableProps.table)
        .update({active: false})
        .where(tableProps.pk, result[tableProps.pk])
        .catch(function(err) {
          if (optionalTrx) {
            optionalTrx.rollback();
          }
          callback(err);
        }));
      }
    });
  }));

  queries.push(collection.map(line => {
    if (line[tableProps.pk] === undefined) {
      line.active = true;
      if (tableProps.parent) {
        line[tableProps.parent.key] = tableProps.parent.value;
      }
      return query(tableProps.table)
      .insert(line, tableProps.pk)
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
      .catch(function(err) {
        if (optionalTrx) {
          optionalTrx.rollback();
        }
        callback(err);
      });
    }
  }));
};

let convertQuestionFormat = (questions) =>{
  return questions.map(question=>{
    question.question = JSON.stringify(question.question);
    if (isNaN(question.id)) {
      delete question.id;
    }
    return question;
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
    query.select('*').from('fin_entity_type'),
    query.select('*').from('relationship_category_type'),
    query.select('*').from('relationship_type').where('active', true),
    query.select('*').from('relationship_amount_type').where('active', true),
    query.select('*').from('relationship_person_type').where('active', true),
    query.select('*').from('declaration_type').where('active', true),
    query.select('*').from('disclosure_type'),
    query.select('*').from('notification'),
    query.select('*').from('questionnaire').limit(1).where('type_cd', 1).orderBy('version', 'desc').then(result=>{
      if (result[0]) {
        return query.select('*').from('questionnaire_question as qq').where({questionnaire_id: result[0].id, active: true});
      }
    }),
    query.select('*').from('questionnaire').limit(1).where('type_cd', 2).orderBy('version', 'desc').then(result=>{
      if (result[0]) {
        return query.select('*').from('questionnaire_question as qq').where({questionnaire_id: result[0].id, active: true});
      }
    }),
    query('config').select('config').where('name', 'General Config'),
    query.select('*').from('disclosure_status'),
    query.select('*').from('project_type')
  ])
  .then(result=>{
    config.entityTypes = result[0];
    config.matrixTypes = result[1];
    config.matrixTypes.map(type => {
      type.typeOptions = result[2].filter(relationType =>{
        return relationType.relationship_cd === type.type_cd;
      });
      type.amountOptions = result[3].filter(amountType =>{
        return amountType.relationship_cd === type.type_cd;
      });
      return type;
    });
    config.relationshipPersonTypes = result[4];
    config.declarationTypes = result[5];
    config.disclosureTypes = result[6];
    config.notifications = result[7];
    config.questions = {};
    config.questions.screening = result[8] ? result[8].map(question=>{
      question.question = JSON.parse(question.question);
      return question;
    }) : [];
    config.questions.entities = result[9] ? result[9].map(question=>{
      question.question = JSON.parse(question.question);
      return question;
    }) : [];

    config.disclosureStatus = result[11];
    config.projectTypes = result[12];

    config = camelizeJson(config);

    config.general = JSON.parse(result[10][0].config);
    callback(undefined, config);
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

    let typeOptionsQueries = createCollectionQueries(dbInfo, type.type_options, {pk: 'type_cd', table: 'relationship_type', where: {key: 'relationship_cd', value: type.type_cd}}, callback);

    let amountOptionsQueries = createCollectionQueries(dbInfo, type.amount_options, {pk: 'type_cd', table: 'relationship_amount_type', where: {key: 'relationship_cd', value: type.type_cd}}, callback);

    matrixTypeQueries.push(matrixTypeQuery);
    matrixTypeQueries.push(typeOptionsQueries);
    matrixTypeQueries.push(amountOptionsQueries);

    return matrixTypeQueries;
  }));

  queries.push(
    createCollectionQueries(dbInfo, config.declaration_types, {pk: 'type_cd', table: 'declaration_type'}, callback)
  );

  queries.push(
    createCollectionQueries(dbInfo, config.relationship_person_types, {pk: 'type_cd', table: 'relationship_person_type'}, callback)
  );

  queries.push(
    createCollectionQueries(dbInfo, config.disclosure_types, {pk: 'type_cd', table: 'disclosure_type'}, callback)
  );

  queries.push(
    createCollectionQueries(dbInfo, config.notifications, {pk: 'id', table: 'notification'}, callback)
  );

  queries.push(
    query.select('*').from('questionnaire').limit(1).where('type_cd', 1).orderBy('version', 'desc').then(result=>{
      if (result[0]) {
        return createCollectionQueries(dbInfo, convertQuestionFormat(config.questions.screening), {
          pk: 'id',
          table: 'questionnaire_question',
          where: {key: 'questionnaire_id', value: result[0].id},
          parent: {key: 'questionnaire_id', value: result[0].id}
        }, callback);
      } else {
        return query('questionnaire').insert({version: 1, type_cd: 1}).then(id=>{
          return createCollectionQueries(dbInfo, convertQuestionFormat(config.questions.screening), {
            pk: 'id',
            table: 'questionnaire_question',
            where: {key: 'questionnaire_id', value: id[0]},
            parent: {key: 'questionnaire_id', value: id[0]}
          }, callback);
        });
      }
    })
  );

  queries.push(
    query.select('*').from('questionnaire').limit(1).where('type_cd', 2).orderBy('version', 'desc').then(result=>{
      if (result[0]) {
        return createCollectionQueries(dbInfo, convertQuestionFormat(config.questions.entities), {
          pk: 'id',
          table: 'questionnaire_question',
          where: {key: 'questionnaire_id', value: result[0].id},
          parent: {key: 'questionnaire_id', value: result[0].id}
        }, callback);
      } else {
        return query('questionnaire').insert({version: 1, type_cd: 2}).then(id=>{
          return createCollectionQueries(dbInfo, convertQuestionFormat(config.questions.entities), {
            pk: 'id',
            table: 'questionnaire_question',
            where: {key: 'questionnaire_id', value: id[0]},
            parent: {key: 'questionnaire_id', value: id[0]}
          }, callback);
        });
      }
    })
  );

  queries.push(
    query('config').update({config: JSON.stringify(body.general)}).where('name', 'General Config')
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


