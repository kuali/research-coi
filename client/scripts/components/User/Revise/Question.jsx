import React from 'react/addons';
import {merge} from '../../../merge';
import CheckLink from './CheckLink';
import PIReviewActions from '../../../actions/PIReviewActions';
import {COIConstants} from '../../../../../COIConstants';
import {RadioControl} from '../RadioControl';
import {TextAreaControl} from '../TextAreaControl';
import {CheckboxControl} from '../CheckboxControl';
import {NumericControl} from '../NumericControl';
import {DateControl} from '../DateControl';

export default class Question extends React.Component {
  constructor() {
    super();

    this.state = {
      revising: false,
      responding: false,
      responded: false,
      revised: false,
      isValid: true
    };

    this.revise = this.revise.bind(this);
    this.respond = this.respond.bind(this);
    this.cancel = this.cancel.bind(this);
    this.done = this.done.bind(this);

    this.changeAnswer = this.changeAnswer.bind(this);
    this.answerParent = this.answerParent.bind(this);
    this.answer = this.answer.bind(this);
    this.answerMultiple = this.answerMultiple.bind(this);
    this.controlValidityChanged = this.controlValidityChanged.bind(this);
  }

  changeAnswer(newAnswer) {
    PIReviewActions.revise(this.props.reviewId, newAnswer);
  }

  // answerAndSubmit(evt) {
  //   this.changeAnswer(evt.target.value);
  // }

  deleteIrrelaventAnswers(questionId, newAnswer) {
    // let toDelete = this.props.allQuestions.filter(question => {
    //   return question.parent === questionId;
    // }).filter(question => {
    //   return question.question.displayCriteria !== newAnswer;
    // }).map(question => {
    //   return question.id;
    // });

    // DisclosureActions.deleteAnswersTo(toDelete);
  }

  answerParent(answer, questionId, isParent) {
    // this.deleteIrrelaventAnswers(questionId, answer);
    // let advance = isParent && !this.anySubQuestionsTriggeredBy(answer);
    // DisclosureActions.submitQuestion({
    //   id: questionId,
    //   answer: {
    //     value: answer
    //   },
    //   advance: advance
    // });
  }

  anySubQuestionsTriggeredBy(value) {
    // let subQuestion = this.props.subQuestions.find(question => {
    //   return question.question.displayCriteria === value;
    // });

    // return subQuestion !== undefined;
  }

  answer(answer, questionId) {
    this.changeAnswer(answer);
  }

  answerMultiple(value, checked) {
    let newAnswer = Array.from(this.props.answer);
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
    this.changeAnswer(newAnswer);
  }

  // submit(answer, questionId) {
    // DisclosureActions.submitQuestion({
    //   id: questionId,
    //   answer: {
    //     value: answer
    //   },
    //   advance: true
    // });
  // }

  answerDate(newDate, questionId) {
    this.changeAnswer(newDate);
  }

  controlValidityChanged(questionId, isValid) {
    this.setState({
      isValid: isValid
    });
  }

  getControl(question, answer) {
    let isSubQuestion = question.parent !== null;

    switch (question.question.type) {
      case COIConstants.QUESTION_TYPE.YESNO:
        return (
          <RadioControl
            options={['Yes', 'No']}
            answer={answer}
            onChange={isSubQuestion ? this.answer : this.answerParent}
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

  cancel() {
    this.setState({
      revising: false,
      responding: false
    });
  }

  done() {
    let newState = {
      revising: false,
      responding: false
    };

    if (this.state.revising) {
      newState.revised = true;
    }
    else if (this.state.responding) {
      newState.responded = true;
      let textarea = React.findDOMNode(this.refs.responseText);
      PIReviewActions.respond(this.props.reviewId, textarea.value);
    }

    this.setState(newState);
  }

  render() {
    let styles = {
      container: {
        marginRight: 25
      },
      answerLabel: {
        color: '#666',
        fontSize: 13
      },
      actions: {
        display: 'inline-block',
        float: 'right'
      },
      text: {
        marginBottom: 10,
        fontSize: 15
      },
      responseText: {
        width: '100%',
        height: 120,
        borderRadius: 5,
        border: '1px solid #AAA',
        margin: '10px 0',
        fontSize: 16,
        padding: '6px 8px',
        resize: 'none',
        backgroundColor: '#EEEEEE'
      }
    };

    let actions;
    if (this.state.revising || this.state.responding) {
      actions = (
        <span style={styles.actions}>
          <CheckLink checked={false} onClick={this.cancel}>CANCEL</CheckLink>
          <CheckLink checked={false} onClick={this.done} disabled={!this.state.isValid}>DONE</CheckLink>
        </span>
      );
    }
    else {
      actions = (
        <span style={styles.actions}>
          <CheckLink checked={this.state.revised} onClick={this.revise}>REVISE</CheckLink>
          <CheckLink checked={this.state.responded} onClick={this.respond}>RESPOND</CheckLink>
        </span>
      );
    }

    let responseText;
    if (this.state.responding) {
      responseText = (
        <div>
          <textarea ref="responseText" style={styles.responseText} />
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
    else {
      if (this.props.type === COIConstants.QUESTION_TYPE.MULTISELECT) {
        answerArea = (
          <div>{this.props.answer.join(', ')}</div>
        );
      }
      else {
        answerArea = (
          <div>{this.props.answer}</div>
        );
      }
    }

    return (
      <span style={merge(styles.container, this.props.style)} className="fill">
        <div style={styles.text}>
          {this.props.text}
        </div>
        <div>
          <span style={{display: 'inline-block'}}>
            <div style={styles.answerLabel}>ANSWER</div>
            {answerArea}
          </span>
        </div>
        {responseText}
        <div>
          {actions}
        </div>
      </span>
    );
  }
}
