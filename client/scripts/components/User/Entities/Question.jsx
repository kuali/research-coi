import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {COIConstants} from '../../../../../COIConstants';
import {RadioControl} from './RadioControl';
import {TextAreaControl} from './TextAreaControl';
import {NumericControl} from './NumericControl';
import {DateControl} from './DateControl';
import {CheckboxControl} from './CheckboxControl';

export class Question extends React.Component {
  constructor() {
    super();

    this.answer = this.answer.bind(this);
    this.answerDate = this.answerDate.bind(this);
    this.answerMultiple = this.answerMultiple.bind(this);
    this.getControl = this.getControl.bind(this);
  }

  answer(evt, questionId) {
    DisclosureActions.answerEntityQuestion({entityId: this.props.entityId, id: questionId, answer: {value: evt.target.value}});
  }

  answerDate(newDate, questionId) {
    DisclosureActions.answerEntityQuestion({entityId: this.props.entityId, id: questionId, answer: {value: newDate}});
  }

  answerMultiple(evt, questionId) {
    DisclosureActions.answerEntityMultiple({entityId: this.props.entityId, id: questionId, answer: {value: evt.target.value}, checked: evt.target.checked});
  }

  getControl(question, answer) {
    switch (question.question.type) {
      case COIConstants.QUESTION_TYPE.YESNO:
        return (
        <RadioControl
          readonly={this.props.readonly}
          options={['Yes', 'No']}
          answer={answer}
          onChange={this.answer}
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
          onChange={this.answer}
          questionId={question.id}
          invalid={this.props.invalid}
        />
        );
      case COIConstants.QUESTION_TYPE.TEXTAREA:
        return (
        <TextAreaControl
          readonly={this.props.readonly}
          answer={answer}
          onChange={this.answer}
          questionId={question.id}
          invalid={this.props.invalid}
        />
        );
      case COIConstants.QUESTION_TYPE.MULTISELECT:
        if (question.question.requiredNumSelections.toString() === '1') {
          return (
          <RadioControl
            readonly={this.props.readonly}
            options={question.question.options}
            answer={answer}
            onChange={this.answer}
            questionId={question.id}
            invalid={this.props.invalid}
          />
          );
        } else {
          return (
          <CheckboxControl
            readonly={this.props.readonly}
            options={question.question.options}
            answer={answer}
            onChange={this.answerMultiple}
            questionId={question.id}
            invalid={this.props.invalid}
          />
          );
        }
        break;
      case COIConstants.QUESTION_TYPE.NUMBER:
        return (
        <NumericControl
          readonly={this.props.readonly}
          answer={answer}
          onChange={this.answer}
          questionId={question.id}
          invalid={this.props.invalid}
        />
        );
      case COIConstants.QUESTION_TYPE.DATE:
        return (
        <DateControl
          readonly={this.props.readonly}
          answer={answer}
          onChange={this.answerDate}
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
