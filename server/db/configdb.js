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

/*eslint camelcase:0 */
import {camelizeJson, snakeizeJson} from './json-utils';

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./connection-manager').default;
}
const mockDB = {
  'UIT': {
    colors: {
      'one': '#348FF7',
      'two': '#0E4BB6',
      'three': '#048EAF',
      'four': '#EDF2F2'
    }
  }
};

const createDeleteQueries = (query, collection, tableProps) => {
  let sel = query(tableProps.table).select(tableProps.pk);
  if (tableProps.where) {
    sel = sel.where(tableProps.where.key, tableProps.where.value);
  }

  return sel.then(results => {
    Promise.all(
      results.filter(result => {
        const match = collection.find(item => {
          return item[tableProps.pk] && (item[tableProps.pk] === result[tableProps.pk]);
        });
        return !match;
      }).map(result => {
        return query(tableProps.table)
        .update({active: false})
        .where(tableProps.pk, result[tableProps.pk]);
      })
    );
  });
};

const createInsertQueries = (query, collection, tableProps) => {
  return Promise.all(
    collection.map(line => {
      line.active = true;
      if (tableProps.parent) {
        line[tableProps.parent.key] = tableProps.parent.value;
      }
      return query(tableProps.table)
        .insert(line, tableProps.pk);
    })
  );
};

const createUpdateQueries = (query, collection, tableProps) => {
  return Promise.all(
    collection.map(line => {
      return query(tableProps.table)
        .update(line)
        .where(tableProps.pk, line[tableProps.pk]);
    })
  );
};

const createCollectionQueries = (query, collection, tableProps) => {
  const updates = [];
  const inserts = [];
  collection.forEach(line => {
    if (line[tableProps.pk] === undefined) {
      inserts.push(line);
    } else {
      updates.push(line);
    }
  });

  return Promise.all([
    createDeleteQueries(query, collection, tableProps),
    createInsertQueries(query, inserts, tableProps),
    createUpdateQueries(query, updates, tableProps)
  ]);
};

const convertQuestionFormat = (questions) => {
  return questions.map(question => {
    question.question = JSON.stringify(question.question);
    if (isNaN(question.id)) {
      delete question.id;
    }
    return question;
  });
};

export const getConfig = (dbInfo, userId, optionalTrx) => {
  let config = mockDB.UIT;
  const knex = getKnex(dbInfo);

  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }
  return Promise.all([
    query.select('*').from('relationship_category_type'),
    query.select('*').from('relationship_type').where('active', true),
    query.select('*').from('relationship_amount_type').where('active', true),
    query.select('*').from('relationship_person_type').where('active', true),
    query.select('*').from('declaration_type').where('active', true),
    query.select('*').from('disclosure_type'),
    query.select('*').from('notification').where('active', true),
    query.select('*').from('questionnaire').limit(1).where('type_cd', 1).orderBy('version', 'desc').then(result => {
      if (result[0]) {
        return query.select('*').from('questionnaire_question as qq').where({questionnaire_id: result[0].id, active: true});
      }
    }),
    query.select('*').from('questionnaire').limit(1).where('type_cd', 2).orderBy('version', 'desc').then(result => {
      if (result[0]) {
        return query.select('*').from('questionnaire_question as qq').where({questionnaire_id: result[0].id, active: true});
      }
    }),
    query('config').select('config').limit(1).orderBy('id', 'desc'),
    query.select('*').from('disclosure_status'),
    query.select('*').from('project_type')
  ])
  .then(result => {
    config.matrixTypes = result[0];
    config.matrixTypes.map(type => {
      type.typeOptions = result[1].filter(relationType => {
        return relationType.relationship_cd === type.type_cd;
      });
      type.amountOptions = result[2].filter(amountType => {
        return amountType.relationship_cd === type.type_cd;
      });
      return type;
    });
    config.relationshipPersonTypes = result[3];
    config.declarationTypes = result[4];
    config.disclosureTypes = result[5];
    config.notifications = result[6];
    config.questions = {};
    config.questions.screening = result[7] ? result[7].map(question => {
      question.question = JSON.parse(question.question);
      return question;
    }) : [];
    config.questions.entities = result[8] ? result[8].map(question => {
      question.question = JSON.parse(question.question);
      return question;
    }) : [];

    config.disclosureStatus = result[10];
    config.projectTypes = result[11];

    config = camelizeJson(config);
    config.general = JSON.parse(result[9][0].config).general;
    return config;
  });
};

