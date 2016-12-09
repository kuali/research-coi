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

import ConfigDB from '../../db/config-db';
import DisclosureDB from '../../db/disclosure-db';
import ProjectDB from '../../db/project-db';
import ReviewerDB from '../../db/additional-reviewer-db';
import PIReviewDB from '../../db/pi-review-db';
import { PI_ROLE_CODE } from '../../../coi-constants';
import * as VariableService from './variables-service';
import getKnex from '../../db/connection-manager';
import {createLogger} from '../../log';
const log = createLogger('NotificationService');

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

const TEMPLATES = {
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
    SUBJECT: 'Annual COI Disclosure Needs Update due to new project to disclose', //eslint-disable-line max-len
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
  },
  RETURN_TO_REPORTER: {
    ID: 11,
    SUBJECT: 'Annual COI Disclosure was Returned to Reporter',
    BODY: 'Dear {{REPORTER_FIRST_NAME}} {{REPORTER_LAST_NAME}}, Your annual disclosure submitted on {{SUBMISSION_DATE}} was returned on {{NOW}} for the following reason {{RETURN_REASON}}. Please login to Kuali Research COI and access your disclosure at {{REPORTER_DASHBOARD}} to update and submit your disclosure.'//eslint-disable-line max-len
  },
  NEW_PROJECT_WITHOUT_DISCLOSURE: {
    ID: 12,
    SUBJECT: 'Action Required: Create COI disclosure due to a new project',
    BODY: '<p>Hello {{REPORTER_FIRST_NAME}} {{REPORTER_LAST_NAME}},</p> <p> You must complete a Conflict of Interest (COI) disclosure immediately because you have been added as {{PROJECT_ROLE}} on <b>{{PROJECT_TYPE}} {{PROJECT_NUMBER}} <i>{{PROJECT_TITLE}}</i>. </b> Login to Kuali Research and create a COI disclosure at: {{REPORTER_DASHBOARD}}. </p> <p>If you have any questions, please contact your COI Administrator.</p> <p>Thank you, <br> Your COI Admin</p>' //eslint-disable-line max-len
  }
};

export function getDefaults(notificationTemplate) {
  switch (notificationTemplate.templateId) {
    case TEMPLATES.SUBMITTED.ID:
      notificationTemplate.subject = TEMPLATES.SUBMITTED.SUBJECT;
      notificationTemplate.body = TEMPLATES.SUBMITTED.BODY;
      return notificationTemplate;
    case TEMPLATES.REVIEW_COMPLETE.ID:
      notificationTemplate.subject = TEMPLATES.REVIEW_COMPLETE.SUBJECT;
      notificationTemplate.body = TEMPLATES.REVIEW_COMPLETE.BODY;
      return notificationTemplate;
    case TEMPLATES.NEW_PROJECT.ID:
      notificationTemplate.subject = TEMPLATES.NEW_PROJECT.SUBJECT;
      notificationTemplate.body = TEMPLATES.NEW_PROJECT.BODY;
      return notificationTemplate;
    case TEMPLATES.SENT_BACK.ID:
      notificationTemplate.subject = TEMPLATES.SENT_BACK.SUBJECT;
      notificationTemplate.body = TEMPLATES.SENT_BACK.BODY;
      return notificationTemplate;
    case TEMPLATES.REVIEW_ASSIGNED.ID:
      notificationTemplate.subject = TEMPLATES.REVIEW_ASSIGNED.SUBJECT;
      notificationTemplate.body = TEMPLATES.REVIEW_ASSIGNED.BODY;
      return notificationTemplate;
    case TEMPLATES.APPROVED.ID:
      notificationTemplate.subject = TEMPLATES.APPROVED.SUBJECT;
      notificationTemplate.body = TEMPLATES.APPROVED.BODY;
      return notificationTemplate;
    case TEMPLATES.REVIEW_UNASSIGNED.ID:
      notificationTemplate.subject = TEMPLATES.REVIEW_UNASSIGNED.SUBJECT;
      notificationTemplate.body = TEMPLATES.REVIEW_UNASSIGNED.BODY;
      return notificationTemplate;
    case TEMPLATES.EXPIRATION_REMINDER.ID:
      notificationTemplate.subject = TEMPLATES.EXPIRATION_REMINDER.SUBJECT;
      notificationTemplate.body = TEMPLATES.EXPIRATION_REMINDER.BODY;
      return notificationTemplate;
    case TEMPLATES.EXPIRED.ID:
      notificationTemplate.subject = TEMPLATES.EXPIRED.SUBJECT;
      notificationTemplate.body = TEMPLATES.EXPIRED.BODY;
      return notificationTemplate;
    case TEMPLATES.RESUBMITTED.ID:
      notificationTemplate.subject = TEMPLATES.RESUBMITTED.SUBJECT;
      notificationTemplate.body = TEMPLATES.RESUBMITTED.BODY;
      return notificationTemplate;
    case TEMPLATES.RETURN_TO_REPORTER.ID:
      notificationTemplate.subject = TEMPLATES.RETURN_TO_REPORTER.SUBJECT;
      notificationTemplate.body = TEMPLATES.RETURN_TO_REPORTER.BODY;
      return notificationTemplate;
    case TEMPLATES.NEW_PROJECT_WITHOUT_DISCLOSURE.ID:
      notificationTemplate.subject = TEMPLATES.NEW_PROJECT_WITHOUT_DISCLOSURE.SUBJECT; // eslint-disable-line max-len
      notificationTemplate.body = TEMPLATES.NEW_PROJECT_WITHOUT_DISCLOSURE.BODY;
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
        const coreTemplateId = await createNewTemplate(
          dbInfo,
          hostname,
          template
        );
        template.core_template_id = coreTemplateId; //eslint-disable-line camelcase, max-len
        return cleanTemplate(template);
      }
      await updateTemplateData(dbInfo, hostname, template);
    }

    return cleanTemplate(template);
  });
}

