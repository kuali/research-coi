/* @flow */
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
import CommentBubble from './CommentBubble';

export default function TopicCommentSummary(props: Object): React.Element {
  const styles = {
    container: {
      paddingBottom: 25
    },
    topicName: {
      fontSize: 18,
      marginBottom: 15
    },
    date: {
      float: 'right',
      fontSize: 13
    },
    author: {
      fontWeight: 'bold',
      fontSize: 16
    },
    text: {
      fontSize: 13,
      marginTop: 7,
      marginBottom: 25
    },
    comment: {
      marginBottom: 15
    }
  };

  let comments;
  if (props.comments) {
    comments = props.comments.map(comment => {
      return (
        <CommentBubble
          key={comment.id}
          isUser={comment.isCurrentUser}
          date={comment.date}
          author={comment.author}
          text={comment.text}
          style={styles.comment}
          new={false}
        />
      );
    });
  }

  return (
    <div style={merge(styles.container, props.style)}>
      <div style={styles.topicName}>{props.topicName}</div>
      <div style={{width: '50%', borderBottom: '1px solid black', marginBottom: 15}}></div>
      <div>
        {comments}
      </div>
    </div>
  );
}
