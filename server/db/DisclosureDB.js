/*eslint camelcase:0 */
import {saveSingleRecord, getExistingSingleRecord, saveExistingSingleRecord, deleteExistingSingleRecord} from './CommonDB';

const ONE_DAY = 1000 * 60 * 60 * 24;

let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let saveDisclosure = (dbInfo, userId, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'disclosure', pk: 'id'}, optionalTrx);
};

export let getExistingDisclosure = (dbInfo, userId, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'disclosure', pk: 'id'}, optionalTrx);
};

export let saveExistingDisclosure = (dbInfo, userId, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'disclosure', pk: 'id'}, optionalTrx);
};

export let deleteExistingDisclosure = (dbInfo, userId, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'disclosure', pk: 'id'}, optionalTrx);
};

export let saveFinEntity = (dbInfo, userId, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'fin_entity', pk: 'id'}, optionalTrx);
};

export let saveNewFinancialEntity = (dbInfo, userId, disclosureId, body, callback) => {
  let knex = getKnex(dbInfo);

  let financialEntity = body;
  knex('fin_entity')
  .insert({
    disclosure_id: disclosureId,
    active: financialEntity.active,
    name: financialEntity.name,
    description: financialEntity.description
  })
  .then(id => {
    financialEntity.id = id[0];
    let queries = [];
    financialEntity.relationships.forEach(relationship => {
      relationship.finEntityId = id[0];
      queries.push(
        knex('relationship')
        .insert({
          fin_entity_id: id[0],
          relationship_cd: relationship.relationshipCd,
          person_cd: relationship.personCd,
          type_cd: !relationship.typeCd ? null : relationship.typeCd,
          amount_cd: !relationship.amountCd ? null : relationship.amountCd,
          comments: relationship.comments
        })
        .then(relationshipId=>{
          relationship.id = relationshipId[0];
        })
        .catch(function(err) {
          callback(err);
        })
      );
    });

    financialEntity.answers.forEach(answer=>{
      queries.push(
        knex('questionnaire_answer').insert({
          question_id: answer.questionId,
          answer: JSON.stringify(answer.answer)
        }).then(result =>{
          answer.id = result[0];
          return knex('fin_entity_answer').insert({
            fin_entity_id: id[0],
            questionnaire_answer_id: result[0]})
          .catch(err=>{
            callback(err);
          });
        })
        .catch(err=>{
          callback(err);
        })
      );
    });

    Promise.all(queries)
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

export let saveExistingFinancialEntity = (dbInfo, userId, disclosureId, body, callback) => {
  let knex = getKnex(dbInfo);

  let financialEntity = body;

  knex('fin_entity')
  .where('id', financialEntity.id)
  .update({
    disclosure_id: disclosureId,
    active: financialEntity.active,
    name: financialEntity.name,
    description: financialEntity.description
  }).then(()=>{
    let queries = [];

    financialEntity.relationships.map(relationship => {
      if (!relationship.id) {
        relationship.finEntityId = financialEntity.id;
        queries.push(
          knex('relationship')
          .insert({
            fin_entity_id: financialEntity.id,
            relationship_cd: relationship.relationshipCd,
            person_cd: relationship.personCd,
            type_cd: !relationship.typeCd ? null : relationship.typeCd,
            amount_cd: !relationship.amountCd ? null : relationship.amountCd,
            comments: relationship.comments
          })
          .then(relationshipId=>{
            relationship.id = relationshipId[0];
          })
          .catch(function(err) {
            callback(err);
          })
        );
      }
    });


    financialEntity.answers.forEach(answer=>{
      if (answer.id) {
        queries.push(
          knex('questionnaire_answer').update({
            question_id: answer.questionId,
            answer: JSON.stringify(answer.answer)
          })
          .where('id', answer.id)
          .catch(err=>{
            callback(err);
          })
        );
      } else {
        queries.push(
          knex('questionnaire_answer').insert({
            question_id: answer.questionId,
            answer: JSON.stringify(answer.answer)
          }).then(result =>{
            answer.id = result[0];
            return knex('fin_entity_answer').insert({
              fin_entity_id: financialEntity.id,
              questionnaire_answer_id: result[0]})
            .catch(err=>{
              callback(err);
            });
          })
          .catch(err=>{
            callback(err);
          })
        );
      }
    });


    Promise.all(queries)
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

export let getExistingEntity = (dbInfo, userId, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'fin_entity', pk: 'id'}, optionalTrx);
};

export let saveExistingFinEntity = (dbInfo, userId, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'fin_entity', pk: 'id'}, optionalTrx);
};

export let deleteExistingEntity = (dbInfo, userId, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'fin_entity', pk: 'id'}, optionalTrx);
};

