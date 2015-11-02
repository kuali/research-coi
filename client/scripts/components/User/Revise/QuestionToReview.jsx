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

import React from 'react/addons';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import Question from './Question';

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
      commentSection: {
        width: 300
      },
      comments: {
        backgroundColor: window.colorBlindModeOn ? 'black' : '#D8E9EB',
        color: window.colorBlindModeOn ? 'white' : 'black',
        borderRadius: 5,
        padding: '1px 10px'
      },
      comment: {
        margin: '15px 10px'
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
      completed: {
        color: window.colorBlindModeOn ? 'black' : 'green',
        fontSize: 35
      },
      incomplete: {
        color: window.colorBlindModeOn ? 'black' : '#E85723',
        fontSize: 35
      }
    };

    let comments = this.props.question.comments.map(comment => {
      return (
        <div style={styles.comment} key={comment.id}>
          <div style={styles.commentTitle}>Comment from
            <span style={{marginLeft: 3}}>{comment.author}</span>:
          </div>
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

    let questionDetails = this.props.question.question;
    let answer = this.props.question.answer;
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
          revised={this.props.question.revised}
          respondedTo={this.props.question.respondedTo}
        />

        <span style={styles.commentSection}>
          <div style={styles.comments}>
            {comments}
          </div>
        </span>
      </div>
    );
  }
}
