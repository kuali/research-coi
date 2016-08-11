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

import {camelizeJson, snakeizeJson} from './json-utils';
import { populateTemplateData, handleTemplates } from '../services/notification-service/notification-service';
import { NOTIFICATIONS_MODE, LANES } from '../../coi-constants';
import getKnex from './connection-manager';
import Log from '../log';

const cachedConfigs = {};

let getNotificationsInfo;
let lane;
try {
  const extensions = require('research-extensions').default;
  getNotificationsInfo = extensions.getNotificationsInfo;
  lane = extensions.config.lane;
}
catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND') {
    Log.error(err);
  }
  lane = process.env.LANE || LANES.PRODUCTION;
  getNotificationsInfo = () => {
    return {
      notificationsMode: process.env.NOTIFICATIONS_MODE || NOTIFICATIONS_MODE.OFF
    };
  };
}

const SCREENING_QUESTIONNAIRE_TYPE_CD = 1;
const FIN_ENTITY_QUESTIONNAIRE_TYPE_CD = 2;

function createDeleteQueries(query, collection, tableProps) {
  let sel = query(tableProps.table).select(tableProps.pk);
  if (tableProps.where) {
    sel = sel.where(tableProps.where);
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
}

function createInsertQueries(query, collection, tableProps) {
  return Promise.all(
    collection.map(line => {
      const tmpId = line.tmpId;
      delete line.tmpId;
      delete line.tmp_id;
      line.active = true;
      if (tableProps.parent) {
        line[tableProps.parent.key] = tableProps.parent.value;
      }
      return query(tableProps.table)
        .insert(line, tableProps.pk).then(result => {
          line[tableProps.pk] = result[0];
          line.tmpId = tmpId;
          return line;
        });
    })
  );
}

function createUpdateQueries(query, collection, tableProps) {
  return Promise.all(
    collection.map(line => {
      delete line.tmpId;
      delete line.tmp_id;
      return query(tableProps.table)
        .update(line)
        .where(tableProps.pk, line[tableProps.pk]);
    })
  );
}

function createCollectionQueries(query, collection, tableProps) {
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
  ]).then((results) => {
    const insertResults = results[1];
    return collection.map(line => {
      if (insertResults) {
        const insert = insertResults.find(result => result.tmpId === line.tmpId);
        if (insert) {
          line.id = insert.id;
        }
      }
      return line;
    });
  });
}

function convertQuestionFormat(questions, questionnaireId) {
  return questions.map(question => {
    question.question = JSON.stringify(question.question);
    question.questionnaire_id = questionnaireId;
    if (isNaN(question.id)) {
      question.tmpId = question.id;
      delete question.id;
    }
    return question;
  });
}

function getNotificationTemplates(query, dbInfo, hostname, notificationsMode) {
  if (notificationsMode > NOTIFICATIONS_MODE.OFF) {
    return query.select('template_id as templateId', 'description', 'type', 'active', 'core_template_id as coreTemplateId', 'value', 'period')
      .from('notification_template')
      .then(templates => {
        return populateTemplateData(dbInfo, hostname, templates).then(results => {
          return results;
        }).catch(() => {
          return Promise.resolve(templates.map(template => {
            template.error = true;
            return template;
          }));
        });
      });
  }
  return Promise.resolve([]);
}

async function createMatrixTypes(query) {
  const categories = await query.select('*').from('relationship_category_type');
  const relationshipTypes = await query.select('*').from('relationship_type').where('active', true);
  const amountTypes = await query.select('*').from('relationship_amount_type').where('active', true);
  return categories.map(type => {
    type.typeOptions = relationshipTypes.filter(relationType => {
      return relationType.relationship_cd === type.type_cd;
    });
    type.amountOptions = amountTypes.filter(amountType => {
      return amountType.relationship_cd === type.type_cd;
    });
    return type;
  });
}

async function getQuestionnaireQuestions(query, typeCd) {
  const questionnaire = await query.select('id').from('questionnaire').limit(1).where('type_cd', typeCd).orderBy('version', 'desc');
  if (questionnaire[0]) {
    const questions = await query.select('*').from('questionnaire_question as qq').where({questionnaire_id: questionnaire[0].id, active: true});
    return questions.map(question => {
      question.question = JSON.parse(question.question);
      return question;
    });
  }
}

async function getScreeningQuestions(query) {
  return await getQuestionnaireQuestions(query, SCREENING_QUESTIONNAIRE_TYPE_CD);
}

