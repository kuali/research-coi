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

import styles from './style';
import classNames from 'classnames';
import React from 'react'; // eslint-disable-line no-unused-vars
import RelationshipType from '../relationship-type';
import {BlueButton} from '../../../blue-button';
import {GreyButton} from '../../../grey-button';

export default class TravelRelationshipType extends RelationshipType {
  constructor() {
    super();

    this.destinationEnabledChanged = this.destinationEnabledChanged.bind(this);
    this.dateEnabledChanged = this.dateEnabledChanged.bind(this);
    this.reasonEnabledChanged = this.reasonEnabledChanged.bind(this);
  }

  enabledChanged() {
    const checkbox = this.refs.enabledCheckbox;
    this.props.enabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  destinationEnabledChanged() {
    const checkbox = this.refs.destinationEnabled;
    this.props.destinationEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  dateEnabledChanged() {
    const checkbox = this.refs.dateEnabled;
    this.props.dateEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  reasonEnabledChanged() {
    const checkbox = this.refs.reasonEnabled;
    this.props.reasonEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }


  render() {
    let content;
    if (this.state.editing) {
      content = (
        <div>
          <div style={{marginBottom: 30}}>
            <BlueButton className={`${styles.override} ${styles.closeButton}`} onClick={this.close}>
              Close
            </BlueButton>
            <label htmlFor={`rtcb${this.props.typeCd}`} className={styles.name}>{this.props.name}</label>
          </div>
          <div className={`flexbox row ${styles.amountSection}`}>
            <span className={styles.left}>
              <input
                id="amountCheckbox"
                type="checkbox"
                ref="amountEnabled"
                checked={this.props.amountEnabled === 1}
                onChange={this.amountEnabledChanged}
              />
              <label htmlFor="amountCheckbox" className={styles.checkboxLabel}>Amount</label>
            </span>
          </div>
          <div className={`flexbox row ${styles.amountSection}`}>
            <span className={styles.left}>
              <input
                id="destinationCheckbox"
                type="checkbox"
                ref="destinationEnabled"
                checked={this.props.destinationEnabled === 1}
                onChange={this.destinationEnabledChanged}
              />
              <label htmlFor="destinationCheckbox" className={styles.checkboxLabel}>Destination</label>
            </span>
          </div>
          <div className={`flexbox row ${styles.amountSection}`}>
            <span className={styles.left}>
              <input id="dateCheckbox" type="checkbox" ref="dateEnabled" checked={this.props.dateEnabled === 1} onChange={this.dateEnabledChanged} />
              <label htmlFor="dateCheckbox" className={styles.checkboxLabel}>Date Range</label>
            </span>
          </div>
          <div className={`flexbox row ${styles.amountSection}`}>
            <span className={styles.left}>
              <input id="reasonCheckbox" type="checkbox" ref="reasonEnabled" checked={this.props.reasonEnabled === 1} onChange={this.reasonEnabledChanged} />
              <label htmlFor="reasonCheckbox" className={styles.checkboxLabel}>Reason</label>
            </span>
          </div>
        </div>
      );
    }
    else {
      content = (
        <div className={styles.collapsedContent}>
          <GreyButton className={`${styles.override} ${styles.configureButton}`} onClick={this.configure}>
            Configure
          </GreyButton>
          <label htmlFor={`rtcb${this.props.typeCd}`} className={styles.name}>{this.props.name}</label>
        </div>
      );
    }

    return (
      <div className={classNames('flexbox', 'row', styles.container, this.props.className)}>
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
        <span className={`fill`}>
          {content}
        </span>
      </div>
    );
  }
}
