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
import CommentBubble from '../CommentBubble';
import {AdminActions} from '../../../../actions/AdminActions';
import {BlueButton} from '../../../BlueButton';
import classNames from 'classnames';

export default class CommentingPanel extends React.Component {
  constructor() {
    super();

    this.makeComment = this.makeComment.bind(this);
  }

  makeComment() {
    const piCheck = this.refs.piCheck;
    const visibleToPI = piCheck.checked;
    piCheck.checked = false;
    const textarea = this.refs.commentText;
    const commentText = textarea.value;
    textarea.value = '';

    AdminActions.makeComment(
      this.props.disclosureId,
      this.props.topicSection,
      this.props.topicId,
      visibleToPI,
      false,
      commentText
    );
  }

  render() {
    let comments;
    if (this.props.comments) {
      comments = this.props.comments.map(comment => {
        return (
          <CommentBubble
            key={comment.id}
            isUser={comment.isCurrentUser}
            date={comment.date}
            author={comment.author}
            text={comment.text}
            className={`${styles.override} ${styles.comment}`}
            new={comment.new}
          />
        );
      });
    }

    let commentForm;
    if (!this.props.readonly) {
      commentForm = (
        <div className={styles.controls}>
          <span className={styles.commentText}>
            <div>COMMENT:</div>
            <div>
              <textarea className={styles.textbox} ref="commentText" />
            </div>
          </span>
          <span className={styles.right}>
            <div>RECIPIENT:</div>
            <div>
              <input type="checkbox" id="piCheck" ref="piCheck" />
              <label htmlFor="piCheck" className={styles.checkLabel}>PRINCIPAL INVESTIGATOR</label>
            </div>
            <div>
              <BlueButton
                className={`${styles.override} ${styles.submitButton}`}
                onClick={this.makeComment}
              >
                Submit
              </BlueButton>
            </div>
          </span>
        </div>
      );
    }

    return (
      <div className={classNames('flexbox', 'column', styles.container, this.props.className)}>
        <div className={styles.heading}>
          <span className={styles.close} onClick={AdminActions.hideCommentingPanel}>
            <i className="fa fa-times" style={{fontSize: 23}}></i> CLOSE
          </span>
          <span className={styles.topic}>{this.props.topic}</span>
        </div>

        <div className={`fill flexbox ${styles.comments}`}>
          <div style={{width: '100%'}}>
            {comments}
          </div>
        </div>

        {commentForm}
      </div>
    );
  }
}
