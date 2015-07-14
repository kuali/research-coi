import React from 'react/addons';
import {merge} from '../../../merge';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {NewDisclosureButton} from './NewDisclosureButton';
import {DisclosureArchiveButton} from './DisclosureArchiveButton';
import {FinancialEntitiesButton} from './FinancialEntitiesButton';
import {ConfirmationMessage} from './ConfirmationMessage';
import {DisclosureTable} from './DisclosureTable';
import {DisclosureStore} from '../../../stores/DisclosureStore';

export class Dashboard extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    let storeState = DisclosureStore.getState();

    this.state = {
      applicationState: storeState.applicationState,

      disclosures: [
        {
          type: 'Annual',
          status: 'Update Required',
          lastReviewed: '05/09/2014',
          expiresOn: '05/09/2015'
        },
        {
          type: 'Event',
          status: 'Update Required',
          lastReviewed: '01/12/2015',
          title: 'Wilkerson Analysis'
        },
        {
          type: 'Manual',
          status: 'Incomplete',
          lastReviewed: '01/01/2015',
          title: 'Drawing a Blank'
        },
        {
          type: 'Travel',
          status: 'Incomplete',
          lastReviewed: '04/15/2015',
          title: 'COI Sub-Committee Party'
        },
        {
          type: 'Travel',
          status: 'Pending Review',
          lastReviewed: '02/23/2015',
          title: 'Sample Gathering'
        },
        {
          type: 'Event',
          status: 'Pending Review',
          lastReviewed: '03/04/2015',
          title: 'Thurman Experiment'
        }
      ]
    };

    this.onChange = this.onChange.bind(this);
  }

  shouldComponentUpdate() {return true;}

  componentDidMount() {
    DisclosureStore.listen(this.onChange);
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = DisclosureStore.getState();
    this.setState({
      applicationState: storeState.applicationState
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

          <DisclosureTable disclosures={this.state.disclosures} />
        </span>
        <div style={styles.mobileMenu}>
          <NewDisclosureButton type="Annual" />
          <NewDisclosureButton type="Travel" />
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
        background: '#DDD'
      },
      sidebar: {
        width: 200,
        display: 'inline-block',
        backgroundColor: '#202020',
        verticalAlign: 'top',
        paddingTop: 125
      },
      content: {
        display: 'inline-block',
        verticalAlign: 'top',
        borderTop: '8px solid ' + window.config.colors.two
      },
      header: {
        backgroundColor: 'white',
        padding: '17px 0 17px 50px',
        position: 'relative',
        borderBottom: '1px solid #e3e3e3'
      },
      heading: {
        fontSize: '33px',
        margin: '0 0 0 0',
        textTransform: 'uppercase',
        fontWeight: 300,
        color: window.config.colors.one
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
            <NewDisclosureButton type="Annual" />
          </div>
          <div>
            <NewDisclosureButton type="Travel" />
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

          <DisclosureTable disclosures={this.state.disclosures} />
        </span>
      </span>
    );
  }
}