export let saveRelationship = (dbInfo, userId, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'relationship', pk: 'id'}, optionalTrx);
};

export let getExistingRelationship = (dbInfo, userId, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'relationship', pk: 'id'}, optionalTrx);
};

export let saveExistingRelationship = (dbInfo, userId, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'relationship', pk: 'id'}, optionalTrx);
};

export let deleteExistingRelationship = (dbInfo, userId, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'relationship', pk: 'id'}, optionalTrx);
};

export let saveDeclaration = (dbInfo, userId, record, callback, optionalTrx) => {
  saveSingleRecord(dbInfo, record, callback, {table: 'declaration', pk: 'id'}, optionalTrx);
};

export let getExistingDeclaration = (dbInfo, userId, record, callback, optionalTrx) => {
  getExistingSingleRecord(dbInfo, record, callback, {table: 'declaration', pk: 'id'}, optionalTrx);
};

export let saveExistingDeclaration = (dbInfo, userId, record, callback, optionalTrx) => {
  saveExistingSingleRecord(dbInfo, record, callback, {table: 'declaration', pk: 'id'}, optionalTrx);
};

export let deleteExistingDeclaration = (dbInfo, userId, record, callback, optionalTrx) => {
  deleteExistingSingleRecord(dbInfo, record, callback, {table: 'declaration', pk: 'id'}, optionalTrx);
};

export let saveNewQuestionAnswer = (dbInfo, userId, disclosureId, body, callback) => {
  let knex = getKnex(dbInfo);
  let answer = body;
  knex('questionnaire_answer').insert({
    question_id: body.questionId,
    answer: JSON.stringify(body.answer)
  }).then(result =>{
    answer.id = result[0];
    return knex('disclosure_answer').insert({
      disclosure_id: disclosureId,
      questionnaire_answer_id: result[0]}).then(()=>{
        callback(undefined, body);
      });
  }).catch(err => {
    callback(err);
  });
};

export let saveExistingQuestionAnswer = (dbInfo, userId, disclosureId, body, callback) => {
  let knex = getKnex(dbInfo);
  knex.select('qa.id')
  .from('disclosure_answer as da')
  .innerJoin('questionnaire_answer as qa', 'da.questionnaire_answer_id', 'qa.id')
  .where('da.disclosure_id', disclosureId)
  .andWhere('qa.question_id', body.questionId).then(result => {
    return knex('questionnaire_answer')
    .where('id', result[0].id)
    .update('answer', JSON.stringify(body.answer)).then(()=>{
      callback(undefined, body);
    });
  }).catch(err => {
    callback(err);
  });
};

export let retrieveComments = (dbInfo, userId, disclosureId) => {
  let knex = getKnex(dbInfo);

  return knex('comment')
    .select('id', 'disclosure_id as disclosureId', 'topic_section as topicSection', 'topic_id as topicId', 'text', 'author', 'user_id as userId', 'date', 'pi_visible as piVisible', 'reviewer_visible as reviewerVisible')
    .where('disclosure_id', disclosureId)
    .then(comments => {
      comments.forEach(comment => {
        comment.isCurrentUser = comment.userId === userId;
      });
      return comments;
    })
    .catch(err => {
      throw err;
    });
};

export let addComment = (dbInfo, userInfo, comment, callback) => {
  let knex = getKnex(dbInfo);

  knex('comment')
    .insert({
      disclosure_id: comment.disclosureId,
      topic_section: comment.topicSection,
      topic_id: comment.topicId,
      text: comment.text,
      user_id: userInfo.id,
      author: userInfo.displayName,
      date: new Date(),
      pi_visible: comment.visibleToPI,
      reviewer_visible: comment.visibleToReviewers
    }).then(() => {
      retrieveComments(dbInfo, userInfo.id, comment.disclosureId)
      .then(comments => {
        callback(undefined, comments);
      });
    })
    .catch(err => {
      callback(err);
    });
};

