import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {AdminStore} from '../../../stores/AdminStore';
import {DisclosureDetail} from './DisclosureDetail';
import {DisclosureList} from './DisclosureList';
import {AdminActions} from '../../../actions/AdminActions';
import {isAfterStartDate, isBeforeEndDate, sortFunction, typeFilter} from '../AdminFilters';


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

    this.searchFilter = this.searchFilter.bind(this);
  }

  shouldComponentUpdate() { return true; }

  componentDidMount() {
    AdminStore.listen(this.onChange);
    if (this.props.params !== undefined &&
        this.props.params.id !== undefined) {
      AdminActions.loadDisclosure(this.props.params.id);
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

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
      },
      details: {
        height: '100%'
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
