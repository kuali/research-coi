/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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

import styles from './style';
import React from 'react';
import {QuestionSummary} from '../question-summary';
import {Instructions} from '../../instructions';
import {COIConstants} from '../../../../../../coi-constants';

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
    const summaries = [];
    if (this.props.answers) {
      const questionAnswer = this.props.answers.map(a => {
        a.question = this.getQuestion(a.questionId);
        return a;
      });

      const parents = [];
      const subs = [];

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
            key={`a${answer.questionId}`}
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
              key={`sa${subAnswer.questionId}`}
            />
          );
        });
      });
    }

    const instructionText = window.config.general.instructions[COIConstants.INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE];
    const contentState = window.config.general.richTextInstructions ?
      window.config.general.richTextInstructions[COIConstants.INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE] :
      undefined;
    const instructions = (
      <Instructions
        text={instructionText}
        collapsed={!this.props.instructionsShowing[COIConstants.INSTRUCTION_STEP.SCREENING_QUESTIONNAIRE]}
        contentState={contentState}
      />
    );

    return (
      <span className={`${styles.container} ${this.props.className}`}>
        {instructions}

        <div className={styles.summaryArea}>
          <div className={styles.title}>
            Please review your questionnaire summary for accuracy before moving on:
          </div>
          {summaries}
        </div>
      </span>
    );
  }
}
