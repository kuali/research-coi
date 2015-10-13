import React from 'react/addons'; //eslint-disable-line no-unused-vars
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
        <div>
          {this.props.question.question.text}
        </div>
        <div style={styles.controls}>
          {this.getControl(this.props.question, this.props.answer)}
        </div>
      </span>
    );
  }
}
