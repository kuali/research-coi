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

    this.state = {
      controlValid: {}
    };

    this.answer = this.answer.bind(this);
    this.answerAndSubmit = this.answerAndSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.submitMultiple = this.submitMultiple.bind(this);
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
    for (var key in this.state.controlValid) {
      if (this.state.controlValid[key] !== true) {
        return false;
      }
    }

    return true;
  }

  answerAndSubmit(answer, questionId, isParent) {
    let advance = isParent && !this.anySubQuestionsTriggeredBy(answer);
    DisclosureActions.submitQuestion({
      id: questionId,
      answer: {
        value: answer
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

  answer(answer, questionId) {
    DisclosureActions.answerQuestion({
      id: questionId,
      answer: {
        value: answer
      }
    });
  }

  answerMultiple(value, checked, questionId) {
    DisclosureActions.answerMultiple({
      id: questionId,
      answer: {
        value: value
      },
      checked: checked
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
    let newControlValid = this.state.controlValid;
    newControlValid[questionId] = isValid;
    this.setState({
      controlValid: newControlValid
    });
  }

  getControl(question, answer) {
    switch (question.question.type) {
      case COIConstants.QUESTION_TYPE.YESNO:
        return (
          <RadioControl
            options={['Yes', 'No']}
            answer={answer}
            onChange={question.parent ? this.answer : this.answerAndSubmit}
            isParent={!question.parent}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
      case COIConstants.QUESTION_TYPE.YESNONA:
        return (
          <RadioControl
            options={['Yes', 'No', 'N/A']}
            answer={answer}
            onChange={question.parent ? this.answer : this.answerAndSubmit}
            isParent={!question.parent}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
      case COIConstants.QUESTION_TYPE.TEXTAREA:
        return (
          <TextAreaControl
            answer={answer}
            onChange={this.answer}
            isParent={!question.parent}
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
            isParent={!question.parent}
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
            isParent={!question.parent}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
      case COIConstants.QUESTION_TYPE.DATE:
        return (
          <DateControl
            answer={answer}
            onChange={this.answerDate}
            isParent={!question.parent}
            questionId={question.id}
            onValidityChange={this.controlValidityChanged}
          />
        );
    }
  }

  render() {
    let styles = {
      container: {
        display: 'inline-block',
        padding: '0 1px',
        overflowX: 'hidden'
      },
      counter: {
        textAlign: 'right',
        fontSize: 17
      },
      controls: {
        marginTop: 10
      },
      nums: {
        fontSize: 38,
        marginLeft: 10,
        color: '#1481A3'
      },
      text: {
        fontSize: 20,
        lineHeight: '28px'
      },
      panel: {
        backgroundColor: 'white',
        borderRadius: 5,
        boxShadow: '0px 0px 3px 1px #CCC',
        zIndex: 2,
        position: 'relative',
        margin: 3
      },
      nextButton: {
        textAlign: 'right',
        borderTop: '1px solid #CCC',
        padding: '10px 20px'
      },
      topPanel: {
        padding: '25px 30px'
      },
      subQuestionPanel: {
        backgroundColor: 'white',
        border: '1px solid #CCC',
        margin: '-5px 3px 0 3px'
      },
      subQuestionContent: {
        padding: '25px 30px'
      },
      numberToShow: {
        color: '#1481A3',
        fontSize: 28,
        marginBottom: 10,
        fontWeight: 'bold'
      }
    };

    let isValid = this.questionIsValid();
    let subQuestions = [];
    this.props.subQuestions.filter(subQuestion => {
      return subQuestion.question.displayCriteria === this.props.answer;
    }).sort((a, b)=>{
      return a.question.order - b.question.order;
    }).forEach((subQuestion, index, array) => {
      let nextDiv;
      if (index === array.length - 1) {
        nextDiv = (
          <div style={styles.nextButton}>
            <NextButton onClick={this.next} isValid={isValid} />
          </div>
        );
      }

      subQuestions.push(
        <div key={index} style={styles.subQuestionPanel}>
          <div style={styles.subQuestionContent}>
            <div style={styles.numberToShow}>
              {subQuestion.question.numberToShow}
            </div>
            <div style={styles.text}>
              {subQuestion.question.text}
            </div>
            <div style={styles.controls}>
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
        <div style={styles.nextButton}>
          <NextButton onClick={this.next} isValid={isValid}/>
        </div>
      );
    }

    return (
      <span style={merge(styles.container, this.props.style)}>
        <div style={styles.panel}>
          <div style={styles.topPanel}>
            <div style={styles.text}>
              {this.props.question.question.text}
            </div>
            <div style={styles.controls}>
              {this.getControl(this.props.question, this.props.answer)}
              <div style={styles.counter}>
                QUESTION
                <span style={styles.nums}>
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
