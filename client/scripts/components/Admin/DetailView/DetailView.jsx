import React from 'react/addons';
import {merge} from '../../../merge';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {AdminStore} from '../../../stores/AdminStore';
import {DisclosureDetail} from './DisclosureDetail';
import {DisclosureList} from './DisclosureList';
import {AdminActions} from '../../../actions/AdminActions';

export class DetailView extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.onChange = this.onChange.bind(this);
    let store = AdminStore.getState();
    this.state = {
      summaries: store.disclosureSummaries,
      applicationState: store.applicationState
    };
  }

  shouldComponentUpdate(nextProps, nextState) {return true;}

  componentDidMount() {
    AdminStore.listen(this.onChange);
    if (this.state.summaries.length > 0 && !this.state.applicationState.selected) {
      AdminActions.loadDisclosure(this.state.summaries[0].id);
    }
  }

  componentWillUnmount() {
    AdminStore.unlisten(this.onChange);
  }

  onChange() {
    let store = AdminStore.getState();
    this.setState({
      summaries: store.disclosureSummaries,
      applicationState: store.applicationState
    });
  }

  filterDisclosures() {
    let dateFilter = this.state.applicationState.filters.date;
    let typeFilter = this.state.applicationState.filters.type;
    let statusFilter = this.state.applicationState.filters.status;
    let query = this.state.applicationState.query ? this.state.applicationState.query.toLowerCase() : '';

    let filtered =  this.state.summaries.filter((disclosure) => {
      if (disclosure.submittedBy.toLowerCase().startsWith(query)) {
        return true;
      }
      else if (disclosure.type.toLowerCase().startsWith(query)) {
        return true;
      }
    }).filter((disclosure) => { // Start date filter
      let dateToUse = disclosure.revisedOn;
      if (!dateToUse) {
        dateToUse = disclosure.submittedOn;
      }

      if (dateFilter.start) {
        return dateToUse >= dateFilter.start;
      }
      else {
        return true;
      }
    }).filter((disclosure) => { // End date filter
      let dateToUse = disclosure.revisedOn;
      if (!dateToUse) {
        dateToUse = disclosure.submittedOn;
      }

      if (dateFilter.end) {
        return dateToUse <= dateFilter.end;
      }
      else {
        return true;
      }
    }).filter((disclosure) => { // Type filter
      if (typeFilter) {
        if (typeFilter.annual && disclosure.type === 'ANNUAL') {
          return true;
        }
        else if (typeFilter.project && disclosure.type === 'PROJECT') {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }
    }).filter((disclosure) => { // Status filter
      if (statusFilter) {
        if (statusFilter.inProgress && disclosure.status === 'IN_PROGRESS') {
          return true;
        }
        else if (statusFilter.awaitingReview && disclosure.status === 'AWAITING_REVIEW') {
          return true;
        }
        else if (statusFilter.revisionNecessary && disclosure.status === 'REVISION_NECESSARY') {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }
    }).sort((a, b) => {
      let aDateToUse = a.revisedOn;
      if (!aDateToUse) {
        aDateToUse = a.submittedOn;
      }

      let bDateToUse = b.revisedOn;
      if (!bDateToUse) {
        bDateToUse = b.submittedOn;
      }

      if (aDateToUse && bDateToUse) {
        if (this.state.applicationState.sortDirection === 'DESCENDING') {
          return bDateToUse - aDateToUse;
        }
        else {
          return aDateToUse - bDateToUse;
        }
      }
      else {
        return 0;
      }
    });

    return filtered;
  }

  getDisclosure(id) {
    this.state
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
      },
      details: {
        height: '100%',
        borderTop: '8px solid ' + window.config.colors.two
      },
      list: {
        width: 320
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let disclosureDetail;
    if (this.state.applicationState.selectedDisclosure) {
      disclosureDetail = (
        <DisclosureDetail
          disclosure={this.state.applicationState.selectedDisclosure}
          showApproval={this.state.applicationState.showingApproval}
          showRejection={this.state.applicationState.showingRejection}
          showingQuestionnaireComments={this.state.applicationState.showingQuestionnaireComments}
          showingEntitiesComments={this.state.applicationState.showingEntitiesComments}
          showingProjectComments={this.state.applicationState.showingProjectComments}
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
        />
        <div className="inline-flexbox fill" style={styles.details}>
          {disclosureDetail}
        </div>
      </div>
    );
  }
}