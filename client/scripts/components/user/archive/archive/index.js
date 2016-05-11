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
import {AppHeader} from '../../../app-header';
import {DisclosureStore} from '../../../../stores/disclosure-store';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {
  getDispositionsEnabled,
  getDisclosureTypeString
} from '../../../../stores/config-store';
import {Link} from 'react-router';
import ArchiveDetail from '../archive-detail';
import {formatDate, formatDateTime} from '../../../../format-date';
import {COIConstants} from '../../../../../../coi-constants';
import ManagementPlan from '../management-plan';

export class Archive extends React.Component {
  constructor() {
    super();

    const storeState = DisclosureStore.getState();
    this.state = {
      archivedDisclosures: storeState.archivedDisclosures
    };

    this.onChange = this.onChange.bind(this);
    this.changeArchive = this.changeArchive.bind(this);
  }

  componentDidMount() {
    DisclosureStore.listen(this.onChange);
    DisclosureActions.loadArchivedDisclosures();
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
  }

  onChange() {
    const storeState = DisclosureStore.getState();
    this.setState({
      archivedDisclosures: storeState.archivedDisclosures,
      currentAnnualDisclosureStatus: storeState.currentAnnualDisclosureStatus
    });

    if (storeState.archivedDisclosures && storeState.archivedDisclosures.length > 0) {
      this.displayArchive(storeState.archivedDisclosures[0]);
    }
  }

  getSubmittedDate() {
    if (!this.state.disclosure) {
      return '';
    }

    return formatDate(this.state.disclosure.submittedDate);
  }

  getApprovedDate() {
    if (!this.state.disclosure) {
      return '';
    }

    return formatDateTime(this.state.disclosure.lastReviewDate);
  }

  displayArchive(archive) {
    this.setState({
      disclosure: JSON.parse(archive.disclosure),
      config: JSON.parse(archive.config)
    });
  }

  changeArchive() {
    const versionPicker = this.refs.versionPicker;

    const theArchive = this.state.archivedDisclosures.find(archive => {
      return archive.id === parseInt(versionPicker.value);
    });

    if (theArchive) {
      this.displayArchive(theArchive);
    }
  }

  render() {
    let detail;
    let header;
    let managementPlan;
    if (this.state.archivedDisclosures && this.state.archivedDisclosures.length > 0) {
      const versions = this.state.archivedDisclosures.map(archivedDisclosure => {
        return (
          <option key={archivedDisclosure.id} value={archivedDisclosure.id}>
            Approved {formatDateTime(archivedDisclosure.approvedDate)}
          </option>
        );
      });

      let dispostion;

      if (
        getDispositionsEnabled(this.context.configState) &&
        this.state.disclosure &&
        this.state.disclosure.disposition
      ) {
        dispostion = (
          <span>
            <span style={{padding: '0 3px'}}>•</span>
            <span style={{fontWeight: 'normal'}}>
              {this.state.disclosure.disposition}
            </span>
          </span>

        );
      }

      const disclosureType = getDisclosureTypeString(
        this.context.configState,
        COIConstants.DISCLOSURE_TYPE.ANNUAL,
        this.context.configState.config.id
      );
      header = (
        <div>
          <span className={styles.versionPicker}>
            <label htmlFor="daVersionPicker" className={styles.versionLabel}>VERSION</label>
            <div>
              <select ref="versionPicker" id="daVersionPicker" className={styles.versionDropDown} onChange={this.changeArchive}>
                {versions}
              </select>
            </div>
          </span>

          <div className={styles.heading}>
            {disclosureType}
            {dispostion}
          </div>
          <div className={styles.dateRow}>
            Submitted On:
            <span className={styles.dateValue}>{this.getSubmittedDate()}</span>
          </div>
          <div className={styles.dateRow}>
            Approved On:
            <span className={styles.dateValue}>{this.getApprovedDate()}</span>
          </div>
        </div>
      );

      if (this.state.disclosure) {
        detail = (
          <ArchiveDetail
            disclosure={this.state.disclosure}
            config={this.state.config}
          />
        );
        if (this.state.disclosure.managementPlan.length > 0) {
          managementPlan = (
            <ManagementPlan
              disclosureId={this.state.disclosure.id}
            />
          );
        }
      }
    }
    else {
      header = (
        <div style={{height: 57}}></div>
      );

      detail = (
        <div style={{textAlign: 'center', marginTop: 100, fontSize: 18}}>No archives found</div>
      );
    }

    let isEditable = false;
    if (this.state.currentAnnualDisclosureStatus && (
          COIConstants.EDITABLE_STATUSES.includes(this.state.currentAnnualDisclosureStatus)
       )) {
      isEditable = true;
    }

    let updateDisclosureLink;
    if (isEditable) {
      updateDisclosureLink = (
        <Link to={"/coi/disclosure"}>
          <div className={`${styles.sidebarButton} ${styles.firstButton}`}>
            <div className={styles.sidebarTopText}>Update</div>
            <div className={styles.sidebarBottomText}>Annual Disclosure</div>
          </div>
        </Link>
      );
    }

    const linkClasses = classNames(
      styles.sidebarButton,
      {[styles.firstButton]: !updateDisclosureLink}
    );

    return (
      <div className={`flexbox column ${styles.app}`}>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <div className={`flexbox row fill ${styles.container} ${this.props.className}`}>
          <span className={styles.sidebar}>
            {updateDisclosureLink}
            <Link
              to={"/coi/dashboard"}
              query={{type: COIConstants.DISCLOSURE_TYPE.ANNUAL}}
            >
              <div className={linkClasses}>
                <div className={styles.sidebarTopText}>Back To</div>
                <div className={styles.sidebarBottomText}>Dashboard</div>
              </div>
            </Link>
          </span>
          <span className={`inline-flexbox column fill ${styles.content}`}>
            <div className={styles.header2}>
              {header}
            </div>
            {managementPlan}
            <div className={`fill`} style={{overflowY: 'auto'}}>
              {detail}
            </div>
          </span>
        </div>
      </div>
    );
  }
}

Archive.contextTypes = {
  configState: React.PropTypes.object
};
