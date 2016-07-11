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

import { values, uniq } from 'lodash';
import {isDisclosureUsers} from './common-db';
import { getReviewers } from '../services/auth-service/auth-service';
import { getProjects } from './project-db';
import {
  filterProjects,
  filterDeclarations
} from '../services/project-service/project-service';
import * as FileService from '../services/file-service/file-service';
import {
  createAndSendReviewerAssignedNotification
} from '../services/notification-service/notification-service';
import {camelizeJson} from './json-utils';
import {
  NO_DISPOSITION,
  ROLES,
  RELATIONSHIP_STATUS,
  FILE_TYPE,
  LANES,
  ENTITY_RELATIONSHIP,
  DISCLOSURE_STATUS,
  DATE_TYPE,
  SYSTEM_USER,
  STATE_TYPE
} from '../../coi-constants';
import Log from '../log';
import getKnex from './connection-manager';

const MILLIS = 1000;
const SECONDS = 60;
const MINUTES = 60;
const HOURS = 24;
const ONE_DAY = MILLIS * SECONDS * MINUTES * HOURS;

let lane; // eslint-disable-line no-unused-vars
try {
  const extensions = require('research-extensions').default;
  lane = extensions.config.lane;
}
catch (err) {
  lane = process.env.LANE || LANES.PRODUCTION;
}

