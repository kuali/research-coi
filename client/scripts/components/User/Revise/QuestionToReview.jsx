import React from 'react/addons';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import Question from './Question';

/*
  Question states to account for:
  1. A main question (flagged) with no sub questions
     - Show and let them edit it
  2. A main question (flagged) with sub questions (none flagged)
     - Show normal flow for that question. If it triggers sub questions, so be it. (Possibly erasing old answers)
  3. A main question (flagged) with sub questions (some flagged)
     - Show normal flow for that question. If it triggers sub questions, so be it. (Possibly erasing old answers)
  4. A main question (unflagged) with sub questions (some flagged)
     - Show read-only parent question with only the flagged subquestions, each being editable. Don't show other sub questions.
*/

export default class QuestionToReview extends React.Component {
  render() {
    let styles = {
      container: {
        marginBottom: 40
      },
      statusIcon: {
        width: 45
      },
      questionNumber: {
        width: 60,
        fontSize: 22
      },
      comments: {
        width: 300,
        backgroundColor: '#EEE',
        borderRadius: 5
      },
      commentTitle: {
        fontWeight: 'bold',
        fontSize: 15
      },
      commentDate: {
        fontStyle: 'italic',
        fontSize: 12,
        paddingTop: 2
      },
      commentText: {
        fontSize: 14
      },
      comment: {
        margin: '11px 15px'
      },
      completed: {
        color: 'green',
        fontSize: 35
      },
      incomplete: {
        color: '#E85723',
        fontSize: 35
      }
    };

    let comments = this.props.question.comments.map(comment => {
      return (
        <div style={styles.comment} key={comment.id}>
          <div style={styles.commentTitle}>Comment from {comment.author}:</div>
          <div style={styles.commentText}>{comment.text}</div>
          <div style={styles.commentDate}>{formatDate(comment.date)}</div>
        </div>
      );
    });

    let icon;
    if (this.props.question.reviewedOn !== null) {
      icon = (
        <i className="fa fa-check-circle" style={styles.completed}></i>
      );
    }
    else {
      icon = (
        <i className="fa fa-exclamation-circle" style={styles.incomplete}></i>
      );
    }

    let questionDetails = JSON.parse(this.props.question.question);
    let answer = JSON.parse(this.props.question.answer);
    return (
      <div className="flexbox row" style={merge(styles.container, this.props.style)}>
        <span style={styles.statusIcon}>
          {icon}
        </span>
        <span style={styles.questionNumber}>
          {questionDetails.numberToShow}
        </span>

        <Question
          reviewId={this.props.question.reviewId}
          question={this.props.question}
          questionDetails={questionDetails}
          text={questionDetails.text}
          answer={answer.value}
          type={questionDetails.type}
        />

        <span style={styles.comments}>
          {comments}
        </span>
      </div>
    );
  }
}
