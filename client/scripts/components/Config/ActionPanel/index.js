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
import classNames from 'classnames';
import React from 'react';
import UndoButton from '../undo-button';
import SaveButton from '../save-button';

export default function ActionPanel(props) {
  const classes = classNames(
    styles.container,
    props.className,
    {[styles.visible]: props.visible}
  );

  return (
    <span className={classes}>
      <div className={styles.saveAndUndo}>
        <SaveButton className={`${styles.override} ${styles.saveButton}`} />
        <UndoButton />
      </div>
    </span>
  );
}
