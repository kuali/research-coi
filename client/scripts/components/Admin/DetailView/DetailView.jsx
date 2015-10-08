import React from 'react/addons'; //eslint-disable-line no-unused-vars
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
    if (this.props.params !== undefined && this.props.params.id !== undefined) {
      AdminActions.loadDisclosure(this.props.params.id);
    }
    ConfigStore.listen(this.onChange);
  }

  componentWillUnmount() {
    AdminStore.unlisten(this.onChange);
    ConfigStore.unlisten(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    AdminActions.loadDisclosure(nextProps.params.id);
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
        />
      );
    }
    else if (this.state.applicationState.additionalReviewShowing) {
      sidePanel = (
        <AdditionalReviewPanel
          managementPlan={this.state.applicationState.selectedDisclosure.managementPlan}/>
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
        transition: 'transform .3s ease-in-out'
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
        transition: 'transform .3s ease-in-out'
      }
    };

    let disclosureDetail;
    if (this.state.applicationState.selectedDisclosure && this.state.config) {
      disclosureDetail = (
        <DisclosureDetail
          disclosure={this.state.applicationState.selectedDisclosure}
          showApproval={this.state.applicationState.showingApproval}
          showRejection={this.state.applicationState.showingRejection}
          config={this.state.config}
        />
      );
    }

    return (
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
        />
        <div className="inline-flexbox fill">
          {disclosureDetail}
        </div>
        <span style={styles.sidePanel}>
          {sidePanel}
        </span>
      </div>
    );
  }
}
