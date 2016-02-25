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
import {CurrentStepIcon} from '../../dynamic-icons/current-step-icon';
import {CompletedStepIcon} from '../../dynamic-icons/completed-step-icon';
import {DisclosureActions} from '../../../actions/disclosure-actions';

export class SidebarStep extends React.Component {
  constructor() {
    super();
    this.navigate = this.navigate.bind(this);
  }

  navigate() {
    DisclosureActions.jumpToStep(this.props.step);
  }

  render() {
    switch (this.props.state.toLowerCase()) {
      case 'complete':
        return (
          <div className={classNames(styles.clickable, this.props.className)} onClick={this.navigate}>
            <li className={styles.container}>
              <CompletedStepIcon
                className={`${styles.override} ${styles.icon}`}
                color={window.colorBlindModeOn ? 'black' : '#0095A0'}
              />
              <span className={styles.stepName}>{this.props.label}</span>
            </li>
          </div>
        );
      case 'active':
        return (
          <div className={classNames(this.props.className)}>
            <li className={`${styles.container} ${styles.selected}`}>
              <CurrentStepIcon
                className={`${styles.override} ${styles.icon}`}
                color={window.colorBlindModeOn ? 'black' : '#0095A0'}
              />
              <span className={styles.stepName}>{this.props.label}</span>
            </li>
          </div>
        );
      case 'incomplete':
        if (this.props.visited) {
          return (
            <li className={classNames(styles.container, styles.clickable, this.props.className)} onClick={this.navigate}>
              <i className={`fa fa-circle ${styles.futureIcon}`}></i>
              <span className={styles.stepName}>{this.props.label}</span>
            </li>
          );
        }

        return (
          <li className={classNames(styles.container, styles.incomplete, this.props.className)}>
            <i className={`fa fa-circle ${styles.futureIcon} ${styles.incomplete}`} />
            <span className={styles.stepName}>{this.props.label}</span>
          </li>
        );
    }
  }
}

SidebarStep.defaultProps = {
  state: ''
};