export let get = (dbInfo, userId, disclosureId, callback) => {
  var disclosure;
  let knex = getKnex(dbInfo);
  Promise.all([
    knex.select('de.id', 'de.type_cd as typeCd', 'de.title', 'de.disposition_type_cd as dispositionTypeCd', 'de.status_cd as statusCd', 'de.submitted_by as submittedBy', 'de.submitted_date as submittedDate', 'de.revised_date as revisedDate', 'de.start_date as startDate', 'de.expired_date as expiredDate', 'de.last_review_date as lastReviewDate')
      .from('disclosure as de')
      .where('id', disclosureId),
    knex.select('e.id', 'e.disclosure_id as disclosureId', 'e.active', 'e.name', 'e.description')
      .from('fin_entity as e')
      .where('disclosure_id', disclosureId),
    knex.select('qa.id as id', 'qa.question_id as questionId', 'qa.answer as answer')
      .from('disclosure_answer as da')
      .innerJoin('questionnaire_answer as qa', 'qa.id', 'da.questionnaire_answer_id')
      .where('da.disclosure_id', disclosureId),
    knex.select('d.id as id', 'd.project_id as projectId', 'd.fin_entity_id as finEntityId', 'd.type_cd as typeCd', 'd.comments as comments', 'p.title as projectTitle', 'fe.name as entityName')
      .from('declaration as d')
      .innerJoin('fin_entity as fe', 'fe.id', 'd.fin_entity_id')
      .innerJoin('project as p', 'p.id', 'd.project_id')
      .where('d.disclosure_id', disclosureId),
    retrieveComments(dbInfo, userId, disclosureId)
  ]).then(result => {
    if (result[0].length === 0) { // There should be more checks like this
      callback(new Error('invalid disclosure id'));
      return;
    }

    disclosure = result[0][0];
    disclosure.entities = result[1];
    disclosure.answers = result[2];
    disclosure.declarations = result[3];
    disclosure.comments = result[4];
    disclosure.answers.forEach(answer =>{
      answer.answer = JSON.parse(answer.answer);
    });

    Promise.all([
      knex.select('r.id', 'r.fin_entity_id as finEntityId', 'r.relationship_cd as relationshipCd', 'rc.description as relationship', 'r.person_cd as personCd', 'rp.description as person', 'r.type_cd as typeCd', 'rt.description as type', 'r.amount_cd as amountCd', 'ra.description as amount', 'r.comments')
        .from('relationship as r')
        .innerJoin('relationship_person_type as rp', 'r.person_cd', 'rp.type_cd')
        .innerJoin('relationship_category_type as rc', 'r.relationship_cd', 'rc.type_cd')
        .leftJoin('relationship_type as rt', 'r.type_cd', 'rt.type_cd' )
        .leftJoin('relationship_amount_type as ra', 'r.amount_cd', 'ra.type_cd')
        .whereIn('fin_entity_id', disclosure.entities.map(entity => { return entity.id; }))
        .then(relationships => {
          disclosure.entities.forEach(entity => {
            entity.relationships = relationships.filter(relationship => {
              return relationship.finEntityId === entity.id;
            });
          });
        })
        .catch(err => {
          callback(err);
        }),
      knex.select('qa.question_id as questionId', 'qa.answer as answer', 'fea.fin_entity_id as finEntityId')
      .from('questionnaire_answer as qa' )
      .innerJoin('fin_entity_answer as fea', 'fea.questionnaire_answer_id', 'qa.id')
      .whereIn('fea.fin_entity_id', disclosure.entities.map(entity => { return entity.id; }))
      .then(answers=>{
        disclosure.entities.forEach(entity => {
          entity.answers = answers.filter(answer => {
            return answer.finEntityId === entity.id;
          }).map(answer=>{
            answer.answer = JSON.parse(answer.answer);
            return answer;
          });
        });
      })
    ]).then(()=>{
      callback(undefined, disclosure);
    }).catch(err=>{
      callback(err);
    });
  })
  .catch(err => {
    callback(err);
  });
};

export let getAnnualDisclosure = (dbInfo, userId, piName, callback) => {
  let knex = getKnex(dbInfo);
  knex('disclosure').select('id as id').where('type_cd', 2).andWhere('user_id', userId)
  .then(result => {
    if (result.length < 1) {
      let newDisclosure = {type_cd: 2, status_cd: 1, start_date: new Date(), user_id: userId, submitted_by: piName};
      return knex('disclosure')
      .insert(newDisclosure)
      .then(id => {
        newDisclosure.id = id[0];
        newDisclosure.answers = [];
        newDisclosure.entities = [];
        newDisclosure.declarations = [];
        callback(undefined, newDisclosure);
      })
      .catch(err => {
        callback(err);
      });
    }

    get(dbInfo, userId, result[0].id, callback);
  })
  .catch(err => {
    callback(err);
  });
};

