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
import {GreyButton} from '../../grey-button';
import {AdminActions} from '../../../actions/admin-actions';
import DisclosureFilter from '../disclosure-filter';
import DoneWithFilterButton from '../done-with-filter-button';
import {DISCLOSURE_STATUS} from '../../../../../coi-constants';
const {
  UPDATE_REQUIRED,
  RETURNED,
  SUBMITTED_FOR_APPROVAL,
  REVISION_REQUIRED,
  EXPIRED,
  RESUBMITTED,
  UP_TO_DATE
} = DISCLOSURE_STATUS;
const APPROVED = UP_TO_DATE;

class StatusOption extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }
  
  onChange() {
    this.props.onChange(this.props.code);
  }

  render() {
    const {label, code, checked} = this.props;
    const id = `statusFilter${code}`;

    return (
      <label className={styles.checkbox}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={this.onChange}
        />
        <span style={{paddingLeft: 9}}>{label}</span>
      </label>
    );
  }
}

StatusOption.propTypes = {
  label: React.PropTypes.string.isRequired,
  code: React.PropTypes.number.isRequired,
  checked: React.PropTypes.bool,
  onChange: React.PropTypes.func.isRequired
};

const LOWER_OPTIONS = [APPROVED, UPDATE_REQUIRED, RETURNED];

function isInDefaultState(activeFilters) {
  return (
    Array.isArray(activeFilters) &&
    activeFilters.length === 4 &&
    activeFilters.includes(SUBMITTED_FOR_APPROVAL) &&
    activeFilters.includes(REVISION_REQUIRED) &&
    activeFilters.includes(EXPIRED) &&
    activeFilters.includes(RESUBMITTED)
  );
}

export class DisclosureFilterByStatus extends DisclosureFilter {
  constructor() {
    super();

    this.label = 'STATUS';

    this.toggleFilter = this.toggleFilter.bind(this);
    this.isChecked = this.isChecked.bind(this);
  }

  // This method must be implemented. It will be called by DisclosureFilter.
  setActiveStatus({activeFilters}) {
    this.setState({active: !isInDefaultState(activeFilters)});
  }

  clear(e) {
    AdminActions.clearStatusFilter();
    e.stopPropagation();
  }

  toggleFilter(code) {
    const theStatus = this.props.possibleStatuses.find(
      status => status.code === code
    );
    AdminActions.toggleStatusFilter(theStatus);
  }

  isChecked(value) {
    return this.props.activeFilters.some(filter => filter === value);
  }

  // render() is implemented in DisclosureFilter, which will call renderFilter
  renderFilter() {
    const {possibleStatuses} = this.props;

    const upperSection = possibleStatuses
      .filter(status => !LOWER_OPTIONS.includes(status.code))
      .sort((a, b) => a.label.localeCompare(b.label))
      .map(status => {
        return (
          <StatusOption
            key={status.code}
            label={status.label}
            code={status.code}
            checked={this.isChecked(status.code)}
            onChange={this.toggleFilter}
          />
        );
      });

    const lowerSection = possibleStatuses
      .filter(status => LOWER_OPTIONS.includes(status.code))
      .sort((a, b) => a.label.localeCompare(b.label))
      .map(status => {
        return (
          <StatusOption
            key={status.code}
            label={status.label}
            code={status.code}
            checked={this.isChecked(status.code)}
            onChange={this.toggleFilter}
          />
        );
      });

    return (
      <div className={styles.container}>
        <DoneWithFilterButton onClick={this.close} />
        {upperSection}

        <div className={styles.approvedStatus}>
          {lowerSection}
        </div>

        <GreyButton
          className={`${styles.override} ${styles.clearButton}`}
          onClick={this.clear}
        >
          <i className={classNames('fa', 'fa-times', styles.x)} />
          RESET FILTER
        </GreyButton>
      </div>
    );
  }
}
