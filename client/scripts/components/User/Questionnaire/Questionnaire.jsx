import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {Question} from './Question';
import {Instructions} from '../Instructions';
import {COIConstants} from '../../../../../COIConstants';

export class Questionnaire extends React.Component {
  constructor() {
    super();

    this.getAnswer = this.getAnswer.bind(this);
  }

  getAnswer(id) {
    let answer = this.props.answers.find(a => {
      return a.questionId === id;
    });
    if (answer) {
      return answer.answer.value;
    }
  }

  render() {
    let percentToSlide = 0;
    if (this.props.currentquestion) {
      const FULL_WIDTH_IN_PERCENT = 100;
      percentToSlide = (this.props.currentquestion - 1) * -FULL_WIDTH_IN_PERCENT;
    }

    let styles = {
      container: {
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      },
      questionArea: {
        margin: '46px 0 0 50px',
        overflow: 'hidden'
      },
      question: {
        width: '100%',
        whiteSpace: 'normal',
        verticalAlign: 'top'
      },
      slider: {
        transition: 'all .3s ease-in-out',
        transform: 'translateX(' + percentToSlide + '%)'
      }
    };

    let questions = [];

    if (this.props.questions) {
      let parentQuestions = this.props.questions.filter(question=>{
        return !question.parent;
      });

      questions = parentQuestions.sort((a, b)=>{
        return a.question.order - b.question.order;
      }).map((question, index) => {
        let answer = this.getAnswer(question.id);
        let subQuestions = [];
        if (question.question.type === COIConstants.QUESTION_TYPE.YESNO) {
          subQuestions = this.props.questions.filter(subQuestion =>{
            return subQuestion.parent === question.id;
          }).map(subQuestion => {
            subQuestion.answer = this.getAnswer(subQuestion.id);
            return subQuestion;
          });
        }

        return (
          <span key={index}>
            <Question
              id={question.id}
              answer={answer}
              style={styles.question}
              number={index + 1}
              of={parentQuestions.length}
              question={question}
              subQuestions={subQuestions}
              disclosureid={this.props.disclosureid}
            />
          </span>
        );
      });
    }

    let instructionText = window.config.general.instructions[COIConstants.INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE];
    let instructions = (
      <Instructions
        text={instructionText}
        collapsed={!this.props.instructionsShowing}
      />
    );

    return (
      <div style={merge(styles.container, this.props.style)}>
        {instructions}

        <div style={styles.questionArea}>
          <div style={styles.slider}>
            {questions}
          </div>
        </div>
      </div>
    );
  }
}
