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
import classNames from 'classnames';

export default function AddSection (props) {
  const messageClasses = classNames(styles.messageContainer,
    {[styles.hideWarning]: !props.message});

  return(
    <div className={styles.container}>
      <div className={styles.left}>
        {props.button}
      </div>
      <div className={styles.right}>
        <div id='message' className={messageClasses}>
          <div className={styles.message}>
            <span>
              <div className={styles.level}>Warning:</div>
              <span className={styles.text}>{props.message}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
