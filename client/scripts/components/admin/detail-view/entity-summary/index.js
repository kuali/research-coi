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
import classNames from 'classnames';
import React from 'react';
import {
  DISCLOSURE_STEP,
  COMMENT_TITLES,
  QUESTION_TYPE
} from '../../../../../../coi-constants';
import {formatDate} from '../../../../format-date';
import {AdminActions} from '../../../../actions/admin-actions';
import EntityRelationshipSummary from '../../../entity-relationship-summary';

export default class EntitySummary extends React.Component {
  constructor() {
    super();

    this.showComments = this.showComments.bind(this);
  }

  showComments() {
    AdminActions.showCommentingPanel(
      DISCLOSURE_STEP.ENTITIES,
      this.props.entity.id,
      `${COMMENT_TITLES.ENTITY} ${this.props.entity.name}`
    );
  }

  getQuestionAnswer(questionId, entity, type) {
    const theAnswer = entity.answers.find(answer => {
      return answer.questionId === questionId;
    });
    if (!theAnswer) {
      return '';
    }

    switch (type) {
      case QUESTION_TYPE.DATE:
        if (isNaN(theAnswer.answer.value)) {
          return theAnswer.answer.value;
        }

        return formatDate(theAnswer.answer.value);
      case QUESTION_TYPE.TEXTAREA:
        return (
          <div>
            {theAnswer.answer.value}
          </div>
        );
      case QUESTION_TYPE.MULTISELECT:
        if (Array.isArray(theAnswer.answer.value)) {
          const answers = theAnswer.answer.value.map((answer, index, array) => {
            let answerToShow = answer;
            if (index !== array.length - 1) {
              answerToShow += ', ';
            }
            return (
              <span key={`ans${questionId}${index}`}>{answerToShow}</span>
            );
          });

          return (
            <div>
              {answers}
            </div>
          );
        }

        return theAnswer.answer.value;
      default:
        return theAnswer.answer.value;
    }
  }

  render() {
    const fields = this.props.questions.map(question => {
      return (
        <div key={`qa${question.id}`} style={{marginBottom: 8}}>
          <span className={styles.fieldLabel}>{question.text}</span>
          <span className={styles.fieldValue}>{this.getQuestionAnswer(question.id, this.props.entity, question.type)}</span>
        </div>
      );
    });

    const relationships = this.props.entity.relationships.map(relationship => {
      return (
        <EntityRelationshipSummary
          key={`rel${relationship.id}`}
          className={`${styles.override} ${styles.relationshipSummary}`}
          relationship={relationship}
          readonly={true}
          configId={this.props.configId}
        />
      );
    });

    const files = this.props.entity.files.map(file => {
      return (
        <div key={file.id} style={{marginBottom: 5}}>
          <a style={
          {
            color: window.colorBlindModeOn ? 'black' : '#0095A0',
            borderBottom: `1px dotted ${window.colorBlindModeOn ? 'black' : '#0095A0'}`
          }}
            href={`/api/coi/files/${encodeURIComponent(file.id)}`}
          >
              {file.name}
          </a>
        </div>
      );
    });

    let attachmentSection;
    if (files.length > 0) {
      attachmentSection = (
        <div className={styles.bottomLeft}>
          <div style={{color: window.colorBlindModeOn ? 'black' : '#888', fontSize: 12}}>ATTACHMENTS</div>
          {files}
        </div>
      );
    }

    const classes = classNames(
      styles.container,
      {[styles.highlighted]: this.props.changedByPI},
      {[styles.entity]: !this.props.isLast},
      this.props.className,
      {[styles.files]: this.props.entity.files.length > 0}
    );

    return (
      <div className={classes}>
        <div className={styles.name}>{this.props.entity.name}</div>
        <div>
          <span className={styles.left}>
            {fields}
          </span>
          <span className={styles.relations}>
            <div className={styles.relationshipsLabel}>RELATIONSHIP(S)</div>
            {relationships}
          </span>
          <div className={styles.bottom}>
            {attachmentSection}
            <div className={styles.commentLink} onClick={this.showComments}>
              <span className={styles.commentLabel}>COMMENT ({this.props.commentCount})</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
