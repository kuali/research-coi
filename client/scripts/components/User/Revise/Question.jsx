import React from 'react/addons';
import {merge} from '../../../merge';
import CheckLink from './CheckLink';
import PIReviewActions from '../../../actions/PIReviewActions';
import {COIConstants} from '../../../../../COIConstants';
import {RadioControl} from '../Questionnaire/RadioControl';
import {TextAreaControl} from '../Questionnaire/TextAreaControl';
import {CheckboxControl} from '../Questionnaire/CheckboxControl';
import {NumericControl} from '../Questionnaire/NumericControl';
import {DateControl} from '../Questionnaire/DateControl';

export default class Question extends React.Component {
  constructor() {
    super();

    this.state = {
      revising: false,
      responding: false,
      responded: false,
      revised: false
    };

    this.revise = this.revise.bind(this);
    this.respond = this.respond.bind(this);
    this.cancel = this.cancel.bind(this);
    this.done = this.done.bind(this);
  }

  getControl(question, answer) {
    switch (this.props.type) {
      case COIConstants.QUESTION_TYPE.YESNO:
        return (
          <RadioControl
            options={['Yes', 'No']}
            answer={answer}
            onChange={this.answerAndSubmit}
            isParent={true}
            questionId={this.props.id}
          />
        );
      case COIConstants.QUESTION_TYPE.YESNONA:
        return (
          <RadioControl
            options={['Yes', 'No', 'NA']}
            answer={answer}
            onChange={this.answerAndSubmit}
            isParent={true}
            questionId={this.props.id}
          />
        );
      case COIConstants.QUESTION_TYPE.TEXTAREA:
        return (
          <TextAreaControl
            answer={answer}
            onChange={this.answer}
            onClick={this.submit}
            isValid={answer ? true : false}
            isParent={true}
            questionId={this.props.id}
          />
        );
      case COIConstants.QUESTION_TYPE.MULTISELECT:
        if (question.question.requiredNumSelections === '1') {
          return (
            <RadioControl
              options={question.question.options}
              answer={answer}
              onChange={this.answerAndSubmit}
              isParent={true}
              questionId={this.props.id}
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
              isParent={true}
              questionId={this.props.id}
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
            isParent={true}
            questionId={this.props.id}
          />
        );
      case COIConstants.QUESTION_TYPE.DATE:
        return (
          <DateControl
            answer={answer}
            onChange={this.answerDate}
            onClick={this.submit}
            isValid={answer ? true : false}
            isParent={true}
            questionId={this.props.id}
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
          <CheckLink checked={false} onClick={this.done}>DONE</CheckLink>
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
          {this.getControl()}
        </div>
      );
    }
    else {
      answerArea = (
        <div>{this.props.answer}</div>
      );
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
