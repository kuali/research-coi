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
import {
  populateTemplateData,
  handleTemplates
} from '../services/notification-service/notification-service';
import { NOTIFICATIONS_MODE, LANES } from '../../coi-constants';
import {
  updateExpirationToRollingDate,
  updateExpirationToStaticDate
} from './disclosure-db';
import Log from '../log';
import {flagIsOn} from '../feature-flags';

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
      notificationsMode: (
        process.env.NOTIFICATIONS_MODE || NOTIFICATIONS_MODE.OFF
      )
    };
  };
}

const SCREENING_QUESTIONNAIRE_TYPE_CD = 1;
const FIN_ENTITY_QUESTIONNAIRE_TYPE_CD = 2;

async function createDeleteQueries(knex, collection, tableProps) {
  let sel = knex(tableProps.table).select(tableProps.pk);
  if (tableProps.where) {
    sel = sel.where(tableProps.where);
  }

  const results = await sel;

  await Promise.all(
    results.filter(result => {
      const match = collection.find(item => {
        return (
          item[tableProps.pk] &&
          item[tableProps.pk] === result[tableProps.pk]
        );
      });
      return !match;
    }).map(result => {
      return knex(tableProps.table)
        .update({active: false})
        .where(tableProps.pk, result[tableProps.pk]);
    })
  );
}

async function createInsertQueries(knex, collection, tableProps) {
  return await Promise.all(
    collection.map(async (line) => {
      const tmpId = line.tmpId;
      delete line.tmpId;
      delete line.tmp_id;
      line.active = true;
      if (tableProps.parent) {
        line[tableProps.parent.key] = tableProps.parent.value;
      }
      const result = await knex(tableProps.table).insert(line, tableProps.pk);

      line[tableProps.pk] = result[0];
      line.tmpId = tmpId;
      return line;
    })
  );
}

function createUpdateQueries(knex, collection, tableProps) {
  return Promise.all(
    collection.map(line => {
      delete line.tmpId;
      delete line.tmp_id;
      return knex(tableProps.table)
        .update(line)
        .where(tableProps.pk, line[tableProps.pk]);
    })
  );
}

