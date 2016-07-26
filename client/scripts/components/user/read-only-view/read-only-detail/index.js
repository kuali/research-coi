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
import DeclarationsSummary from '../../../read-only-declarations-summary';
import EntitiesSummary from '../../../read-only-entities-summary';
import QuestionnaireSummary from '../../../read-only-questionnaire-summary';
import getConfig from '../../../../get-config';

function getAnswerMap(answers) {
  if (!answers || !Array.isArray(answers)) {
    return {};
  }

  return answers.reduce((theMap, answer) => {
    theMap[answer.questionId] = answer;
    return theMap;
  }, {});
}

export default function ReadOnlyDetail(props, {configState}) {
  const disclosure = props.disclosure;
  let detail;

  if (!disclosure || !disclosure.configId) {
    return <span />;
  }

  const config = getConfig(configState, disclosure.configId);
  if (config === null) {
    return <span />;
  }

  if (disclosure) {
    detail = (
      <div>
        <QuestionnaireSummary
          questions={config.questions.screening}
          answers={getAnswerMap(disclosure.answers)}
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
          showDispositions={false}
          displayRecommendation={false}
        />
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${props.className}`}>
      {detail}
    </div>
  );
}

ReadOnlyDetail.contextTypes = {
  configState: React.PropTypes.object
};
