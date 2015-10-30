import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import DeclarationsSummary from './DeclarationsSummary';
import EntitiesSummary from './EntitiesSummary';
import QuestionnaireSummary from './QuestionnaireSummary';

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
    let styles = {
      container: {
        padding: 20
      },
      questionnaire: {
        marginBottom: 25
      },
      entities: {
        marginBottom: 25
      }
    };

    let disclosure = this.props.disclosure;
    let detail;
    if (disclosure) {
      detail = (
        <div>
          <QuestionnaireSummary
            questions={this.props.config.questions.screening}
            answers={this.getAnswerMap(disclosure.answers)}
            style={styles.questionnaire}
          />
          <EntitiesSummary
            entities={disclosure.entities}
            style={styles.entities}
            questions={this.props.config.questions.entities}
          />
          <DeclarationsSummary
            declarations={disclosure.declarations}
            projectTypes={this.props.config.projectTypes}
            declarationTypes={this.props.config.declarationTypes}
            id={disclosure.id} />
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        {detail}
      </div>
    );
  }
}