async function createCollectionQueries(knex, collection, tableProps) {
  const updates = [];
  const inserts = [];
  collection.forEach(line => {
    if (line[tableProps.pk] === undefined) {
      inserts.push(line);
    } else {
      updates.push(line);
    }
  });

  const results = await Promise.all([
    createDeleteQueries(knex, collection, tableProps),
    createInsertQueries(knex, inserts, tableProps),
    createUpdateQueries(knex, updates, tableProps)
  ]);

  const insertResults = results[1];
  return collection.map(line => {
    if (insertResults) {
      const insert = insertResults.find(
        result => result.tmpId === line.tmpId
      );
      if (insert) {
        line.id = insert.id;
      }
    }
    return line;
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

async function getNotificationTemplates(
  knex,
  dbInfo,
  hostname,
  notificationsMode
) {
  if (notificationsMode > NOTIFICATIONS_MODE.OFF) {
    const templates = await knex.select(
        'template_id as templateId',
        'description',
        'type',
        'active',
        'core_template_id as coreTemplateId',
        'value',
        'period'
      )
      .from('notification_template');

    try {
      return await populateTemplateData(dbInfo, hostname, templates);
    } catch (err) {
      return templates.map(template => {
        template.error = true;
        return template;
      });
    }
  }
  return [];
}

async function createMatrixTypes(knex) {
  const categories = await knex
    .select('*')
    .from('relationship_category_type');
  const relationshipTypes = await knex
    .select('*')
    .from('relationship_type')
    .where('active', true);
  const amountTypes = await knex
    .select('*')
    .from('relationship_amount_type')
    .where('active', true);
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

async function getQuestionnaireQuestions(knex, typeCd) {
  const questionnaire = await knex
    .first('id')
    .from('questionnaire')
    .where('type_cd', typeCd)
    .orderBy('version', 'desc');

  if (questionnaire) {
    const questions = await knex
      .select('*')
      .from('questionnaire_question as qq')
      .where({questionnaire_id: questionnaire.id, active: true});
    return questions.map(question => {
      question.question = JSON.parse(question.question);
      return question;
    });
  }
}

async function getScreeningQuestions(knex) {
  return await getQuestionnaireQuestions(
    knex,
    SCREENING_QUESTIONNAIRE_TYPE_CD
  );
}

async function getEntityQuestions(knex) {
  return await getQuestionnaireQuestions(
    knex,
    FIN_ENTITY_QUESTIONNAIRE_TYPE_CD
  );
}

async function getQuestions(knex) {
  const screening = await getScreeningQuestions(knex);
  const entities = await getEntityQuestions(knex);
  return {
    screening,
    entities
  };
}

export async function getLatestConfigsId(knex) {
  const record = await knex('config').max('id as id');
  return record[0].id;
}

export async function getGeneralConfig(knex) {
  const mostRecentId = await getLatestConfigsId(knex);

  if (cachedConfigs[mostRecentId]) {
    return {
      config: cachedConfigs[mostRecentId].general,
      id: mostRecentId
    };
  }

  const generalConfigRecords = await knex
    .first('config')
    .from('config')
    .where({id: mostRecentId});

  if (!generalConfigRecords) {
    return {
      config: {},
      id: mostRecentId
    };
  }

  const parsedConfig = JSON.parse(generalConfigRecords.config);
  cachedConfigs[mostRecentId] = parsedConfig;

  return {
    config: parsedConfig.general,
    id: mostRecentId
  };
}

export async function getConfig(dbInfo, knex, hostname) {
  let config = {};
  const notificationsMode = getNotificationsInfo(dbInfo).notificationsMode;

  config.matrixTypes = await createMatrixTypes(knex);
  config.relationshipPersonTypes = await knex
    .select('*')
    .from('relationship_person_type')
    .where('active', true);

  config.declarationTypes = await knex
    .select('*')
    .from('declaration_type')
    .orderBy('order');

  config.dispositionTypes = await knex
    .select('*')
    .from('disposition_type')
    .orderBy('order');

  config.disclosureTypes = await knex.select('*').from('disclosure_type');
  config.questions = await getQuestions(knex);
  config.disclosureStatus = await knex.select('*').from('disclosure_status');
  config.projectTypes = await knex.select('*').from('project_type');
  config.projectRoles = await knex.select('*').from('project_role');
  config.projectStatuses = await knex.select('*').from('project_status');
  config.notificationTemplates = await getNotificationTemplates(
    knex,
    dbInfo,
    hostname,
    notificationsMode
  );
  config.notificationsMode = notificationsMode;
  config.lane = lane;
  config = camelizeJson(config);
  const generalConfig = await getGeneralConfig(knex);
  config.id = generalConfig.id;
  config.general = generalConfig.config;
  return config;
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

export async function saveScreeningQuestionnaire(knex, questions) {
  const questionnaire = await knex
    .first('id')
    .from('questionnaire')
    .where('type_cd', 1)
    .orderBy('version', 'desc');

  const convertedQuestions = convertQuestionFormat(
    questions,
    questionnaire.id
  );
  const parents = convertedQuestions.filter(question => !question.parent);
  const children = convertedQuestions.filter(question => question.parent);

  const updatedParents = await createCollectionQueries(knex, parents, {
    pk: 'id',
    table: 'questionnaire_question',
    where() {
      this
        .whereNull('parent')
        .andWhere({
          questionnaire_id: questionnaire.id
        });
    }
  });

  await createCollectionQueries(
    knex,
    updateParentIdOnChildren(children, updatedParents),
    {
      pk: 'id',
      table: 'questionnaire_question',
      where() {
        this
          .whereNotNull('parent')
          .andWhere({
            questionnaire_id: questionnaire.id}
          );
      }
    }
  );
}

export async function saveEntityQuestionnaire(knex, questions) {
  const result = await knex
    .first('*')
    .from('questionnaire')
    .where('type_cd', 2)
    .orderBy('version', 'desc');

  let idToUse;
  if (result) {
    idToUse = result.id;
  }
  else {
    const id = await knex('questionnaire')
      .insert({
        version: 1,
        type_cd: 2
      }, 'id');
    
    idToUse = parseInt(id[0]);
  }

  return await createCollectionQueries(
    knex,
    convertQuestionFormat(questions, idToUse),
    {
      pk: 'id',
      table: 'questionnaire_question',
      where: {questionnaire_id: idToUse}
    }
  );
}

export async function setConfig(dbInfo, knex, userId, body, hostname) {
  const config = snakeizeJson(body);

  if (config.disposition_types && Array.isArray(config.disposition_types)) {
    const tooLong = config.disposition_types.some(dispositionType => {
      return (
        dispositionType.description &&
        dispositionType.description.length > 60
      );
    });

    if (tooLong) {
      throw Error('disposition type description is too long');
    }
  }

  const notificationsMode = getNotificationsInfo(dbInfo).notificationsMode;
  const queries = [];

  config.matrix_types.forEach(type => {
    queries.push(
      knex('relationship_category_type')
        .update({
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
      createCollectionQueries(knex, type.type_options, {
        pk: 'type_cd',
        table: 'relationship_type',
        where: {relationship_cd: type.type_cd}
      })
    );

    queries.push(
      createCollectionQueries(knex, type.amount_options, {
        pk: 'type_cd',
        table: 'relationship_amount_type',
        where: {relationship_cd: type.type_cd}
      })
    );
  });

  queries.push(
    createCollectionQueries(
      knex,
      config.declaration_types,
      {pk: 'type_cd', table: 'declaration_type'}
    )
  );

  queries.push(
    createCollectionQueries(
      knex,
      config.disposition_types,
      {pk: 'type_cd', table: 'disposition_type'}
    )
  );

  queries.push(
    createCollectionQueries(knex, config.relationship_person_types, {
      pk: 'type_cd',
      table: 'relationship_person_type'
    })
  );

  queries.push(
    createCollectionQueries(
      knex,
      config.disclosure_types,
      {pk: 'type_cd', table: 'disclosure_type'}
    )
  );

  queries.push(
    createCollectionQueries(
      knex,
      config.project_types,
      {pk: 'type_cd', table: 'project_type'}
    )
  );

  queries.push(
    createCollectionQueries(
      knex,
      config.project_roles,
      {pk: 'type_cd', table: 'project_role'}
    )
  );

  queries.push(
    createCollectionQueries(
      knex,
      config.project_statuses,
      {pk: 'type_cd', table: 'project_status'}
    )
  );

  if (await flagIsOn(knex, 'RESCOI-898')) {
    const previousGeneralConfig = await getGeneralConfig(knex);
    if (config.general.is_rolling_due_date) {
      if (!previousGeneralConfig.config.isRollingDueDate) {
        await updateExpirationToRollingDate(knex);
      }
    }
    else if (
      previousGeneralConfig.config.isRollingDueDate ||
      previousGeneralConfig.config.dueDate !== config.general.due_date
    ) {
      await updateExpirationToStaticDate(
        knex,
        new Date(config.general.due_date)
      );
    }
  }

  await saveScreeningQuestionnaire(knex, config.questions.screening);
  await saveEntityQuestionnaire(knex, config.questions.entities);

  const notificationErrors = config.notification_templates.some(
    template => template.error === true
  );
  if (notificationErrors) {
    Log.error(
      'Not saving notification templates because of configuration errors'
    );
  }
  if (!notificationErrors && notificationsMode > NOTIFICATIONS_MODE.OFF) {
    const results = await handleTemplates(
      dbInfo,
      hostname,
      config.notification_templates
    );
    const templates = await Promise.all(results);
    queries.push(
      createCollectionQueries(
        knex,
        templates,
        {pk: 'template_id', table: 'notification_template'}
      )
    );
  }

  await Promise.all(queries);
  return camelizeJson(config);
}

export async function archiveConfig(knex, userId, userName, config) {
  const id = await knex('config')
    .insert({
      config: JSON.stringify(config),
      user_id: userId,
      user_name: userName,
      updated_date: new Date()
    }, 'id');

  return parseInt(id[0]);
}

export async function getArchivedConfig(knex, id) {
  if (cachedConfigs[id]) {
    return cachedConfigs[id];
  }

  const result = await knex('config')
    .first(
      'config',
      'id'
    )
    .where('id', id);

  const config = JSON.parse(result.config);
  config.lane = lane;
  config.id = result.id;

  cachedConfigs[id] = config;
  return config;
}

export function getRequiredProjectRoles(knex) {
  return knex('project_role')
    .select('source_role_cd as sourceRoleCd','project_type_cd as projectTypeCd')
    .where({req_disclosure: true});
}

export function getRequiredProjectStatuses(knex) {
  return knex('project_status')
    .select(
      'source_status_cd as sourceStatusCd',
      'project_type_cd as projectTypeCd'
    )
    .where({req_disclosure: true});
}

export function getRequiredProjectTypes(knex) {
  return knex('project_type')
    .select('type_cd as typeCd')
    .where({req_disclosure: true});
}

export async function getProjectTypeDescription(knex, typeCd) {
  const projectType = await knex('project_type')
    .first('description')
    .where({type_cd: typeCd});

  return projectType.description;
}

export async function getCoreTemplateIdByTemplateId(knex, templateId) {
  const template = await knex('notification_template')
    .first('core_template_id as coreTemplateId', 'active')
    .where({template_id: templateId});

  return template;
}
