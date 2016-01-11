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

import styles from './style';
import classNames from 'classnames';
import React from 'react';
import DeclarationsSummary from '../DeclarationsSummary';
import EntitiesSummary from '../EntitiesSummary';
import QuestionnaireSummary from '../QuestionnaireSummary';

export default class extends React.Component {
  getAnswerMap(answers) {
    if (!answers || !Array.isArray(answers)) {
      return {};
    }

    return answers.reduce((theMap, answer) => {
      theMap[answer.questionId] = answer;
      return theMap;
    }, {});
  }

  render() {
    const disclosure = this.props.disclosure;
    let detail;
    if (disclosure) {
      detail = (
        <div>
          <QuestionnaireSummary
            questions={this.props.config.questions.screening}
            answers={this.getAnswerMap(disclosure.answers)}
            className={`${styles.override} ${styles.questionnaire}`}
          />
          <EntitiesSummary
            entities={disclosure.entities}
            className={`${styles.override} ${styles.entities}`}
            questions={this.props.config.questions.entities}
          />
          <DeclarationsSummary
            declarations={disclosure.declarations}
            projectTypes={this.props.config.projectTypes}
            declarationTypes={this.props.config.declarationTypes}
            id={disclosure.id}
          />
        </div>
      );
    }

    return (
      <div className={classNames(styles.container, this.props.className)}>
        {detail}
      </div>
    );
  }
}
