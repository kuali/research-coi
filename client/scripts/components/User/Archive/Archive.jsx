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
import {AppHeader} from '../../AppHeader';
import {DisclosureStore} from '../../../stores/DisclosureStore';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {Link} from 'react-router';
import ArchiveDetail from './ArchiveDetail';
import {formatDate} from '../../../formatDate';
import {COIConstants} from '../../../../../COIConstants';

export class Archive extends React.Component {
  constructor() {
    super();

    const storeState = DisclosureStore.getState();
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
    const storeState = DisclosureStore.getState();
    this.setState({
      archivedDisclosures: storeState.archivedDisclosures,
      currentAnnualDisclosureStatus: storeState.currentAnnualDisclosureStatus
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
    const versionPicker = this.refs.versionPicker;

    const theArchive = this.state.archivedDisclosures.find(archive => {
      return archive.id === parseInt(versionPicker.value);
    });

    if (theArchive) {
      this.displayArchive(theArchive);
    }
  }

  render() {
    const styles = {
      container: {
        background: '#eeeeee',
        minHeight: 100
      },
      header: {
        boxShadow: '0 1px 6px #D1D1D1',
        zIndex: 10,
        position: 'relative'
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
      header2: {
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
      const versions = this.state.archivedDisclosures.map(archivedDisclosure => {
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

    let isEditable = false;
    if (this.state.currentAnnualDisclosureStatus && (
          this.state.currentAnnualDisclosureStatus === COIConstants.DISCLOSURE_STATUS.IN_PROGRESS ||
          this.state.currentAnnualDisclosureStatus === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE ||
          this.state.currentAnnualDisclosureStatus === COIConstants.DISCLOSURE_STATUS.EXPIRED
       )) {
      isEditable = true;
    }

    let updateDisclosureLink;
    if (isEditable) {
      updateDisclosureLink = (
        <Link to={"/coi/disclosure"}>
          <div style={merge(styles.sidebarButton, styles.firstButton)}>
            <div style={styles.sidebarTopText}>Update</div>
            <div style={styles.sidebarBottomText}>Annual Disclosure</div>
          </div>
        </Link>
      );
    }

    return (
      <div className="flexbox column" style={{height: '100%'}}>
        <AppHeader style={styles.header} />
        <div className="flexbox row fill" style={merge(styles.container, this.props.style)}>
          <span style={styles.sidebar}>
            {updateDisclosureLink}
            <Link to={"/coi/dashboard"}>
              <div style={merge(styles.sidebarButton, !updateDisclosureLink ? styles.firstButton : {})}>
                <div style={styles.sidebarTopText}>Back To</div>
                <div style={styles.sidebarBottomText}>Dashboard</div>
              </div>
            </Link>
          </span>
          <span className="inline-flexbox column fill" style={styles.content}>
            <div style={styles.header2}>
              {header}
            </div>
            <div className="fill" style={{overflowY: 'auto'}}>
              {detail}
            </div>
          </span>
        </div>
      </div>
    );
  }
}
