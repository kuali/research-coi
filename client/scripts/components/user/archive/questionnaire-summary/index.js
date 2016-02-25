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
import classNames from 'classnames';
import React from 'react';
import QuestionSummary from '../question-summary';

export default function QuestionnaireSummary(props) {
  let questions;
  if(props.questions !== undefined) {
    questions = props.questions.filter(question => {
      return props.answers[question.id] !== undefined;
    }).sort((a, b) => {
      return String(a.question.numberToShow).localeCompare(String(b.question.numberToShow));
    });
    questions = questions.map(question => {
      return (
        <QuestionSummary
          key={question.id}
          question={question}
          answer={props.answers[question.id].answer.value}
        />
      );
    });
  }

  return (
    <div className={classNames(styles.container, props.className)} >
      <div className={styles.heading}>QUESTIONNAIRE</div>
      <div className={styles.body}>
        {questions}
      </div>
    </div>
  );
}
