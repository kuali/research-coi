/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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
import {AdminActions} from '../../../../actions/admin-actions';
import {BlueButton} from '../../../blue-button';
import classNames from 'classnames';
import { ROLES } from '../../../../../../coi-constants';

export default class CommentingPanel extends React.Component {
  constructor() {
    super();

    this.makeComment = this.makeComment.bind(this);
  }

  makeComment() {
    AdminActions.makeComment(
      this.props.comment
    );
  }

  render() {
    let comments;
    if (this.props.comments) {
      comments = this.props.comments.map(comment => {
        return (
          <CommentBubble
            {...comment}
            role={this.props.role}
            readOnly={this.props.editingComment}
            key={comment.id}
            className={`${styles.override} ${styles.comment}`}
          />
        );
      });
    }

    let visibleChecks;

    if (this.props.role === ROLES.ADMIN) {
      visibleChecks = (
        <span className={styles.left}>
          <div>
            <div style={{color:'#737373'}}>VISIBLE TO</div>
            <div>
              <input
                type="checkbox"
                id="piCheck"
                onChange={AdminActions.toggleReporter}
                checked={this.props.comment.piVisible === 1}
                className={styles.checkBox}
              />
              <label htmlFor="piCheck" className={styles.checkLabel}>Reporter</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="reviewerCheck"
                onChange={AdminActions.toggleReviewer}
                checked={this.props.comment.reviewerVisible === 1}
                className={styles.checkBox}
              />
              <label htmlFor="reviewerCheck" className={styles.checkLabel}>Reviewer</label>
            </div>
          </div>
        </span>
      );
    }

    let commentForm;
    if (!this.props.readonly) {
      let cancelButton;
      if (this.props.editingComment) {
        cancelButton = (
          <BlueButton
            className={`${styles.override} ${styles.button} ${styles.cancel}`}
            onClick={AdminActions.cancelComment}
          >
            CANCEL
          </BlueButton>
        );
      }

      let commentButton;

      if (this.props.comment.text.length > 0) {
        commentButton = (
          <BlueButton
            className={`${styles.override} ${styles.button} ${styles.submit}`}
            onClick={this.makeComment}
          >
            COMMENT
          </BlueButton>
        );
      }

      const adminWarningClasses = classNames(
        styles.adminWarning,
        {[styles.showing]: this.props.comment.piVisible === 0 && this.props.comment.reviewerVisible === 0 && this.props.role === ROLES.ADMIN}
      );

      const commentClasses = classNames(
        styles.commentText,
        {[styles.adminCommentText]: this.props.role === ROLES.ADMIN}
      );

      commentForm = (
        <div>
          <div id='adminWarning' className={adminWarningClasses}>
            If no recipients are selected, only admins can see this comment.
          </div>
          <div className={styles.controls}>
            {visibleChecks}
            <span className={commentClasses}>
              <div style={{color:'#737373'}}>COMMENT</div>
              <div style={{marginTop: '5px'}}>
                <textarea
                  className={styles.textbox}
                  onChange={AdminActions.updateCommentText}
                  value={this.props.comment.text}
                />
                <div>
                  {commentButton}
                  {cancelButton}
                </div>
              </div>
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className={classNames('flexbox', 'column', styles.container, this.props.className)}>
        <div className={styles.heading}>
          <span className={styles.close} onClick={AdminActions.hideCommentingPanel}>
            <i className="fa fa-times" style={{fontSize: 23}}></i> CLOSE
          </span>
          <span className={styles.topic}>{this.props.comment.title}</span>
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
