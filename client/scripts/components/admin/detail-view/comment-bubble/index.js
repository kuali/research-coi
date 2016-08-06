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
import {formatDate} from '../../../../format-date';
import classNames from 'classnames';
import { AdminActions } from '../../../../actions/admin-actions';
import { ROLES } from '../../../../../../coi-constants';
import ViewableByReporterButton from './viewable-by-reporter-button';

export default class CommentBubble extends React.Component {
  constructor() {
    super();

    this.editComment = this.editComment.bind(this);
  }

  editComment() {
    AdminActions.editComment(this.props.id);
  }

  render() {
    const {
      date,
      isCurrentUser,
      className,
      piVisible,
      reviewerVisible,
      editable,
      readOnly,
      userRole: commentersRole,
      id,
      disclosureReadonly,
      author,
      text
    } = this.props;
    const {coiRole: role} = this.context.userInfo;

    let theDate;
    if (date) {
      theDate = formatDate(date);
    }

    const classes = classNames(
      styles.container,
      {[styles.isUser]: isCurrentUser},
      {[styles.new]: this.props.new},
      className
    );

    let reporterBubble;
    if (
      Number(piVisible) === 1 &&
      [ROLES.ADMIN, ROLES.REVIEWER].includes(String(role))
    ) {
      reporterBubble = (
        <div
          id='reporterBubble'
          className={classNames(styles.blue, styles.bubble)}
        >
          Reporter
        </div>
      );
    }

    let reviewerBubble;
    if (Number(reviewerVisible) === 1 && String(role) === ROLES.ADMIN) {
      reviewerBubble = (
        <div
          id='reviewerBubble'
          className={classNames(styles.blue, styles.bubble)}
        >
          Reviewer
        </div>
      );
    }

    let editButton;
    if (editable && !readOnly && isCurrentUser) {
      editButton = (
        <div className={styles.editSection}>
          <button className={styles.editButton} onClick={this.editComment}>
            <i className={'fa fa-edit'} style={{marginRight: 5}} />
            EDIT COMMENT
          </button>
        </div>
      );
    }

    let visibleTo;
    if ((reporterBubble || reviewerBubble) && commentersRole !== ROLES.USER) {
      visibleTo = (
        <div>
          <span className={styles.from}>
            VISIBLE TO:
          </span>
          {reporterBubble}
          {reviewerBubble}
        </div>
      );
    }

    let viewableByReporterButton;
    if (!readOnly) {
      viewableByReporterButton = (
        <ViewableByReporterButton
          id={id}
          piVisible={piVisible}
          role={role}
          disclosureReadonly={disclosureReadonly}
        />
      );
    }

    return (
      <div className={classes}>
        <span className={styles.comment}>
          <div>
            <span className={styles.date}>{theDate}</span>
            <span className={styles.from}>FROM:</span>
            <span className={styles.author}>
              {author}
            </span>
          </div>
          <div>
            {visibleTo}
          </div>
          <div className={styles.text}>
            {text}
          </div>
        </span>
        {editButton}
        {viewableByReporterButton}
      </div>
    );
  }
}

CommentBubble.contextTypes = {
  userInfo: React.PropTypes.object
};