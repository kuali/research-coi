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
import classNames from 'classnames';
import {formatDate} from '../../../../format-date';
import Question from '../question';
import { COI_ADMIN, ROLES } from '../../../../../../coi-constants';

export default function QuestionToReview({question, className}) {
  let commentSection;
  let icon;
  if (question.comments) {
    const comments = question.comments.map(comment => {
      const commentClasses = classNames(
        {[styles.piComment]: comment.userRole === ROLES.USER},
        styles.comment
      );

      const author = comment.userRole === ROLES.USER ? 'you' : COI_ADMIN;
      return (
        <div className={commentClasses} key={comment.id}>
          <div className={styles.commentTitle}>Comment from
            <span style={{marginLeft: 3}}>{author}</span>:
          </div>
          <div className={styles.commentText}>{comment.text}</div>
          <div className={styles.commentDate}>{formatDate(comment.date)}</div>
        </div>
      );
    });

    if (comments.length > 0) {
      commentSection = (
        <div className={styles.comments}>
          {comments}
        </div>
      );
    }

    if (question.reviewedOn !== null) {
      icon = (
        <i className={`fa fa-check-circle ${styles.completed}`} />
      );
    }
    else {
      icon = (
        <i className={`fa fa-exclamation-circle ${styles.incomplete}`} />
      );
    }
  }

  const questionDetails = question.question;
  const answer = question.answer;
  return (
    <div className={`flexbox row ${styles.container} ${className}`}>
      <span className={styles.statusIcon}>
        {icon}
      </span>
      <span className={styles.questionNumber}>
        {questionDetails.numberToShow}
      </span>

      <Question
        reviewId={question.reviewId}
        question={question}
        questionDetails={questionDetails}
        text={questionDetails.text}
        answer={answer ? answer.value : undefined}
        type={questionDetails.type}
        revised={question.revised}
        respondedTo={question.respondedTo}
        canRespond={question.comments !== undefined}
      />

      <span className={styles.commentSection}>
        {commentSection}
      </span>
    </div>
  );
}
