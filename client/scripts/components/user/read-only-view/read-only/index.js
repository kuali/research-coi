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
import {AppHeader} from '../../../app-header';
import {DisclosureStore} from '../../../../stores/disclosure-store';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {
  getDisclosureTypeString,
  getDisclosureStatusString
} from '../../../../stores/config-store';
import {Link} from 'react-router';
import ReadOnlyDetail from '../read-only-detail';
import {formatDateTime} from '../../../../format-date';
import {
  DISCLOSURE_TYPE
} from '../../../../../../coi-constants';

export default class ReadOnly extends React.Component {
  constructor() {
    super();

    const storeState = DisclosureStore.getState();
    this.state = {
      disclosure: storeState.disclosureDetail
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    DisclosureStore.listen(this.onChange);
    DisclosureActions.loadDisclosureDetail(this.props.params.id);
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
  }

  onChange() {
    const storeState = DisclosureStore.getState();
    this.setState({
      disclosure: storeState.disclosureDetail
    });
  }

  getSubmittedDate() {
    if (!this.state.disclosure) {
      return '';
    }

    return formatDateTime(this.state.disclosure.submittedDate);
  }

  render() {
    let detail;
    let header;
    if (this.state.disclosure) {
      const disclosureType = getDisclosureTypeString(
        this.context.configState,
        DISCLOSURE_TYPE.ANNUAL,
        this.state.disclosure.configId
      );
      const statusString = getDisclosureStatusString(
        this.context.configState,
        this.state.disclosure.statusCd,
        this.state.disclosure.configId
      );
      header = (
        <div>
          <div className={styles.heading}>
            {disclosureType}
          </div>
          <div className={styles.dateRow}>
            Submitted On:
            <span className={styles.dateValue}>{this.getSubmittedDate()}</span>
          </div>
          <div className={styles.statusRow}>
            Status:
            <span className={styles.statusValue}>{statusString}</span>
          </div>
        </div>
      );

      detail = (
        <ReadOnlyDetail disclosure={this.state.disclosure} />
      );
    }
    else {
      header = (
        <div style={{height: 57}} />
      );

      detail = (
        <div style={{textAlign: 'center', marginTop: 100, fontSize: 18}}>
          Not found
        </div>
      );
    }

    return (
      <div className={`flexbox column ${styles.app}`}>
        <AppHeader
          className={`${styles.override} ${styles.header}`}
          moduleName={'Conflict Of Interest'}
        />
        <div
          className={
            `flexbox row fill ${styles.container} ${this.props.className}`
          }
        >
          <span className={styles.sidebar}>
            <Link to={{pathname: '/coi/dashboard'}}>
              <div className={`${styles.sidebarButton} ${styles.firstButton}`}>
                <div className={styles.sidebarTopText}>Back To</div>
                <div className={styles.sidebarBottomText}>Dashboard</div>
              </div>
            </Link>
          </span>
          <span className={`inline-flexbox column fill ${styles.content}`}>
            <div className={styles.header2}>
              {header}
            </div>
            <div className={'fill'} style={{overflowY: 'auto'}}>
              {detail}
            </div>
          </span>
        </div>
      </div>
    );
  }
}

ReadOnly.contextTypes = {
  configState: React.PropTypes.object
};