export const setConfig = (dbInfo, userId, body, optionalTrx) => {
  const config = snakeizeJson(body);
  const knex = getKnex(dbInfo);
  let query;
  if (optionalTrx) {
    query = knex.transacting(optionalTrx);
  }
  else {
    query = knex;
  }

  const queries = [];

  config.matrix_types.forEach(type => {
    queries.push(
      query('relationship_category_type').update({
        enabled: type.enabled,
        type_enabled: type.type_enabled,
        amount_enabled: type.amount_enabled,
        destination_enabled: type.destination_enabled,
        date_enabled: type.date_enabled,
        reason_enabled: type.reason_enabled
      })
      .where('type_cd', type.type_cd)
    );

    queries.push(
      createCollectionQueries(query, type.type_options, {pk: 'type_cd', table: 'relationship_type', where: {key: 'relationship_cd', value: type.type_cd}})
    );

    queries.push(
      createCollectionQueries(query, type.amount_options, {
        pk: 'type_cd',
        table: 'relationship_amount_type',
        where: {
          key: 'relationship_cd',
          value: type.type_cd
        }
      })
    );
  });

  queries.push(
    createCollectionQueries(query, config.declaration_types, {pk: 'type_cd', table: 'declaration_type'})
  );

  queries.push(
    createCollectionQueries(query, config.relationship_person_types, {pk: 'type_cd', table: 'relationship_person_type'})
  );

  queries.push(
    createCollectionQueries(query, config.disclosure_types, {pk: 'type_cd', table: 'disclosure_type'})
  );

  queries.push(
    createCollectionQueries(query, config.notifications, {pk: 'id', table: 'notification'})
  );

  queries.push(
    query.select('*').from('questionnaire').limit(1).where('type_cd', 1).orderBy('version', 'desc')
      .then(result => {
        if (result[0]) {
          return createCollectionQueries(query, convertQuestionFormat(config.questions.screening), {
            pk: 'id',
            table: 'questionnaire_question',
            where: {key: 'questionnaire_id', value: result[0].id},
            parent: {key: 'questionnaire_id', value: result[0].id}
          });
        }

        return query('questionnaire').insert({version: 1, type_cd: 1}, 'id').then(id => {
          return createCollectionQueries(query, convertQuestionFormat(config.questions.screening), {
            pk: 'id',
            table: 'questionnaire_question',
            where: {key: 'questionnaire_id', value: id[0]},
            parent: {key: 'questionnaire_id', value: id[0]}
          });
        });
      })
  );

  queries.push(
    query.select('*').from('questionnaire').limit(1).where('type_cd', 2).orderBy('version', 'desc')
      .then(result => {
        if (result[0]) {
          return createCollectionQueries(query, convertQuestionFormat(config.questions.entities), {
            pk: 'id',
            table: 'questionnaire_question',
            where: {key: 'questionnaire_id', value: result[0].id},
            parent: {key: 'questionnaire_id', value: result[0].id}
          });
        }
        return query('questionnaire').insert({version: 1, type_cd: 2}, 'id').then(id => {
          return createCollectionQueries(query, convertQuestionFormat(config.questions.entities), {
            pk: 'id',
            table: 'questionnaire_question',
            where: {key: 'questionnaire_id', value: id[0]},
            parent: {key: 'questionnaire_id', value: id[0]}
          });
        });
      })
  );
  return Promise.all(queries)
    .then(() => {
      return camelizeJson(config);
    });
};

export const archiveConfig = (dbInfo, userId, userName, config) => {
  const knex = getKnex(dbInfo);
  return knex('config').insert({
    config: JSON.stringify(config),
    user_id: userId,
    user_name: userName,
    updated_date: new Date()
  }, 'id');
};

export const getArchivedConfig = (dbInfo, id) => {
  const knex = getKnex(dbInfo);
  return knex('config').select('config').where('id', id);
};
