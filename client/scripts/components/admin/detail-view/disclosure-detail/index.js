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

import styles from './style';
import React from 'react';
import {DisclosureDetailHeading} from '../disclosure-detail-heading';
import ActionButtons from '../action-buttons';
import {AdminQuestionnaireSummary} from '../admin-questionnaire-summary';
import {AdminEntitiesSummary} from '../admin-entities-summary';
import {AdminDeclarationsSummary} from '../admin-declarations-summary';
import ApprovalConfirmation from '../approval-confirmation';
import RejectionConfirmation from '../rejection-confirmation';
import {
  DISCLOSURE_STEP,
  FILE_TYPE,
  DISCLOSURE_STATUS
} from '../../../../../../coi-constants';
import classNames from 'classnames';

export function prepareScreeningQuestions(questions) {
  const active = questions.filter(question => question.active !== 0);

  const parents = active
    .filter(question => !question.parent)
    .sort((a, b) => a.question.order - b.question.order);

  const sortedQuestions = [];
  parents.forEach(parent => {
    sortedQuestions.push(parent);
    questions
      .filter(question => question.parent === parent.id)
      .sort((a, b) => a.question.order - b.question.order)
      .forEach(child => {
        sortedQuestions.push(child);
      });
  });

  return sortedQuestions.map(question => {
    return {
      id: question.id,
      parent: question.parent,
      order: question.question.order,
      numberToShow: question.question.numberToShow,
      text: question.question.text,
      type: question.question.type
    };
  });
}

export function prepareEntityQuestions(questions) {
  return questions
    .filter(question => question.active !== 0)
    .sort((a, b) => a.question.order - b.question.order)
    .map(question => {
      return {
        id: question.id,
        text: question.question.text,
        type: question.question.type
      };
    });
}

export class DisclosureDetail extends React.Component {
  constructor() {
    super();

    this.getResponses = this.getResponses.bind(this);
  }

  makeEntityMap() {
    const result = {};
    const entities = this.props.disclosure.entities;
    if (entities !== undefined) {
      entities.forEach(entity => {
        result[entity.id] = entity.name;
      });
    }

    return result;
  }

  getResponses(type) {
    let responses = [];
    if (this.props.piResponses && Array.isArray(this.props.piResponses)) {
      responses = this.props.piResponses.filter(response => {
        return response.targetType === type;
      });
    }

    return responses;
  }

  render() {
    const { disclosure } = this.props;
    let config;
    if (this.context.configState.config.id === disclosure.configId) {
      config = this.context.configState.config;
    } else if (this.context.configState.archivedConfigs[disclosure.configId]) {
      config = this.context.configState.archivedConfigs[disclosure.configId];
    } else {
      return null;
    }

    const entityNameMap = this.makeEntityMap();
    const screeningQuestions = prepareScreeningQuestions(
      config.questions.screening
    );
    const entityQuestions = prepareEntityQuestions(config.questions.entities);
    const screeningAnswers = {};
    disclosure.answers.forEach(answer => {
      screeningAnswers[answer.questionId] = answer.answer.value;
    });

    const { comments } = disclosure;
    const questionnaireComments = comments.filter(comment => {
      return comment.topicSection === DISCLOSURE_STEP.QUESTIONNAIRE;
    });
    const entitiesComments = comments.filter(comment => {
      return comment.topicSection === DISCLOSURE_STEP.ENTITIES;
    });
    const declarationsComments = comments.filter(comment => {
      return comment.topicSection === DISCLOSURE_STEP.PROJECTS;
    });
    const piComments = comments.filter(comment => comment.piVisible);

    const classes = classNames(
      'inline-flexbox',
      'column',
      styles.container,
      {[styles.showApproval]: this.props.showApproval},
      {[styles.showRejection]: this.props.showRejection}
    );

    const showAttachments = disclosure.files
      .some(file => file.fileType === FILE_TYPE.DISCLOSURE);

    const { statusCd } = disclosure;
    const readonly = statusCd === DISCLOSURE_STATUS.UP_TO_DATE ||
      statusCd === DISCLOSURE_STATUS.REVISION_REQUIRED ||
      statusCd === DISCLOSURE_STATUS.UPDATE_REQUIRED ||
      statusCd === DISCLOSURE_STATUS.EXPIRED;

    const declarationsWithoutDispositions = disclosure.declarations.filter(declaration => {
      return !declaration.dispositionTypeCd;
    });
    const showDispositionWarning =
      declarationsWithoutDispositions.length > 0 &&
      config.general.dispositionsEnabled;

    return (
      <div className={classes}>
        <DisclosureDetailHeading disclosure={disclosure} />
        <div className={`fill flexbox row ${styles.bottom}`}>
          <span className={`fill ${styles.detailsFromPI}`}>
            <AdminQuestionnaireSummary
              questions={screeningQuestions}
              answers={screeningAnswers}
              comments={questionnaireComments}
              className={`${styles.override} ${styles.questionnaire}`}
              piResponses={this.getResponses(DISCLOSURE_STEP.QUESTIONNAIRE)}
            />
            <AdminEntitiesSummary
              questions={entityQuestions}
              entities={disclosure.entities}
              comments={entitiesComments}
              className={`${styles.override} ${styles.entities}`}
              piResponses={this.getResponses(DISCLOSURE_STEP.ENTITIES)}
            />
            <AdminDeclarationsSummary
              entityNameMap={entityNameMap}
              declarations={disclosure.declarations}
              comments={declarationsComments}
              id={disclosure.id}
              className={`${styles.override} ${styles.declarations}`}
              piResponses={this.getResponses(DISCLOSURE_STEP.PROJECTS)}
              config={config}
              readonly={readonly}
            />
          </span>
          <span style={{display: 'inline-block'}}>
            <ApprovalConfirmation
              id={disclosure.id}
              showDispositionWarning={showDispositionWarning}
              className={`${styles.override} ${styles.confirmation}`}
            />
            <RejectionConfirmation
              id={disclosure.id}
              canReject={piComments.length > 0}
              className={`${styles.override} ${styles.rejection}`}
            />
            <ActionButtons
              className={`${styles.override} ${styles.actionButtons}`}
              showAttachments={showAttachments}
              role={this.props.role}
              readonly={readonly}
            />
          </span>
        </div>
      </div>
    );
  }
}

DisclosureDetail.contextTypes = {
  configState: React.PropTypes.object
};
