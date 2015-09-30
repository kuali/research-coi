import React from 'react/addons';
import {merge} from '../../../merge';
import TopicCommentSummary from './TopicCommentSummary';
import {AdminActions} from '../../../actions/AdminActions';
import ConfigStore from '../../../stores/ConfigStore';
import {COIConstants} from '../../../../../COIConstants';

export default class CommentSummary extends React.Component {
  done() {
    AdminActions.hideCommentSummary();
  }

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
      else {
        return a.topicId - b.topicId;
      }
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
    else {
      return undefined;
    }
  }

  getDeclarationName(id) {
    let theDeclaration = this.props.disclosure.declarations.find(declaration => {
      return declaration.id === id;
    });

    if (theDeclaration) {
      return theDeclaration.projectTitle + ' - ' + theDeclaration.entityName;
    }
    else {
      return undefined;
    }
  }

  getEntitiesTopics() {
    let entityComments = this.props.disclosure.comments.filter(comment => {
      return comment.topicSection === COIConstants.DISCLOSURE_STEP.ENTITIES;
    }).sort((a, b) => {
      if (a.topicId === b.topicId) {
        return a.id - b.id;
      }
      else {
        return a.topicId - b.topicId;
      }
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
      else {
        return a.topicId - b.topicId;
      }
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
        backgroundColor: 'black',
        height: '100%',
        color: 'white',
        padding: '10px 25px',
        overflowY: 'auto'
      },
      heading: {
        color: 'white',
        padding: '10px 20px',
        marginBottom: 20,
        zIndex: 99,
        position: 'relative',
        backgroundColor: 'black'
      },
      close: {
        float: 'right',
        fontWeight: 'bold',
        cursor: 'pointer',
        right: 25,
        position: 'fixed',
        boxShadow: '0 0 21px 11px black',
        backgroundColor: 'black'
      }
    };

    let questionnaireTopics = this.getQuestionnaireTopics();
    let entitiesTopics = this.getEntitiesTopics();
    let declarationTopics = this.getDeclarationTopics();

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.heading}>
          <span style={styles.close} onClick={this.done}>X CLOSE</span>
        </div>

        {questionnaireTopics}
        {entitiesTopics}
        {declarationTopics}

      </div>
    );
  }
}
