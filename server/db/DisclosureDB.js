/*eslint camelcase:0 */
import {isDisclosureUsers} from './CommonDB';
import * as FileService from '../services/fileService/FileService';
import {COIConstants} from '../../COIConstants';

const ONE_DAY = 1000 * 60 * 60 * 24;

let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let saveNewFinancialEntity = (dbInfo, displayName, disclosureId, financialEntity, files) => {
  let knex = getKnex(dbInfo);

  return knex('fin_entity')
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
            if (relationship.relationshipCd === 6) {
              return knex('travel_relationship')
              .insert({
                relationship_id: relationshipId[0],
                amount: relationship.travel.amount,
                destination: relationship.travel.destination,
                start_date: new Date(relationship.travel.startDate),
                end_date: new Date(relationship.travel.endDate),
                reason: relationship.travel.reason
              });
            }
          })
        );
      });

      financialEntity.answers.forEach(answer=>{
        queries.push(
          knex('questionnaire_answer').insert({
            question_id: answer.questionId,
            answer: JSON.stringify(answer.answer)
          })
          .then(result =>{
            answer.id = result[0];
            return knex('fin_entity_answer')
              .insert({
                fin_entity_id: id[0],
                questionnaire_answer_id: result[0]
              });
          })
        );
      });

      financialEntity.files = [];
      files.forEach(file=>{
        let fileData = {
          file_type: COIConstants.FILE_TYPE.FINANCIAL_ENTITY,
          ref_id: financialEntity.id,
          type: file.mimetype,
          key: file.filename,
          name: file.originalname,
          uploaded_by: displayName,
          upload_date: new Date()
        };
        queries.push(
        knex('file')
        .insert(fileData)
        .then(fileId=>{
          fileData.id = fileId[0];
          financialEntity.files.push(fileData);
        })
        );
      });

      return Promise.all(queries)
        .then(() => {
          return financialEntity;
        });
    });
};

export let saveExistingFinancialEntity = (dbInfo, displayName, disclosureId, body, files) => {
  let knex = getKnex(dbInfo);

  let financialEntity = body;

  return knex('fin_entity')
    .where('id', financialEntity.id)
    .update({
      disclosure_id: disclosureId,
      active: financialEntity.active,
      name: financialEntity.name,
      description: financialEntity.description
    })
    .then(() => {
      let queries = [];

      queries.push(
        knex('relationship')
        .select('*')
        .where('fin_entity_id', financialEntity.id)
        .then(dbRelationships => {
          return Promise.all(
            dbRelationships.filter(dbRelationship => {
              let match = financialEntity.relationships.find(relationship => {
                return relationship.id === dbRelationship.id;
              });
              return !match;
            }).map(dbRelationship => {
              return knex('travel_relationship')
              .del()
              .where('relationship_id', dbRelationship.id)
              .then(() => {
                return knex('relationship')
                .del()
                .where('id', dbRelationship.id);
              });
            })
          );
        })
      );

      financialEntity.relationships.map(relationship => {
        if (isNaN(relationship.id)) {
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
              if (relationship.relationshipCd === 6) {
                return knex('travel_relationship')
                .insert({
                  relationship_id: relationshipId[0],
                  amount: relationship.travel.amount,
                  destination: relationship.travel.destination,
                  start_date: new Date(relationship.travel.startDate),
                  end_date: new Date(relationship.travel.endDate),
                  reason: relationship.travel.reason
                });
              }
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
                questionnaire_answer_id: result[0]});
            })
          );
        }
      });

      queries.push(
        knex.select('*')
          .from('file')
          .where({
            ref_id: financialEntity.id,
            file_type: COIConstants.FILE_TYPE.FINANCIAL_ENTITY
          })
          .then(results => {
            if (results) {
              results.forEach(result => {
                let match = financialEntity.files.find(file => {
                  return result.id === file.id;
                });
                if (!match) {
                  queries.push(
                    knex('file').where('id', result.id).del()
                    .then(() => {
                      return new Promise((resolve, reject) => {
                        FileService.deleteFile(result.key, err => {
                          if (err) {
                            reject(err);
                          } else {
                            resolve();
                          }
                        });
                      });
                    })
                  );
                }
              });
            }
          })
      );

      files.forEach(file => {
        let fileData = {
          file_type: COIConstants.FILE_TYPE.FINANCIAL_ENTITY,
          ref_id: financialEntity.id,
          type: file.mimetype,
          key: file.filename,
          name: file.originalname,
          uploaded_by: displayName,
          upload_date: new Date()
        };
        queries.push(
          knex('file')
            .insert(fileData)
            .then(id => {
              fileData.id = id[0];
              financialEntity.files.push(fileData);
            })
        );
      });

      return Promise.all(queries)
        .then(() => {
          return financialEntity;
        });
    });
};

