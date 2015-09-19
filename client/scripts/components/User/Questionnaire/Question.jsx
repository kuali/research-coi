import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {COIConstants} from '../../../../../COIConstants';
import {RadioControl} from './RadioControl';
import {TextAreaControl} from './TextAreaControl';
import {NumericControl} from './NumericControl';
import {DateControl} from './DateControl';
import {CheckboxControl} from './CheckboxControl';

export class Question extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.answer = this.answer.bind(this);
    this.answerAndSubmit = this.answerAndSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.submitMultiple = this.submitMultiple.bind(this);
    this.answerMultiple = this.answerMultiple.bind(this);
    this.answerDate = this.answerDate.bind(this);
  }

  answerAndSubmit(evt) {
    DisclosureActions.submitQuestion({id: this.props.id, answer: {value: evt.target.value}});
    DisclosureActions.advanceQuestion();
  }

  answer(evt) {
    DisclosureActions.answerQuestion({id: this.props.id, answer: {value: evt.target.value}});
  }

  answerMultiple(evt) {
    DisclosureActions.answerMultiple({id: this.props.id, answer: {value: evt.target.value}, checked: evt.target.checked});
  }

  submit() {
    DisclosureActions.submitQuestion({id: this.props.id, answer: {value: this.props.answer}});
    DisclosureActions.advanceQuestion();
  }

  submitMultiple() {
    DisclosureActions.submitQuestion({id: this.props.id, answer: {value: this.props.answer}});
    DisclosureActions.advanceQuestion();
  }

  answerDate(newDate) {
    DisclosureActions.submitQuestion({id: this.props.id, answer: {value: newDate}});
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        display: 'inline-block',
        padding: 1
      },
      counter: {
        'float': 'right',
        fontSize: 17,
        marginTop: 30
      },
      controls: {
        marginTop: 20
      },
      nums: {
        fontSize: 38,
        marginLeft: 10,
        color: '#1481A3'
      },
      text: {
        fontSize: 20,
        lineHeight: '28px'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let control = {};
    switch (this.props.question.question.type) {
      case COIConstants.QUESTION_TYPE.YESNO:
        control = (
          <RadioControl
            options={['Yes', 'No']}
            answer={this.props.answer}
            onChange={this.answerAndSubmit}/>
        );
        break;
      case COIConstants.QUESTION_TYPE.YESNONA:
        control = (
          <RadioControl
            options={['Yes', 'No', 'NA']}
            answer={this.props.answer}
            onChange={this.answerAndSubmit}/>
        );
        break;
      case COIConstants.QUESTION_TYPE.TEXTAREA:
        control = (
          <TextAreaControl
            answer={this.props.answer}
            onChange={this.answer}
            onClick={this.submit}
            isValid={this.props.answer ? true : false}/>
        );
        break;
      case COIConstants.QUESTION_TYPE.MULTISELECT:
        if (this.props.question.question.requiredNumSelections === '1') {
          control = (
            <RadioControl
              options={this.props.question.question.options}
              answer={this.props.answer}
              onChange={this.answerAndSubmit}/>
          );
        } else {
          let valid = this.props.answer && this.props.answer.length >= parseInt(this.props.question.question.requiredNumSelections);
          control = (
            <CheckboxControl
              options={this.props.question.question.options}
              answer={this.props.answer}
              onChange={this.answerMultiple}
              onClick={this.submitMultiple}
              isValid={valid} />
          );
        }
        break;
      case COIConstants.QUESTION_TYPE.NUMBER:
        control = (
          <NumericControl
            answer={this.props.answer}
            onChange={this.answer}
            onClick={this.submit}
            isValid={this.props.answer ? true : false}/>
        );
        break;
      case COIConstants.QUESTION_TYPE.DATE:
        control = (
          <DateControl
            answer={this.props.answer}
            onChange={this.answerDate}
            onClick={this.submit}
            isValid={this.props.answer ? true : false}/>
        );
        break;
    }

    return (
      <span style={merge(styles.container, this.props.style)}>
        <div style={styles.text}>
          {this.props.question.question.text}
        </div>
        <div style={styles.controls}>
          {control}
          <span style={styles.counter}>
            QUESTION
            <span style={styles.nums}>
              {this.props.number}/{this.props.of}
            </span>
          </span>
        </div>
      </span>
    );
  }
}
