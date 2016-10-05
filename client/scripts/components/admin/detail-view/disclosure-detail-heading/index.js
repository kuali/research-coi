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
import {get} from 'lodash';
import {
  getAdminDisclosureStatusString,
  getDispositionsEnabled,
  getDisclosureTypeString
} from '../../../../stores/config-store';
import {formatDate, formatDateTime} from '../../../../format-date';
import {DISCLOSURE_STATUS, ROLES} from '../../../../../../coi-constants';
const {ADMIN} = ROLES;
const {UP_TO_DATE, UPDATE_REQUIRED, RESUBMITTED, RETURNED} = DISCLOSURE_STATUS;
import Dropdown from '../../../dropdown';
import {BlueButton} from '../../../blue-button';
import {AdminActions} from '../../../../actions/admin-actions';

function DateAndStatusHeader({label, date, status}) {
  return (
    <div className={styles.details}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        <span style={{marginRight: 3}}>
          {formatDate(date)}
        </span>
        <span style={{marginRight: 3}}>•</span>
        {status}
      </span>
    </div>
  );
}

DateAndStatusHeader.propTypes = {
  label: React.PropTypes.string.isRequired,
  date: React.PropTypes.string,
  status: React.PropTypes.string
};

function Header({label, value}) {
  return (
    <div className={styles.details}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

Header.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string
};

export class DisclosureDetailHeading extends React.Component {
  constructor() {
    super();

    this.archiveChosen = this.archiveChosen.bind(this);
    this.showArchive = this.showArchive.bind(this);
  }

  archiveChosen(archiveId) {
    if (archiveId === '') {
      this.setState({archiveId: undefined});
    }
    else {
      this.setState({archiveId});
    }
  }

  showArchive() {
    if (get(this, 'state.archiveId') !== undefined) {
      AdminActions.showArchivedDisclosure(this.state.archiveId);
    }
  }

  render() {
    const {
      revisedDate,
      statusCd,
      configId,
      lastReviewDate,
      typeCd,
      archivedVersions,
      id,
      submittedBy,
      submittedDate,
      returnedDate,
      resubmissionDate,
      disposition
    } = this.props.disclosure;
    const {configState, userInfo} = this.context;

    const status = getAdminDisclosureStatusString(
      configState,
      statusCd,
      configId
    );
    let DateStatusJsx;
    if (revisedDate) {
      DateStatusJsx = (
        <DateAndStatusHeader
          label="Revised On:"
          date={revisedDate}
          status={status}
        />
      );
    }
    else {
      DateStatusJsx = (
        <DateAndStatusHeader
          label="Submitted On:"
          date={submittedDate}
          status={status}
        />
      );
    }

    let approvedDateJsx;
    if (
      (
        statusCd === UP_TO_DATE ||
        statusCd === UPDATE_REQUIRED
      ) &&
      lastReviewDate
    ) {
      approvedDateJsx = (
        <Header label="Approved On:" value={formatDateTime(lastReviewDate)} />
      );
    }

    let returnedDateJsx;
    if (statusCd === RETURNED && returnedDate) {
      returnedDateJsx = (
        <Header label="Returned On:" value={formatDate(returnedDate)} />
      );
    }
    let resubmissionDateJsx;
    if (statusCd === RESUBMITTED && resubmissionDate) {
      resubmissionDateJsx = (
        <Header label="Resubmitted On:" value={formatDate(resubmissionDate)} />
      );
    }

    let dispositionJsx;
    if (getDispositionsEnabled(configState) && disposition) {
      dispositionJsx = (
        <span>
          <span style={{margin: '0 3px'}}>•</span>
          {disposition}
        </span>
      );
    }

    const disclosureType = getDisclosureTypeString(
      configState,
      typeCd,
      configId
    );

    let versionPicker;
    if (userInfo.coiRole === ADMIN) {
      let versionControls;
      if (archivedVersions.length > 0) {
        const versionOptions = archivedVersions.map(version => {
          return {
            label: `Approved ${formatDateTime(version.approvedDate)}`,
            value: version.id
          };
        });

        const archiveId = get(this, 'state.archiveId');
        versionControls = (
          <div>
            <Dropdown
              value={archiveId}
              options={versionOptions}
              className={styles.dropDown}
              id={'archivedVersionPicker'}
              onChange={this.archiveChosen}
            />
            <BlueButton
              style={{
                minWidth: 'initial',
                fontSize: 10,
                padding: '4px 9px 3px 9px'
              }}
              onClick={this.showArchive}
              disabled={archiveId === undefined}
            >
              View
            </BlueButton>
          </div>
        );
      } else {
        versionControls = (
          <div className={styles.noVersions} id="archivedVersionPicker">
            NONE FOUND
          </div>
        );
      }

      versionPicker = (
        <span className={styles.archivedList}>
          <label htmlFor="archivedVersionPicker">Previous Versions:</label>
          {versionControls}
        </span>
      );
    }

    return (
      <div className={styles.container} >
        <span>
          <div className={styles.heading}>
            <span className={styles.disclosure}>
              <span style={{marginRight: 3}}>
                {disclosureType}
              </span>
              •
            </span>
            <span>ID</span>
            <span className={styles.id}>#{id}</span>
            {dispositionJsx}
          </div>
          <Header label="Submitted By:" value={submittedBy} />
          {DateStatusJsx}
          {approvedDateJsx}
          {returnedDateJsx}
          {resubmissionDateJsx}
        </span>
        {versionPicker}
      </div>
    );
  }
}

DisclosureDetailHeading.contextTypes = {
  configState: React.PropTypes.object,
  userInfo: React.PropTypes.object
};

DisclosureDetailHeading.propTypes = {
  disclosure: React.PropTypes.object.isRequired
};
