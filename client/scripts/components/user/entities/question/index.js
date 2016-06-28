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
import {QUESTION_TYPE} from '../../../../../../coi-constants';
import {RadioControl} from '../radio-control';
import {TextAreaControl} from '../text-area-control';
import {NumericControl} from '../numeric-control';
import {DateControl} from '../date-control';
import {CheckboxControl} from '../checkbox-control';

export class Question extends React.Component {
  constructor() {
    super();

    this.onAnswer = this.onAnswer.bind(this);
    this.onAnswerMultiple = this.onAnswerMultiple.bind(this);
    this.getControl = this.getControl.bind(this);
  }

  onAnswer(newValue, questionId) {
    this.props.onAnswer(newValue, questionId);
  }

  onAnswerMultiple(value, checked, questionId) {
    let newAnswer;
    if (this.props.answer) {
      newAnswer = Array.from(this.props.answer);
    }
    else {
      newAnswer = [];
    }

    if (checked) {
      if (!newAnswer.includes(value)) {
        newAnswer.push(value);
      }
    }
    else {
      newAnswer = this.props.answer.filter(answer => {
        return answer !== value;
      });
    }

    this.props.onAnswer(newAnswer, questionId);
  }

  getControl(question, answer) {
    switch (question.question.type) {
      case QUESTION_TYPE.YESNO:
        return (
          <RadioControl
            readonly={this.props.readonly}
            options={['Yes', 'No']}
            answer={answer}
            onChange={this.onAnswer}
            questionId={question.id}
            invalid={this.props.invalid}
          />
        );
      case QUESTION_TYPE.YESNONA:
        return (
          <RadioControl
            readonly={this.props.readonly}
            options={['Yes', 'No', 'NA']}
            answer={answer}
            onChange={this.onAnswer}
            questionId={question.id}
            invalid={this.props.invalid}
          />
        );
      case QUESTION_TYPE.TEXTAREA:
        return (
          <TextAreaControl
            readonly={this.props.readonly}
            answer={answer}
            onChange={this.onAnswer}
            questionId={question.id}
            invalid={this.props.invalid}
          />
        );
      case QUESTION_TYPE.MULTISELECT:
        return (
          <CheckboxControl
            readonly={this.props.readonly}
            options={question.question.options}
            answer={answer}
            onChange={this.onAnswerMultiple}
            questionId={question.id}
            invalid={this.props.invalid}
          />
        );
      case QUESTION_TYPE.NUMBER:
        return (
          <NumericControl
            readonly={this.props.readonly}
            answer={answer}
            onChange={this.onAnswer}
            questionId={question.id}
            invalid={this.props.invalid}
          />
        );
      case QUESTION_TYPE.DATE:
        return (
          <DateControl
            readonly={this.props.readonly}
            answer={answer}
            onChange={this.onAnswer}
            questionId={question.id}
            invalid={this.props.invalid}
          />
        );
    }
  }

  render() {
    const classes = classNames(
      styles.container,
      {[styles.invalid]: this.props.invalid}
    );

    return (
      <span className={classes}>
        <label htmlFor={`eqa${this.props.question.id}`}>
          {this.props.question.question.text}
        </label>
        <div className={styles.controls}>
          {this.getControl(this.props.question, this.props.answer)}
        </div>
      </span>
    );
  }
}
