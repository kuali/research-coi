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
import {formatDate} from '../../../../format-date';
import classNames from 'classnames';
import { ROLES } from '../../../../../../coi-constants';

export default function CommentBubble(props) {
  let theDate;
  if (props.date) {
    theDate = formatDate(props.date);
  }

  const classes = classNames(
    styles.container,
    {[styles.isUser]: props.isCurrentUser},
    {[styles.new]: props.new},
    props.className
  );

  let adminBubble;
  let reviewerBubble;
  let reporterBubble;

  if (props.piVisible == 1 && props.userRole != ROLES.USER) {
    reporterBubble = (
      <div id='reporterBubble' className={classNames(styles.blue, styles.bubble)}>
        Reporter
      </div>
    );
  }

  if (props.reviewerVisible == 1 && props.userRole != ROLES.USER) {
    reviewerBubble = (
      <div id='reviewerBubble' className={classNames(styles.blue, styles.bubble)}>
        Reviewer
      </div>
    );
  }

  if (props.userRole == ROLES.USER || props.reviewerVisible == 0 && props.piVisible == 0) {
    adminBubble = (
      <div id='adminBubble' className={classNames(styles.orange, styles.bubble)}>
        Admin
      </div>
    );
  }

  return (
    <div className={classes}>
      <span style={{width: '100%'}}>
        <div>
          <span className={styles.date}>{theDate}</span>
          <span className={styles.from}>
              FROM:
          </span>
          <span className={styles.author}>
             {props.author}
          </span>
        </div>
        <div>
          <span className={styles.from}>
              TO:
          </span>
          {reporterBubble}
          {reviewerBubble}
          {adminBubble}
        </div>
        <div className={styles.text}>
          {props.text}
        </div>
      </span>
    </div>
  );
}
