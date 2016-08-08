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
import {formatDate} from '../../format-date';
import {QUESTION_TYPE} from '../../../../coi-constants';

function formatAnswer(type, answer) {
  switch (type) {
    case QUESTION_TYPE.DATE:
      return formatDate(answer);
    case QUESTION_TYPE.MULTISELECT:
      if (Array.isArray(answer)) {
        return answer.join(', ');
      }
      return answer;
    default:
      return answer;
  }
}

export default function QuestionSummary({className, question, answer, comments}) {
  let commentsJsx;
  if (comments && comments.length > 0) {
    let individualComments = comments.map(comment => {
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
    <div className={`${styles.container} flexbox row ${className}`}>
      <span
        className={question.parent ? styles.subQuestionNumber : styles.number}
      >
        <div>{question.question.numberToShow}</div>
      </span>
      <span className={'fill'} style={{display: 'inline-block'}}>
        <div style={{fontSize: 14}}>{question.question.text}</div>
        <div className={'flexbox row'}>
          <span className={`fill ${styles.answerSection}`}>
            <div className={styles.answerLabel}>ANSWER:</div>
            <div className={styles.answer}>
              {formatAnswer(question.question.type, answer)}
            </div>
          </span>
        </div>
        {commentsJsx}
      </span>
    </div>
  );
}
