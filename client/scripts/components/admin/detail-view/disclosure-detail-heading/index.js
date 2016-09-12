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
import Dropdown from '../../../dropdown';
import {BlueButton} from '../../../blue-button';
import {AdminActions} from '../../../../actions/admin-actions';

export class DisclosureDetailHeading extends React.Component {
  constructor() {
    super();

    this.archiveChosen = this.archiveChosen.bind(this);
    this.showArchive = this.showArchive.bind(this);
  }

  archiveChosen(id) {
    let idToUse = id;
    if (id === '') {
      idToUse = undefined;
    }

    this.setState({
      archiveId: idToUse
    });
  }

  showArchive() {
    if (get(this.state, 'archiveId') !== undefined) {
      AdminActions.showArchivedDisclosure(this.state.archiveId);
    }
  }

  render() {
    const {disclosure} = this.props;
    const {configState} = this.context;

    let submittedDate;
    if (disclosure.revisedDate) {
      const disclosureStatus = getAdminDisclosureStatusString(
        configState,
        disclosure.statusCd,
        disclosure.configId
      );
      submittedDate = (
        <div className={styles.details}>
          <span className={styles.label}>Revised On:</span>
          <span className={styles.value}>
            <span style={{marginRight: 3}}>{formatDate(disclosure.revisedDate)}</span>
            <span style={{marginRight: 3}}>•</span>
            {disclosureStatus}
          </span>
        </div>
      );
    }
    else {
      const disclosureStatus = getAdminDisclosureStatusString(
        configState,
        disclosure.statusCd,
        disclosure.configId
      );
      submittedDate = (
        <div className={styles.details}>
          <span className={styles.label}>Submitted On:</span>
          <span className={styles.value}>
            <span style={{marginRight: 3}}>{formatDate(disclosure.submittedDate)}</span>
            <span style={{marginRight: 3}}>•</span>
            {disclosureStatus}
          </span>
        </div>
      );
    }

    let approvedDate;
    if (
      (disclosure.statusCd === DISCLOSURE_STATUS.UP_TO_DATE ||
      disclosure.statusCd === DISCLOSURE_STATUS.UPDATE_REQUIRED) &&
      disclosure.lastReviewDate
    ) {
      approvedDate = (
        <div className={styles.details}>
          <span className={styles.label}>Approved On:</span>
          <span className={styles.value}>{formatDateTime(disclosure.lastReviewDate)}</span>
        </div>
      );
    }

    let disposition;
    if (
      getDispositionsEnabled(configState) &&
      disclosure.disposition
    ) {
      disposition = (
        <span>
          <span style={{margin: '0 3px'}}>•</span>
          {disclosure.disposition}
        </span>
      );
    }

    const disclosureType = getDisclosureTypeString(
      configState,
      disclosure.typeCd,
      disclosure.configId
    );

    let versionPicker;
    let versionOptions;

    const isAdmin = this.context.userInfo.coiRole === ROLES.ADMIN;
    if (isAdmin) {
      let versionControls;
      if (disclosure.archivedVersions.length > 0) {
        versionOptions = disclosure.archivedVersions.map(version => {
          return {
            label: `Approved ${formatDateTime(version.approvedDate)}`,
            value: version.id
          };
        });

        versionControls = (
          <div>
            <Dropdown
              options={versionOptions}
              className={styles.dropDown}
              id={'archivedVersionPicker'}
              onChange={this.archiveChosen}
            />
            <BlueButton
              style={{minWidth: 'initial', fontSize: 10, padding: '4px 9px 3px 9px'}}
              onClick={this.showArchive}
              disabled={get(this.state, 'archiveId') === undefined}
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
            <span className={styles.id}>#{disclosure.id}</span>
            {disposition}
          </div>
          <div className={styles.details}>
            <span className={styles.label}>Submitted By:</span>
            <span className={styles.value}>{disclosure.submittedBy}</span>
          </div>
          {submittedDate}
          {approvedDate}
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
