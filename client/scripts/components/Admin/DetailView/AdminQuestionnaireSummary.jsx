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
import QuestionSummary from './QuestionSummary';

export class AdminQuestionnaireSummary extends React.Component {
  constructor() {
    super();

    this.getCommentCount = this.getCommentCount.bind(this);
    this.wasRespondedTo = this.wasRespondedTo.bind(this);
  }

  wasRespondedTo(id) {
    if (this.props.piResponses && Array.isArray(this.props.piResponses)) {
      return this.props.piResponses.some(response => {
        return response.targetId === id;
      });
    }
    else {
      return false;
    }
  }

  getCommentCount(id) {
    return this.props.comments.filter(comment => {
      return comment.topicId === id;
    }).length;
  }

  render() {
    let styles = {
      container: {
        backgroundColor: 'white',
        boxShadow: '0 0 8px #AAA',
        borderRadius: 5,
        overflow: 'hidden'
      },
      heading: {
        borderBottom: '1px solid #999',
        fontSize: 25,
        color: 'black',
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
            changedByPI={this.wasRespondedTo(question.id)}
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
