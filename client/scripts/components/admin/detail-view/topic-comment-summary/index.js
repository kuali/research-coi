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

import styles from './style';
import React from 'react';
import CommentBubble from '../comment-bubble';
import classNames from 'classnames';

export default function TopicCommentSummary(props) {
  let comments;
  if (props.comments) {
    comments = props.comments.map(comment => {
      return (
        <CommentBubble
          key={comment.id}
          {...comment}
          className={`${styles.override} ${styles.comment}`}
        />
      );
    });
  }

  return (
    <div className={classNames(styles.container, props.className)}>
      <div className={styles.topicName}>{props.topicName}</div>
      <div style={{width: '50%', borderBottom: '1px solid black', marginBottom: 15}}></div>
      <div>
        {comments}
      </div>
    </div>
  );
}