export let saveDeclaration = (dbInfo, userId, disclosureId, record) => {
  let knex = getKnex(dbInfo);
  return knex('declaration').insert({
    project_id: record.projectId,
    disclosure_id: disclosureId,
    fin_entity_id: record.finEntityId,
    type_cd: record.typeCd,
    comments: record.comments
  }).then(id => {
    record.id = id[0];
    return record;
  });
};

export let saveExistingDeclaration = (dbInfo, userId, disclosureId, record) => {
  let knex = getKnex(dbInfo);
  return knex('declaration').update({
    project_id: record.projectId,
    disclosure_id: disclosureId,
    fin_entity_id: record.finEntityId,
    type_cd: record.typeCd,
    comments: record.comments
  }).where('id', record.id);
};

export let saveNewQuestionAnswer = (dbInfo, userId, disclosureId, body) => {
  let knex = getKnex(dbInfo);
  let answer = body;
  return knex('questionnaire_answer').insert({
    question_id: body.questionId,
    answer: JSON.stringify(body.answer)
  }).then(result => {
    answer.id = result[0];
    return knex('disclosure_answer').insert({
      disclosure_id: disclosureId,
      questionnaire_answer_id: result[0]}).then(() => {
        return body;
      });
  });
};

export let saveExistingQuestionAnswer = (dbInfo, userId, disclosureId, body) => {
  let knex = getKnex(dbInfo);
  return knex.select('qa.id')
    .from('disclosure_answer as da')
    .innerJoin('questionnaire_answer as qa', 'da.questionnaire_answer_id', 'qa.id')
    .where('da.disclosure_id', disclosureId)
    .andWhere('qa.question_id', body.questionId)
    .then(result => {
      return knex('questionnaire_answer')
        .where('id', result[0].id)
        .update('answer', JSON.stringify(body.answer))
        .then(() => {
          return body;
        });
    });
};

let retrieveComments = (dbInfo, userId, disclosureId) => {
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

let flagPIReviewNeeded = (dbInfo, disclosureId, section, id) => {
  let knex = getKnex(dbInfo);

  return knex.select('*')
    .from('pi_review')
    .where({
      'disclosure_id': disclosureId,
      'target_type': section,
      'target_id': id
    }).then(rows => {
      if (rows.length > 0) {
        return knex('pi_review').update({
          'reviewed_on': null
        }).where({
          'disclosure_id': disclosureId,
          'target_type': section,
          'target_id': id
        });
      }
      else {
        return knex('pi_review').insert({
          'disclosure_id': disclosureId,
          'target_type': section,
          'target_id': id
        });
      }
    });
};

export let addComment = (dbInfo, userInfo, comment) => {
  let knex = getKnex(dbInfo);

  return knex('comment')
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
      let statements = [
        retrieveComments(dbInfo, userInfo.id, comment.disclosureId)
      ];
      if (comment.visibleToPI) {
        statements.push(
          flagPIReviewNeeded(dbInfo, comment.disclosureId, comment.topicSection, comment.topicId)
        );
      }
      return Promise.all(statements);
    });
};

