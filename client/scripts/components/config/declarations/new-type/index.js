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
import ConfigActions from '../../../../actions/config-actions';
import DoneLink from '../../done-link';
import {COIConstants} from '../../../../../../coi-constants';

export default class DeclarationType extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.lookForEnter = this.lookForEnter.bind(this);
    this.done = this.done.bind(this);
  }

  lookForEnter(evt) {
    if (evt.keyCode === COIConstants.RETURN_KEY) {
      this.done();
    }
  }

  onChange(evt) {
    ConfigActions.set({
      path: this.props.path,
      value: evt.target.value
    });
  }

  done() {
    ConfigActions.saveNewType(this.props.type);
  }

  componentDidMount() {
    this.refs.newType.focus();
  }

  render() {
    return (
      <div style={{margin: '0 20px 0 10px'}}>
        <input
          type="text"
          ref="newType"
          value={this.props.value}
          className={styles.textbox}
          onKeyUp={this.lookForEnter}
          onChange={this.onChange}
        />
        <DoneLink
          className={`${styles.override} ${styles.editLink}`}
          onClick={this.done}
        />
      </div>
    );
  }
}