export async function populateTemplateData(
  dbInfo,
  hostname,
  notificationTemplates
) {
  const templates = await getTemplates(dbInfo, hostname);
  return notificationTemplates.map(notificationTemplate => {
    const template = templates.find(t => {
      return (
        String(t.id) === String(notificationTemplate.coreTemplateId) ||
        t.displayName === createDisplayName(
          hostname,
          notificationTemplate.description
        )
      );
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
  const template = await ConfigDB.getCoreTemplateIdByTemplateId(
    knex,
    templateId
  );

  if (template.active === 0) {
    return;
  }

  return template;
}

async function getArchivedDisclosure(dbInfo, hostname, archiveId) {
  const knex = getKnex(dbInfo);
  const disclosure = await DisclosureDB.getArchivedDisclosureInfoForNotifications( // eslint-disable-line max-len
    knex,
    archiveId
  );
  try {
    disclosure.reporterInfo = await getUserInfo(
      dbInfo,
      hostname,
      disclosure.userId
    );
  } catch (err) {
    log.error(err);
  }

  return disclosure;
}

async function getDisclosure(dbInfo, hostname, disclosureId) {
  const knex = getKnex(dbInfo);

  const disclosure = await DisclosureDB.getDisclosureInfoForNotifications(
    knex,
    disclosureId
  );
  try {
    disclosure.reporterInfo = await getUserInfo(
      dbInfo,
      hostname,
      disclosure.userId
    );
  } catch (err) {
    log.error(err);
  }
  return disclosure;
}

async function getReviewer(dbInfo, hostname, reviewerId) {
  const knex = getKnex(dbInfo);
  const reviewer = await ReviewerDB.getAdditionalReviewer(knex, reviewerId);
  if (reviewer) {
    try {
      reviewer.reviewerInfo = await getUserInfo(
        dbInfo,
        hostname,
        reviewer.userId
      );
    } catch (err) {
      log.error(err);
    }
  }
  return reviewer;
}

async function getProject(dbInfo, hostname, project, person) {
  const knex = getKnex(dbInfo);
  const projectInfo = JSON.parse(JSON.stringify(project));
  projectInfo.type = await ConfigDB.getProjectTypeDescription(
    knex,
    project.typeCode
  );
  projectInfo.person = JSON.parse(JSON.stringify(person));
  projectInfo.person.info = await getUserInfo(
    dbInfo,
    hostname,
    person.personId
  );
  const pi = projectInfo.persons.find(p => p.roleCode === PI_ROLE_CODE);
  if (pi) {
    projectInfo.piInfo = await getUserInfo(dbInfo, hostname, pi.personId);
  }
  return projectInfo;
}

async function getProjectsInformation(dbinfo, knex, hostname, disclosure) {
  const projects = await ProjectDB.getActiveProjectsWithDeclarationsForUser(
    knex,
    disclosure.userId
  );
  const config = await ConfigDB.getConfig(dbinfo, knex, hostname);

  let dispositionHeader = '';
  if (config.general.dispositionsEnabled === true) {
    dispositionHeader = '<th>Project Disposition</th>';
  }
  let projectInformation = `
    <table>
      <tr style="text-align: left;">
        <th>Project Number</th>
        <th>Title</th>
        <th>Sponsors</th>
        <th>Project Type</th>
        ${dispositionHeader}
      </tr>
  `;
  for (const project of projects) {
    let sponsorString = '';
    project.sponsors.forEach(sponsor => {
      sponsorString += `${sponsor.sponsorName}, `;
    });
    sponsorString = sponsorString.replace(/, $/, '');

    const projectType = await ConfigDB.getProjectTypeDescription(
      knex,
      project.typeCd
    );

    let disposition = '';
    if (config.general.dispositionsEnabled) {
      const adminDisposition = await PIReviewDB.getAdminProjectDisposition(
        knex,
        project.id,
        disclosure.userId
      );

      let description = '';
      let dispositionType;
      if (adminDisposition) {
        dispositionType = config.dispositionTypes.find(
          type => type.typeCd === adminDisposition.dispositionTypeCd
        );
        if (dispositionType) {
          description = dispositionType.description;
        }
      }

      disposition = `<td>${description}</td>`;
    }

    projectInformation += `
      <tr>
        <td>${project.sourceIdentifier}</td>
        <td>${project.name}</td>
        <td>${sponsorString}</td>
        <td>${projectType}</td>
        ${disposition}
      </tr>
    `;
  }
  projectInformation += '</table>';
  return projectInformation;
}

async function getVariables(dbInfo, hostname, disclosure, reviewer, project) {
  const url = getRequestInfo(dbInfo, hostname).url;
  let variables = VariableService.getDefaultVariables(url);

  if (disclosure) {
    const knex = getKnex(dbInfo);
    const generalConfig = await ConfigDB.getGeneralConfig(knex);
    if (generalConfig.dispositionsEnabled) {
      disclosure.disposition = await DisclosureDB.getDisclosuresAdminDisposition( // eslint-disable-line max-len
        knex,
        disclosure.id
      );
    }
    variables = VariableService.getDisclosureVariables(
      disclosure,
      url,
      variables
    );
  }

  if (reviewer) {
    variables = VariableService.getReviewerVariables(reviewer, variables);
  }

  if (project) {
    variables = VariableService.getProjectVariables(project, variables);
  }

  return variables;
}

export async function createAndSendAdminNotification(
  dbInfo,
  hostname,
  authHeader,
  userInfo,
  disclosureId,
  templateId
) {
  const template = await getTemplate(dbInfo, templateId);

  if (!template) {
    return;
  }
  const disclosure = await getDisclosure(dbInfo, hostname, disclosureId);
  const variables = await getVariables(dbInfo, hostname, disclosure);
  const adminEmails = await getAdminRecipients(dbInfo, authHeader);
  const notification = createCoreNotification(
    template.coreTemplateId,
    variables,
    userInfo.id,
    adminEmails
  );
  return await sendNotification(dbInfo, hostname, notification);
}

export async function createAndSendSubmitNotification(
  dbInfo,
  hostname,
  authHeader,
  userInfo,
  disclosureId
) {
  return await createAndSendAdminNotification(
    dbInfo,
    hostname,
    authHeader,
    userInfo,
    disclosureId,
    TEMPLATES.SUBMITTED.ID
  );
}

export async function createAndSendResubmitNotification(
  dbInfo,
  hostname,
  authHeader,
  userInfo,
  disclosureId
) {
  return await createAndSendAdminNotification(
    dbInfo,
    hostname,
    authHeader,
    userInfo,
    disclosureId,
    TEMPLATES.RESUBMITTED.ID
  );
}

export async function createAndSendApproveNotification(
  dbInfo,
  knex,
  hostname,
  userInfo,
  archiveId
) {
  const template = await getTemplate(
    dbInfo,
    TEMPLATES.APPROVED.ID
  );
  if (!template) {
    return;
  }

  const disclosure = await getArchivedDisclosure(dbInfo, hostname, archiveId);
  let variables = await getVariables(dbInfo, hostname, disclosure);
  const projectInformation = await getProjectsInformation(
    dbInfo,
    knex,
    hostname,
    disclosure
  );
  variables = VariableService.addProjectInformation(
    projectInformation,
    variables
  );
  const recipients = getRecipients(dbInfo, disclosure.reporterInfo.email);
  const notification = createCoreNotification(
    template.coreTemplateId,
    variables,
    userInfo.id,
    recipients
  );
  return await sendNotification(dbInfo, hostname, notification);
}

export async function createAndSendExpirationNotification(
  dbInfo,
  hostname,
  disclosureId
) {
  return await createAndSendExpireNotification(
    dbInfo,
    hostname,
    disclosureId,
    TEMPLATES.EXPIRED.ID
  );
}

export async function createAndSendExpirationReminderNotification(
  dbInfo,
  hostname,
  disclosureId
) {
  return await createAndSendExpireNotification(
    dbInfo,
    hostname,
    disclosureId,
    TEMPLATES.EXPIRATION_REMINDER.ID
  );
}

export async function createAndSendExpireNotification(
  dbInfo,
  hostname,
  disclosureId,
  templateId
) {
  const template = await getTemplate(dbInfo, templateId);
  if (!template) {
    return;
  }
  const disclosure = await getDisclosure(dbInfo, hostname, disclosureId);
  const variables = await getVariables(dbInfo, hostname, disclosure);
  const recipients = getRecipients(dbInfo, disclosure.reporterInfo.email);
  const notification = createCoreNotification(
    template.coreTemplateId,
    variables,
    disclosure.reporterInfo.id,
    recipients
  );
  return await sendNotification(dbInfo, hostname, notification);
}

export async function createAndSendSentBackNotification(
  dbInfo,
  hostname,
  userInfo,
  disclosureId
) {
  const template = await getTemplate(
    dbInfo,
    TEMPLATES.SENT_BACK.ID
  );
  if (!template) {
    return;
  }
  const disclosure = await getDisclosure(dbInfo, hostname, disclosureId);
  const variables = await getVariables(dbInfo, hostname, disclosure);
  const recipients = getRecipients(dbInfo, disclosure.reporterInfo.email);
  const notification = createCoreNotification(
    template.coreTemplateId,
    variables,
    userInfo.id,
    recipients
  );
  return await sendNotification(dbInfo, hostname, notification);
}

export async function returnToReporterNotification(
  dbInfo,
  hostname,
  userInfo,
  disclosureId
) {
  const knex = getKnex(dbInfo);
  const template = await getTemplate(
    dbInfo,
    TEMPLATES.RETURN_TO_REPORTER.ID
  );
  if (!template) {
    return;
  }
  const disclosure = await getDisclosure(dbInfo, hostname, disclosureId);
  let variables = await getVariables(dbInfo, hostname, disclosure);
  const comment = await DisclosureDB.getGeneralComment(
    knex,
    userInfo,
    disclosureId
  );
  const returnReason = comment === undefined ? '' : comment.slice(-1)[0].text;
  variables = VariableService.addReturnedToReporterInformation(
    returnReason,
    variables
  );
  const recipients = getRecipients(dbInfo, disclosure.reporterInfo.email);
  const notification = createCoreNotification(
    template.coreTemplateId,
    variables,
    userInfo.id,
    recipients
  );
  return await sendNotification(dbInfo, hostname, notification);
}

export async function createAndSendReviewerNotification(
  dbInfo,
  hostname,
  userInfo,
  reviewerId,
  templateId
) {
  const template = await getTemplate(dbInfo, templateId);
  if (!template) {
    return;
  }

  const reviewer = await getReviewer(dbInfo, hostname, reviewerId);

  if (!reviewer) {
    return;
  }
  const disclosure = await getDisclosure(
    dbInfo,
    hostname,
    reviewer.disclosureId
  );
  const variables = await getVariables(dbInfo, hostname, disclosure, reviewer);
  const recipients = getRecipients(dbInfo, reviewer.email);
  const notification = createCoreNotification(
    template.coreTemplateId,
    variables,
    userInfo.id,
    recipients
  );
  return await sendNotification(dbInfo, hostname, notification);
}

export async function createAndSendReviewerAssignedNotification(
  dbInfo,
  hostname,
  userInfo,
  reviewerId
) {
  return await createAndSendReviewerNotification(
    dbInfo,
    hostname,
    userInfo,
    reviewerId,
    TEMPLATES.REVIEW_ASSIGNED.ID
  );
}

export async function createAndSendReviewerUnassignNotification(
  dbInfo,
  hostname,
  userInfo,
  reviewerId
) {
  return await createAndSendReviewerNotification(
    dbInfo,
    hostname,
    userInfo,
    reviewerId,
    TEMPLATES.REVIEW_UNASSIGNED.ID
  );
}

export async function createAndSendReviewCompleteNotification(
  dbInfo,
  hostname,
  authHeader,
  userInfo,
  reviewerId
) {
  const template = await getTemplate(
    dbInfo,
    TEMPLATES.REVIEW_COMPLETE.ID
  );
  if (!template) {
    return;
  }

  const reviewer = await getReviewer(dbInfo, hostname, reviewerId);

  if (!reviewer) {
    return;
  }
  const disclosure = await getDisclosure(
    dbInfo,
    hostname,
    reviewer.disclosureId
  );
  const variables = await getVariables(dbInfo, hostname, disclosure, reviewer);
  const recipients = await getAdminRecipients(dbInfo, authHeader);
  const notification = createCoreNotification(
    template.coreTemplateId,
    variables,
    userInfo.id,
    recipients
  );
  return await sendNotification(dbInfo, hostname, notification);
}

export async function sendNewProjectNotification(
  dbInfo,
  hostname,
  disclosureId,
  project,
  person
) {
  log.logArguments(
    'sendNewProjectNotification',
    {hostname, disclosureId, project, person}
  );

  let templateId;
  if (disclosureId) {
    templateId = TEMPLATES.NEW_PROJECT.ID;
  } else {
    templateId = TEMPLATES.NEW_PROJECT_WITHOUT_DISCLOSURE.ID;
  }

  const template = await getTemplate(dbInfo, templateId);
  if (!template) {
    return;
  }

  try {
    const projectInfo = await getProject(dbInfo, hostname, project, person);
    let disclosure;
    if (disclosureId) {
      disclosure = await getDisclosure(dbInfo, hostname, disclosureId);
    }
    const variables = await getVariables(
      dbInfo,
      hostname,
      disclosure,
      undefined,
      projectInfo
    );
    if (!disclosureId) {
      const reporterInfo = await getUserInfo(dbInfo, hostname, person.personId);
      if (reporterInfo) {
        VariableService.setReporterDetails(
          variables,
          reporterInfo.firstName,
          reporterInfo.lastName
        );
      }
    }

    const recipients = getRecipients(dbInfo, projectInfo.person.info.email);
    const notification = createCoreNotification(
      template.coreTemplateId,
      variables,
      projectInfo.person.info.id,
      recipients
    );
    return await sendNotification(dbInfo, hostname, notification);
  } catch (err) {
    log.error(err);
  }
}

const debounced = {};
export function createAndSendNewProjectNotification(
  dbInfo,
  hostname,
  userInfo,
  disclosureId,
  project,
  person
) {
  log.logArguments(
    'createAndSendNewProjectNotification',
    {hostname, userInfo, disclosureId, project, person}
  );

  if (debounced[`${person.sourceIdentifier}:${person.personId}`]) {
    clearTimeout(debounced[`${person.sourceIdentifier}:${person.personId}`]);
  }

  const timeoutId = setTimeout(() => {
    sendNewProjectNotification(
      dbInfo,
      hostname,
      disclosureId,
      project,
      person
    );
  }, 20000);
  debounced[`${person.sourceIdentifier}:${person.personId}`] = timeoutId;
}

export async function getNotificationReceiptDetail(dbInfo, hostname, id) {
  return await client.getNotificationReceiptDetail(dbInfo, hostname, id);
}