export let get = (dbInfo, userId, disclosureId) => {
  var disclosure;
  let knex = getKnex(dbInfo);
  return Promise.all([
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
    knex.select('d.id as id', 'd.project_id as projectId', 'd.fin_entity_id as finEntityId', 'd.type_cd as typeCd', 'd.comments as comments', 'p.title as projectTitle', 'fe.name as entityName', 'p.type_cd as projectTypeCd', 'p.sponsor_name as sponsorName', 'pp.role_cd as roleCd')
      .from('declaration as d')
      .innerJoin('fin_entity as fe', 'fe.id', 'd.fin_entity_id')
      .innerJoin('project as p', 'p.id', 'd.project_id')
      .innerJoin('project_person as pp', 'pp.project_id', 'p.id')
      .innerJoin('disclosure as di', 'di.user_id', 'pp.person_id')
      .where('d.disclosure_id', disclosureId),
    retrieveComments(dbInfo, userId, disclosureId),
    knex.select('id', 'name', 'key')
    .from('file')
    .where({
      ref_id: disclosureId,
      file_type: COIConstants.FILE_TYPE.DISCLOSURE
    }),
    knex.select('id', 'name', 'key')
    .from('file')
    .where({
      ref_id: disclosureId,
      file_type: COIConstants.FILE_TYPE.MANAGEMENT_PLAN
    })
  ]).then(result => {
    if (result[0].length === 0) { // There should be more checks like this
      throw new Error('invalid disclosure id');
    }

    disclosure = result[0][0];
    disclosure.entities = result[1];
    disclosure.answers = result[2];
    disclosure.declarations = result[3];
    disclosure.comments = result[4];
    disclosure.files = result[5];
    disclosure.managementPlan = result[6];
    disclosure.answers.forEach(answer =>{
      answer.answer = JSON.parse(answer.answer);
    });

    return Promise.all([
      knex.select('r.id', 'r.fin_entity_id as finEntityId', 'r.relationship_cd as relationshipCd', 'rc.description as relationship', 'r.person_cd as personCd', 'rp.description as person', 'r.type_cd as typeCd', 'rt.description as type', 'r.amount_cd as amountCd', 'ra.description as amount', 'r.comments')
        .from('relationship as r')
        .innerJoin('relationship_person_type as rp', 'r.person_cd', 'rp.type_cd')
        .innerJoin('relationship_category_type as rc', 'r.relationship_cd', 'rc.type_cd')
        .leftJoin('relationship_type as rt', 'r.type_cd', 'rt.type_cd' )
        .leftJoin('relationship_amount_type as ra', 'r.amount_cd', 'ra.type_cd')
        .whereIn('fin_entity_id', disclosure.entities.map(entity => { return entity.id; }))
        .then(relationships => {
          return knex('travel_relationship')
          .select('amount', 'destination', 'start_date as startDate', 'end_date as endDate', 'reason', 'relationship_id as relationshipId')
          .whereIn('relationship_id', relationships.map(relationship => { return relationship.id; }))
          .then(travels=> {
            disclosure.entities.forEach(entity => {
              entity.relationships = relationships.filter(relationship => {
                return relationship.finEntityId === entity.id;
              }).map(relationship=> {
                let travel = travels.find(item => {
                  return item.relationshipId === relationship.id;
                });
                relationship.travel = travel ? travel : {};
                return relationship;
              });
            });
          });
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
        }),
      knex.select('*')
        .from('file')
        .whereIn('ref_id', disclosure.entities.map(entity => { return entity.id; }))
        .andWhere('file_type', COIConstants.FILE_TYPE.FINANCIAL_ENTITY)
        .then(files=>{
          disclosure.entities.forEach(entity => {
            entity.files = files.filter(file => {
              return file.ref_id === entity.id;
            });
          });
        })
    ]).then(()=>{
      return disclosure;
    });
  });
};

export let getAnnualDisclosure = (dbInfo, userId, piName) => {
  let knex = getKnex(dbInfo);
  return knex('disclosure').select('id as id').where('type_cd', 2).andWhere('user_id', userId)
    .then(result => {
      if (result.length < 1) {
        let newDisclosure = {
          type_cd: 2,
          status_cd: 1,
          start_date: new Date(),
          user_id: userId,
          submitted_by: piName
        };
        return knex('disclosure')
          .insert(newDisclosure)
          .then(id => {
            newDisclosure.id = id[0];
            newDisclosure.answers = [];
            newDisclosure.entities = [];
            newDisclosure.declarations = [];
            return newDisclosure;
          });
      }
      else {
        return get(dbInfo, userId, result[0].id);
      }
    });
};

