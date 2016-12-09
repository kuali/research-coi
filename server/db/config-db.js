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
import DisclosureDB from './disclosure-db';
import {addLoggers, logError} from '../log';

const ConfigDB = {};
export default ConfigDB;

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
    logError(err, null, 'ConfigDB');
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

ConfigDB.createDeleteQueries = async function (knex, collection, tableProps) {
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
};

ConfigDB.createInsertQueries = async function(knex, collection, tableProps) {
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
};

ConfigDB.createUpdateQueries = function(knex, collection, tableProps) {
  return Promise.all(
    collection.map(line => {
      delete line.tmpId;
      delete line.tmp_id;
      return knex(tableProps.table)
        .update(line)
        .where(tableProps.pk, line[tableProps.pk]);
    })
  );
};

ConfigDB.rowExists = async function(knex, table, primaryKeyColumn, value) {
  const result = await knex
    .first(primaryKeyColumn)
    .from(table)
    .where({[primaryKeyColumn]: value});

  return result !== undefined;
};

ConfigDB.createCollectionQueries = async function(
    knex,
    collection,
    tableProps
  ) {
  const updates = [];
  const inserts = [];
  for (const line of collection) {
    if (line[tableProps.pk] === undefined) {
      inserts.push(line);
    } else {
      const exists = await ConfigDB.rowExists(
        knex,
        tableProps.table,
        tableProps.pk,
        line[tableProps.pk]
      );
      if (exists) {
        updates.push(line);
      }
      else {
        inserts.push(line);
      }
    }
  }

  const results = await Promise.all([
    ConfigDB.createDeleteQueries(knex, collection, tableProps),
    ConfigDB.createInsertQueries(knex, inserts, tableProps),
    ConfigDB.createUpdateQueries(knex, updates, tableProps)
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
};

ConfigDB.convertQuestionFormat = function(questions, questionnaireId) {
  return questions.map(question => {
    question.question = JSON.stringify(question.question);
    question.questionnaire_id = questionnaireId;
    if (isNaN(question.id)) {
      question.tmpId = question.id;
      delete question.id;
    }
    return question;
  });
};

ConfigDB.getNotificationTemplates = async function(
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
};

ConfigDB.createMatrixTypes = async function(knex) {
  const categories = await knex
    .select('*')
    .from('relationship_category_type');
  const relationshipTypes = await knex
    .select('*')
    .from('relationship_type')
    .where('active', true)
    .orderBy('order');
  const amountTypes = await knex
    .select('*')
    .from('relationship_amount_type')
    .where('active', true)
    .orderBy('order');
  return categories.map(type => {
    type.typeOptions = relationshipTypes.filter(relationType => {
      return relationType.relationship_cd === type.type_cd;
    });
    type.amountOptions = amountTypes.filter(amountType => {
      return amountType.relationship_cd === type.type_cd;
    });
    return type;
  });
};

ConfigDB.getQuestionnaireQuestions = async function (knex, typeCd) {
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
};

ConfigDB.getScreeningQuestions = async function(knex) {
  return await ConfigDB.getQuestionnaireQuestions(
    knex,
    SCREENING_QUESTIONNAIRE_TYPE_CD
  );
};

ConfigDB.getEntityQuestions = async function (knex) {
  return await ConfigDB.getQuestionnaireQuestions(
    knex,
    FIN_ENTITY_QUESTIONNAIRE_TYPE_CD
  );
};

ConfigDB.getQuestions = async function (knex) {
  const screening = await ConfigDB.getScreeningQuestions(knex);
  const entities = await ConfigDB.getEntityQuestions(knex);
  return {
    screening,
    entities
  };
};

ConfigDB.getLatestConfigsId = async function (knex) {
  const record = await knex('config').max('id as id');
  return record[0].id;
};

ConfigDB.getGeneralConfig = async function (knex) {
  const mostRecentId = await ConfigDB.getLatestConfigsId(knex);

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
  parsedConfig.id = mostRecentId;
  cachedConfigs[mostRecentId] = parsedConfig;

  return {
    config: parsedConfig.general,
    id: mostRecentId
  };
};

ConfigDB.getConfig = async function (dbInfo, knex, hostname) {
  let config = {};
  const notificationsMode = getNotificationsInfo(dbInfo).notificationsMode;

  config.matrixTypes = await ConfigDB.createMatrixTypes(knex);
  config.relationshipPersonTypes = await knex
    .select('*')
    .from('relationship_person_type')
    .where('active', true)
    .orderBy('order');

  config.declarationTypes = await knex
    .select('*')
    .from('declaration_type')
    .orderBy('order');

  config.dispositionTypes = await knex
    .select('*')
    .from('disposition_type')
    .orderBy('order');

  config.disclosureTypes = await knex.select('*').from('disclosure_type');
  config.questions = await ConfigDB.getQuestions(knex);
  config.disclosureStatus = await knex.select('*').from('disclosure_status');
  config.projectTypes = await knex.select('*').from('project_type');
  config.projectRoles = await knex.select('*').from('project_role');
  config.projectStatuses = await knex.select('*').from('project_status');
  config.notificationTemplates = await ConfigDB.getNotificationTemplates(
    knex,
    dbInfo,
    hostname,
    notificationsMode
  );
  config.notificationsMode = notificationsMode;
  config.lane = lane;
  config = camelizeJson(config);
  const generalConfig = await ConfigDB.getGeneralConfig(knex);
  config.id = generalConfig.id;
  config.general = generalConfig.config;
  return config;
};

ConfigDB.updateParentIdOnChildren = function (children, updatedParents) {
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
};

ConfigDB.saveScreeningQuestionnaire = async function(knex, questions) {
  const questionnaire = await knex
    .first('id')
    .from('questionnaire')
    .where('type_cd', 1)
    .orderBy('version', 'desc');

  const convertedQuestions = ConfigDB.convertQuestionFormat(
    questions,
    questionnaire.id
  );
  const parents = convertedQuestions.filter(question => !question.parent);
  const children = convertedQuestions.filter(question => question.parent);

  const updatedParents = await ConfigDB.createCollectionQueries(knex, parents, {
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

  await ConfigDB.createCollectionQueries(
    knex,
    ConfigDB.updateParentIdOnChildren(children, updatedParents),
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
};

ConfigDB.saveEntityQuestionnaire = async function(knex, questions) {
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

  return await ConfigDB.createCollectionQueries(
    knex,
    ConfigDB.convertQuestionFormat(questions, idToUse),
    {
      pk: 'id',
      table: 'questionnaire_question',
      where: {questionnaire_id: idToUse}
    }
  );
};

ConfigDB.setConfig = async function(dbInfo, knex, userId, body, hostname) {
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
      ConfigDB.createCollectionQueries(knex, type.type_options, {
        pk: 'type_cd',
        table: 'relationship_type',
        where: {relationship_cd: type.type_cd}
      })
    );

    queries.push(
      ConfigDB.createCollectionQueries(knex, type.amount_options, {
        pk: 'type_cd',
        table: 'relationship_amount_type',
        where: {relationship_cd: type.type_cd}
      })
    );
  });

  queries.push(
    ConfigDB.createCollectionQueries(
      knex,
      config.declaration_types,
      {pk: 'type_cd', table: 'declaration_type'}
    )
  );

  queries.push(
    ConfigDB.createCollectionQueries(
      knex,
      config.disposition_types,
      {pk: 'type_cd', table: 'disposition_type'}
    )
  );

  queries.push(
    ConfigDB.createCollectionQueries(knex, config.relationship_person_types, {
      pk: 'type_cd',
      table: 'relationship_person_type'
    })
  );

  queries.push(
    ConfigDB.createCollectionQueries(
      knex,
      config.disclosure_types,
      {pk: 'type_cd', table: 'disclosure_type'}
    )
  );

  queries.push(
    ConfigDB.createCollectionQueries(
      knex,
      config.project_types,
      {pk: 'type_cd', table: 'project_type'}
    )
  );

  queries.push(
    ConfigDB.createCollectionQueries(
      knex,
      config.project_roles,
      {pk: 'type_cd', table: 'project_role'}
    )
  );

  queries.push(
    ConfigDB.createCollectionQueries(
      knex,
      config.project_statuses,
      {pk: 'type_cd', table: 'project_status'}
    )
  );

  const previousGeneralConfig = await ConfigDB.getGeneralConfig(knex);
  if (config.general.is_rolling_due_date) {
    if (!previousGeneralConfig.config.isRollingDueDate) {
      await DisclosureDB.updateExpirationToRollingDate(knex);
    }
  }
  else if (
    previousGeneralConfig.config.isRollingDueDate ||
    previousGeneralConfig.config.dueDate !== config.general.due_date
  ) {
    await DisclosureDB.updateExpirationToStaticDate(
      knex,
      new Date(config.general.due_date)
    );
  }

  await ConfigDB.saveScreeningQuestionnaire(knex, config.questions.screening);
  await ConfigDB.saveEntityQuestionnaire(knex, config.questions.entities);

  const notificationErrors = config.notification_templates.some(
    template => template.error === true
  );
  if (notificationErrors) {
    this.log.error(
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
      ConfigDB.createCollectionQueries(
        knex,
        templates,
        {pk: 'template_id', table: 'notification_template'}
      )
    );
  }

  await Promise.all(queries);
  return camelizeJson(config);
};

ConfigDB.archiveConfig = async function(knex, userId, userName, config) {
  delete config.id;
  const id = await knex('config')
    .insert({
      config: JSON.stringify(config),
      user_id: userId,
      user_name: userName,
      updated_date: new Date()
    }, 'id');

  return parseInt(id[0]);
};

ConfigDB.getArchivedConfig = async function (knex, id) {
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
};

ConfigDB.getRequiredProjectRoles = function (knex) {
  return knex('project_role')
    .select('source_role_cd as sourceRoleCd','project_type_cd as projectTypeCd')
    .where({req_disclosure: true});
};

ConfigDB.getRequiredProjectStatuses = function (knex) {
  return knex('project_status')
    .select(
      'source_status_cd as sourceStatusCd',
      'project_type_cd as projectTypeCd'
    )
    .where({req_disclosure: true});
};

ConfigDB.getRequiredProjectTypes = function (knex) {
  return knex('project_type')
    .select('type_cd as typeCd')
    .where({req_disclosure: true});
};

ConfigDB.getProjectTypeDescription = async function (knex, typeCd) {
  const projectType = await knex('project_type')
    .first('description')
    .where({type_cd: typeCd});

  return projectType.description;
};

ConfigDB.getCoreTemplateIdByTemplateId = async function (knex, templateId) {
  const template = await knex('notification_template')
    .first('core_template_id as coreTemplateId', 'active')
    .where({template_id: templateId});

  return template;
};

addLoggers({ConfigDB});