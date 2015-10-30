import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {DisclosureStore} from '../../../stores/DisclosureStore';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import Router from 'react-router';
let Link = Router.Link;
import ArchiveDetail from './ArchiveDetail';
import {formatDate} from '../../../formatDate';

export class Archive extends React.Component {
  constructor() {
    super();

    let storeState = DisclosureStore.getState();
    this.state = {
      archivedDisclosures: storeState.archivedDisclosures
    };

    this.onChange = this.onChange.bind(this);
    this.changeArchive = this.changeArchive.bind(this);
  }

  componentDidMount() {
    DisclosureStore.listen(this.onChange);
    DisclosureActions.loadArchivedDisclosures();
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = DisclosureStore.getState();
    this.setState({
      archivedDisclosures: storeState.archivedDisclosures
    });

    if (storeState.archivedDisclosures && storeState.archivedDisclosures.length > 0) {
      this.displayArchive(storeState.archivedDisclosures[0]);
    }
  }

  getSubmittedDate() {
    if (!this.state.disclosure) {
      return '';
    }

    return formatDate(this.state.disclosure.submittedDate);
  }

  getApprovedDate() {
    if (!this.state.disclosure) {
      return '';
    }

    return formatDate(this.state.disclosure.lastReviewDate);
  }

  displayArchive(archive) {
    this.setState({
      disclosure: JSON.parse(archive.disclosure),
      config: JSON.parse(archive.config)
    });
  }

  changeArchive() {
    let versionPicker = React.findDOMNode(this.refs.versionPicker);

    let theArchive = this.state.archivedDisclosures.find(archive => {
      return archive.id === parseInt(versionPicker.value);
    });

    if (theArchive) {
      this.displayArchive(theArchive);
    }
  }

  render() {
    let styles = {
      container: {
        background: '#eeeeee',
        minHeight: 100
      },
      sidebar: {
        minWidth: 300,
        display: 'inline-block',
        backgroundColor: '#eeeeee',
        verticalAlign: 'top',
        paddingTop: 125,
        boxShadow: '2px 1px 8px #D5D5D5'
      },
      sidebarButton: {
        borderBottom: window.colorBlindModeOn ? '1px solid black' : '1px solid #DDD',
        padding: '20px 40px',
        cursor: 'pointer',
        color: window.colorBlindModeOn ? 'black' : '#666'
      },
      firstButton: {
        borderTop: window.colorBlindModeOn ? '1px solid black' : '1px solid #DDD'
      },
      sidebarTopText: {
        fontSize: 28,
        fontWeight: 300
      },
      sidebarBottomText: {
        fontSize: 22,
        fontWeight: 'bold'
      },
      content: {
        verticalAlign: 'top'
      },
      header: {
        backgroundColor: 'white',
        padding: '12px 0 13px 33px',
        position: 'relative',
        borderBottom: '1px solid #e3e3e3',
        boxShadow: '0 2px 8px #CCC',
        minHeight: 83
      },
      heading: {
        fontSize: 19,
        fontWeight: 'bold'
      },
      dateRow: {
        fontSize: 14
      },
      dateValue: {
        fontWeight: 'bold',
        marginLeft: 3
      },
      versionPicker: {
        float: 'right',
        marginRight: 55,
        paddingTop: 8
      },
      versionLabel: {
        fontSize: 12
      },
      versionDropDown: {
      }
    };

    let detail;
    let header;
    if (this.state.archivedDisclosures && this.state.archivedDisclosures.length > 0) {
      let versions = this.state.archivedDisclosures.map(archivedDisclosure => {
        return (
          <option key={archivedDisclosure.id} value={archivedDisclosure.id}>
            Approved {formatDate(archivedDisclosure.approvedDate)}
          </option>
        );
      });

      header = (
        <div>
          <span style={styles.versionPicker}>
            <label htmlFor="daVersionPicker" style={styles.versionLabel}>VERSION</label>
            <div>
              <select ref="versionPicker" id="daVersionPicker" style={styles.versionDropDown} onChange={this.changeArchive}>
                {versions}
              </select>
            </div>
          </span>

          <div style={styles.heading}>Annual Disclosure</div>
          <div style={styles.dateRow}>
            Submited On:
            <span style={styles.dateValue}>{this.getSubmittedDate()}</span>
          </div>
          <div style={styles.dateRow}>
            Approved On:
            <span style={styles.dateValue}>{this.getApprovedDate()}</span>
          </div>
        </div>
      );

      if (this.state.disclosure) {
        detail = (
          <ArchiveDetail
            disclosure={this.state.disclosure}
            config={this.state.config}
          />
        );
      }
    }
    else {
      header = (
        <div style={{height: 57}}></div>
      );

      detail = (
        <div style={{textAlign: 'center', marginTop: 100, fontSize: 18}}>No archives found</div>
      );
    }

    return (
      <div className="flexbox row fill" style={merge(styles.container, this.props.style)}>
        <span style={styles.sidebar}>
          <Link to="dashboard">
            <div style={merge(styles.sidebarButton, styles.firstButton)}>
              <div style={styles.sidebarTopText}>Back To</div>
              <div style={styles.sidebarBottomText}>Dashboard</div>
            </div>
          </Link>
          <Link to="disclosure">
            <div style={styles.sidebarButton}>
              <div style={styles.sidebarTopText}>Update</div>
              <div style={styles.sidebarBottomText}>Annual Disclosure</div>
            </div>
          </Link>
        </span>
        <span className="inline-flexbox column fill" style={styles.content}>
          <div style={styles.header}>
            {header}
          </div>
          <div className="fill" style={{overflowY: 'auto'}}>
            {detail}
          </div>
        </span>
      </div>
    );
  }
}
