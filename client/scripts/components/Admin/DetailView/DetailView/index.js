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
import React from 'react';
import {AdminStore} from '../../../../stores/AdminStore';
import ConfigStore from '../../../../stores/ConfigStore';
import {DisclosureDetail} from '../DisclosureDetail';
import {DisclosureList} from '../DisclosureList';
import {AdminActions} from '../../../../actions/AdminActions';
import CommentingPanel from '../CommentingPanel';
import AdditionalReviewPanel from '../AdditionalReviewPanel';
import CommentSummary from '../CommentSummary';
import GeneralAttachmentsPanel from '../GeneralAttachmentsPanel';
import UploadAttachmentsPanel from '../UploadAttachmentsPanel';
import {COIConstants} from '../../../../../../COIConstants';
import {AppHeader} from '../../../AppHeader';
import classNames from 'classnames';

export class DetailView extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    const store = AdminStore.getState();
    const configStore = ConfigStore.getState();
    this.state = {
      summaries: store.disclosureSummaries,
      applicationState: store.applicationState,
      config: configStore.config
    };

    this.searchFilter = this.searchFilter.bind(this);
  }

  componentDidMount() {
    AdminStore.listen(this.onChange);
    if (this.props.params !== undefined && this.props.params.id !== undefined && this.props.params.statusCd !== undefined) {
      if (this.props.params.statusCd === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE.toString()) {
        AdminActions.loadArchivedDisclosure(this.props.params.id);
      } else {
        AdminActions.loadDisclosure(this.props.params.id);
      }
    }
    ConfigStore.listen(this.onChange);
  }

  componentWillUnmount() {
    AdminStore.unlisten(this.onChange);
    ConfigStore.unlisten(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.statusCd === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE.toString()) {
      AdminActions.loadArchivedDisclosure(nextProps.params.id);
    } else {
      AdminActions.loadDisclosure(nextProps.params.id);
    }
  }

  onChange() {
    const newState = {};
    const config = ConfigStore.getState();
    if (config.isLoaded) {
      newState.config = config.config;
    }
    const store = AdminStore.getState();
    newState.summaries = store.disclosureSummaries;
    newState.applicationState = store.applicationState;

    this.setState(newState);
  }

  searchFilter(disclosure) {
    let query = this.state.applicationState.query;
    if (query && query.length > 0) {
      query = query.toLowerCase();
      if (disclosure.submittedBy.toLowerCase().startsWith(query)) {
        return true;
      }
      else if (disclosure.type.toLowerCase().startsWith(query)) {
        return true;
      }
    }
    else {
      return true;
    }
  }

  filterDisclosures() {
    const filtered = this.state.summaries;
    return filtered;
  }

  render() {
    let sidePanel;
    if (this.state.applicationState.commentingPanelShowing) {
      const comments = this.state.applicationState.currentComments;

      sidePanel = (
        <CommentingPanel
          topic={this.state.applicationState.commentTitle}
          topicSection={this.state.applicationState.commentTopic}
          topicId={this.state.applicationState.commentId}
          comments={comments}
          disclosureId={this.state.applicationState.selectedDisclosure.id}
          readonly={this.state.applicationState.selectedDisclosure.statusCd === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE
           || this.state.applicationState.selectedDisclosure.statusCd === COIConstants.DISCLOSURE_STATUS.UPDATES_REQUIRED}
        />
      );
    }
    else if (this.state.applicationState.additionalReviewShowing) {
      let managementPlan;
      let reviewers = [];
      let readOnly = true;
      if (this.state.applicationState.selectedDisclosure) {
        reviewers = this.state.applicationState.selectedDisclosure.reviewers;
        managementPlan = this.state.applicationState.selectedDisclosure.managementPlan;
        readOnly = this.state.applicationState.selectedDisclosure.statusCd === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE;
      }
      sidePanel = (
        <AdditionalReviewPanel
          reviewerSearchValue={this.state.applicationState.reviewerSearchValue}
          reviewers={reviewers}
          managementPlan={managementPlan}
          readonly={readOnly}
        />
      );
    }
    else if (this.state.applicationState.commentSummaryShowing) {
      sidePanel = (
        <CommentSummary
          disclosure={this.state.applicationState.selectedDisclosure}
        />
      );
    }
    else if (this.state.applicationState.generalAttachmentsShowing) {
      sidePanel = (
        <GeneralAttachmentsPanel
          files={this.state.applicationState.selectedDisclosure.files}
        />
      );
    }
    else if (this.state.applicationState.uploadAttachmentsShowing) {
      const adminFiles = this.state.applicationState.selectedDisclosure.files
        .filter(file => file.file_type === COIConstants.FILE_TYPE.ADMIN );
      sidePanel = (
        <UploadAttachmentsPanel
          files={adminFiles}
          readonly={this.state.applicationState.selectedDisclosure.statusCd === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE}
        />
      );
    }

    let disclosureDetail;
    if (this.state.applicationState.selectedDisclosure && this.state.config) {
      disclosureDetail = (
        <DisclosureDetail
          disclosure={this.state.applicationState.selectedDisclosure}
          piResponses={this.state.applicationState.piResponses}
          showApproval={this.state.applicationState.showingApproval}
          showRejection={this.state.applicationState.showingRejection}
          config={this.state.config}
        />
      );
    }
    else if (this.state.applicationState.loadingDisclosure) {
      disclosureDetail = (
        <div className={styles.loadingDisclosure}>Loading...</div>
      );
    }

    return (
      <div
        className={`flexbox column ${classNames({[styles.listShowing]: this.state.applicationState.listShowing})}`}
        style={{height: '100%', overflowX: 'hidden'}}
      >
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <div className={`flexbox row fill ${classNames(styles.container, this.props.className)}`}>
          <DisclosureList
            className={`inline-flexbox column ${styles.override} ${styles.list}`}
            summaries={this.filterDisclosures()}
            selected={this.state.applicationState.selectedDisclosure}
            query={this.state.applicationState.query}
            filters={this.state.applicationState.filters}
            sortDirection={this.state.applicationState.sortDirection}
            count={this.state.applicationState.summaryCount}
            searchTerm={this.state.applicationState.effectiveSearchValue}
            loadingMore={this.state.applicationState.loadingMore}
            loadedAll={this.state.applicationState.loadedAll}
            showFilters={this.state.applicationState.showFilters}
          />
          <div className={`inline-flexbox fill`}>
            {disclosureDetail}
          </div>
          <span className={styles.sidePanel}>
            {sidePanel}
          </span>
        </div>
      </div>
    );
  }
}
