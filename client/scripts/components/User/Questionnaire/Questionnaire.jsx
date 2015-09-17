import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {Question} from './Question';
import {Instructions} from '../Instructions';
import {COIConstants} from '../../../../../COIConstants';

export class Questionnaire extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.getAnswer = this.getAnswer.bind(this);
  }

  getAnswer(id) {
    let value = {};
    this.props.answers.forEach(answer => {
      if (answer.questionId === id) {
        value = answer.answer.value;
      }
    });
    return value;
  }

  renderMobile() {}

  renderDesktop() {
    let percentToSlide = 0;
    if (this.props.currentquestion) {
      const FULL_WIDTH_IN_PERCENT = 100;
      percentToSlide = (this.props.currentquestion - 1) * -FULL_WIDTH_IN_PERCENT;
    }

    let desktopStyles = {
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
    let styles = merge(this.commonStyles, desktopStyles);

    let questions = [];
    if (this.props.questions) {
      questions = this.props.questions.sort((a, b)=>{
        return a.question.order - b.question.order;
      }).map((question, index) => {
        return (
          <Question
            id={question.id}
            answer={this.getAnswer(question.id)}
            style={styles.question}
            number={index + 1}
            of={this.props.questions.length}
            text={question.question.text}
            disclosureid={this.props.disclosureid}
            key={index}
          />
        );
      });
    }

    let instructionText = window.config.instructions[COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE];
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
