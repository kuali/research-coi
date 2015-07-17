import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {QuestionSummary} from './QuestionSummary';
import {Instructions} from '../Instructions';
import {COIConstants} from '../../../../../COIConstants';

export class QuestionnaireSummary extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        display: 'block',
        overflow: 'hidden'
      },
      summaryArea: {
        padding: '46px 0 0 50px'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let summaries;
    if (this.props.answers) {
      summaries = this.props.answers.map((answer, index) => {
        let thisQuestion = this.props.questions.find((question) => {
          return question.id == answer.id;
        });

        return (
          <QuestionSummary
            number={index} 
            text={thisQuestion.text}
            answer={answer.value}
            questionId={answer.id}
            key={answer.id}
          />
        );
      });
    }

    let instructionText = window.config.instructions[COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY];
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
          <div>Please review your questionnaire summary for accuracy before moving on:</div>
          {summaries}
        </div>
      </span>
    );  
  }
}