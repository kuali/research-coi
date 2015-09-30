import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import QuestionSummary from './QuestionSummary';

export class AdminQuestionnaireSummary extends React.Component {
  constructor() {
    super();

    this.getCommentCount = this.getCommentCount.bind(this);
  }

  getCommentCount(id) {
    return this.props.comments.filter(comment => {
      return comment.topicId === id;
    }).length;
  }

  render() {
    let styles = {
      container: {
        border: '1px solid #999',
        boxShadow: '0 0 10px #BBB',
        borderRadius: 8,
        overflow: 'hidden'
      },
      heading: {
        backgroundColor: '#1481A3',
        borderBottom: '1px solid #999',
        fontSize: 25,
        color: 'white',
        padding: 10
      },
      body: {
        padding: '13px 20px'
      }
    };

    let questions;
    if(this.props.questions !== undefined) {
      questions = this.props.questions.filter(question => {
        return this.props.answers[question.id] !== undefined;
      }).map(question => {
        return (
          <QuestionSummary
            key={question.id}
            question={question}
            answer={this.props.answers[question.id]}
            commentCount={this.getCommentCount(question.id)}
          />
        );
      });
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.heading}>QUESTIONNAIRE</div>
        <div style={styles.body}>
          {questions}
        </div>
      </div>
    );
  }
}
