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
import Modal from '../../../modal';
import {AdminStore} from '../../../../stores/admin-store';
import {DisclosureDetail} from '../disclosure-detail';
import {DisclosureList} from '../disclosure-list';
import {AdminActions} from '../../../../actions/admin-actions';
import CommentingPanel from '../commenting-panel';
import AdditionalReviewPanel from '../additional-review-panel';
import CommentSummary from '../comment-summary';
import GeneralAttachmentsPanel from '../general-attachments-panel';
import UploadAttachmentsPanel from '../upload-attachments-panel';
import {DISCLOSURE_STATUS, FILE_TYPE} from '../../../../../../coi-constants';
import {AppHeader} from '../../../app-header';

export class DetailView extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    const store = AdminStore.getState();
    this.state = {
      summaries: store.disclosureSummaries,
      applicationState: store.applicationState
    };

    this.searchFilter = this.searchFilter.bind(this);
  }

  componentDidMount() {
    AdminStore.listen(this.onChange);
    if (this.props.params !== undefined && this.props.params.id !== undefined && this.props.params.statusCd !== undefined) {
      if (this.props.params.statusCd === DISCLOSURE_STATUS.UP_TO_DATE.toString() ||
      this.props.params.statusCd === DISCLOSURE_STATUS.UPDATE_REQUIRED.toString()) {
        AdminActions.loadArchivedDisclosure(this.props.params.id);
      } else {
        AdminActions.loadDisclosure(this.props.params.id);
      }
    }
  }

  componentWillUnmount() {
    AdminStore.unlisten(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.params.id !== nextProps.params.id ||
      this.props.params.statusCd !== nextProps.params.statusCd
    ) {
      if (nextProps.params.statusCd === DISCLOSURE_STATUS.UP_TO_DATE.toString() ||
        this.props.params.statusCd === DISCLOSURE_STATUS.UPDATE_REQUIRED.toString()) {
        AdminActions.loadArchivedDisclosure(nextProps.params.id);
      } else {
        AdminActions.loadDisclosure(nextProps.params.id);
      }
    }
  }

  onChange() {
    const newState = {};
    const config = this.context.configState;
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
    const { userInfo } = this.context;

    let sidePanel;
    let top = 0;
    if (this.state.applicationState.commentingPanelShowing) {
      top = window.pageYOffset > 45 ? window.pageYOffset - 45 : 0;
      const comments = this.state.applicationState.currentComments;
      sidePanel = (
        <CommentingPanel
          comments={comments}
          comment={this.state.applicationState.comment}
          editingComment={this.state.applicationState.editingComment}
          disclosureId={this.state.applicationState.selectedDisclosure.id}
          role={userInfo.coiRole}
          readonly={this.state.applicationState.selectedDisclosure.statusCd === DISCLOSURE_STATUS.UP_TO_DATE
           || this.state.applicationState.selectedDisclosure.statusCd === DISCLOSURE_STATUS.REVISION_REQUIRED
           || this.state.applicationState.selectedDisclosure.statusCd === DISCLOSURE_STATUS.UPDATE_REQUIRED}
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
        readOnly = this.state.applicationState.selectedDisclosure.statusCd === DISCLOSURE_STATUS.UP_TO_DATE
          || this.state.applicationState.selectedDisclosure.statusCd === DISCLOSURE_STATUS.UPDATE_REQUIRED
          || this.state.applicationState.selectedDisclosure.statusCd === DISCLOSURE_STATUS.EXPIRED;
      }
      sidePanel = (
        <AdditionalReviewPanel
          displayAdditionalReviewers={this.state.applicationState.displayAdditionalReviewers}
          statusCd={this.state.applicationState.selectedDisclosure.statusCd}
          disclosureId={this.state.applicationState.selectedDisclosure.id}
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
          role={userInfo.coiRole}
          disclosure={this.state.applicationState.selectedDisclosure}
          configId={this.state.applicationState.selectedDisclosure.configId}
        />
      );
    }
    else if (this.state.applicationState.generalAttachmentsShowing) {
      const files = this.state.applicationState.selectedDisclosure.files
        .filter(file => file.fileType === FILE_TYPE.DISCLOSURE );
      sidePanel = (
        <GeneralAttachmentsPanel
          files={files}
        />
      );
    }
    else if (this.state.applicationState.uploadAttachmentsShowing) {
      const adminFiles = this.state.applicationState.selectedDisclosure.files
        .filter(file => file.fileType === FILE_TYPE.ADMIN );
      sidePanel = (
        <UploadAttachmentsPanel
          files={adminFiles}
          readonly={this.state.applicationState.selectedDisclosure.statusCd === DISCLOSURE_STATUS.UP_TO_DATE
          || this.state.applicationState.selectedDisclosure.statusCd === DISCLOSURE_STATUS.UPDATE_REQUIRED
          || this.state.applicationState.selectedDisclosure.statusCd === DISCLOSURE_STATUS.EXPIRED}
        />
      );
    }

    let disclosureDetail;
    if (this.state.applicationState.selectedDisclosure && this.context.configState.config) {
      disclosureDetail = (
        <DisclosureDetail
          disclosure={this.state.applicationState.selectedDisclosure}
          piResponses={this.state.applicationState.piResponses}
          showApproval={this.state.applicationState.showingApproval}
          showRejection={this.state.applicationState.showingRejection}
          role={userInfo.coiRole}
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
        style={{minHeight: '100%', overflowX: 'hidden'}}
      >
        <Modal
          isOpen={this.state.applicationState.currentArchiveId !== undefined}
          onRequestClose={AdminActions.closeArchivedDisclosureModal}
        >
          Hi!
        </Modal>

        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <div className={`flexbox row fill ${classNames(styles.container, this.props.className)}`}>
          <DisclosureList
            className={`inline-flexbox column ${styles.override} ${styles.list}`}
            summaries={this.filterDisclosures()}
            selected={this.state.applicationState.selectedDisclosure}
            query={this.state.applicationState.query}
            filters={this.state.applicationState.filters}
            sortDirection={this.state.applicationState.sortDirection}
            reviewerFilterValues={this.state.applicationState.reviewerFilterValues}
            count={this.state.applicationState.summaryCount}
            searchTerm={this.state.applicationState.effectiveSearchValue}
            loadingMore={this.state.applicationState.loadingMore}
            loadedAll={this.state.applicationState.loadedAll}
            showFilters={this.state.applicationState.showFilters}
            possibleDispositions={this.context.configState.config.dispositionTypes}
          />
          <div className={'inline-flexbox fill'}>
            {disclosureDetail}
          </div>
          <span className={styles.sidePanel} style={{top}}>
            {sidePanel}
          </span>
        </div>
      </div>
    );
  }
}

DetailView.contextTypes = {
  configState: React.PropTypes.object,
  userInfo: React.PropTypes.object
};
