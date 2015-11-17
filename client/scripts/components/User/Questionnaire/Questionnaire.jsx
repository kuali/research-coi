/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import React from 'react'; //eslint-disable-line no-unused-vars
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
        whiteSpace: 'nowrap'
      },
      questionArea: {
        margin: '46px 0 0 50px',
        overflow: 'hidden',
        paddingBottom: '140px'
      },
      question: {
        width: '100%',
        whiteSpace: 'normal',
        verticalAlign: 'top'
      },
      slider: {
        transition: 'all .2s ease-in-out',
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
          <span key={index} style={{verticalAlign: 'top', width: '100%'}}>
            <Question
              id={question.id}
              answer={answer}
              style={styles.question}
              number={index + 1}
              of={parentQuestions.length}
              question={question}
              subQuestions={subQuestions}
              disclosureid={this.props.disclosureid}
              allQuestions={this.props.questions}
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
