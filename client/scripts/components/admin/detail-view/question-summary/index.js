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
import {COIConstants} from '../../../../../../coi-constants';
import {AdminActions} from '../../../../actions/admin-actions';

export default class QuestionSummary extends React.Component {
  constructor() {
    super();

    this.showComments = this.showComments.bind(this);
  }

  showComments() {
    AdminActions.showCommentingPanel(
      COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE,
      this.props.question.id,
      `QUESTION ${this.props.question.numberToShow}`
    );
  }

  render() {
    let commentLink;
    if (this.props.question.parent) {
      commentLink = (
        <span style={{width: 125}}>
          <span>
          </span>
        </span>
      );
    }
    else {
      commentLink = (
        <span className={styles.commentLink} onClick={this.showComments}>
          <span className={styles.commentLabel}>
            COMMENT ({this.props.commentCount})
          </span>
        </span>
      );
    }

    const classes = classNames(
      styles.container,
      'flexbox',
      'row',
      this.props.className,
      {[styles.highlighted]: this.props.changedByPI}
    );

    return (
      <div className={classes}>
        <span className={this.props.question.parent ? styles.subQuestionNumber : styles.number}>
          <div>{this.props.question.numberToShow}</div>
        </span>
        <span className={'fill'} style={{display: 'inline-block'}}>
          <div style={{paddingRight: 125, fontSize: 14}}>{this.props.question.text}</div>
          <div className={'flexbox row'}>
            <span className={`fill ${styles.answerSection}`}>
              <div className={styles.answerLabel}>ANSWER:</div>
              <div className={styles.answer}>
                {this.props.question.type === COIConstants.QUESTION_TYPE.DATE ? formatDate(this.props.answer) : this.props.answer}
              </div>
            </span>
            {commentLink}
          </div>
        </span>
      </div>
    );
  }
}
