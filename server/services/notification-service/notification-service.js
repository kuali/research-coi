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

import {
  getCoreTemplateIdByTemplateId,
  getProjectTypeDescription,
  getConfig
} from '../../db/config-db';
import { getDisclosureInfoForNotifications, getArchivedDisclosureInfoForNotifications } from '../../db/disclosure-db';
import { getProjects } from '../../db/project-db';
import { getAdditionalReviewer } from '../../db/additional-reviewer-db';
import { getDeclarationWithProjectId } from '../../db/pi-review-db';
import { PI_ROLE_CODE } from '../../../coi-constants';
import * as VariableService from './variables-service';
import getKnex from '../../db/connection-manager';

const client = process.env.NODE_ENV === 'test' ?
  require('./mock-notification-client') :
  require('./notification-client');

const {
  createDisplayName,
  createNewTemplate,
  updateTemplateData,
  getTemplates,
  getUserInfo,
  sendNotification,
  getAdminRecipients,
  getRecipients,
  getRequestInfo,
  areNotificationsEnabled
} = client;

const NOTIFICATION_TEMPLATES = {
  SUBMITTED: {
    ID: 1,
    SUBJECT: 'Annual Disclosure Submitted for Review',
    BODY: 'Hello COI Admin, An Annual Disclosure was submitted by {{REPORTER_FIRST_NAME}} {{REPORTER_LAST_NAME}} on {{SUBMISSION_DATE}}. You can review this disclosure at {{ADMIN_DETAIL_VIEW}}. You can access the Kuali Research COI Admin Dashboard at {{ADMIN_DASHBOARD}}. Have a nice day.'//eslint-disable-line max-len
  },
  REVIEW_COMPLETE: {
    ID: 2,
    SUBJECT: 'Additional Reviewer Completed their COI Disclosure Review',
    BODY: 'Hello {{ASSIGNER_FIRST_NAME}} {{ASSIGNER_LAST_NAME}}, COI Additional Reviewer {{REVIEWER_FIRST_NAME}} {{REVIEWER_LAST_NAME}} has completed their review of the COI Annual Disclosure submitted on {{SUBMISSION_DATE}} by {{REPORTER_FIRST_NAME}} {{REPORTER_LAST_NAME}}. You can review this disclosure and the reviewer\'s comments at {{ADMIN_DETAIL_VIEW}}. Have a nice day.'//eslint-disable-line max-len
  },
  NEW_PROJECT: {
    ID: 3,
    SUBJECT: 'Annual COI Disclosure Needs Update due to new project to disclose',
    BODY: 'Dear {{PROJECT_PERSON_FIRST_NAME}} {{PROJECT_PERSON_LAST_NAME}}, Your annual disclosure needs to be updated because you have the role {{PROJECT_ROLE}} on the {{PROJECT_TYPE}} {{PROJECT_NUMBER}} {{PROJECT_TITLE}} (PI: {{PI_FIRST_NAME}} {{PI_LAST_NAME}} ) must be disclosed. To update your annual disclosure, please login to Kuali Research COI and access your annual disclosure at {{REPORTER_DASHBOARD}}. If you have any questions, please contact your COI Admin.' //eslint-disable-line max-len
  },
  SENT_BACK: {
    ID: 4,
    SUBJECT: 'Annual COI Disclosure was Sent Back for Revisions',
    BODY: 'Dear {{REPORTER_FIRST_NAME}} {{REPORTER_LAST_NAME}}, Your annual disclosure submitted on {{SUBMISSION_DATE}} was sent back for revisions on {{NOW}}. Please login to Kuali Research COI and access your disclosure at {{REPORTER_DASHBOARD}} to revise and resubmit your disclosure.'//eslint-disable-line max-len
  },
  REVIEW_ASSIGNED: {
    ID: 5,
    SUBJECT: 'COI Disclosure Assigned for your Review',
    BODY: 'Hello {{REVIEWER_FIRST_NAME}} {{REVIEWER_LAST_NAME}}, On {{REVIEW_ASSIGNED}}, the COI Administrator {{ASSIGNER_FIRST_NAME}} {{ASSIGNER_LAST_NAME}} assigned you to review the COI Annual Disclosure submitted on {{SUBMISSION_DATE}} by {{REPORTER_FIRST_NAME}} {{REPORTER_LAST_NAME}}. Please review this disclosure at {{ADMIN_DETAIL_VIEW}}. Thanks for your helping in reviewing this disclosure.' //eslint-disable-line max-len
  },
  APPROVED: {
    ID: 6,
    SUBJECT: 'Annual COI Disclosure is Approved',
    BODY: 'Dear {{REPORTER_FIRST_NAME}} {{REPORTER_LAST_NAME}}, Your annual disclosure submitted on {{SUBMISSION_DATE}} was approved on {{APPROVAL_DATE}}. To view your disclosure, login to your COI Dashboard at {{REPORTER_DASHBOARD}} and go to Disclosure Archives.' //eslint-disable-line max-len
  },
  EXPIRED: {
    ID: 7,
    SUBJECT: 'Annual COI Disclosure is Expired',
    BODY: 'Dear {{REPORTER_FIRST_NAME}} {{REPORTER_LAST_NAME}}, Your annual Conflict of Interest (COI) disclosure expired on {{EXPIRATION_DATE}}. Please update your annual disclosure as soon as possible. Login to Kuali Research COI and access your annual disclosure at {{REPORTER_DASHBOARD}}.' //eslint-disable-line max-len
  },
  REVIEW_UNASSIGNED: {
    ID: 8,
    SUBJECT: 'COI Disclosure Review Unassigned',
    BODY: 'Hello {{REVIEWER_FIRST_NAME}} {{REVIEWER_LAST_NAME}}, On {{REVIEW_ASSIGNED}}, the COI Administrator {{ASSIGNER_FIRST_NAME}} {{ASSIGNER_LAST_NAME}} removed you as a reviewer for the COI Annual Disclosure submitted on {{SUBMISSION_DATE}} by {{REPORTER_FIRST_NAME}} {{REPORTER_LAST_NAME}}. You are no longer responsible for reviewing this disclosure. Thank you.' //eslint-disable-line max-len
  },
  EXPIRATION_REMINDER: {
    ID: 9,
    SUBJECT: 'Annual COI Disclosure is Due',
    BODY: 'Dear {{REPORTER_FIRST_NAME}} {{REPORTER_LAST_NAME}}, Your annual Conflict of Interest (COI) disclosure will expire on {{EXPIRATION_DATE}}. Please update your annual disclosure prior to this date. Login to Kuali Research COI and access your annual disclosure at {{REPORTER_DASHBOARD}}.' //eslint-disable-line max-len
  },
  RESUBMITTED: {
    ID: 10,
    SUBJECT: 'Revised Annual Disclosure Resubmitted for Review',
    BODY: 'Hello COI Admin, An Annual Disclosure was resubmitted by {{REPORTER_FIRST_NAME}} {{REPORTER_LAST_NAME}} on {{SUBMISSION_DATE}}. You can review this disclosure at {{ADMIN_DETAIL_VIEW}}. You can access the Kuali Research COI Admin Dashboard at {{ADMIN_DASHBOARD}}. Have a nice day.' //eslint-disable-line max-len
  }
};

