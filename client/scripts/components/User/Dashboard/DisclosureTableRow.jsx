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

import React from 'react/addons';
import {merge} from '../../../merge';
import {GreyButton} from '../../GreyButton';
import Router from 'react-router';
import {formatDate} from '../../../formatDate';
import ConfigStore from '../../../stores/ConfigStore';
import {COIConstants} from '../../../../../COIConstants';

let Link = Router.Link;

export class DisclosureTableRow extends React.Component {
  wrapWithUpdateLink(dom) {
    return (
      <Link style={{color: window.colorBlindModeOn ? 'black' : '#0095A0'}} to="disclosure" query={{type: this.props.type }}>
        {dom}
      </Link>
    );
  }

  wrapWithReviseLink(dom) {
    return (
      <Link style={{color: window.colorBlindModeOn ? 'black' : '#0095A0'}} to={`/revise/${this.props.disclosureId}`}>
        {dom}
      </Link>
    );
  }

  render() {
    let styles = {
      container: {
        padding: '20px 60px',
        borderBottom: '5px solid white',
        backgroundColor: this.props.type === 'Annual' ? '#E9E9E9' : '#F7F7F7',
        color: window.colorBlindModeOn ? 'black' : '#333'
      },
      cell: {
        display: 'inline-block',
        verticalAlign: 'top'
      },
      one: {
        width: this.props.showButtonColumn ? '35%' : '33%'
      },
      two: {
        width: this.props.showButtonColumn ? '25%' : '33%',
        fontSize: 17
      },
      three: {
        width: this.props.showButtonColumn ? '25%' : '33%',
        fontSize: 17
      },
      four: {
        width: '15%'
      },
      type: {
        fontSize: 17
      },
      extra: {
        fontSize: 14
      }
    };

    let updateable = this.props.status === COIConstants.DISCLOSURE_STATUS.IN_PROGRESS ||
      this.props.status === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE ||
      this.props.status === COIConstants.DISCLOSURE_STATUS.EXPIRED;

    let revisable = this.props.status === COIConstants.DISCLOSURE_STATUS.UPDATES_REQUIRED;

    let extraInfo;
    if (this.props.expiresOn) {
      extraInfo = (
        <span role="gridcell" style={merge(styles.cell, styles.one)}>
          <div style={styles.type}>{ConfigStore.getDisclosureTypeString(this.props.type)}</div>
          <div style={styles.extra}>
            Expires On:
            <span style={{marginLeft: 3}}>
              {formatDate(this.props.expiresOn)}
            </span>
          </div>
        </span>
      );
    }
    else {
      extraInfo = (
        <span role="gridcell" style={merge(styles.cell, styles.one)}>
          <div style={styles.type}>{ConfigStore.getDisclosureTypeString(this.props.type)}</div>
        </span>
      );
    }
    if (updateable) {
      extraInfo = this.wrapWithUpdateLink(extraInfo);
    }
    else if (revisable) {
      extraInfo = this.wrapWithReviseLink(extraInfo);
    }

    let status = (
      <span role="gridcell" style={merge(styles.cell, styles.two)}>
        {ConfigStore.getDisclosureStatusString(this.props.status)}
      </span>
    );
    if (updateable) {
      status = this.wrapWithUpdateLink(status);
    }
    else if (revisable) {
      status = this.wrapWithReviseLink(status);
    }

    let lastReviewed = (
      <span role="gridcell" style={merge(styles.cell, styles.three)}>
        {this.props.lastreviewed ? formatDate(this.props.lastreviewed) : 'None'}
      </span>
    );
    if (updateable) {
      lastReviewed = this.wrapWithUpdateLink(lastReviewed);
    }
    else if (revisable) {
      lastReviewed = this.wrapWithReviseLink(lastReviewed);
    }

    let button;
    if (updateable) {
      button = this.wrapWithUpdateLink((
        <GreyButton>Update &gt;</GreyButton>
      ));
    } else if (revisable) {
      button = this.wrapWithReviseLink((
        <GreyButton>Revise &gt;</GreyButton>
      ));
    }

    let buttonColumn;
    if (this.props.showButtonColumn) {
      buttonColumn = (
        <span role="gridcell" style={merge(styles.cell, styles.four)}>
          {button}
        </span>
      );
    }

    return (
      <div role="row" style={merge(styles.container, this.props.style)}>
        {extraInfo}
        {status}
        {lastReviewed}
        {buttonColumn}
      </div>
    );
  }
}
