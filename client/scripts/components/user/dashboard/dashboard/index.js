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
import {get} from 'lodash';
import {AppHeader} from '../../../app-header';
import {NewDisclosureButton} from '../new-disclosure-button';
import {DisclosureArchiveButton} from '../disclosure-archive-button';
import {ConfirmationMessage} from '../confirmation-message';
import DisclosureTable from '../disclosure-table';
import {ReviewTable} from '../review-table';
import {DisclosureStore} from '../../../../stores/disclosure-store';
import {TravelLogButton} from '../travel-log-button';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {
  DISCLOSURE_TYPE,
  ROLES,
  DISCLOSURE_STATUS
} from '../../../../../../coi-constants';
import AdminMenu from '../../../admin-menu';
import moment from 'moment';

function shouldUpdateStatus(noEntityConfigValue, disclosureSummaries) {
  if (!noEntityConfigValue) {
    return true;
  }

  const annualSummary = disclosureSummaries.find(summary => {
    return String(summary.type) === DISCLOSURE_TYPE.ANNUAL;
  });
  if (annualSummary && annualSummary.entityCount === 0) {
    return false;
  }

  return true;
}

export class Dashboard extends React.Component {
  constructor() {
    super();

    const storeState = DisclosureStore.getState();

    this.state = {
      applicationState: storeState.applicationState,
      disclosureSummaries: storeState.disclosureSummariesForUser,
      projects: storeState.projects,
      annualDisclosure: storeState.annualDisclosure,
      toReview: storeState.disclosuresNeedingReview
    };

    this.onChange = this.onChange.bind(this);
  }

  shouldComponentUpdate() { return true; }

  componentDidMount() {
    DisclosureStore.listen(this.onChange);
    DisclosureActions.loadDisclosureSummaries();
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
  }

  onChange() {
    const storeState = DisclosureStore.getState();
    this.setState({
      applicationState: storeState.applicationState,
      disclosureSummaries: storeState.disclosureSummariesForUser,
      projects: storeState.projects,
      annualDisclosure: storeState.annualDisclosure,
      toReview: storeState.disclosuresNeedingReview
    });
  }

  render() {
    const {
      disclosureSummaries,
      applicationState,
      projects,
      toReview
    } = this.state;

    const { userInfo, configState } = this.context;

    const isAdmin = userInfo &&
      (userInfo.coiRole === ROLES.ADMIN);

    let confirmationMessage;
    if (this.state && applicationState && applicationState.confirmationShowing) {
      confirmationMessage = (
        <ConfirmationMessage />
      );
    }

    let annualDisclosureEnabled;
    let manualDisclosureEnabled;
    let travelLogEnabled;
    configState.config.disclosureTypes.forEach(type => {
      switch (type.typeCd.toString()) {
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

    let annualDisclosureButton;
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
            <NewDisclosureButton
              type={DISCLOSURE_TYPE.ANNUAL}
              update={disclosureSummaries.length > 0}
            />
          </div>
        );
      }
    }

    let travelLogButton;
    if (travelLogEnabled) {
      travelLogButton = (
        <div>
          <TravelLogButton />
        </div>
      );
    }

    let manualDisclosureButton;
    if (manualDisclosureEnabled) {
      manualDisclosureButton = (
        <div>
          <NewDisclosureButton type={DISCLOSURE_TYPE.MANUAL} />
        </div>
      );
    }
    if (!configState.isLoaded) {
      return (<div />);
    }

    let adminMenu;
    if (isAdmin ) {
      adminMenu = (
        <AdminMenu className={`${styles.override} ${styles.adminMenu}`} />
      );
    }

    const configValueOn = get(
      configState,
      'config.general.disableNewProjectStatusUpdateWhenNoEntities',
      false
    );
    let newProjectBanner;
    if (
      Array.isArray(projects) &&
      projects.some(project => project.new === 1) &&
      shouldUpdateStatus(configValueOn, disclosureSummaries)
    ) {
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
            <span className={styles.daysLabel}>Days</span>
          </div>
        );
      }
    }

    let banners;
    if (newProjectBanner || expirationBanner) {
      banners = (
        <div>
          <div className={styles.bannerContainer}>
            {expirationBanner}
            {newProjectBanner}
          </div>
        </div>
      );
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
      {[styles.isAdmin]: isAdmin}
    );

    return (
      <div className={classes} style={{minHeight: '100%'}}>
        <AppHeader
          className={`${styles.override} ${styles.header}`}
          moduleName={'Conflict Of Interest'}
        />
        <span className={`flexbox row fill ${styles.container} ${this.props.className}`}>
          <span className={styles.sidebar}>
            {adminMenu}
            {annualDisclosureButton}
            {travelLogButton}
            {manualDisclosureButton}
            <div>
              <DisclosureArchiveButton
                className={`${styles.override} ${styles.borderBottom}`}
              />
            </div>
          </span>
          <span className={`fill ${styles.content}`}>
            <div className={styles.header2}>
              <h2 className={styles.heading}>MY COI DASHBOARD</h2>
            </div>
            {confirmationMessage}
            {banners}
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

Dashboard.contextTypes = {
  configState: React.PropTypes.object,
  userInfo: React.PropTypes.object
};
