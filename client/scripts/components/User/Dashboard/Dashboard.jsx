import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {NewDisclosureButton} from './NewDisclosureButton';
import {DisclosureArchiveButton} from './DisclosureArchiveButton';
import {FinancialEntitiesButton} from './FinancialEntitiesButton';
import {ConfirmationMessage} from './ConfirmationMessage';
import {DisclosureTable} from './DisclosureTable';
import {DisclosureStore} from '../../../stores/DisclosureStore';
import {TravelLogButton} from './TravelLogButton';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class Dashboard extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    let storeState = DisclosureStore.getState();

    this.state = {
      applicationState: storeState.applicationState,
      disclosureSummaries: storeState.disclosureSummariesForUser
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
    let storeState = DisclosureStore.getState();
    this.setState({
      applicationState: storeState.applicationState,
      disclosureSummaries: storeState.disclosureSummariesForUser
    });
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        width: '100%',
        background: '#DDD',
        height: '0'
      },
      content: {
        display: 'inline-block',
        verticalAlign: 'top',
        overflowY: 'auto',
        overflowX: 'hidden'
      },
      header: {
        backgroundColor: 'white',
        position: 'relative',
        borderBottom: '1px solid #e3e3e3',
        padding: '6px 0',
        marginBottom: 6
      },
      heading: {
        textAlign: 'center',
        fontSize: '21px',
        margin: '0 0 0 0',
        textTransform: 'uppercase',
        fontWeight: 300,
        color: '#747474'
      },
      mobileMenu: {
        width: '100%'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    let confirmationMessage;
    if (this.state && this.state.confirmationShowing) {
      confirmationMessage = (
        <ConfirmationMessage />
      );
    }
    return (
      <span className="flexbox column fill" style={merge(styles.container, this.props.style)}>
        <span className="fill" style={styles.content}>
          <div style={styles.header}>
            <h2 style={styles.heading}>MY COI DASHBOARD</h2>
          </div>
          {confirmationMessage}

          <DisclosureTable disclosures={this.state.disclosureSummaries} />
        </span>
        <div style={styles.mobileMenu}>
          <NewDisclosureButton type="Annual" />
          <TravelLogButton />
          <NewDisclosureButton type="Manual" />
          <FinancialEntitiesButton />
          <DisclosureArchiveButton />
        </div>
      </span>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        width: '100%',
        backgroundColor: '#eeeeee'
      },
      sidebar: {
        minWidth: 300,
        display: 'inline-block',
        backgroundColor: '#eeeeee',
        verticalAlign: 'top',
        paddingTop: 125,
        boxShadow: '1px 0px 6px #D1D1D1'
      },
      content: {
        display: 'inline-block',
        verticalAlign: 'top'
      },
      header: {
        backgroundColor: 'white',
        padding: '17px 0 17px 50px',
        position: 'relative',
        borderBottom: '1px solid #e3e3e3',
        boxShadow: '0 1px 6px #D1D1D1'
      },
      heading: {
        fontSize: '33px',
        margin: '0 0 0 0',
        textTransform: 'uppercase',
        fontWeight: 300,
        color: '#525252'
      },
      annualButton: {
        borderTop: '1px solid #c0c0c0'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let confirmationMessage;
    if (this.state && this.state.applicationState && this.state.applicationState.confirmationShowing) {
      confirmationMessage = (
        <ConfirmationMessage />
      );
    }

    return (
      <span className="flexbox row fill" style={merge(styles.container, this.props.style)}>
        <span style={styles.sidebar}>
          <div>
            <NewDisclosureButton type="Annual" style={styles.annualButton} />
          </div>
          <div>
          <TravelLogButton />
          </div>
          <div>
            <NewDisclosureButton type="Manual" />
          </div>
          <div>
            <FinancialEntitiesButton />
          </div>
          <div>
            <DisclosureArchiveButton />
          </div>
        </span>
        <span className="fill" style={styles.content}>
          <div style={styles.header}>
            <h2 style={styles.heading}>MY COI DASHBOARD</h2>
          </div>
          {confirmationMessage}

          <DisclosureTable disclosures={this.state.disclosureSummaries} />
        </span>
      </span>
    );
  }
}