export const saveNewFinancialEntity = (dbInfo, userInfo, disclosureId, financialEntity, files) => {
  const knex = getKnex(dbInfo);

  return isDisclosureUsers(dbInfo, disclosureId, userInfo.schoolId)
    .then(isSubmitter => {
      if (!isSubmitter) {
        throw Error(`Attempt by ${userInfo.username} to associate an entity with disclosure ${disclosureId} that isnt the users`);
      }

      resetAdminRelationships(knex, disclosureId).then();
      resetProjectDispositions(knex, disclosureId).then();

      return knex('fin_entity')
        .insert({
          disclosure_id: disclosureId,
          active: financialEntity.active,
          name: financialEntity.name,
          status: RELATIONSHIP_STATUS.IN_PROGRESS
        }, 'id')
        .then(id => {
          financialEntity.id = id[0];
          const queries = [];
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
                  comments: relationship.comments,
                  status: RELATIONSHIP_STATUS.IN_PROGRESS
                }, 'id')
                .then(relationshipId => {
                  relationship.id = relationshipId[0];
                  if (relationship.relationshipCd === ENTITY_RELATIONSHIP.TRAVEL) {
                    return knex('travel_relationship')
                      .insert({
                        relationship_id: relationshipId[0],
                        amount: relationship.travel.amount,
                        destination: relationship.travel.destination,
                        start_date: new Date(relationship.travel.startDate),
                        end_date: new Date(relationship.travel.endDate),
                        reason: relationship.travel.reason
                      }, 'id');
                  }
                })
            );
          });

          financialEntity.answers.forEach(answer => {
            queries.push(
              knex('questionnaire_answer')
                .insert({
                  question_id: answer.questionId,
                  answer: JSON.stringify(answer.answer)
                }, 'id')
                .then(result => {
                  answer.id = result[0];
                  return knex('fin_entity_answer')
                    .insert({
                      fin_entity_id: id[0],
                      questionnaire_answer_id: result[0]
                    }, 'id');
                })
            );
          });

          financialEntity.files = [];
          files.forEach(file => {
            const fileData = {
              file_type: FILE_TYPE.FINANCIAL_ENTITY,
              ref_id: financialEntity.id,
              type: file.mimetype,
              key: file.filename,
              name: file.originalname,
              user_id: userInfo.schoolId,
              uploaded_by: userInfo.name,
              upload_date: new Date()
            };
            queries.push(
              knex('file')
                .insert(fileData, 'id')
                .then(fileId => {
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
    });
};

const isEntityUsers = (knex, entityId, userId) => {
  return knex.select('e.id')
    .from('fin_entity as e')
    .innerJoin('disclosure as d', 'd.id', 'e.disclosure_id')
    .where({
      'e.id': entityId,
      'd.user_id': userId
    })
    .then(rows => {
      return rows.length > 0;
    });
};

export const saveExistingFinancialEntity = (dbInfo, userInfo, entityId, body, files) => {
  const knex = getKnex(dbInfo);

  const financialEntity = body;

  return isEntityUsers(knex, entityId, userInfo.schoolId)
    .then(isOwner => {
      if (!isOwner) {
        throw Error(`Attempt by ${userInfo.username} to update entity ${entityId} not owned by user`);
      }

      knex
        .select('disclosure_id as disclosureId')
        .from('fin_entity')
        .where({
          id: entityId
        }).then(entityRecord => {
          resetAdminRelationships(knex, entityRecord.disclosureId).then();
          resetProjectDispositions(knex, entityRecord.disclosureId).then();
        });

      return knex('fin_entity')
        .where('id', entityId)
        .update({
          active: financialEntity.active,
          name: financialEntity.name
        })
        .then(() => {
          const queries = [];

          queries.push(
            knex('relationship')
              .select('*')
              .where('fin_entity_id', entityId)
              .then(dbRelationships => {
                return Promise.all(
                  dbRelationships.filter(dbRelationship => {
                    const match = financialEntity.relationships.some(relationship => {
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

          financialEntity.relationships.forEach(relationship => {
            if (isNaN(relationship.id)) {
              relationship.finEntityId = entityId;
              queries.push(
                knex('relationship')
                  .insert({
                    fin_entity_id: entityId,
                    relationship_cd: relationship.relationshipCd,
                    person_cd: relationship.personCd,
                    type_cd: !relationship.typeCd ? null : relationship.typeCd,
                    amount_cd: !relationship.amountCd ? null : relationship.amountCd,
                    comments: relationship.comments,
                    status: RELATIONSHIP_STATUS.IN_PROGRESS
                  }, 'id')
                  .then(relationshipId => {
                    relationship.id = relationshipId[0];
                    if (relationship.relationshipCd === ENTITY_RELATIONSHIP.TRAVEL) {
                      return knex('travel_relationship')
                        .insert({
                          relationship_id: relationshipId[0],
                          amount: relationship.travel.amount,
                          destination: relationship.travel.destination,
                          start_date: new Date(relationship.travel.startDate),
                          end_date: new Date(relationship.travel.endDate),
                          reason: relationship.travel.reason
                        }, 'id');
                    }
                  })
              );
            }
          });

          financialEntity.answers.forEach(answer => {
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
                }, 'id').then(result => {
                  answer.id = result[0];
                  return knex('fin_entity_answer').insert({
                    fin_entity_id: entityId,
                    questionnaire_answer_id: result[0]
                  }, 'id');
                })
              );
            }
          });

          queries.push(
            knex.select('*')
              .from('file')
              .where({
                ref_id: entityId,
                file_type: FILE_TYPE.FINANCIAL_ENTITY
              })
              .then(results => {
                if (results) {
                  results.forEach(result => {
                    const match = financialEntity.files.find(file => {
                      return result.id === file.id;
                    });
                    if (!match) {
                      queries.push(
                        knex('file')
                          .where('id', result.id)
                          .del()
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
            const fileData = {
              file_type: FILE_TYPE.FINANCIAL_ENTITY,
              ref_id: entityId,
              type: file.mimetype,
              key: file.filename,
              name: file.originalname,
              user_id: userInfo.schoolId,
              uploaded_by: userInfo.name,
              upload_date: new Date()
            };
            queries.push(
              knex('file')
                .insert(fileData, 'id')
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
    });
};

export const saveDeclaration = (dbInfo, userId, disclosureId, record) => {
  return isDisclosureUsers(dbInfo, disclosureId, userId)
    .then(isSubmitter => {
      if (!isSubmitter) {
        throw Error(`Attempt by user id ${userId} to create a declaration for disclosure ${disclosureId} which isnt the users`);
      }

      const knex = getKnex(dbInfo);
      return knex('declaration')
        .insert({
          project_id: record.projectId,
          disclosure_id: disclosureId,
          fin_entity_id: record.finEntityId,
          type_cd: record.typeCd,
          comments: record.comments ? record.comments : null
        }, 'id').then(id => {
          record.id = id[0];
          return record;
        });
    });
};

export async function saveExistingDeclaration(dbInfo, userInfo, disclosureId, declarationId, record) {
  const isSubmitter = await isDisclosureUsers(dbInfo, disclosureId, userInfo.schoolId);
  if (!isSubmitter && userInfo.coiRole !== ROLES.ADMIN) {
    throw Error(`Attempt by userId ${userInfo.schoolId} to save a declaration on disclosure ${disclosureId} which isnt theirs`);
  }

  const knex = getKnex(dbInfo);

  return knex('declaration')
    .update({
      type_cd: record.typeCd,
      comments: record.comments,
      admin_relationship_cd: record.adminRelationshipCd
    })
    .where({
      disclosure_id: disclosureId,
      id: declarationId
    });
}

export const saveNewQuestionAnswer = (dbInfo, userId, disclosureId, body) => {
  return isDisclosureUsers(dbInfo, disclosureId, userId)
    .then(isSubmitter => {
      if (!isSubmitter) {
        throw Error(`Attempt by user id ${userId} to save a question answer on disclosure ${disclosureId} which isnt theirs`);
      }

      const knex = getKnex(dbInfo);
      const answer = body;
      return knex('questionnaire_answer')
        .insert({
          question_id: body.questionId,
          answer: JSON.stringify(body.answer)
        }, 'id')
        .then(result => {
          answer.id = result[0];
          return knex('disclosure_answer')
            .insert({
              disclosure_id: disclosureId,
              questionnaire_answer_id: result[0]
            }, 'id')
            .then(() => {
              return body;
            });
        });
    });
};

export const saveExistingQuestionAnswer = (dbInfo, userId, disclosureId, questionId, body) => {
  return isDisclosureUsers(dbInfo, disclosureId, userId)
    .then(isSubmitter => {
      if (!isSubmitter) {
        throw Error(`Attempt by user id ${userId} to save a question answer on disclosure ${disclosureId} which isnt theirs`);
      }

      const knex = getKnex(dbInfo);
      return knex.select('qa.id')
        .from('disclosure_answer as da')
        .innerJoin('questionnaire_answer as qa', 'da.questionnaire_answer_id', 'qa.id')
        .where('da.disclosure_id', disclosureId)
        .andWhere('qa.question_id', questionId)
        .then(result => {
          return knex('questionnaire_answer')
            .where('id', result[0].id)
            .update('answer', JSON.stringify(body.answer))
            .then(() => {
              return body;
            });
        });
    });
};

async function retrieveComments(dbInfo, userInfo, disclosureId) {
  const knex = getKnex(dbInfo);

  const criteria = {
    disclosure_id: disclosureId
  };

  if (userInfo.coiRole === ROLES.USER) {
    criteria.pi_visible = true;
  }

  const query = knex.select(
      'id',
      'disclosure_id as disclosureId',
      'topic_section as topicSection',
      'topic_id as topicId',
      'text',
      'author',
      'editable',
      'user_role as userRole',
      'user_id as userId',
      'date',
      'pi_visible as piVisible',
      'reviewer_visible as reviewerVisible'
    )
    .from('comment')
    .where(criteria);

  if (userInfo.coiRole === ROLES.REVIEWER) {
    query.andWhere(function() {
      this.where({
        reviewer_visible: true
      }).orWhere({
        user_id: userInfo.schoolId
      });
    });
  }

  const comments = await query;

  comments.forEach(comment => {
    comment.isCurrentUser = comment.userId == userInfo.schoolId; // eslint-disable-line eqeqeq
  });

  return comments;
}

const flagPIReviewNeeded = (dbInfo, disclosureId, section, id) => {
  const knex = getKnex(dbInfo);
  return knex.select('*')
    .from('pi_review')
    .where({
      disclosure_id: disclosureId,
      target_type: section,
      target_id: id
    }).then(rows => {
      if (rows.length > 0) {
        return knex('pi_review').update({
          reviewed_on: null
        }).where({
          disclosure_id: disclosureId,
          target_type: section,
          target_id: id
        });
      }
      return knex('pi_review').insert({
        disclosure_id: disclosureId,
        target_type: section,
        target_id: id
      }, 'id');
    });
};

const unflagPIReviewNeeded = (dbInfo, disclosureId, section, id) => {
  const knex = getKnex(dbInfo);
  return knex('comment').count()
    .where({
      disclosure_id: disclosureId,
      topic_section: section,
      topic_id: id,
      pi_visible: true
    })
    .then(result => {
      const count = result[0]['count(*)'];

      if (count == 0) {
        return knex('pi_review').delete()
          .where({
            disclosure_id: disclosureId,
            target_type: section,
            target_id: id
          });
      }
    });
};

export const addComment = (dbInfo, userInfo, comment) => {
  const knex = getKnex(dbInfo);
  return knex('comment')
    .insert({
      disclosure_id: comment.disclosureId,
      topic_section: comment.topicSection,
      topic_id: comment.topicId,
      text: comment.text,
      user_id: userInfo.schoolId,
      author: `${userInfo.firstName} ${userInfo.lastName}`,
      user_role: userInfo.coiRole,
      date: new Date(),
      pi_visible: userInfo.coiRole === ROLES.ADMIN && comment.piVisible,
      reviewer_visible: userInfo.coiRole === ROLES.ADMIN && comment.reviewerVisible
    }, 'id').then(() => {
      const statements = [
        retrieveComments(dbInfo, userInfo, comment.disclosureId)
      ];
      if (comment.piVisible) {
        statements.push(
          flagPIReviewNeeded(dbInfo, comment.disclosureId, comment.topicSection, comment.topicId)
        );
      }
      return Promise.all(statements);
    });
};

export const updateComment = (dbInfo, userInfo, comment) => {
  const knex = getKnex(dbInfo);
  return knex('comment')
    .update({
      text: comment.text,
      date: new Date(),
      pi_visible: userInfo.coiRole === ROLES.ADMIN && comment.piVisible,
      reviewer_visible: userInfo.coiRole === ROLES.ADMIN && comment.reviewerVisible
    })
    .where({
      id: comment.id
    })
    .then(() => {
      if (comment.piVisible) {
        return flagPIReviewNeeded(dbInfo, comment.disclosureId, comment.topicSection, comment.topicId);
      }

      return unflagPIReviewNeeded(dbInfo, comment.disclosureId, comment.topicSection, comment.topicId);
    })
    .then(() => {
      return retrieveComments(dbInfo, userInfo, comment.disclosureId);
    });
};

const getDisclosure = (knex, userInfo, disclosureId) => {
  const criteria = {
    id: disclosureId
  };

  if (userInfo.coiRole !== ROLES.ADMIN &&
    userInfo.coiRole !== ROLES.REVIEWER) {
    criteria.user_id = userInfo.schoolId;
  }

  return knex
    .select(
      'de.id',
      'de.type_cd as typeCd',
      'de.title',
      'de.status_cd as statusCd',
      'de.submitted_by as submittedBy',
      'de.submitted_date as submittedDate',
      'de.revised_date as revisedDate',
      'de.start_date as startDate',
      'de.expired_date as expiredDate',
      'de.last_review_date as lastReviewDate',
      'de.config_id as configId'
    )
    .from('disclosure as de')
    .where(criteria);
};

async function getDeclarations(dbInfo, disclosureId, authHeader) {
  const knex = getKnex(dbInfo);

  const declarations = await knex.select(
      'd.id as id',
      'd.project_id as projectId',
      'd.fin_entity_id as finEntityId',
      'd.type_cd as typeCd',
      'd.comments as comments',
      'd.admin_relationship_cd as adminRelationshipCd',
      'p.title as projectTitle',
      'p.source_identifier as sourceIdentifier',
      'fe.name as entityName',
      'p.type_cd as projectTypeCd',
      'pp.role_cd as roleCd',
      'fe.active as finEntityActive',
      'pp.id as projectPersonId',
      'pp.disposition_type_cd as dispositionTypeCd',
      'p.source_status as statusCd'
    )
    .from('declaration as d')
    .innerJoin('project as p', 'p.id', 'd.project_id')
    .innerJoin('project_person as pp', 'pp.project_id', 'p.id')
    .innerJoin('disclosure as di', 'di.user_id', 'pp.person_id')
    .innerJoin('fin_entity as fe', function() {
      this.on('fe.id', 'd.fin_entity_id')
        .andOn('di.id', 'fe.disclosure_id');
    })
    .where('d.disclosure_id', disclosureId);

  if (declarations.length === 0) {
    return declarations;
  }

  let projectIds = declarations.map(declaration => declaration.projectId);
  projectIds = uniq(projectIds);

  const sponsors = await knex
    .distinct(
      'sponsor_name as sponsorName',
      'project_id as projectId',
      'sponsor_cd as sponsorCode'
    )
    .from('project_sponsor')
    .whereIn('project_id', projectIds);

  declarations.forEach(declaration => {
    declaration.sponsors = sponsors.filter(sponsor => {
      return sponsor.projectId === declaration.projectId;
    });
  });

  return filterDeclarations(dbInfo, declarations, authHeader);
}

function getArchivedVersionList(knex, disclosureId) {
  return knex.select(
      'id',
      'approved_date as approvedDate'
    ).from('disclosure_archive')
    .where('disclosure_id', disclosureId)
    .orderBy('approvedDate', 'DESC');
}

export const get = (dbInfo, userInfo, disclosureId, authHeader) => {
  let disclosure;
  const knex = getKnex(dbInfo);

  return Promise.all([
    getDisclosure(knex, userInfo, disclosureId),
    knex.select('e.id', 'e.disclosure_id as disclosureId', 'e.active', 'e.name')
      .from('fin_entity as e')
      .where('disclosure_id', disclosureId)
      .andWhereNot('status', RELATIONSHIP_STATUS.PENDING),
    knex.select('qa.id as id', 'qa.question_id as questionId', 'qa.answer as answer')
      .from('disclosure_answer as da')
      .innerJoin('questionnaire_answer as qa', 'qa.id', 'da.questionnaire_answer_id')
      .where('da.disclosure_id', disclosureId),
    getDeclarations(dbInfo, disclosureId, authHeader),
    retrieveComments(dbInfo, userInfo, disclosureId),
    knex.select('id', 'name', 'key', 'file_type as fileType')
      .from('file')
      .whereIn('file_type', [FILE_TYPE.DISCLOSURE, FILE_TYPE.ADMIN])
      .andWhere({
        ref_id: disclosureId
      }),
    knex.select('id', 'name', 'key')
      .from('file')
      .where({
        ref_id: disclosureId,
        file_type: FILE_TYPE.MANAGEMENT_PLAN
      }),
    knex('additional_reviewer')
      .select('id', 'disclosure_id as disclosureId', 'user_id as userId', 'name', 'email', 'title', 'unit_name as unitName', 'active', 'dates')
      .where({disclosure_id: disclosureId})
      .then(reviewers => {
        return reviewers.map(reviewer => {
          reviewer.dates = JSON.parse(reviewer.dates);
          return reviewer;
        });
      }),
    isDisclosureUsers(dbInfo, disclosureId, userInfo.schoolId),
    knex('config').select('id').limit(1).orderBy('id', 'desc'),
    getArchivedVersionList(knex, disclosureId)
  ]).then(([
    disclosureRecords,
    entityRecords,
    answerRecords,
    declarationRecords,
    commentRecords,
    fileRecords,
    managementPlans,
    additionalReviewers,
    isOwner,
    latestConfig,
    archivedVersions
  ]) => {
    const { coiRole } = userInfo;
    if (coiRole !== ROLES.ADMIN && coiRole !== ROLES.REVIEWER) {
      if (!isOwner) {
        throw Error(`Attempt by ${userInfo.username} to load disclosure ${disclosureId} which is not theirs`);
      }
    }

    const phaseTwoSteps = [];
    disclosure = disclosureRecords[0];
    disclosure.entities = entityRecords;
    disclosure.answers = answerRecords;
    disclosure.declarations = declarationRecords;
    disclosure.archivedVersions = archivedVersions;
    if (coiRole === ROLES.REVIEWER) {
      phaseTwoSteps.push(
        knex.select(
            'r.declaration_id as declarationId',
            'r.project_person_id as projectPersonId',
            'r.disposition_type_id as dispositionTypeId'
          )
          .from('reviewer_recommendation as r')
          .innerJoin('additional_reviewer as a', 'r.additional_reviewer_id', 'a.id')
          .where({
            'a.user_id': userInfo.schoolId,
            'a.disclosure_id': disclosureId
          })
          .then(recommendations => {
            recommendations.forEach(recommendation => {
              if (recommendation.projectPersonId) {
                if (!disclosure.recommendedProjectDispositions) {
                  disclosure.recommendedProjectDispositions = [];
                }

                disclosure.recommendedProjectDispositions.push({
                  projectPersonId: recommendation.projectPersonId,
                  disposition: recommendation.dispositionTypeId
                });
              } else {
                const decl = disclosure.declarations.find(declaration => {
                  return declaration.id === recommendation.declarationId;
                });
                if (decl) {
                  decl.reviewerRelationshipCd = recommendation.dispositionTypeId;
                }
              }
            });
          })
      );
    } else if (coiRole === ROLES.ADMIN) {
      phaseTwoSteps.push(
        knex.select(
            'r.declaration_id as declarationId',
            'r.project_person_id as projectPersonId',
            'r.disposition_type_id as dispositionTypeId',
            'a.name as usersName'
          )
          .from('reviewer_recommendation as r')
          .innerJoin('additional_reviewer as a', 'r.additional_reviewer_id', 'a.id')
          .where({
            'a.disclosure_id': disclosureId
          })
          .orderBy('r.disposition_type_id')
          .then(recommendations => {
            recommendations.forEach(recommendation => {
              let decl;
              if (recommendation.declarationId) {
                decl = disclosure.declarations.find(declaration => {
                  return declaration.id === recommendation.declarationId;
                });

                if (decl) {
                  if (!decl.recommendations) {
                    decl.recommendations = [];
                  }

                  decl.recommendations.push({
                    usersName: recommendation.usersName,
                    dispositionTypeCd: recommendation.dispositionTypeId
                  });
                }
              } else if (recommendation.projectPersonId) {
                if (!disclosure.recommendedProjectDispositions) {
                  disclosure.recommendedProjectDispositions = [];
                }

                disclosure.recommendedProjectDispositions.push({
                  usersName: recommendation.usersName,
                  projectPersonId: recommendation.projectPersonId,
                  disposition: recommendation.dispositionTypeId
                });
              }
            });
          })
      );
    }
    disclosure.comments = commentRecords;
    disclosure.files = fileRecords;
    disclosure.managementPlan = managementPlans;
    disclosure.reviewers = additionalReviewers;
    disclosure.answers.forEach(answer => {
      answer.answer = JSON.parse(answer.answer);
    });

    if (disclosure.answers.length < 1) {
      disclosure.configId = latestConfig[0].id;
    }

    phaseTwoSteps.push(
      knex.select(
          'r.id',
          'r.fin_entity_id as finEntityId',
          'r.relationship_cd as relationshipCd',
          'r.person_cd as personCd',
          'r.type_cd as typeCd',
          'r.amount_cd as amountCd',
          'r.comments'
        )
        .from('relationship as r')
        .whereIn('fin_entity_id', disclosure.entities.map(entity => { return entity.id; }))
        .andWhereNot('status', RELATIONSHIP_STATUS.PENDING)
        .then(relationships => {
          return knex('travel_relationship')
            .select('amount', 'destination', 'start_date as startDate', 'end_date as endDate', 'reason', 'relationship_id as relationshipId')
            .whereIn('relationship_id', relationships.map(relationship => { return relationship.id; }))
            .then(travels => {
              disclosure.entities.forEach(entity => {
                entity.relationships = relationships.filter(relationship => {
                  return relationship.finEntityId === entity.id;
                }).map(relationship => {
                  const travel = travels.find(item => {
                    return item.relationshipId === relationship.id;
                  });
                  relationship.travel = travel ? travel : {};
                  return relationship;
                });
              });
            });
        })
    );

    phaseTwoSteps.push(
      knex.select('qa.question_id as questionId', 'qa.answer as answer', 'fea.fin_entity_id as finEntityId')
        .from('questionnaire_answer as qa' )
        .innerJoin('fin_entity_answer as fea', 'fea.questionnaire_answer_id', 'qa.id')
        .whereIn('fea.fin_entity_id', disclosure.entities.map(entity => { return entity.id; }))
        .then(answers => {
          disclosure.entities.forEach(entity => {
            entity.answers = answers.filter(answer => {
              return answer.finEntityId === entity.id;
            }).map(answer => {
              answer.answer = JSON.parse(answer.answer);
              return answer;
            });
          });
        })
    );

    phaseTwoSteps.push(
      knex.select('*')
        .from('file')
        .whereIn('ref_id', disclosure.entities.map(entity => { return entity.id; }))
        .andWhere('file_type', FILE_TYPE.FINANCIAL_ENTITY)
        .then(files => {
          disclosure.entities.forEach(entity => {
            entity.files = files.filter(file => {
              return file.ref_id === entity.id;
            });
          });
        })
    );

    phaseTwoSteps.push(
      knex('disclosure').update({config_id: disclosure.configId}).where({id: disclosure.id})
    );

    return Promise.all(phaseTwoSteps).then(() => {
      return disclosure;
    });
  });
};

export async function getAnnualDisclosure(dbInfo, userInfo, piName) {
  const knex = getKnex(dbInfo);
  const result = await knex('disclosure')
    .select('id as id')
    .where('type_cd', 2)
    .andWhere('user_id', userInfo.schoolId);

  if (result.length >= 1) {
    return get(dbInfo, userInfo, result[0].id);
  }

  const config = await knex('config').max('id as id');
  const newDisclosure = {
    type_cd: 2,
    status_cd: 1,
    start_date: new Date(),
    user_id: userInfo.schoolId,
    submitted_by: piName,
    config_id: config[0].id
  };
  const id = await knex('disclosure').insert(newDisclosure, 'id');
  newDisclosure.id = id[0];
  newDisclosure.answers = [];
  newDisclosure.entities = [];
  newDisclosure.declarations = [];
  return camelizeJson(newDisclosure);
}

export async function getSummariesForReview(dbInfo, sortColumn, sortDirection, start, filters, reviewerDisclosures, pageSize) {
  const knex = getKnex(dbInfo);
  const query = knex('disclosure as d');
  const columnsToSelect = [
    'd.submitted_by',
    'd.revised_date',
    'd.status_cd as statusCd',
    'd.id',
    'd.submitted_date',
    'd.config_id as configId'
  ];

  let validTypeCds = [];
  if (Array.isArray(filters.disposition)) {
    query.distinct();
    columnsToSelect.push('project_person.disposition_type_cd as dispositionTypeCd');

    validTypeCds = filters.disposition.filter(typeCd => !isNaN(typeCd));
    query.leftJoin(
      'declaration as de',
      'd.id',
      'de.disclosure_id'
    );
    query.leftJoin('project_person', function() {
      this.on(
        'de.project_id', 'project_person.project_id'
      ).andOn(
        'd.user_id', 'project_person.person_id'
      );
    });
  }

  let reviewJoinMade = false;
  if (filters.reviewStatus) {
    const {reviewStatus} = filters;

    if (!reviewStatus.assigned && !reviewStatus.notAssigned) {
      query.where('status_cd', -99999999); // return no rows
    }
    else if (reviewStatus.assigned && !reviewStatus.notAssigned) {
      if (!reviewJoinMade) {
        reviewJoinMade = true;
        query.innerJoin('additional_reviewer as ar',
          'd.id',
          'ar.disclosure_id'
        );
        query.where('ar.active', true);
      }
    }
    else if (!reviewStatus.assigned && reviewStatus.notAssigned) {
      if (!reviewJoinMade) {
        reviewJoinMade = true;
        query.leftJoin('additional_reviewer as ar',
          'd.id',
          'ar.disclosure_id'
        );
        query.where(function() {
          this.whereNull('ar.id').orWhere('ar.active', false);
        });
      }
    }
  }

  if (filters.reviewers) {
    if (!reviewJoinMade) {
      reviewJoinMade = true;
      query.innerJoin('additional_reviewer as ar',
        'd.id',
        'ar.disclosure_id'
      );
    }

    query.where('ar.user_id', 'in', filters.reviewers);
  }

  query.select(columnsToSelect);

  if (filters.date) {
    if (filters.date.start && !isNaN(filters.date.start)) {
      query.where(function() {
        this.where(function() {
          this.whereNotNull('d.revised_date')
            .andWhere('d.revised_date', '>=', new Date(filters.date.start));
        });
        this.orWhere(function() {
          this.whereNull('d.revised_date')
            .andWhere('d.submitted_date', '>=', new Date(filters.date.start));
        });
      });
    }

    if (filters.date.end && !isNaN(filters.date.end)) {
      query.where(function() {
        this.where(function() {
          this.whereNotNull('d.revised_date')
            .andWhere('d.revised_date', '<=', new Date(filters.date.end + ONE_DAY));
        });
        this.orWhere(function() {
          this.whereNull('d.revised_date')
            .andWhere('d.submitted_date', '<=', new Date(filters.date.end + ONE_DAY));
        });
      });
    }
  }
  if (filters.status) {
    query.whereIn('d.status_cd', filters.status);
  }
  if (filters.submittedBy) {
    query.where('d.submitted_by', filters.submittedBy);
  }
  if (filters.search) {
    query.where(function() {
      this.where('d.submitted_by', 'like', `%${filters.search}%`);
    });
  }

  let dbSortColumn;
  const dbSortDirection = sortDirection === 'DESCENDING' ? 'desc' : undefined;
  switch (sortColumn) {
    case 'SUBMITTED_DATE':
      dbSortColumn = 'd.submitted_date';
      break;
    case 'STATUS':
      dbSortColumn = 'statusCd';
      break;
    case 'TYPE':
      dbSortColumn = 'd.type';
      break;
    default:
      dbSortColumn = 'd.submitted_by';
      break;
  }

  if (reviewerDisclosures) {
    query.whereIn('d.id', reviewerDisclosures);
  }

  query.orderBy(dbSortColumn, dbSortDirection);
  query.orderBy('d.id', 'desc');
  query.limit(pageSize);

  let queryResult = await query.offset(Number(start));

  if (Array.isArray(filters.disposition)) {
    const includeNone = validTypeCds.includes(NO_DISPOSITION);
    queryResult = queryResult.reduce((result, row) => {
      if (validTypeCds.includes(row.dispositionTypeCd) || includeNone) {
        result[row.id] = row;
      }
      return result;
    }, {});
    queryResult = values(queryResult);
  }

  return queryResult;
}

export async function getSummariesForReviewCount(dbInfo, filters) {
  const results = await getSummariesForReview(
    dbInfo,
    null,
    'DESCENDING',
    0,
    filters,
    undefined,
    999999
  );
  return Promise.resolve([{rowcount: results.length}]);
}

export const getSummariesForUser = async (dbInfo, userId) => {
  const knex = getKnex(dbInfo);
  const summaries = await knex.select(
      'expired_date',
      'type_cd as type',
      'title',
      'status_cd as status',
      'last_review_date',
      'id',
      'config_id as configId'
    )
    .from('disclosure as d')
    .where('d.user_id', userId);

  const entityCounts = await knex('fin_entity')
    .count('disclosure_id as entityCount')
    .select('disclosure_id as disclosureId')
    .whereIn('disclosure_id', summaries.map(s => s.id))
    .andWhere('active', true)
    .groupBy('disclosure_id');

  return summaries.map(summary => {
    const count = entityCounts.find(c => c.disclosureId === summary.id);
    summary.entityCount = count ? count.entityCount : 0;
    return summary;
  });
};

const updateEntitiesAndRelationshipsStatuses = (knex, disclosureId, oldStatus, newStatus) => {
  return knex('fin_entity')
    .update({status: newStatus})
    .where('disclosure_id', disclosureId)
    .andWhere('status', oldStatus)
    .then(() => {
      return knex('fin_entity')
        .select('id')
        .where('disclosure_id', disclosureId)
        .then(results => {
          return Promise.all(
            results.map(result => {
              const update = {};
              update.status = newStatus;
              if (newStatus === RELATIONSHIP_STATUS.DISCLOSED) {
                update.disclosed_date = new Date();
              }

              return knex('relationship')
                .update(update)
                .where('fin_entity_id', result.id)
                .andWhere('status', oldStatus);
            })
          );
        });
    });
};

export const getExpirationDate = (date, isRolling, dueDate) => {
  if (isRolling === true) {
    return new Date(date.setFullYear(date.getFullYear() + 1));
  }

  const dueMonthDay = dueDate.getMonth() + dueDate.getDay();
  const approveMonthDay = date.getMonth() + date.getDay();

  if (approveMonthDay < dueMonthDay) {
    return new Date(dueDate.setFullYear(date.getFullYear()));
  }

  return new Date(dueDate.setFullYear(date.getFullYear() + 1));
};

const approveDisclosure = (knex, disclosureId, expiredDate, userId, dbInfo, authHeader) => {
  return knex('disclosure').select('user_id as userId').where({id: disclosureId}).then(disclosure => {
    return getProjects(undefined, disclosure[0].userId, knex).then(projects => {
      return filterProjects(dbInfo, projects, authHeader).then(requiredProjects => {
        const newActiveProjects = requiredProjects.filter(project => {
          return project.new === 1;
        });
        let status = DISCLOSURE_STATUS.UP_TO_DATE;

        if (newActiveProjects && newActiveProjects.length > 0) {
          status = DISCLOSURE_STATUS.UPDATE_REQUIRED;
        }

        return knex('disclosure')
          .update({
            expired_date: expiredDate,
            status_cd: status,
            last_review_date: new Date()
          })
          .where('id', disclosureId);
      });
    });
  });
};

async function getDisclosureDisposition(knex, declarations, id) {
  const config = await knex('config')
    .select('config')
    .where({id});

  const dispositionTypes = JSON.parse(config[0].config).dispositionTypes;
  if (dispositionTypes && dispositionTypes.length > 0) {
    dispositionTypes.sort((a,b) => {
      return b.order - a.order;
    });

    const dispositions = declarations.map(declaration => {
      const dispostion = dispositionTypes.find(dispositionType => {
        return String(dispositionType.typeCd) === String(declaration.dispositionTypeCd);
      });
      return dispostion;
    });

    dispositions.sort((a,b) => {
      return a.order - b.order;
    });

    if (dispositions[0]) {
      return dispositions[0].description;
    }

    if (dispositionTypes[0]) {
      return dispositionTypes[0].description;
    }
  }

  return undefined;
}

async function archiveDisclosure(knex, disclosureId, approverName, disclosure) {
  disclosure.disposition = await getDisclosureDisposition(knex, disclosure.declarations, disclosure.configId);

  return knex('disclosure_archive')
    .insert({
      disclosure_id: disclosureId,
      approved_date: new Date(),
      approved_by: approverName,
      disclosure: JSON.stringify(disclosure)
    }, 'id');
}

const deleteComments = (knex, disclosureId) => {
  return knex('comment')
    .del()
    .where('disclosure_id', disclosureId);
};

const deleteAnswersForDisclosure = (knex, disclosureId) => {
  return knex('disclosure_answer').select('questionnaire_answer_id').where('disclosure_id', disclosureId)
    .then((result) => {
      return knex('disclosure_answer').del().where('disclosure_id', disclosureId)
        .then(() => {
          const idsToDelete = result.map(disclosureAnswer => {
            return disclosureAnswer.questionnaire_answer_id;
          });
          return knex('questionnaire_answer').del().whereIn('id', idsToDelete);
        });
    });
};

const deletePIReviewsForDisclsoure = (knex, disclosureId) => {
  return knex('pi_review')
    .del()
    .where('disclosure_id', disclosureId);
};

async function deleteAdditionalReviewers(knex, disclosureId) {
  await knex('reviewer_recommendation')
    .del()
    .whereIn('additional_reviewer_id', function() {
      this.select('id')
        .from('additional_reviewer')
        .where({
          disclosure_id: disclosureId
        });
    });

  return knex('additional_reviewer')
    .del()
    .where('disclosure_id', disclosureId);
}

async function resetProjectDispositions(knex, disclosureId) {
  const disclosure = await knex('disclosure')
    .select('user_id')
    .where({
      id: disclosureId
    });

  return knex('project_person')
    .update({
      disposition_type_cd: null
    })
    .where({
      person_id: disclosure[0].user_id
    });
}

async function resetAdminRelationships(knex, disclosureId) {
  return knex('declaration')
    .update({
      admin_relationship_cd: null
    })
    .where({
      disclosure_id: disclosureId
    });
}

export const approve = (dbInfo, disclosure, displayName, disclosureId, authHeader, trx) => {
  let knex;
  if (trx) {
    knex = trx;
  } else {
    knex = getKnex(dbInfo);
  }

  disclosure.statusCd = DISCLOSURE_STATUS.UP_TO_DATE;
  disclosure.lastReviewDate = new Date();

  return Promise.all([
    knex('config').select('config').limit(1).orderBy('id', 'desc'),
    archiveDisclosure(knex, disclosureId, displayName, disclosure),
    deleteComments(knex, disclosureId),
    deleteAnswersForDisclosure(knex, disclosureId),
    deletePIReviewsForDisclsoure(knex, disclosureId),
    deleteAdditionalReviewers(knex, disclosureId),
    updateEntitiesAndRelationshipsStatuses(knex, disclosureId, RELATIONSHIP_STATUS.PENDING, RELATIONSHIP_STATUS.IN_PROGRESS)
  ])
  .then(([config, archivedDisclosure]) => {
    const generalConfig = JSON.parse(config[0].config).general;
    const expiredDate = getExpirationDate(new Date(disclosure.submittedDate), generalConfig.isRollingDueDate, new Date(generalConfig.dueDate));
    return approveDisclosure(knex, disclosureId, expiredDate, disclosure.userId, dbInfo, authHeader).then(() => {
      return archivedDisclosure[0];
    });
  });
};

const updateStatus = (knex, name, disclosureId) => {
  return knex('disclosure')
  .update({
    status_cd: DISCLOSURE_STATUS.SUBMITTED_FOR_APPROVAL,
    submitted_by: name,
    submitted_date: new Date()
  })
  .where('id', disclosureId);
};

function updateProjects(trx, schoolId) {
  return trx('project_person')
    .update({
      new: false
    })
    .where({
      person_id: schoolId,
      active: true
    });
}

async function addAdditionalReviewers(trx, dbInfo, authHeader, disclosureId, userInfo) {
  const reviewers = await getReviewers(dbInfo, authHeader, userInfo.primaryDepartmentCode);

  return await Promise.all(
    reviewers.filter(reviewer => {
      return reviewer.userId !== userInfo.schoolId;
    }).map(reviewer => {
      return trx('additional_reviewer').insert({
        user_id: reviewer.userId,
        disclosure_id: disclosureId,
        name: reviewer.value,
        email: reviewer.email,
        active: true,
        dates: JSON.stringify([{
          type: DATE_TYPE.ASSIGNED,
          date: new Date()
        }]),
        assigned_by: SYSTEM_USER
      }, 'id').then(newId => {
        return Promise.resolve(newId[0]);
      }).catch(() => {
        Log.info(
          `reviewer ${reviewer.userId} already added to disclosure ${disclosureId}`
        );
        return Promise.resolve(null);
      });
    })
  );
}

export async function submit(dbInfo, userInfo, disclosureId, authHeader, hostName) {
  const knex = getKnex(dbInfo);
  const isSubmitter = await isDisclosureUsers(dbInfo, disclosureId, userInfo.schoolId);

  if (!isSubmitter) {
    throw Error(`Attempt by ${userInfo.username} to submit disclosure ${disclosureId} which isnt theirs`);
  }

  let reviewerIds;
  return knex.transaction( async (trx) => {
    await updateStatus(trx, userInfo.name, disclosureId);
    await updateEntitiesAndRelationshipsStatuses(trx, disclosureId, RELATIONSHIP_STATUS.IN_PROGRESS, RELATIONSHIP_STATUS.DISCLOSED);
    await updateProjects(trx, userInfo.schoolId);

    const disclosure = await get(dbInfo, userInfo, disclosureId, trx);
    const config = await trx('config').select('config').where({id: disclosure.configId});

    const generalConfig = JSON.parse(config[0].config).general;

    if (generalConfig.autoAddAdditionalReviewer) {
      reviewerIds = await addAdditionalReviewers(trx, dbInfo, authHeader, disclosureId, userInfo);
    }

    if (generalConfig.autoApprove) {
      const count = await trx('fin_entity').count('id as count').where({active: true, disclosure_id: disclosureId});
      if (count[0].count === 0) {
        await approve(dbInfo, disclosure, SYSTEM_USER, disclosureId, authHeader, trx);
      }
    }
  }).then(async () => {
    if (Array.isArray(reviewerIds)) {
      for (let i = 0; i < reviewerIds.length; i++) {
        if (reviewerIds[i] === null) {
          continue;
        }

        await createAndSendReviewerAssignedNotification(
          dbInfo,
          hostName,
          userInfo,
          reviewerIds[i]
        );
      }
    }
  });
}

async function updateEditableComments(trx, disclosureId) {
  await trx('comment')
    .update({editable: false})
    .where({disclosure_id: disclosureId});
}

export const reject = (dbInfo, userInfo, disclosureId) => {
  const knex = getKnex(dbInfo);
  return knex.transaction(trx => {
    return trx('disclosure')
      .update({
        status_cd: DISCLOSURE_STATUS.REVISION_REQUIRED,
        last_review_date: new Date()
      })
      .where('id', disclosureId).then(() => {
        return updateEditableComments(trx, disclosureId);
      });
  });
};

export const getArchivedDisclosures = (dbInfo, userId) => {
  const knex = getKnex(dbInfo);

  return Promise.all([
    knex.select('da.id', 'da.disclosure_id as disclosureId', 'da.approved_by as approvedBy', 'da.approved_date as approvedDate', 'da.disclosure as disclosure')
      .from('disclosure_archive as da')
      .innerJoin('disclosure as d', 'd.id', 'da.disclosure_id')
      .where('d.user_id', userId)
      .orderBy('da.id', 'desc'),
    knex.select('id', 'config')
      .from('config as c')
  ]).then(([archives, configs]) => {
    archives.forEach(archive => {
      const archivesConfigId = JSON.parse(archive.disclosure).configId;
      const theConfig = configs.find(config => {
        return config.id === archivesConfigId;
      });

      if (theConfig) {
        archive.config = theConfig.config;
      }
    });

    return archives;
  });
};

export const getLatestArchivedDisclosure = (dbInfo, userId, disclosureId) => {
  const knex = getKnex(dbInfo);
  return knex.select('disclosure')
  .from('disclosure_archive')
  .where('disclosure_id', disclosureId)
  .limit(1)
  .orderBy('approved_date', 'desc');
};

export function getArchivedDisclosure(dbInfo, archiveId) {
  const knex = getKnex(dbInfo);
  return knex
    .select('disclosure')
    .from('disclosure_archive')
    .where('id', archiveId);
}

export const deleteAnswers = (dbInfo, userInfo, disclosureId, answersToDelete) => {
  const knex = getKnex(dbInfo);

  return isDisclosureUsers(dbInfo, disclosureId, userInfo.schoolId)
    .then(isSubmitter => {
      if (!isSubmitter) {
        throw Error(`Attempt by ${userInfo.username} to delete answers from disclosure ${disclosureId} which isnt theirs`);
      }

      return knex.select('qa.id as questionnaireAnswerId', 'da.id as disclosureAnswerId')
        .from('disclosure_answer as da')
        .innerJoin('questionnaire_answer as qa', 'qa.id', 'da.questionnaire_answer_id')
        .whereIn('qa.question_id', answersToDelete)
        .andWhere('da.disclosure_id', disclosureId)
        .then(results => {
          const questionnaireAnswerIds = results.map(row => {
            return row.questionnaireAnswerId;
          });
          const disclosureAnswerIds = results.map(row => {
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
    });
};

export const getCurrentState = (dbInfo, userInfo, disclosureId) => {
  return isDisclosureUsers(dbInfo, disclosureId, userInfo.schoolId)
    .then(isSubmitter => {
      if (!isSubmitter) {
        throw Error(`Attempt by user id ${userInfo.schoolId} to retrieve state of disclosure ${disclosureId} which isnt theirs`);
      }

      const knex = getKnex(dbInfo);
      return knex
        .select('state')
        .from('state')
        .where({
          key: STATE_TYPE.ANNUAL_DISCLOSURE_STATE,
          user_id: userInfo.schoolId
        })
        .then(stateFound => {
          if (stateFound.length === 0) {
            return '';
          }
          return JSON.parse(stateFound[0].state);
        });
    });
};

export const saveCurrentState = (dbInfo, userInfo, disclosureId, state) => {
  return getCurrentState(dbInfo, userInfo, disclosureId)
    .then(currentState => {
      const knex = getKnex(dbInfo);

      if (currentState !== '') {
        return knex('state')
          .update({
            state: JSON.stringify(state)
          })
          .where({
            key: STATE_TYPE.ANNUAL_DISCLOSURE_STATE,
            user_id: userInfo.schoolId
          }).then(() => {
            return;
          });
      }

      return knex('state')
        .insert({
          key: STATE_TYPE.ANNUAL_DISCLOSURE_STATE,
          user_id: userInfo.schoolId,
          state: JSON.stringify(state)
        }, 'id').then(() => {
          return;
        });
    });
};

export async function getDisclosureInfoForNotifications(dbInfo, id) {
  const knex = getKnex(dbInfo);

  const disclosure = await knex('disclosure')
    .select('id', 'status_cd as statusCd', 'submitted_date as submittedDate', 'expired_date as expiredDate', 'user_id as userId')
    .where({id});

  return disclosure[0];
}

export async function getArchivedDisclosureInfoForNotifications(dbInfo, id) {
  const knex = getKnex(dbInfo);

  const results = await knex('disclosure_archive as da')
    .select('d.user_id as userId', 'da.approved_date as approvedDate', 'da.approved_by as approvedBy', 'da.disclosure')
    .innerJoin('disclosure as d', 'da.disclosure_id', 'd.id')
    .where({'da.id': id});

  const disclosure = JSON.parse(results[0].disclosure);
  disclosure.approvedDate = results[0].approvedDate;
  disclosure.approvedBy = results[0].approvedBy;
  disclosure.userId = results[0].userId;
  return disclosure;
}