export function getDefaults(notificationTemplate) {
  switch (notificationTemplate.templateId) {
    case NOTIFICATION_TEMPLATES.SUBMITTED.ID:
      notificationTemplate.subject = NOTIFICATION_TEMPLATES.SUBMITTED.SUBJECT;
      notificationTemplate.body = NOTIFICATION_TEMPLATES.SUBMITTED.BODY;
      return notificationTemplate;
    case NOTIFICATION_TEMPLATES.REVIEW_COMPLETE.ID:
      notificationTemplate.subject = NOTIFICATION_TEMPLATES.REVIEW_COMPLETE.SUBJECT;
      notificationTemplate.body = NOTIFICATION_TEMPLATES.REVIEW_COMPLETE.BODY;
      return notificationTemplate;
    case NOTIFICATION_TEMPLATES.NEW_PROJECT.ID:
      notificationTemplate.subject = NOTIFICATION_TEMPLATES.NEW_PROJECT.SUBJECT;
      notificationTemplate.body = NOTIFICATION_TEMPLATES.NEW_PROJECT.BODY;
      return notificationTemplate;
    case NOTIFICATION_TEMPLATES.SENT_BACK.ID:
      notificationTemplate.subject = NOTIFICATION_TEMPLATES.SENT_BACK.SUBJECT;
      notificationTemplate.body = NOTIFICATION_TEMPLATES.SENT_BACK.BODY;
      return notificationTemplate;
    case NOTIFICATION_TEMPLATES.REVIEW_ASSIGNED.ID:
      notificationTemplate.subject = NOTIFICATION_TEMPLATES.REVIEW_ASSIGNED.SUBJECT;
      notificationTemplate.body = NOTIFICATION_TEMPLATES.REVIEW_ASSIGNED.BODY;
      return notificationTemplate;
    case NOTIFICATION_TEMPLATES.APPROVED.ID:
      notificationTemplate.subject = NOTIFICATION_TEMPLATES.APPROVED.SUBJECT;
      notificationTemplate.body = NOTIFICATION_TEMPLATES.APPROVED.BODY;
      return notificationTemplate;
    case NOTIFICATION_TEMPLATES.REVIEW_UNASSIGNED.ID:
      notificationTemplate.subject = NOTIFICATION_TEMPLATES.REVIEW_UNASSIGNED.SUBJECT;
      notificationTemplate.body = NOTIFICATION_TEMPLATES.REVIEW_UNASSIGNED.BODY;
      return notificationTemplate;
    case NOTIFICATION_TEMPLATES.EXPIRATION_REMINDER.ID:
      notificationTemplate.subject = NOTIFICATION_TEMPLATES.EXPIRATION_REMINDER.SUBJECT;
      notificationTemplate.body = NOTIFICATION_TEMPLATES.EXPIRATION_REMINDER.BODY;
      return notificationTemplate;
    case NOTIFICATION_TEMPLATES.EXPIRED.ID:
      notificationTemplate.subject = NOTIFICATION_TEMPLATES.EXPIRED.SUBJECT;
      notificationTemplate.body = NOTIFICATION_TEMPLATES.EXPIRED.BODY;
      return notificationTemplate;
    case NOTIFICATION_TEMPLATES.RESUBMITTED.ID:
      notificationTemplate.subject = NOTIFICATION_TEMPLATES.RESUBMITTED.SUBJECT;
      notificationTemplate.body = NOTIFICATION_TEMPLATES.RESUBMITTED.BODY;
      return notificationTemplate;
    default:
      notificationTemplate.subject = '';
      notificationTemplate.body = '';
      return notificationTemplate;
  }
}

