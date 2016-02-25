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
import QuestionToReview from '../question-to-review';

export default function QuestionnaireSection(props) {
  const questions = props.questions.map((question, index) => {
    return (
      <QuestionToReview
        key={question.id}
        question={question}
        className={classNames(
          styles.override,
          styles.question,
          {[styles.last]: index === props.questions.length - 1}
        )}
      />
    );
  });

  return (
    <div className={`${styles.container} ${props.className}`}>
      <div className={styles.title}>
        QUESTIONNAIRE
      </div>
      <div className={styles.body}>
        {questions}
      </div>
    </div>
  );
}
