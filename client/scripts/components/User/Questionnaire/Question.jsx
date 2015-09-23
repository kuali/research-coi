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
import {NextButton} from './NextButton';

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
    this.getControl = this.getControl.bind(this);
    this.isSubQuestionForAnswer = this.isSubQuestionForAnswer.bind(this);
    this.submitSubQuestions = this.submitSubQuestions.bind(this);
  }

  answerAndSubmit(evt, questionId, isParent) {
    let advance = !this.isSubQuestionForAnswer(evt.target.value) && isParent;
    DisclosureActions.submitQuestion({id: questionId, answer: {value: evt.target.value}, advance: advance});
  }

  isSubQuestionForAnswer(value) {
    let subQuestion = this.props.subQuestions.find(question=>{
      return question.question.displayCriteria === value;
    });

    if (subQuestion) {
      return true;
    } else {
      return false;
    }
  }

  answer(evt, questionId) {
    DisclosureActions.answerQuestion({id: questionId, answer: {value: evt.target.value}});
  }

  answerMultiple(evt, questionId) {
    DisclosureActions.answerMultiple({id: questionId, answer: {value: evt.target.value}, checked: evt.target.checked});
  }

  submit(answer, questionId) {
    DisclosureActions.submitQuestion({id: questionId, answer: {value: answer}, advance: true});
  }

  submitMultiple(answer, questionId) {
    DisclosureActions.submitQuestion({id: questionId, answer: {value: answer}, advance: true});
  }

  answerDate(newDate, questionId) {
    DisclosureActions.submitQuestion({id: questionId, answer: {value: newDate}, advance: true});
  }

    submitSubQuestions() {
    this.props.subQuestions.forEach((subQuestion, index)=>{
      if (subQuestion.question.displayCriteria === this.props.answer) {
        let advance = this.props.subQuestions.length - 1 === index;
        DisclosureActions.submitQuestion({id: subQuestion.id, answer: {value: subQuestion.answer}, advance: advance});
      }
    });
  }

  getControl(question, answer) {
    switch (question.question.type) {
      case COIConstants.QUESTION_TYPE.YESNO:
        return (
        <RadioControl
        options={['Yes', 'No']}
        answer={answer}
        onChange={this.answerAndSubmit}
        isParent={!question.parent}
        questionId={question.id}
        />
        );
      case COIConstants.QUESTION_TYPE.YESNONA:
        return (
        <RadioControl
        options={['Yes', 'No', 'NA']}
        answer={answer}
        onChange={this.answerAndSubmit}
        isParent={!question.parent}
        questionId={question.id}
        />
        );
      case COIConstants.QUESTION_TYPE.TEXTAREA:
        return (
        <TextAreaControl
        answer={answer}
        onChange={this.answer}
        onClick={this.submit}
        isValid={answer ? true : false}
        isParent={!question.parent}
        questionId={question.id}
        />
        );
      case COIConstants.QUESTION_TYPE.MULTISELECT:
        if (question.question.requiredNumSelections === '1') {
          return (
          <RadioControl
          options={question.question.options}
          answer={answer}
          onChange={this.answerAndSubmit}
          isParent={!question.parent}
          questionId={question.id}
          />
          );
        } else {
          let valid = answer && answer.length >= parseInt(question.question.requiredNumSelections);
          return (
          <CheckboxControl
          options={question.question.options}
          answer={answer}
          onChange={this.answerMultiple}
          onClick={this.submitMultiple}
          isValid={valid}
          isParent={!question.parent}
          questionId={question.id}
          />
          );
        }
        break;
      case COIConstants.QUESTION_TYPE.NUMBER:
        return (
        <NumericControl
        answer={answer}
        onChange={this.answer}
        onClick={this.submit}
        isValid={answer ? true : false}
        isParent={!question.parent}
        questionId={question.id}
        />
        );
      case COIConstants.QUESTION_TYPE.DATE:
        return (
        <DateControl
        answer={answer}
        onChange={this.answerDate}
        onClick={this.submit}
        isValid={answer ? true : false}
        isParent={!question.parent}
        questionId={question.id}
        />
        );
    }
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

    let isValid = true;
    let subQuestions = [];
    let nextButton = {};
    this.props.subQuestions.filter(subQuestion=>{
      return subQuestion.question.displayCriteria === this.props.answer;
    }).sort((a, b)=>{
      return a.question.order - b.question.order;
    }).forEach(subQuestion=>{
      subQuestions.push(
        <div style={{clear: 'both', marginTop: 40}}>
          <div style={{color: '#1481A3', fontSize: 28, marginBottom: 10}}>
            {subQuestion.question.numberToShow}
          </div>
          <div style={styles.text}>
            {subQuestion.question.text}
          </div>
          <div style={styles.controls}>
            {this.getControl(subQuestion, subQuestion.answer)}
          </div>
        </div>
      );

      if (!subQuestion.answer) {
        isValid = false;
      }

      nextButton = (
      <NextButton onClick={this.submitSubQuestions} isValid={isValid}/>
      );

    });

    return (
      <span style={merge(styles.container, this.props.style)}>
        <div style={styles.text}>
          {this.props.question.question.text}
        </div>
        <div style={styles.controls}>
          {this.getControl(this.props.question, this.props.answer)}
          <span style={styles.counter}>
            QUESTION
            <span style={styles.nums}>
              {this.props.number}/{this.props.of}
            </span>
          </span>
        </div>
        {subQuestions}
        {nextButton}
      </span>
    );
  }
}
