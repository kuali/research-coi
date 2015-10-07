import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {COIConstants} from '../../../../../COIConstants';
import {RadioControl} from '../RadioControl';
import {TextAreaControl} from '../TextAreaControl';
import {NumericControl} from '../NumericControl';
import {DateControl} from '../DateControl';
import {CheckboxControl} from '../CheckboxControl';
import {NextButton} from './NextButton';

export class Question extends React.Component {
  constructor() {
    super();

    this.answer = this.answer.bind(this);
    this.answerAndSubmit = this.answerAndSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.submitMultiple = this.submitMultiple.bind(this);
    this.answerMultiple = this.answerMultiple.bind(this);
    this.answerDate = this.answerDate.bind(this);
    this.getControl = this.getControl.bind(this);
    this.anySubQuestionsTriggeredBy = this.anySubQuestionsTriggeredBy.bind(this);
    this.submitSubQuestions = this.submitSubQuestions.bind(this);
  }

  answerAndSubmit(evt, questionId, isParent) {
    let advance = isParent && !this.anySubQuestionsTriggeredBy(evt.target.value);
    DisclosureActions.submitQuestion({
      id: questionId,
      answer: {
        value: evt.target.value
      },
      advance: advance
    });
  }

  anySubQuestionsTriggeredBy(value) {
    let subQuestion = this.props.subQuestions.find(question => {
      return question.question.displayCriteria === value;
    });

    return subQuestion !== undefined;
  }

  answer(evt, questionId) {
    DisclosureActions.answerQuestion({
      id: questionId,
      answer: {
        value: evt.target.value
      }
    });
  }

  answerMultiple(evt, questionId) {
    DisclosureActions.answerMultiple({
      id: questionId,
      answer: {
        value: evt.target.value
      },
      checked: evt.target.checked
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

  submitMultiple(answer, questionId) {
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
      },
      advance: true
    });
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
            options={['Yes', 'No', 'N/A']}
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
        let valid = answer && answer.length >= parseInt(question.question.requiredNumSelections);
        return (
          <CheckboxControl
            options={question.question.options}
            answer={answer}
            onChange={this.answerMultiple}
            isValid={valid}
            isParent={!question.parent}
            questionId={question.id}
          />
        );
      case COIConstants.QUESTION_TYPE.NUMBER:
        return (
          <NumericControl
            answer={answer}
            onChange={this.answer}
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

  render() {
    let styles = {
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

    let isValid = true;
    let subQuestions = [];
    this.props.subQuestions.filter(subQuestion=>{
      return subQuestion.question.displayCriteria === this.props.answer;
    }).sort((a, b)=>{
      return a.question.order - b.question.order;
    }).forEach((subQuestion, index) => {
      subQuestions.push(
        <div key={index} style={{clear: 'both', marginTop: 40}}>
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
    });

    let nextButton;
    if (subQuestions.length > 0) {
      nextButton = (
       <NextButton onClick={this.submitSubQuestions} isValid={isValid}/>
      );
    }

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
