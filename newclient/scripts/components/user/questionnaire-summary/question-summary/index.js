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
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {QUESTION_TYPE} from '../../../../../../coi-constants';
import {formatDate} from '../../../../../scripts/format-date';

export class QuestionSummary extends React.Component {
  constructor() {
    super();

    this.reviewQuestion = this.reviewQuestion.bind(this);
  }

  reviewQuestion() {
    DisclosureActions.setCurrentQuestion(this.props.index + 1);
  }

  render() {
    let answer = this.props.answer;
    switch (this.props.question.question.type) {
      case QUESTION_TYPE.DATE:
        answer = formatDate(this.props.answer);
        break;
      case QUESTION_TYPE.MULTISELECT:
        if (this.props.answer.length > 1) {
          answer = this.props.answer.join(', ');
        }
    }

    const classes = classNames(
      {[styles.subquestion]: this.props.question.parent !== null},
      'flexbox',
      'row',
      styles.container,
      this.props.className
    );

    return (
      <div className={classes}>
        <span className={styles.counter}>
          <span className={styles.nums}>
            {this.props.question.question.numberToShow}
          </span>
        </span>

        <span className={`fill ${styles.question}`}>
          <div>{this.props.question.question.text}</div>
          <div style={{marginTop: 15}} className={'flexbox row'}>
            <span className={`fill ${styles.answer}`}>
              <span className={styles.answerLabel}>Answer: </span>
              <span style={{fontSize: 20}}>
                {answer}
              </span>
            </span>
            <span onClick={this.reviewQuestion}>
              <span className={styles.editlink}>&lt; EDIT</span>
            </span>
          </div>
        </span>
      </div>
    );
  }
}