function cleanTemplate(template) {
  delete template.subject;
  delete template.body;
  delete template.index;
  delete template.editing;
  delete template.error;
  return template;
}

export async function handleTemplates(dbInfo, hostname, templates) {
  return templates.map(async (template) => {
    if (template.active === 1) {
      if (!template.core_template_id) { //eslint-disable-line camelcase
        const coreTemplateId = await createNewTemplate(dbInfo, hostname, template);
        template.core_template_id = coreTemplateId; //eslint-disable-line camelcase
        return cleanTemplate(template);
      }
      await updateTemplateData(dbInfo, hostname, template);
    }

    return cleanTemplate(template);
  });
}

export async function populateTemplateData(dbInfo, hostname, notificationTemplates) {
  const templates = await getTemplates(dbInfo, hostname);
  return notificationTemplates.map(notificationTemplate => {
    const template = templates.find(t => {
      return String(t.id) === String(notificationTemplate.coreTemplateId) ||
        t.displayName === createDisplayName(hostname, notificationTemplate.description);
    });

    if (!template) {
      return getDefaults(notificationTemplate);
    }
    notificationTemplate.subject = template.subject;
    notificationTemplate.body = template.templates.email.text;
    notificationTemplate.coreTemplateId = template.id;
    return notificationTemplate;
  });
}

function createCoreNotification(templateId, variables, creatorId, addresses) {
  return {
    templateId,
    creatorId,
    addresses,
    variables
  };
}

async function getTemplate(dbInfo, templateId) {
  if (!areNotificationsEnabled(dbInfo)) {
    return;
  }
  const knex = getKnex(dbInfo);
  const template = await getCoreTemplateIdByTemplateId(knex, templateId);

  if (template.active === 0) {
    return;
  }

  return template;
}

async function getArchivedDisclosure(dbInfo, hostname, archiveId) {
  const knex = getKnex(dbInfo);
  const disclosure = await getArchivedDisclosureInfoForNotifications(
    knex,
    archiveId
  );
  disclosure.reporterInfo = await getUserInfo(dbInfo, hostname, disclosure.userId);
  return disclosure;
}

async function getDisclosure(dbInfo, hostname, disclosureId) {
  const knex = getKnex(dbInfo);

  const disclosure = await getDisclosureInfoForNotifications(
    knex,
    disclosureId
  );
  disclosure.reporterInfo = await getUserInfo(dbInfo, hostname, disclosure.userId);
  return disclosure;
}

async function getReviewer(dbInfo, hostname, reviewerId) {
  const knex = getKnex(dbInfo);
  const reviewer = await getAdditionalReviewer(knex, reviewerId);
  if (reviewer) {
    reviewer.reviewerInfo = await getUserInfo(dbInfo, hostname, reviewer.userId);
  }
  return reviewer;
}