export let getSummariesForReviewCount = (dbInfo, userId, filters) => {
  let knex = getKnex(dbInfo);

  let query = knex('disclosure').count('id as rowcount')
    .innerJoin('disclosure_type', 'disclosure_type.type_cd', 'disclosure.type_cd');

  if (filters.date) {
    if (filters.date.start && !isNaN(filters.date.start)) {
      query.where(function() {
        this.where(function() {
          this.whereNotNull('revised_date')
            .andWhere('revised_date', '>=', new Date(filters.date.start));
        });
        this.orWhere(function() {
          this.whereNull('revised_date')
            .andWhere('submitted_date', '>=', new Date(filters.date.start));
        });
      });
    }

    if (filters.date.end && !isNaN(filters.date.end)) {
      query.where(function() {
        this.where(function() {
          this.whereNotNull('revised_date')
            .andWhere('revised_date', '<=', new Date(filters.date.end + ONE_DAY));
        });
        this.orWhere(function() {
          this.whereNull('revised_date')
            .andWhere('submitted_date', '<=', new Date(filters.date.end + ONE_DAY));
        });
      });
    }
  }
  if (filters.status && filters.status.length > 0) {
    query.whereIn('disclosure.status_cd', filters.status);
  }
  if (filters.type && filters.type.length > 0) {
    query.whereIn('disclosure_type.description', filters.type);
  }
  if (filters.submittedBy) {
    query.where('submitted_by', filters.submittedBy);
  }
  if (filters.search) {
    query = query.where(function() {
      this.where('submitted_by', 'like', '%' + filters.search + '%');
         // .orWhere('disclosure_type.description', 'like', '%' + filters.search + '%')
    });
  }

  return query;
};

const SUMMARY_PAGE_SIZE = 40;
export let getSummariesForReview = (dbInfo, userId, sortColumn, sortDirection, start, filters) => {
  let knex = getKnex(dbInfo);

  let query = knex('disclosure').select('submitted_by', 'revised_date', 'disclosure.status_cd as statusCd', 'disclosure_type.description as type', 'id', 'submitted_date')
    .innerJoin('disclosure_type', 'disclosure_type.type_cd', 'disclosure.type_cd');

  if (filters.date) {
    if (filters.date.start && !isNaN(filters.date.start)) {
      query.where(function() {
        this.where(function() {
          this.whereNotNull('revised_date')
            .andWhere('revised_date', '>=', new Date(filters.date.start));
        });
        this.orWhere(function() {
          this.whereNull('revised_date')
            .andWhere('submitted_date', '>=', new Date(filters.date.start));
        });
      });
    }

    if (filters.date.end && !isNaN(filters.date.end)) {
      query.where(function() {
        this.where(function() {
          this.whereNotNull('revised_date')
            .andWhere('revised_date', '<=', new Date(filters.date.end + ONE_DAY));
        });
        this.orWhere(function() {
          this.whereNull('revised_date')
            .andWhere('submitted_date', '<=', new Date(filters.date.end + ONE_DAY));
        });
      });
    }
  }
  if (filters.status && filters.status.length > 0) {
    query.whereIn('disclosure.status_cd', filters.status);
  }
  if (filters.type && filters.type.length > 0) {
    query.whereIn('disclosure_type.description', filters.type);
  }
  if (filters.submittedBy) {
    query.where('submitted_by', filters.submittedBy);
  }
  if (filters.search) {
    query.where(function() {
      this.where('submitted_by', 'like', '%' + filters.search + '%');
         // .orWhere('disclosure_type.description', 'like', '%' + filters.search + '%')
    });
  }

  let dbSortColumn;
  let dbSortDirection = sortDirection === 'DESCENDING' ? 'desc' : undefined;
  switch (sortColumn) {
    case 'SUBMITTED_DATE':
      dbSortColumn = 'submitted_date';
      break;
    case 'STATUS':
      dbSortColumn = 'statusCd';
      break;
    case 'TYPE':
      dbSortColumn = 'type';
      break;
    default:
      dbSortColumn = 'submitted_by';
      break;
  }

  query.orderBy(dbSortColumn, dbSortDirection);
  query.orderBy('id', 'desc');
  return query.limit(SUMMARY_PAGE_SIZE).offset(+start);
};

