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
import {QUESTION_TYPE} from '../../../../coi-constants';
import {formatDate} from '../../format-date';
import EntityRelationshipSummary from '../entity-relationship-summary';

function getQuestionAnswer(questionId, entity, type) {
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

export default function EntitySummary(props) {
  const fields = props.questions.map(question => {
    return (
      <div key={`qa${question.id}`} style={{marginBottom: 8}}>
        <span className={styles.fieldLabel}>{question.question.text}</span>
        <span className={styles.fieldValue}>
          {getQuestionAnswer(question.id, props.entity, question.question.type)}
        </span>
      </div>
    );
  });

  const relationships = props.entity.relationships.map(relationship => {
    return (
      <EntityRelationshipSummary
        key={`rel${relationship.id}`}
        className={`${styles.override} ${styles.relationshipSummary}`}
        relationship={relationship}
        readonly={true}
      />
    );
  });

  const files = props.entity.files.map(file => {
    return (
      <div key={file.id} style={{marginBottom: 5}}>
        <a
          style={{
            color: window.colorBlindModeOn ? 'black' : '#0095A0',
            borderBottom: `1px dotted ${(window.colorBlindModeOn ? 'black' : '#0095A0')}`
          }}
          href={`/api/coi/files/${encodeURIComponent(file.id)}`}
        >
          {file.name}
        </a>
      </div>
    );
  });

  const classes = classNames(
    styles.container,
    {[styles.highlighted]: props.changedByPI},
    {[styles.entity]: !props.isLast},
    props.style
  );

  let attachmentSection;
  if (files.length > 0) {
    attachmentSection = (
      <div className={styles.bottomLeft}>
        <div className={styles.attachmentsLabel}>
          ATTACHMENTS
        </div>
        {files}
      </div>
    );
  }

  let commentsJsx;
  if (props.comments && props.comments.length > 0) {
    const individualComments = props.comments.map(comment => {
      return (
        <div key={comment.id} className={styles.comment}>
          {comment.author}:
          <span className={styles.commentText}>{comment.text}</span>
        </div>
      );
    });

    commentsJsx = (
      <div className={styles.commentSection}>
        <div className={styles.commentsLabel}>COMMENTS:</div>
        {individualComments}
      </div>
    );
  }

  return (
    <div className={classes}>
      <div className={styles.name}>{props.entity.name}</div>
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
        </div>
        {commentsJsx}
      </div>
    </div>
  );
}
