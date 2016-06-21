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
import DeclarationsSummary from '../../read-only-declarations-summary';
import EntitiesSummary from '../../read-only-entities-summary';
import QuestionnaireSummary from '../../read-only-questionnaire-summary';
import getConfig from '../../../../get-config';

export default class ArchiveDetail extends React.Component {
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

    if (!disclosure || !disclosure.configId) {
      return null;
    }

    const config = getConfig(this.context.configState, disclosure.configId);
    if (config === null) {
      return null;
    }

    if (disclosure) {
      detail = (
        <div>
          <QuestionnaireSummary
            questions={config.questions.screening}
            answers={this.getAnswerMap(disclosure.answers)}
            className={`${styles.override} ${styles.questionnaire}`}
          />
          <EntitiesSummary
            entities={disclosure.entities}
            className={`${styles.override} ${styles.entities}`}
            questions={config.questions.entities}
          />
          <DeclarationsSummary
            declarations={disclosure.declarations}
            id={disclosure.id}
            configId={config.id}
            showDispositions={true}
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

ArchiveDetail.contextTypes = {
  configState: React.PropTypes.object
};