async function getEntityQuestions(query) {
  return await getQuestionnaireQuestions(query, FIN_ENTITY_QUESTIONNAIRE_TYPE_CD);
}

async function getQuestions(query) {
  const screening = await getScreeningQuestions(query);
  const entities = await getEntityQuestions(query);
  return {
    screening,
    entities
  };
}

export async function getGeneralConfig(query) {
  const mostRecentId = (await query('config').max('id as id'))[0].id;

  if (cachedConfigs[mostRecentId]) {
    return {
      config: cachedConfigs[mostRecentId].general,
      id: mostRecentId
    };
  }

  const generalConfigRecords = await query
    .select('config')
    .from('config')
    .where({id: mostRecentId});

  if (!generalConfigRecords || generalConfigRecords.length === 0) {
    return {
      config: {},
      id: mostRecentId
    };
  }

  const parsedConfig = JSON.parse(generalConfigRecords[0].config);
  cachedConfigs[mostRecentId] = parsedConfig;

  return {
    config: parsedConfig.general,
    id: mostRecentId
  };
}

export async function getConfig(dbInfo, hostname, optionalTrx) {
  try {
    let config = {};
    const knex = getKnex(dbInfo);
    const notificationsMode = getNotificationsInfo(dbInfo).notificationsMode;
    let query;
    if (optionalTrx) {
      query = knex.transacting(optionalTrx);
    }
    else {
      query = knex;
    }

    config.matrixTypes = await createMatrixTypes(query);
    config.relationshipPersonTypes = await query.select('*').from('relationship_person_type').where('active', true);
    config.declarationTypes = await query.select('*').from('declaration_type').orderBy('order');
    config.dispositionTypes = await query.select('*').from('disposition_type').orderBy('order');
    config.disclosureTypes = await query.select('*').from('disclosure_type');
    config.questions = await getQuestions(query);
    config.disclosureStatus = await query.select('*').from('disclosure_status');
    config.projectTypes = await query.select('*').from('project_type');
    config.projectRoles = await query.select('*').from('project_role');
    config.projectStatuses = await query.select('*').from('project_status');
    config.notificationTemplates = await getNotificationTemplates(query, dbInfo, hostname, notificationsMode);
    config.notificationsMode = notificationsMode;
    config.lane = lane;
    config = camelizeJson(config);
    const generalConfig = await getGeneralConfig(query);
    config.id = generalConfig.id;
    config.general = generalConfig.config;
    return Promise.resolve(config);
  } catch (err) {
    Promise.reject(err);
  }
}

function updateParentIdOnChildren(children, updatedParents) {
  return children.map(question => {
    if (isNaN(question.parent)) {
      const parent = updatedParents.find(p => {
        return p.tmpId === question.parent;
      });

      if (parent) {
        question.parent = parent.id;
      }
    }
    return question;
  });
}

export async function saveScreeningQuestionnaire(query, questions) {
  const questionnaire = await query
    .select('id')
    .from('questionnaire')
    .limit(1)
    .where('type_cd', 1)
    .orderBy('version', 'desc');

  const convertedQuestions = convertQuestionFormat(questions, questionnaire[0].id);
  const parents = convertedQuestions.filter(question => !question.parent);
  const children = convertedQuestions.filter(question => question.parent);

  const updatedParents = await createCollectionQueries(query, parents, {
    pk: 'id',
    table: 'questionnaire_question',
    where() {
      this
        .whereNull('parent')
        .andWhere({
          questionnaire_id: questionnaire[0].id
        });
    }
  });

  await createCollectionQueries(query, updateParentIdOnChildren(children, updatedParents), {
    pk: 'id',
    table: 'questionnaire_question',
    where() {
      this
        .whereNotNull('parent')
        .andWhere({
          questionnaire_id: questionnaire[0].id}
        );
    }
  });
}

