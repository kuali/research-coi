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
import {NewDisclosureButton} from '../new-disclosure-button';
import {DisclosureArchiveButton} from '../disclosure-archive-button';
import {ConfirmationMessage} from '../confirmation-message';
import {DisclosureTable} from '../disclosure-table';
import {ReviewTable} from '../review-table';
import {DisclosureStore} from '../../../../stores/disclosure-store';
import {TravelLogButton} from '../travel-log-button';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {
  DISCLOSURE_TYPE,
  ROLES,
  DISCLOSURE_STATUS
} from '../../../../../../coi-constants';
import ConfigStore from '../../../../stores/config-store';
import UserInfoStore from '../../../../stores/user-info-store';
import AdminMenu from '../../../admin-menu';
import moment from 'moment';

export class Dashboard extends React.Component {
  constructor() {
    super();

    const storeState = DisclosureStore.getState();
    const configState = ConfigStore.getState();

    this.state = {
      applicationState: storeState.applicationState,
      disclosureSummaries: storeState.disclosureSummariesForUser,
      projects: storeState.projects,
      annualDisclosure: storeState.annualDisclosure,
      configLoaded: configState.isLoaded,
      userInfo: UserInfoStore.getState().userInfo,
      toReview: storeState.disclosuresNeedingReview
    };

    this.onChange = this.onChange.bind(this);
  }

  shouldComponentUpdate() { return true; }

  componentDidMount() {
    DisclosureStore.listen(this.onChange);
    ConfigStore.listen(this.onChange);
    DisclosureActions.loadDisclosureSummaries();
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
    ConfigStore.unlisten(this.onChange);
  }

  onChange() {
    const storeState = DisclosureStore.getState();
    const configState = ConfigStore.getState();
    this.setState({
      applicationState: storeState.applicationState,
      disclosureSummaries: storeState.disclosureSummariesForUser,
      projects: storeState.projects,
      annualDisclosure: storeState.annualDisclosure,
      configLoaded: configState.isLoaded,
      userInfo: UserInfoStore.getState().userInfo,
      toReview: storeState.disclosuresNeedingReview
    });
  }

  render() {
    const {
      disclosureSummaries,
      userInfo,
      applicationState,
      projects,
      configLoaded,
      toReview
    } = this.state;

    const isAdminOrReviewer = userInfo &&
      (userInfo.coiRole === ROLES.ADMIN || userInfo.coiRole === ROLES.REVIEWER);

    let confirmationMessage;
    if (this.state && applicationState && applicationState.confirmationShowing) {
      confirmationMessage = (
        <ConfirmationMessage />
      );
    }

    let annualDisclosureButton;
    let travelLogButton;
    let manualDisclosureButton;

    let annualDisclosureEnabled;
    let manualDisclosureEnabled;
    let travelLogEnabled;

    window.config.disclosureTypes.forEach(type => {
      switch(type.typeCd.toString()) {
        case DISCLOSURE_TYPE.ANNUAL:
          annualDisclosureEnabled = type.enabled === 1;
          break;
        case DISCLOSURE_TYPE.MANUAL:
          manualDisclosureEnabled = type.enabled === 1;
          break;
        case DISCLOSURE_TYPE.TRAVEL:
          travelLogEnabled = type.enabled === 1;
          break;
      }
    });

    if (annualDisclosureEnabled) {
      const annualDisclosure = disclosureSummaries.find(summary => {
        return summary.type.toString() === DISCLOSURE_TYPE.ANNUAL;
      });
      if (
        !annualDisclosure ||
        annualDisclosure.status === DISCLOSURE_STATUS.IN_PROGRESS ||
        annualDisclosure.status === DISCLOSURE_STATUS.UP_TO_DATE ||
        annualDisclosure.status === DISCLOSURE_STATUS.UPDATE_REQUIRED
      ) {
        annualDisclosureButton = (
          <div>
            <NewDisclosureButton type={DISCLOSURE_TYPE.ANNUAL}/>
          </div>
        );
      }
    }

    if (travelLogEnabled) {
      travelLogButton = (
        <div>
          <TravelLogButton/>
        </div>
      );
    }

    if (manualDisclosureEnabled) {
      manualDisclosureButton = (
        <div>
          <NewDisclosureButton type={DISCLOSURE_TYPE.MANUAL} />
        </div>
      );
    }
    if (!configLoaded) {
      return (<div/>);
    }

    let adminMenu;
    if (isAdminOrReviewer ) {
      adminMenu = (
        <AdminMenu
          role={userInfo.coiRole}
          className={`${styles.override} ${styles.adminMenu}`}
        />
      );
    }

    let newProjectBanner;
    if (Array.isArray(projects) && projects.filter(project => project.new === 1).length > 0) {
      newProjectBanner = (
        <div className={styles.infoBanner}>
          Your annual disclosure needs updates due to new projects to disclose.
        </div>
      );
    }

    let expirationBanner;
    if (disclosureSummaries.length > 0) {
      const expirationDate = disclosureSummaries.find(summary => {
        return String(summary.type) === DISCLOSURE_TYPE.ANNUAL;
      }).expired_date;
      if (expirationDate) {
        const days = moment(expirationDate).diff(moment(new Date()), 'days');
        expirationBanner = (
          <div className={styles.expiresBanner}>
            <span style={{paddingTop: '5px'}}>Your disclosure expires in:</span>
            <span className={styles.days}>{days}</span>
            <span style={{color: 'white', verticalAlign: 'bottom', marginBottom: '5px'}}>Days</span>
          </div>
        );
      }
    }

    let disclosureTableLabel;
    let reviewTableLabel;
    let reviewTable;
    if (userInfo.coiRole === ROLES.REVIEWER) {
      disclosureTableLabel = (
        <div className={styles.disclosureTableLabel}>My Disclosures</div>
      );
      reviewTableLabel = (
        <div className={styles.reviewTableLabel}>Needs Review</div>
      );
      reviewTable = (
        <ReviewTable disclosures={toReview} />
      );
    }

    const classes = classNames(
      'flexbox',
      'column',
      {[styles.isAdmin]: isAdminOrReviewer}
    );

    return (
      <div className={classes} style={{height: '100%'}}>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <span className={`flexbox row fill ${styles.container} ${this.props.className}`}>
          <span className={styles.sidebar}>
            {adminMenu}
            {annualDisclosureButton}
            {travelLogButton}
            {manualDisclosureButton}
            <div>
              <DisclosureArchiveButton className={`${styles.override} ${styles.borderBottom}`} />
            </div>
          </span>
          <span className={`fill ${styles.content}`}>
            <div className={styles.header2}>
              <h2 className={styles.heading}>MY COI DASHBOARD</h2>
            </div>
            {confirmationMessage}
            <div>
              <div className={styles.bannerContainer}>
                {expirationBanner}
                {newProjectBanner}
              </div>
            </div>
            {disclosureTableLabel}
            <DisclosureTable disclosures={disclosureSummaries} />
            {reviewTableLabel}
            {reviewTable}
          </span>
        </span>
      </div>
    );
  }
}
