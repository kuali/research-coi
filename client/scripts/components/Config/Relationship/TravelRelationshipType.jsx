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

import React from 'react'; // eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import RelationshipType from './RelationshipType';
import {BlueButton} from '../../BlueButton';
import {GreyButton} from '../../GreyButton';

export default class TravelRelationshipType extends RelationshipType {
  constructor() {
    super();

    this.destinationEnabledChanged = this.destinationEnabledChanged.bind(this);
    this.dateEnabledChanged = this.dateEnabledChanged.bind(this);
    this.reasonEnabledChanged = this.reasonEnabledChanged.bind(this);
  }

  enabledChanged() {
    let checkbox = this.refs.enabledCheckbox;
    this.props.enabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  destinationEnabledChanged() {
    let checkbox = this.refs.destinationEnabled;
    this.props.destinationEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  dateEnabledChanged() {
    let checkbox = this.refs.dateEnabled;
    this.props.dateEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  reasonEnabledChanged() {
    let checkbox = this.refs.reasonEnabled;
    this.props.reasonEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }


  render() {
    let styles = {
      container: {
      },
      collapsedContent: {
        borderBottom: '1px solid #E6E6E6',
        paddingBottom: 20,
        marginBottom: 15,
        verticalAlign: 'top'
      },
      configureButton: {
        float: 'right',
        fontSize: 9
      },
      closeButton: {
        float: 'right',
        fontSize: 9
      },
      name: {
        fontSize: 14
      },
      left: {
        paddingRight: 25,
        width: 200
      },
      checkboxLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        verticalAlign: 'middle'
      },
      amountSection: {
        paddingLeft: 27,
        margin: '40px 0'
      }
    };

    let content;
    if (this.state.editing) {
      content = (
      <div>
        <div style={{marginBottom: 30}}>
          <BlueButton style={styles.closeButton} onClick={this.close}>
            Close
          </BlueButton>
          <label htmlFor={`rtcb${this.props.typeCd}`} style={styles.name}>{this.props.name}</label>
        </div>
        <div className="flexbox row" style={styles.amountSection}>
            <span style={styles.left}>
              <input id="amountCheckbox" type="checkbox" ref="amountEnabled" checked={this.props.amountEnabled === 1} onChange={this.amountEnabledChanged} />
              <label htmlFor="amountCheckbox" style={styles.checkboxLabel}>Amount</label>
            </span>
        </div>
        <div className="flexbox row" style={styles.amountSection}>
            <span style={styles.left}>
              <input id="destinationCheckbox" type="checkbox" ref="destinationEnabled" checked={this.props.destinationEnabled === 1} onChange={this.destinationEnabledChanged} />
              <label htmlFor="destinationCheckbox" style={styles.checkboxLabel}>Destination</label>
            </span>
        </div>
        <div className="flexbox row" style={styles.amountSection}>
            <span style={styles.left}>
              <input id="dateCheckbox" type="checkbox" ref="dateEnabled" checked={this.props.dateEnabled === 1} onChange={this.dateEnabledChanged} />
              <label htmlFor="dateCheckbox" style={styles.checkboxLabel}>Date Range</label>
            </span>
        </div>
        <div className="flexbox row" style={styles.amountSection}>
            <span style={styles.left}>
              <input id="reasonCheckbox" type="checkbox" ref="reasonEnabled" checked={this.props.reasonEnabled === 1} onChange={this.reasonEnabledChanged} />
              <label htmlFor="reasonCheckbox" style={styles.checkboxLabel}>Reason</label>
            </span>
        </div>
      </div>
      );
    }
    else {
      content = (
      <div style={styles.collapsedContent}>
        <GreyButton style={styles.configureButton} onClick={this.configure}>
          Configure
        </GreyButton>
        <label htmlFor={`rtcb${this.props.typeCd}`} style={styles.name}>{this.props.name}</label>
      </div>
      );
    }

    return (
    <div className="flexbox row" style={merge(styles.container, this.props.style)}>
        <span style={{margin: '0 10px 0 20px'}}>
          <input
            type="checkbox"
            id={`rtcb${this.props.typeCd}`}
            checked={this.props.enabled === 1}
            onChange={this.enabledChanged}
            ref="enabledCheckbox"
            style={{verticalAlign: 'top'}}
          />
        </span>
        <span className="fill">
          {content}
        </span>
    </div>
    );
  }
}