export let getSummariesForUser = (dbInfo, userId) => {
  let knex = getKnex(dbInfo);
  return knex.select('expired_date', 'type_cd as type', 'title', 'status_cd as status', 'last_review_date', 'id')
    .from('disclosure as d')
    .where('d.user_id', userId);
};

export let submit = (dbInfo, displayName, disclosureId) => {
  let knex = getKnex(dbInfo);
  return knex('disclosure')
    .update({
      status_cd: COIConstants.DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL,
      submitted_by: displayName,
      submitted_date: new Date()
    })
    .where('id', disclosureId);
};

export let approve = (dbInfo, disclosure, displayName, disclosureId) => {
  let knex = getKnex(dbInfo);
  return knex('disclosure')
  .update({
    status_cd: COIConstants.DISCLOSURE_STATUS.UP_TO_DATE
  })
  .where('id', disclosureId)
  .then(()=>{
    disclosure.statusCd = COIConstants.DISCLOSURE_STATUS.UP_TO_DATE;
    return knex('disclosure_archive').insert({
      disclosure_id: disclosureId,
      approved_date: new Date(),
      approved_by: displayName,
      disclosure: JSON.stringify(disclosure)
    })
    .then(()=> {
      return knex('comment')
      .del()
      .where('disclosure_id', disclosureId)
      .then(() => {
        return Promise.all([
          knex('disclosure_answer').select('questionnaire_answer_id').where('disclosure_id', disclosureId),
          knex('disclosure_answer').del().where('disclosure_id', disclosureId)
        ])
        .then(result => {
          return knex('questionnaire_answer').del().whereIn('id', result[0].map(disclosureAnswer => { return disclosureAnswer.questionnaire_answer_id; }));
        });
      });
    });
  });
};

export let reject = (dbInfo, displayName, disclosureId) => {
  let knex = getKnex(dbInfo);
  return knex('disclosure')
  .update({
    status_cd: COIConstants.DISCLOSURE_STATUS.UPDATES_REQUIRED
  })
  .where('id', disclosureId);
};

export let getArchivedDisclosures = (dbInfo, userId) => { //eslint-disable-line no-unused-vars
  let knex = getKnex(dbInfo);
  return knex.select('de.id', 'de.type_cd as type', 'de.title', 'submitted_date as submitted_date', 'dn.description as disposition', 'de.start_date')
    .from('disclosure as de')
    .innerJoin('disposition_type as dn', 'de.disposition_type_cd', 'dn.type_cd');
};

export let deleteAnswers = (dbInfo, userInfo, disclosureId, answersToDelete) => {
  let knex = getKnex(dbInfo);

  return isDisclosureUsers(dbInfo, disclosureId, userInfo.id)
    .then(isSubmitter => {
      if (isSubmitter) {
        return knex.select('qa.id as questionnaireAnswerId', 'da.id as disclosureAnswerId')
          .from('disclosure_answer as da')
          .innerJoin('questionnaire_answer as qa', 'qa.id', 'da.questionnaire_answer_id')
          .whereIn('qa.question_id', answersToDelete)
          .andWhere('da.disclosure_id', disclosureId)
          .then(results => {
            let questionnaireAnswerIds = results.map(row => {
              return row.questionnaireAnswerId;
            });
            let disclosureAnswerIds = results.map(row => {
              return row.disclosureAnswerId;
            });

            return knex('disclosure_answer')
              .whereIn('id', disclosureAnswerIds)
              .del()
              .then(() => {
                return knex('questionnaire_answer')
                  .whereIn('id', questionnaireAnswerIds)
                  .del()
                  .then(() => { return; });
              });
          });
      }
      else {
        return 'Unauthorized';
      }
    });
};
