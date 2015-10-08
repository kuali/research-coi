import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {QuestionSummary} from './QuestionSummary';
import {Instructions} from '../Instructions';
import {COIConstants} from '../../../../../COIConstants';

export class QuestionnaireSummary extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.getQuestion = this.getQuestion.bind(this);
  }

  getQuestion(questionId) {
    return this.props.questions.find((question) => {
      return question.id === questionId;
    });
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        display: 'block',
        overflow: 'hidden'
      },
      summaryArea: {
        padding: '23px 29px',
        backgroundColor: 'white',
        margin: '35px 5px 3px 39px',
        boxShadow: '0px 0px 3px 1px #CCC'
      },
      title: {
        fontWeight: 'bold',
        fontSize: 18
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let summaries = [];
    if (this.props.answers) {
      let questionAnswer = this.props.answers.map(a=>{
        a.question = this.getQuestion(a.questionId);
        return a;
      });

      let parents = [];
      let subs = [];

      questionAnswer.forEach(answer=>{
        if (answer.question && !answer.question.parent) {
          parents.push(answer);
        } else if (answer.question) {
          subs.push(answer);
        }
      });

      parents.sort((a, b)=>{
        return a.question.question.order - b.question.question.order;
      }).forEach((answer, index) => {
        summaries.push(
          <QuestionSummary
            answer={answer.answer.value}
            question={answer.question}
            index={index}
            key={'a' + answer.id}
          />
        );
        subs.filter(subAnswer=>{
          return answer.question.id === subAnswer.question.parent;
        }).sort((a, b)=>{
          return a.question.question.order - b.question.question.order;
        }).forEach((subAnswer) => {
          summaries.push(
            <QuestionSummary
              answer={subAnswer.answer.value}
              question={subAnswer.question}
              index={index}
              key={'sa' + subAnswer.id}
            />
          );
        });
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
      <span style={merge(styles.container, this.props.style)}>
        {instructions}

        <div style={styles.summaryArea}>
          <div style={styles.title}>
            Please review your questionnaire summary for accuracy before moving on:
          </div>
          {summaries}
        </div>
      </span>
    );
  }
}