export async function setConfig(dbInfo, userId, body, hostname, optionalTrx) {
  const knex = getKnex(dbInfo);
  const config = snakeizeJson(body);

  if (config.disposition_types && Array.isArray(config.disposition_types)) {
    const tooLong = config.disposition_types.some(dispositionType => {
      return (
        dispositionType.description &&
        dispositionType.description.length > 50
      );
    });

    if (tooLong) {
      throw Error('disposition type description is too long');
    }
  }

  return knex.transaction(async (query) => {
    if (optionalTrx) {
      query = knex.transacting(optionalTrx); // eslint-disable-line no-param-reassign
    }

    const notificationsMode = getNotificationsInfo(dbInfo).notificationsMode;
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
        createCollectionQueries(query, type.type_options, {
          pk: 'type_cd',
          table: 'relationship_type',
          where: {relationship_cd: type.type_cd}
        })
      );

      queries.push(
        createCollectionQueries(query, type.amount_options, {
          pk: 'type_cd',
          table: 'relationship_amount_type',
          where: {relationship_cd: type.type_cd}
        })
      );
    });

    queries.push(
      createCollectionQueries(query, config.declaration_types, {pk: 'type_cd', table: 'declaration_type'})
    );

    queries.push(
      createCollectionQueries(query, config.disposition_types, {pk: 'type_cd', table: 'disposition_type'})
    );

    queries.push(
      createCollectionQueries(query, config.relationship_person_types, {
        pk: 'type_cd',
        table: 'relationship_person_type'
      })
    );

    queries.push(
      createCollectionQueries(query, config.disclosure_types, {pk: 'type_cd', table: 'disclosure_type'})
    );

    queries.push(
      createCollectionQueries(query, config.project_types, {pk: 'type_cd', table: 'project_type'})
    );

    queries.push(
      createCollectionQueries(query, config.project_roles, {pk: 'type_cd', table: 'project_role'})
    );

    queries.push(
      createCollectionQueries(query, config.project_statuses, {pk: 'type_cd', table: 'project_status'})
    );

    await saveScreeningQuestionnaire(query, config.questions.screening);

    queries.push(
      query.select('*').from('questionnaire').limit(1).where('type_cd', 2).orderBy('version', 'desc')
        .then(result => {
          if (result[0]) {
            return createCollectionQueries(query, convertQuestionFormat(config.questions.entities, result[0].id), {
              pk: 'id',
              table: 'questionnaire_question',
              where: {questionnaire_id: result[0].id}
            });
          }
          return query('questionnaire').insert({version: 1, type_cd: 2}, 'id').then(id => {
            return createCollectionQueries(query, convertQuestionFormat(config.questions.entities, id[0]), {
              pk: 'id',
              table: 'questionnaire_question',
              where: {questionnaire_id: id[0]}
            });
          });
        })
    );

    if (notificationsMode > NOTIFICATIONS_MODE.OFF) {
      return handleTemplates(dbInfo, hostname, config.notification_templates).then(results => {
        return Promise.all(results).then(templates => {
          queries.push(
            createCollectionQueries(query, templates, {pk: 'template_id', table: 'notification_template'})
          );
        }).then(() => {
          return Promise.all(queries)
            .then(() => {
              return camelizeJson(config);
            });
        });
      });
    }

    return Promise.all(queries)
      .then(() => {
        return camelizeJson(config);
      });
  });
}

export function archiveConfig(dbInfo, userId, userName, config) {
  const knex = getKnex(dbInfo);
  return knex('config').insert({
    config: JSON.stringify(config),
    user_id: userId,
    user_name: userName,
    updated_date: new Date()
  }, 'id');
}

export async function getArchivedConfig(dbInfo, id) {
  if (cachedConfigs[id]) {
    return cachedConfigs[id];
  }

  const knex = getKnex(dbInfo);
  const results = await knex('config').select('config', 'id').where('id', id);
  const config = JSON.parse(results[0].config);
  config.lane = lane;
  config.id = results[0].id;

  cachedConfigs[id] = config;
  return config;
}

export function getRequiredProjectRoles(dbInfo) {
  const knex = getKnex(dbInfo);
  return knex('project_role')
    .select('source_role_cd as sourceRoleCd','project_type_cd as projectTypeCd')
    .where({req_disclosure: true});
}

export function getRequiredProjectStatuses(dbInfo) {
  const knex = getKnex(dbInfo);
  return knex('project_status')
    .select('source_status_cd as sourceStatusCd','project_type_cd as projectTypeCd')
    .where({req_disclosure: true});
}

export function getRequiredProjectTypes(dbInfo) {
  const knex = getKnex(dbInfo);
  return knex('project_type')
    .select('type_cd as typeCd')
    .where({req_disclosure: true});
}

export async function getProjectTypeDescription(dbInfo, typeCd) {
  const knex = getKnex(dbInfo);

  const projectType = await knex('project_type')
    .select('description')
    .where({type_cd: typeCd});

  return projectType[0].description;
}

export async function getCoreTemplateIdByTemplateId(dbInfo, templateId) {
  const knex = getKnex(dbInfo);
  const template = await knex('notification_template')
    .select('core_template_id as coreTemplateId', 'active')
    .where({template_id: templateId});

  return template[0];
}
