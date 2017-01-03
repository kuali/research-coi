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
import {formatDate} from '../../../../format-date';
import {DISCLOSURE_STEP, QUESTION_TYPE} from '../../../../../../coi-constants';
import {AdminActions} from '../../../../actions/admin-actions';

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

export default class QuestionSummary extends React.Component {
  constructor() {
    super();

    this.showComments = this.showComments.bind(this);
  }

  showComments() {
    AdminActions.showCommentingPanel(
      DISCLOSURE_STEP.QUESTIONNAIRE,
      this.props.question.id,
      `QUESTION ${this.props.question.numberToShow}`
    );
  }

  render() {
    const {
      question,
      commentCount,
      changedByPI,
      className,
      answer
    } = this.props;

    let commentLink;
    if (question.parent) {
      commentLink = (
        <span style={{width: 125}}>
          <span />
        </span>
      );
    }
    else {
      commentLink = (
        <span className={styles.commentLink} onClick={this.showComments}>
          <span className={styles.commentLabel}>
            COMMENT ({commentCount})
          </span>
        </span>
      );
    }

    const classes = classNames(
      styles.container,
      'flexbox',
      'row',
      className,
      {[styles.highlighted]: changedByPI}
    );

    return (
      <div className={classes}>
        <span
          className={question.parent ? styles.subQuestionNumber : styles.number}
        >
          <div>{question.numberToShow}</div>
        </span>
        <span className={'fill'} style={{display: 'inline-block'}}>
          <div className={styles.questionText}>{question.text}</div>
          <div className={'flexbox row'}>
            <span className={`fill ${styles.answerSection}`}>
              <div className={styles.answerLabel}>ANSWER:</div>
              <div className={styles.answer}>
                {formatAnswer(question.type, answer)}
              </div>
            </span>
            {commentLink}
          </div>
        </span>
      </div>
    );
  }
}
