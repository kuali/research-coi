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

import React from 'react'; //eslint-disable-line no-unused-vars
import {COIConstants} from '../../../../../COIConstants';
import {RadioControl} from './RadioControl';
import {TextAreaControl} from './TextAreaControl';
import {NumericControl} from './NumericControl';
import {DateControl} from './DateControl';
import {CheckboxControl} from './CheckboxControl';

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
      case COIConstants.QUESTION_TYPE.YESNO:
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
      case COIConstants.QUESTION_TYPE.YESNONA:
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
      case COIConstants.QUESTION_TYPE.TEXTAREA:
        return (
          <TextAreaControl
            readonly={this.props.readonly}
            answer={answer}
            onChange={this.onAnswer}
            questionId={question.id}
            invalid={this.props.invalid}
          />
        );
      case COIConstants.QUESTION_TYPE.MULTISELECT:
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
      case COIConstants.QUESTION_TYPE.NUMBER:
        return (
          <NumericControl
            readonly={this.props.readonly}
            answer={answer}
            onChange={this.onAnswer}
            questionId={question.id}
            invalid={this.props.invalid}
          />
        );
      case COIConstants.QUESTION_TYPE.DATE:
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
    let styles = {
      container: {
        display: 'inline-block',
        width: '90%',
        marginTop: 20,
        color: this.props.invalid ? 'red' : 'inherit'
      },
      counter: {
        'float': 'right',
        fontSize: 17,
        marginTop: 30
      },
      controls: {
        marginTop: 10
      }
    };

    return (
    <span style={styles.container}>
        <label htmlFor={`eqa${this.props.question.id}`}>
          {this.props.question.question.text}
        </label>
        <div style={styles.controls}>
          {this.getControl(this.props.question, this.props.answer)}
        </div>
      </span>
    );
  }
}