async function getProject(dbInfo, hostname, project, person) {
  const knex = getKnex(dbInfo);
  const projectInfo = JSON.parse(JSON.stringify(project));
  projectInfo.type = await getProjectTypeDescription(knex, project.typeCode);
  projectInfo.person = JSON.parse(JSON.stringify(person));
  projectInfo.person.info = await getUserInfo(dbInfo, hostname, person.personId);
  const pi = projectInfo.persons.find(p => p.roleCode === PI_ROLE_CODE);
  if (pi) {
    projectInfo.piInfo = await getUserInfo(dbInfo, hostname, pi.personId);
  }
  return projectInfo;
}

async function getProjectsInformation(dbinfo, knex, hostname, disclosure) {
  const projects = await getProjects(knex, disclosure.userId);
  const config = await getConfig(dbinfo, knex, hostname);
  let projectInformation = '<table><tr><th>Project Number</th><th>Title</th><th>Sponsors</th><th>Project Type</th><th>Project Disposition</th></tr>';
  for (const project of projects) {
    let sponsorString = '';
    project.sponsors.forEach(sponsor => {
      sponsorString += `${sponsor.sponsorName}, `;
    });
    sponsorString = sponsorString.replace(/, $/, '');

    const projectType = await getProjectTypeDescription(knex, project.typeCd);
    const declaration = await getDeclarationWithProjectId(knex, project.id);
    const dispositionTypes = config.dispositionTypes.filter(type => type.typeCd === declaration[0].adminRelationshipCd);
    const dispositionType = dispositionTypes[0].description ? dispositionTypes[0].description : '';
    projectInformation += `<tr><td>${project.sourceIdentifier}</td><td>${project.name}</td><td>${sponsorString}</td>`;
    projectInformation += `<td>${projectType}</td><td> ${dispositionType}</td></tr>`;
  }
  projectInformation += '</table>';
  return projectInformation;
}

function getVariables(dbInfo, hostname, disclosure, reviewer, project) {
  const url = getRequestInfo(dbInfo, hostname).url;
  let variables = VariableService.getDefaultVariables(url);
  if (disclosure) {
    variables = VariableService.getDisclosureVariables(disclosure, url, variables);
  }
  variables = reviewer ? VariableService.getReviewerVariables(reviewer, variables) : variables;
  variables = project ? VariableService.getProjectVariables(project, variables) : variables;
  return variables;
}

export async function createAndSendAdminNotification(dbInfo, hostname, authHeader, userInfo, disclosureId, templateId) {
  const template = await getTemplate(dbInfo, templateId);

  if (!template) {
    return;
  }
  const disclosure = await getDisclosure(dbInfo, hostname, disclosureId);
  const variables = await getVariables(dbInfo, hostname, disclosure);
  const adminEmails = await getAdminRecipients(dbInfo, authHeader);
  const notification = createCoreNotification(template.coreTemplateId, variables, userInfo.id, adminEmails);
  return await sendNotification(dbInfo, hostname, notification);
}

export async function createAndSendSubmitNotification(dbInfo, hostname, authHeader, userInfo, disclosureId) {
  return await createAndSendAdminNotification(dbInfo, hostname, authHeader, userInfo, disclosureId, NOTIFICATION_TEMPLATES.SUBMITTED.ID);
}

export async function createAndSendResubmitNotification(dbInfo, hostname, authHeader, userInfo, disclosureId) {
  return await createAndSendAdminNotification(dbInfo, hostname, authHeader, userInfo, disclosureId, NOTIFICATION_TEMPLATES.RESUBMITTED.ID);
}

export async function createAndSendApproveNotification(dbInfo, knex, hostname, userInfo, archiveId) {
  const template = await getTemplate(dbInfo, NOTIFICATION_TEMPLATES.APPROVED.ID);
  if (!template) {
    return;
  }
  const disclosure = await getArchivedDisclosure(dbInfo, hostname, archiveId);
  let variables = await getVariables(dbInfo, hostname, disclosure);
  const projectInformation = await getProjectsInformation(dbInfo, knex, hostname, disclosure);
  variables = VariableService.addProjectInformation(projectInformation, variables);
  const recipients = getRecipients(dbInfo, disclosure.reporterInfo.email);
  const notification = createCoreNotification(template.coreTemplateId, variables, userInfo.id, recipients);
  return await sendNotification(dbInfo, hostname, notification);
}

export async function createAndSendExpirationNotification(dbInfo, hostname, disclosureId) {
  return await createAndSendExpireNotification(dbInfo, hostname, disclosureId, NOTIFICATION_TEMPLATES.EXPIRED.ID);
}

