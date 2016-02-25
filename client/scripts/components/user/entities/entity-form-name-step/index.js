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
import classNames from 'classnames';
import React from 'react';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {DisclosureStore} from '../../../../stores/disclosure-store';

export class EntityFormNameStep extends React.Component {
  constructor() {
    super();

    this.updateName = this.updateName.bind(this);
  }

  updateName() {
    const newNameValue = this.refs.entityName.value;
    DisclosureActions.setInProgressEntityName(newNameValue);
  }

  render() {
    const validationErrors = DisclosureStore.entityNameStepErrors();

    let requiredFieldError;
    if (this.props.validating && validationErrors.name) {
      requiredFieldError = (
        <div className={styles.invalidError}>{validationErrors.name}</div>
      );
    }

    const htmlId = Math.floor(Math.random() * 1000000000);

    const classes = classNames(
      styles.container,
      {[styles.errors]: this.props.validating && validationErrors.name},
      this.props.className
    );

    return (
      <span className={classes}>
        <div className={styles.title}>Add New Financial Entity</div>

        <div className={styles.top}>
          <span className={styles.entityName}>
            <label htmlFor={htmlId} className={styles.nameLabel}>ENTITY NAME</label>
            <div>
              <input id={htmlId} required onChange={this.updateName} value={this.props.entityName} ref="entityName" type="text" className={styles.name} />
            </div>
            {requiredFieldError}
          </span>
        </div>
      </span>
    );
  }
}
