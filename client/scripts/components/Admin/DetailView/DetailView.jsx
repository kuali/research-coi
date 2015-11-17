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

import React from 'react'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {AdminStore} from '../../../stores/AdminStore';
import ConfigStore from '../../../stores/ConfigStore';
import {DisclosureDetail} from './DisclosureDetail';
import {DisclosureList} from './DisclosureList';
import {AdminActions} from '../../../actions/AdminActions';
import CommentingPanel from './CommentingPanel';
import AdditionalReviewPanel from './AdditionalReviewPanel';
import CommentSummary from './CommentSummary';
import GeneralAttachmentsPanel from './GeneralAttachmentsPanel';
import {COIConstants} from '../../../../../COIConstants';
import {AppHeader} from '../../AppHeader';

export class DetailView extends React.Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    let store = AdminStore.getState();
    let configStore = ConfigStore.getState();
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
    let newState = {};
    let config = ConfigStore.getState();
    if (config.isLoaded) {
      newState.config = config.config;
    }
    let store = AdminStore.getState();
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
    let filtered = this.state.summaries;
    return filtered;
  }

  render() {
    let sidePanel;
    if (this.state.applicationState.commentingPanelShowing) {
      let comments = this.state.applicationState.currentComments;

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
      let readOnly = true;
      if (this.state.applicationState.selectedDisclosure) {
        managementPlan = this.state.applicationState.selectedDisclosure.managementPlan;
        readOnly = this.state.applicationState.selectedDisclosure.statusCd === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE;
      }
      sidePanel = (
        <AdditionalReviewPanel
          managementPlan={managementPlan}
          readonly={readOnly}/>
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

    let styles = {
      container: {
        position: 'relative',
        transform: this.state.applicationState.listShowing ? 'translateX(0px)' : 'translateX(-320px)',
        transition: 'transform .2s ease-in-out',
        minHeight: 100
      },
      header: {
        boxShadow: '0 1px 6px #D1D1D1',
        zIndex: 19,
        position: 'relative'
      },
      list: {
        width: 320
      },
      sidePanel: {
        position: 'absolute',
        backgroundColor: '#DADADA',
        color: 'black',
        height: '100%',
        width: 570,
        transform: this.state.applicationState.listShowing ? 'translateX(0%)' : 'translateX(-250px)',
        transition: 'transform .2s ease-in-out',
        zIndex: 2
      },
      loadingDisclosure: {
        margin: '200px auto',
        color: '#AAA'
      }
    };

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
        <div style={styles.loadingDisclosure}>Loading...</div>
      );
    }

    return (
      <div className="flexbox column" style={{height: '100%', overflowX: 'hidden'}}>
        <AppHeader style={styles.header} />
        <div className="flexbox row fill" style={merge(styles.container, this.props.style)} >
          <DisclosureList
            className="inline-flexbox column"
            summaries={this.filterDisclosures()}
            style={styles.list}
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
          <div className="inline-flexbox fill">
            {disclosureDetail}
          </div>
          <span style={styles.sidePanel}>
            {sidePanel}
          </span>
        </div>
      </div>
    );
  }
}
