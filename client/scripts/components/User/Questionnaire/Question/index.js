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
import {DisclosureActions} from '../../../../actions/DisclosureActions';
import {COIConstants} from '../../../../../../COIConstants';
import {RadioControl} from '../../RadioControl';
import {TextAreaControl} from '../../TextAreaControl';
import {NumericControl} from '../../NumericControl';
import {DateControl} from '../../DateControl';
import {CheckboxControl} from '../../CheckboxControl';
import {NextButton} from '../NextButton';

export class Question extends React.Component {
  constructor() {
    super();

    this.state = {
      controlValid: {}
    };

    this.answer = this.answer.bind(this);
    this.answerAndSubmit = this.answerAndSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.answerMultiple = this.answerMultiple.bind(this);
    this.answerDate = this.answerDate.bind(this);
    this.getControl = this.getControl.bind(this);
    this.anySubQuestionsTriggeredBy = this.anySubQuestionsTriggeredBy.bind(this);
    this.submitSubQuestions = this.submitSubQuestions.bind(this);
    this.next = this.next.bind(this);
    this.controlValidityChanged = this.controlValidityChanged.bind(this);
    this.questionIsValid = this.questionIsValid.bind(this);
  }

  questionIsValid() {
    for (const key in this.state.controlValid) {
      if (this.state.controlValid[key] !== true) {
        return false;
      }
    }

    return true;
  }

  deleteIrrelaventAnswers(questionId, newAnswer) {
    const toDelete = this.props.allQuestions.filter(question => {
      return question.parent === questionId;
    }).filter(question => {
      return question.question.displayCriteria !== newAnswer;
    }).map(question => {
      return question.id;
    });

    DisclosureActions.deleteAnswersTo(toDelete);
  }

  answerAndSubmit(answer, questionId, isParent) {
    this.deleteIrrelaventAnswers(questionId, answer);
    const advance = isParent && !this.anySubQuestionsTriggeredBy(answer);
    DisclosureActions.submitQuestion({
      id: questionId,
      answer: {
        value: answer
      },
      advance
    });
  }

  anySubQuestionsTriggeredBy(value) {
    const subQuestion = this.props.subQuestions.find(question => {
      return question.question.displayCriteria === value;
    });

    return subQuestion !== undefined;
  }

  answer(newAnswer, questionId) {
    DisclosureActions.answerQuestion({
      id: questionId,
      answer: {
        value: newAnswer
      }
    });
  }

  answerMultiple(value, checked, questionId) {
    DisclosureActions.answerMultiple({
      id: questionId,
      answer: {
        value
      },
      checked
    });
  }

  submit(answer, questionId) {
    DisclosureActions.submitQuestion({
      id: questionId,
      answer: {
        value: answer
      },
      advance: true
    });
  }

  answerDate(newDate, questionId) {
    DisclosureActions.submitQuestion({
      id: questionId,
      answer: {
        value: newDate
      }
    });
  }

  next() {
    this.submit(this.props.answer, this.props.id);
    this.submitSubQuestions();
  }

  submitSubQuestions() {
    this.props.subQuestions.forEach(subQuestion => {
      if (subQuestion.question.displayCriteria === this.props.answer) {
        DisclosureActions.submitQuestion({
          id: subQuestion.id,
          answer: {
            value: subQuestion.answer
          }
        });
      }
    });
  }

  controlValidityChanged(questionId, isValid) {
    const newControlValid = this.state.controlValid;
    newControlValid[questionId] = isValid;
    this.setState({
      controlValid: newControlValid
    });
  }

  getControl(question, answer) {
    const isSubQuestion = question.parent !== null;

    switch (question.question.type) {
      case COIConstants.QUESTION_TYPE.YESNO:
        return (
          <RadioControl
            options={['Yes', 'No']}
            answer={answer}
            onChange={isSubQuestion ? this.answer : this.answerAndSubmit}
            isParent={!isSubQuestion}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
      case COIConstants.QUESTION_TYPE.YESNONA:
        return (
          <RadioControl
            options={['Yes', 'No', 'N/A']}
            answer={answer}
            onChange={isSubQuestion ? this.answer : this.answerAndSubmit}
            isParent={!isSubQuestion}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
      case COIConstants.QUESTION_TYPE.TEXTAREA:
        return (
          <TextAreaControl
            answer={answer}
            onChange={this.answer}
            isParent={!isSubQuestion}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
      case COIConstants.QUESTION_TYPE.MULTISELECT:
        return (
          <CheckboxControl
            options={question.question.options}
            answer={answer}
            onChange={this.answerMultiple}
            isParent={!isSubQuestion}
            questionId={question.id}
            required={parseInt(question.question.requiredNumSelections)}
            onValidityChange={this.controlValidityChanged}
          />
        );
      case COIConstants.QUESTION_TYPE.NUMBER:
        return (
          <NumericControl
            answer={answer}
            onChange={this.answer}
            isParent={!isSubQuestion}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
      case COIConstants.QUESTION_TYPE.DATE:
        return (
          <DateControl
            answer={answer}
            onChange={this.answerDate}
            isParent={!isSubQuestion}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
            direction={isSubQuestion ? 'Up' : undefined}
          />
        );
    }
  }

  render() {
    let isValid = this.questionIsValid();
    const subQuestions = [];
    this.props.subQuestions.filter(subQuestion => {
      return subQuestion.question.displayCriteria === this.props.answer;
    }).sort((a, b) => {
      return a.question.order - b.question.order;
    }).forEach((subQuestion, index, array) => {
      let nextDiv;
      if (index === array.length - 1) {
        nextDiv = (
          <div className={styles.nextButton}>
            <NextButton onClick={this.next} isValid={isValid} />
          </div>
        );
      }

      subQuestions.push(
        <div key={index} className={styles.subQuestionPanel}>
          <div className={styles.subQuestionContent}>
            <div className={styles.numberToShow}>
              {subQuestion.question.numberToShow}
            </div>
            <label htmlFor={`qn${subQuestion.id}`} className={styles.text}>
              {subQuestion.question.text}
            </label>
            <div className={styles.controls}>
              {this.getControl(subQuestion, subQuestion.answer)}
            </div>
          </div>
          {nextDiv}
        </div>
      );

      if (!subQuestion.answer) {
        isValid = false;
      }
    });

    let nextButton;
    if (
      subQuestions.length === 0 && (
        this.props.question.question.type !== COIConstants.QUESTION_TYPE.YESNO &&
        this.props.question.question.type !== COIConstants.QUESTION_TYPE.YESNONA
      )
    ) {
      nextButton = (
        <div className={styles.nextButton}>
          <NextButton onClick={this.next} isValid={isValid}/>
        </div>
      );
    }

    return (
      <span className={`${styles.container} ${this.props.className}`}>
        <div className={styles.panel}>
          <div className={styles.topPanel}>
            <label htmlFor={`qn${this.props.question.id}`} className={styles.text}>
              {this.props.question.question.text}
            </label>
            <div className={styles.controls}>
              {this.getControl(this.props.question, this.props.answer)}
              <div className={styles.counter}>
                QUESTION
                <span className={styles.nums}>
                  {this.props.number}/{this.props.of}
                </span>
              </div>
            </div>
          </div>

          {nextButton}
        </div>

        {subQuestions}
      </span>
    );
  }
}