export async function createAndSendExpirationReminderNotification(dbInfo, hostname, disclosureId) {
  return await createAndSendExpireNotification(dbInfo, hostname, disclosureId, NOTIFICATION_TEMPLATES.EXPIRATION_REMINDER.ID);
}

export async function createAndSendExpireNotification(dbInfo, hostname, disclosureId, templateId) {
  const template = await getTemplate(dbInfo, templateId);
  if (!template) {
    return;
  }
  const disclosure = await getDisclosure(dbInfo, hostname, disclosureId);
  const variables = await getVariables(dbInfo, hostname, disclosure);
  const recipients = getRecipients(dbInfo, disclosure.reporterInfo.email);
  const notification = createCoreNotification(template.coreTemplateId, variables, disclosure.reporterInfo.id, recipients);
  return await sendNotification(dbInfo, hostname, notification);
}

export async function createAndSendSentBackNotification(dbInfo, hostname, userInfo, disclosureId) {
  const template = await getTemplate(dbInfo, NOTIFICATION_TEMPLATES.SENT_BACK.ID);
  if (!template) {
    return;
  }
  const disclosure = await getDisclosure(dbInfo, hostname, disclosureId);
  const variables = await getVariables(dbInfo, hostname, disclosure);
  const recipients = getRecipients(dbInfo, disclosure.reporterInfo.email);
  const notification = createCoreNotification(template.coreTemplateId, variables, userInfo.id, recipients);
  return await sendNotification(dbInfo, hostname, notification);
}

export async function createAndSendReviewerNotification(dbInfo, hostname, userInfo, reviewerId, templateId) {
  const template = await getTemplate(dbInfo, templateId);
  if (!template) {
    return;
  }

  const reviewer = await getReviewer(dbInfo, hostname, reviewerId);

  if (!reviewer) {
    return;
  }
  const disclosure = await getDisclosure(dbInfo, hostname, reviewer.disclosureId);
  const variables = await getVariables(dbInfo, hostname, disclosure, reviewer);
  const recipients = getRecipients(dbInfo, reviewer.email);
  const notification = createCoreNotification(template.coreTemplateId, variables, userInfo.id, recipients);
  return await sendNotification(dbInfo, hostname, notification);
}

export async function createAndSendReviewerAssignedNotification(dbInfo, hostname, userInfo, reviewerId) {
  return await createAndSendReviewerNotification(dbInfo, hostname, userInfo, reviewerId, NOTIFICATION_TEMPLATES.REVIEW_ASSIGNED.ID);
}

export async function createAndSendReviewerUnassignNotification(dbInfo, hostname, userInfo, reviewerId) {
  return await createAndSendReviewerNotification(dbInfo, hostname, userInfo, reviewerId, NOTIFICATION_TEMPLATES.REVIEW_UNASSIGNED.ID);
}

export async function createAndSendReviewCompleteNotification(dbInfo, hostname, authHeader, userInfo, reviewerId) {
  const template = await getTemplate(dbInfo, NOTIFICATION_TEMPLATES.REVIEW_COMPLETE.ID);
  if (!template) {
    return;
  }

  const reviewer = await getReviewer(dbInfo, hostname, reviewerId);

  if (!reviewer) {
    return;
  }
  const disclosure = await getDisclosure(dbInfo, hostname, reviewer.disclosureId);
  const variables = await getVariables(dbInfo, hostname, disclosure, reviewer);
  const recipients = await getAdminRecipients(dbInfo, authHeader);
  const notification = createCoreNotification(template.coreTemplateId, variables, userInfo.id, recipients);
  return await sendNotification(dbInfo, hostname, notification);
}

export async function createAndSendNewProjectNotification(dbInfo, hostname, userInfo, disclosureId, project, person) {
  const template = await getTemplate(dbInfo, NOTIFICATION_TEMPLATES.NEW_PROJECT.ID);
  if (!template) {
    return;
  }
  const projectInfo = await getProject(dbInfo, hostname, project, person);
  let disclosure;
  if (disclosureId) {
    disclosure = await getDisclosure(dbInfo, hostname, disclosureId);
  }
  const variables = await getVariables(dbInfo, hostname, disclosure, undefined, projectInfo);
  if (!disclosureId) {
    const reporterInfo = await getUserInfo(dbInfo, hostname, person.personId);
    VariableService.setReporterDetails(variables, reporterInfo.firstName, reporterInfo.lastName);
  }

  const recipients = getRecipients(dbInfo, projectInfo.person.info.email);
  const notification = createCoreNotification(template.coreTemplateId, variables, projectInfo.person.info.id, recipients);
  return await sendNotification(dbInfo, hostname, notification);
}