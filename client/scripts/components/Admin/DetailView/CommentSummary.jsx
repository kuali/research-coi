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

import React from 'react';
import {merge} from '../../../merge';
import TopicCommentSummary from './TopicCommentSummary';
import {AdminActions} from '../../../actions/AdminActions';
import ConfigStore from '../../../stores/ConfigStore';
import {COIConstants} from '../../../../../COIConstants';

export default class CommentSummary extends React.Component {
  getUniqueTopics(comments) {
    let topics = [];
    let lastValue;
    comments.forEach(comment => {
      if (lastValue !== comment.topicId) {
        topics.push(comment.topicId);
        lastValue = comment.topicId;
      }
    });

    return topics;
  }

  getQuestionnaireTopics() {
    let questionComments = this.props.disclosure.comments.filter(comment => {
      return comment.topicSection === COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE;
    }).sort((a, b) => {
      if (a.topicId === b.topicId) {
        return a.id - b.id;
      }

      return a.topicId - b.topicId;
    });

    return this.getUniqueTopics(questionComments).sort((a, b) => {
      let aName = ConfigStore.getQuestionNumberToShow(COIConstants.QUESTIONNAIRE_TYPE.SCREENING, a);
      let bName = ConfigStore.getQuestionNumberToShow(COIConstants.QUESTIONNAIRE_TYPE.SCREENING, b);

      return String(aName).localeCompare(String(bName));
    }).map(topicId => {
      let comments = questionComments.filter(comment => {
        return comment.topicId === topicId;
      });

      let topicName = 'QUESTION ' + ConfigStore.getQuestionNumberToShow(COIConstants.QUESTIONNAIRE_TYPE.SCREENING, topicId);
      return (
        <TopicCommentSummary
          key={'qt' + topicId}
          topicName={topicName}
          comments={comments}
        />
      );
    });
  }

  getEntityName(id) {
    let theEntity = this.props.disclosure.entities.find(entity => {
      return entity.id === id;
    });

    if (theEntity) {
      return theEntity.name;
    }

    return undefined;
  }

  getDeclarationName(id) {
    let theDeclaration = this.props.disclosure.declarations.find(declaration => {
      return declaration.id === id;
    });

    if (theDeclaration) {
      return theDeclaration.projectTitle + ' - ' + theDeclaration.entityName;
    }

    return undefined;
  }

  getEntitiesTopics() {
    let entityComments = this.props.disclosure.comments.filter(comment => {
      return comment.topicSection === COIConstants.DISCLOSURE_STEP.ENTITIES;
    }).sort((a, b) => {
      if (a.topicId === b.topicId) {
        return a.id - b.id;
      }

      return a.topicId - b.topicId;
    });

    return this.getUniqueTopics(entityComments).map(topicId => {
      let comments = entityComments.filter(comment => {
        return comment.topicId === topicId;
      });

      let topicName = 'ENTITY: ' + this.getEntityName(topicId);
      return (
        <TopicCommentSummary
          key={'et' + topicId}
          topicName={topicName}
          comments={comments}
        />
      );
    });
  }

  getDeclarationTopics() {
    let declarationComments = this.props.disclosure.comments.filter(comment => {
      return comment.topicSection === COIConstants.DISCLOSURE_STEP.PROJECTS;
    }).sort((a, b) => {
      if (a.topicId === b.topicId) {
        return a.id - b.id;
      }

      return a.topicId - b.topicId;
    });

    return this.getUniqueTopics(declarationComments).map(topicId => {
      let comments = declarationComments.filter(comment => {
        return comment.topicId === topicId;
      });

      let topicName = this.getDeclarationName(topicId);
      return (
        <TopicCommentSummary
          key={'et' + topicId}
          topicName={topicName}
          comments={comments}
        />
      );
    });
  }

  render() {
    let styles = {
      container: {
        backgroundColor: 'white',
        height: '100%',
        boxShadow: '0 0 10px 0 #AAA',
        color: 'black',
        padding: '10px 25px 0 25px'
      },
      heading: {
        color: 'black',
        padding: '10px 20px 10px 0',
        height: 50,
        zIndex: 99,
        position: 'relative',
        backgroundColor: 'white',
        boxShadow: '0 5px 10px white'
      },
      close: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontWeight: 'bold',
        cursor: 'pointer',
        float: 'right',
        fontSize: 20
      },
      title: {
        fontWeight: 300,
        fontSize: 23
      }
    };

    let questionnaireTopics = this.getQuestionnaireTopics();
    let entitiesTopics = this.getEntitiesTopics();
    let declarationTopics = this.getDeclarationTopics();

    return (
      <div className="flexbox column" style={merge(styles.container, this.props.style)}>
        <div style={styles.heading}>
          <span style={styles.title}>COMMENTS</span>
          <span style={styles.close} onClick={AdminActions.hideCommentSummary}>
            <i className="fa fa-times" style={{fontSize: 23, marginRight: 3}}></i>
            CLOSE
          </span>
        </div>

        <div className="fill" style={{overflowY: 'auto', paddingBottom: 15}}>
          {questionnaireTopics}
          {entitiesTopics}
          {declarationTopics}
        </div>
      </div>
    );
  }
}
