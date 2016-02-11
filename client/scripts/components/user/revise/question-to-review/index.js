/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

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
import {formatDate} from '../../../../format-date';
import Question from '../question';

export default function QuestionToReview(props) {
  const comments = props.question.comments.map(comment => {
    return (
      <div className={styles.comment} key={comment.id}>
        <div className={styles.commentTitle}>Comment from
          <span style={{marginLeft: 3}}>{comment.author}</span>:
        </div>
        <div className={styles.commentText}>{comment.text}</div>
        <div className={styles.commentDate}>{formatDate(comment.date)}</div>
      </div>
    );
  });

  let icon;
  if (props.question.reviewedOn !== null) {
    icon = (
      <i className={`fa fa-check-circle ${styles.completed}`}></i>
    );
  }
  else {
    icon = (
      <i className={`fa fa-exclamation-circle ${styles.incomplete}`}></i>
    );
  }

  const questionDetails = props.question.question;
  const answer = props.question.answer;
  return (
    <div className={`flexbox row ${styles.container} ${props.className}`}>
      <span className={styles.statusIcon}>
        {icon}
      </span>
      <span className={styles.questionNumber}>
        {questionDetails.numberToShow}
      </span>

      <Question
        reviewId={props.question.reviewId}
        question={props.question}
        questionDetails={questionDetails}
        text={questionDetails.text}
        answer={answer.value}
        type={questionDetails.type}
        revised={props.question.revised}
        respondedTo={props.question.respondedTo}
      />

      <span className={styles.commentSection}>
        <div className={styles.comments}>
          {comments}
        </div>
      </span>
    </div>
  );
}
