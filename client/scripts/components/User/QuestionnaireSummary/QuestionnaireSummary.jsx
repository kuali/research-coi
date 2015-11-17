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
import {QuestionSummary} from './QuestionSummary';
import {Instructions} from '../Instructions';
import {COIConstants} from '../../../../../COIConstants';

export class QuestionnaireSummary extends React.Component {
  constructor() {
    super();

    this.getQuestion = this.getQuestion.bind(this);
  }

  getQuestion(questionId) {
    return this.props.questions.find((question) => {
      return question.id === questionId;
    });
  }

  render() {
    let styles = {
      container: {
        display: 'block',
        overflow: 'hidden'
      },
      summaryArea: {
        padding: '23px 29px',
        backgroundColor: 'white',
        margin: '35px 5px 3px 39px',
        boxShadow: '0 0 8px #AAA',
        borderRadius: 5
      },
      title: {
        fontWeight: 'bold',
        fontSize: 18
      }
    };

    let summaries = [];
    if (this.props.answers) {
      let questionAnswer = this.props.answers.map(a=>{
        a.question = this.getQuestion(a.questionId);
        return a;
      });

      let parents = [];
      let subs = [];

      questionAnswer.forEach(answer => {
        if (answer.question && !answer.question.parent) {
          parents.push(answer);
        } else if (answer.question) {
          subs.push(answer);
        }
      });

      parents.sort((a, b) => {
        return a.question.question.order - b.question.question.order;
      }).forEach((answer, index) => {
        summaries.push(
          <QuestionSummary
            answer={answer.answer.value}
            question={answer.question}
            index={index}
            key={'a' + answer.questionId}
          />
        );
        subs.filter(subAnswer => {
          return answer.question.id === subAnswer.question.parent;
        }).sort((a, b) => {
          return a.question.question.order - b.question.question.order;
        }).forEach((subAnswer) => {
          summaries.push(
            <QuestionSummary
              answer={subAnswer.answer.value}
              question={subAnswer.question}
              index={index}
              key={'sa' + subAnswer.questionId}
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