export let getSummariesForReviewCount = (dbInfo, userId, filters, callback) => {
  let knex = getKnex(dbInfo);

  let query = knex('disclosure').count('id as rowcount')
    .innerJoin('disclosure_type', 'disclosure_type.type_cd', 'disclosure.type_cd')
    .innerJoin('disclosure_status', 'disclosure_status.status_cd', 'disclosure.status_cd');

  if (filters.date) {
    if (filters.date.start && !isNaN(filters.date.start)) {
      query.where('submitted_date', '>=', new Date(filters.date.start));
    }

    if (filters.date.end && !isNaN(filters.date.end)) {
      query.where('submitted_date', '<=', new Date(filters.date.end + ONE_DAY));
    }
  }
  if (filters.status && filters.status.length > 0) {
    query.whereIn('disclosure_status.description', filters.status);
  }
  if (filters.type && filters.type.length > 0) {
    query.whereIn('disclosure_type.description', filters.type);
  }
  if (filters.submittedBy) {
    query.where('submitted_by', query.submittedBy);
  }
  if (filters.search) {
    query = query.where(function() {
      this.where('disclosure_status.description', 'like', '%' + filters.search + '%')
         // .orWhere('disclosure_type.description', 'like', '%' + filters.search + '%')
         .orWhere('submitted_by', 'like', '%' + filters.search + '%');
    });
  }

  query.then(count => {
    callback(undefined, count);
  }).catch(err => {
    callback(err);
  });
};

const SUMMARY_PAGE_SIZE = 40;
export let getSummariesForReview = (dbInfo, userId, sortColumn, sortDirection, start, filters, callback) => {
  let knex = getKnex(dbInfo);

  let query = knex('disclosure').select('submitted_by', 'revised_date', 'disclosure_status.description as status', 'disclosure_type.description as type', 'id', 'submitted_date')
    .innerJoin('disclosure_type', 'disclosure_type.type_cd', 'disclosure.type_cd')
    .innerJoin('disclosure_status', 'disclosure_status.status_cd', 'disclosure.status_cd');

  if (filters.date) {
    if (filters.date.start && !isNaN(filters.date.start)) {
      query.where('submitted_date', '>=', new Date(filters.date.start));
    }

    if (filters.date.end && !isNaN(filters.date.end)) {
      query.where('submitted_date', '<=', new Date(filters.date.end + ONE_DAY));
    }
  }
  if (filters.status && filters.status.length > 0) {
    query.whereIn('disclosure_status.description', filters.status);
  }
  if (filters.type && filters.type.length > 0) {
    query.whereIn('disclosure_type.description', filters.type);
  }
  if (filters.submittedBy) {
    query.where('submitted_by', query.submittedBy);
  }
  if (filters.search) {
    query.where(function() {
      this.where('disclosure_status.description', 'like', '%' + filters.search + '%')
         // .orWhere('disclosure_type.description', 'like', '%' + filters.search + '%')
         .orWhere('submitted_by', 'like', '%' + filters.search + '%');
    });
  }

  let dbSortColumn;
  let dbSortDirection = sortDirection === 'DESCENDING' ? 'desc' : undefined;
  switch (sortColumn) {
    case 'SUBMITTED_DATE':
      dbSortColumn = 'submitted_date';
      break;
    case 'STATUS':
      dbSortColumn = 'status';
      break;
    case 'TYPE':
      dbSortColumn = 'type';
      break;
    default:
      dbSortColumn = 'submitted_by';
      break;
  }

  query.orderBy(dbSortColumn, dbSortDirection);
  query.limit(SUMMARY_PAGE_SIZE).offset(+start)
  .then(rows => {
    callback(undefined, rows);
  }).catch(err => {
    callback(err);
  });
};

export let getSummariesForUser = (dbInfo, userId, callback) => {
  let knex = getKnex(dbInfo);
  knex.select('expired_date', 'type_cd as type', 'title', 'status_cd as status', 'last_review_date', 'id')
    .from('disclosure as d')
    .where('d.user_id', userId)
    .then(function (rows) {
      callback(undefined, rows);
    })
    .catch(function (err) {
      callback(err);
    });
};

export let submit = (dbInfo, displayName, disclosureId, callback) => {
  let knex = getKnex(dbInfo);
  knex('disclosure')
  .update({
    status_cd: 2,
    submitted_by: displayName,
    submitted_date: new Date()
  })
  .where('id', disclosureId)
  .then(()=>{
    callback(undefined);
  })
  .catch(err=>{
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
