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
import CheckLink from '../check-link';
import PIReviewActions from '../../../../actions/pi-review-actions';
import {QUESTION_TYPE} from '../../../../../../coi-constants';
import {RadioControl} from '../../radio-control';
import {TextAreaControl} from '../../text-area-control';
import {CheckboxControl} from '../../checkbox-control';
import {NumericControl} from '../../numeric-control';
import {DateControl} from '../../date-control';
import {formatDate} from '../../../../format-date';

export default class Question extends React.Component {
  constructor(props) {
    super();

    this.state = {
      revising: false,
      responding: false,
      responded: props.respondedTo,
      revised: props.revised,
      isValid: true
    };

    this.revise = this.revise.bind(this);
    this.respond = this.respond.bind(this);
    this.done = this.done.bind(this);

    this.changeAnswer = this.changeAnswer.bind(this);
    this.answer = this.answer.bind(this);
    this.answerMultiple = this.answerMultiple.bind(this);
    this.controlValidityChanged = this.controlValidityChanged.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.revised !== this.props.revised) {
      this.setState({
        revised: newProps.revised
      });
    }
  }

  changeAnswer(newAnswer) {
    PIReviewActions.reviseScreeningQuestion(
      this.props.question.id,
      newAnswer
    );
    this.setState({
      revised: true
    });
  }

  answer(newAnswer, questionId) {
    const isParentQuestion = this.props.question.id === questionId;
    if (isParentQuestion) {
      PIReviewActions.deleteAnswers(questionId, newAnswer);
      this.changeAnswer(newAnswer);
    }
    else {
      PIReviewActions.reviseSubQuestion(questionId, newAnswer);
    }
  }

  answerMultiple(value, checked, questionId) {
    const isParentQuestion = this.props.question.id === questionId;
    if (isParentQuestion) {
      const {answer: answers = []} = this.props;
      let newAnswer = Array.from(answers);
      if (checked) {
        if (!newAnswer.includes(value)) {
          newAnswer.push(value);
        }
      }
      else {
        newAnswer = answers.filter(answer => answer !== value);
      }
      this.changeAnswer(newAnswer);
    }
    else {
      const questionBeingAnswered = this.props.question.subQuestions.find(subQuestion => {
        return subQuestion.id === questionId;
      });
      let newAnswer = [];
      if (questionBeingAnswered.answer.value) {
        newAnswer = Array.from(questionBeingAnswered.answer.value);
      }
      if (checked) {
        if (!newAnswer.includes(value)) {
          newAnswer.push(value);
        }
      }
      else {
        newAnswer = questionBeingAnswered.answer.value.filter(answer => {
          return answer !== value;
        });
      }
      PIReviewActions.reviseSubQuestion(questionId, newAnswer);
    }
  }

  controlValidityChanged(questionId, isValid) {
    this.setState({
      isValid
    });
  }

  getControl(question, answer) {
    const isSubQuestion = question.parent !== null;

    switch (question.question.type) {
      case QUESTION_TYPE.YESNO:
        return (
          <RadioControl
            options={['Yes', 'No']}
            answer={answer}
            onChange={this.answer}
            isParent={!isSubQuestion}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
      case QUESTION_TYPE.YESNONA:
        return (
          <RadioControl
            options={['Yes', 'No', 'N/A']}
            answer={answer}
            onChange={this.answer}
            isParent={!isSubQuestion}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
      case QUESTION_TYPE.TEXTAREA:
        return (
          <TextAreaControl
            answer={answer}
            onChange={this.answer}
            isParent={!isSubQuestion}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
      case QUESTION_TYPE.MULTISELECT:
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
      case QUESTION_TYPE.NUMBER:
        return (
          <NumericControl
            answer={answer}
            onChange={this.answer}
            isParent={!isSubQuestion}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
      case QUESTION_TYPE.DATE:
        return (
          <DateControl
            answer={answer}
            onChange={this.answer}
            isParent={!isSubQuestion}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
    }
  }

  revise() {
    this.setState({
      revising: true
    });
  }

  respond() {
    this.setState({
      responding: true
    });
  }

  done() {
    if (!this.state.isValid) {
      return;
    }

    const newState = {
      revising: false,
      responding: false
    };

    if (this.state.revising) {
      newState.revised = true;
    }
    else if (this.state.responding) {
      const textarea = this.refs.responseText;
      if (textarea.value.length > 0) {
        newState.responded = true;
        PIReviewActions.respond(this.props.reviewId, textarea.value);
      } else {
        newState.responded = false;
      }
    }

    this.setState(newState);
  }

  render() {
    let actions;
    if (this.state.revising || this.state.responding) {
      actions = (
        <span className={styles.actions}>
          <CheckLink
            checked={false}
            onClick={this.done}
            disabled={!this.state.isValid}
          >
            DONE
          </CheckLink>
        </span>
      );
    }
    else {
      let respondLink;
      if (this.props.canRespond) {
        respondLink = (
          <CheckLink checked={this.state.responded} onClick={this.respond}>
            RESPOND
          </CheckLink>
        );
      }
      actions = (
        <span className={styles.actions}>
          <CheckLink checked={this.state.revised} onClick={this.revise}>
            REVISE
          </CheckLink>
          {respondLink}
        </span>
      );
    }

    let responseText;
    if (this.state.responding) {
      let defaultText;
      if (this.props.question.piResponse) {
        defaultText = this.props.question.piResponse.text;
      }
      responseText = (
        <div>
          <textarea
            aria-label="Response"
            ref="responseText"
            className={styles.responseText}
            defaultValue={defaultText}
          />
        </div>
      );
    }

    let answerArea;
    if (this.state.revising) {
      answerArea = (
        <div>
          {this.getControl(this.props.question, this.props.answer)}
        </div>
      );
    }
    else if (this.props.type === QUESTION_TYPE.MULTISELECT) {
      const {answer = []} = this.props;
      answerArea = (
        <div>{answer.join(', ')}</div>
      );
    }
    else if (this.props.type === QUESTION_TYPE.DATE) {
      answerArea = (
        <div>{formatDate(this.props.answer)}</div>
      );
    }
    else {
      answerArea = (
        <div>{this.props.answer}</div>
      );
    }

    let relevantSubQuestions;
    if (this.props.question.subQuestions && this.props.question.subQuestions.length > 0) {
      relevantSubQuestions = this.props.question.subQuestions
        .filter(subQuestionToTest => {
          return subQuestionToTest.question.displayCriteria === this.props.answer;
        })
        .sort((a, b) => {
          return a.question.order - b.question.order;
        })
        .map(subQuestion => {
          let answerValue;
          if (subQuestion.answer !== null) {
            answerValue = subQuestion.answer.value;
          }
          if (subQuestion.question.type === QUESTION_TYPE.DATE) {
            answerValue = formatDate(answerValue);
          }
          if (this.state.revising) {
            return (
              <div className={'flexbox row'} key={subQuestion.id} style={{margin: '10px 0', borderTop: '1px solid #CCC', padding: '13px 0px'}}>
                <span style={{width: 70, fontSize: 22, verticalAlign: 'top'}}>
                  <div>{subQuestion.question.numberToShow}</div>
                </span>
                <span className={'fill'}>
                  <div style={{marginBottom: 10}}>{subQuestion.question.text}</div>
                  <div className={styles.answerLabel}>ANSWER</div>
                  {this.getControl(subQuestion, answerValue)}
                </span>
              </div>
            );
          }

          let subQuestionAnswer;
          if (Array.isArray(answerValue)) {
            subQuestionAnswer = (
              <div>{answerValue.join(', ')}</div>
            );
          }
          else {
            subQuestionAnswer = (
              <div>{answerValue}</div>
            );
          }
          return (
            <div className={'flexbox row'} key={subQuestion.id} style={{margin: '10px 0', borderTop: '1px solid #CCC', padding: '13px 0px'}}>
              <span style={{width: 70, fontSize: 22, verticalAlign: 'top'}}>
                <div>{subQuestion.question.numberToShow}</div>
              </span>
              <span className={'fill'}>
                <div style={{marginBottom: 10}}>{subQuestion.question.text}</div>
                <div className={styles.answerLabel}>ANSWER</div>
                {subQuestionAnswer}
              </span>
            </div>
          );
        }
      );
    }

    return (
      <span className={`fill ${styles.container} ${this.props.className}`}>
        <div className={styles.text}>
          {this.props.text}
        </div>
        <div>
          <span style={{display: 'inline-block'}}>
            <div className={styles.answerLabel}>ANSWER</div>
            {answerArea}
          </span>
        </div>
        {relevantSubQuestions}
        {responseText}
        <div>
          {actions}
        </div>
      </span>
    );
  }
}
