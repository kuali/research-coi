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
import classNames from 'classnames';
import React from 'react';
import EditableList from '../../editable-list';
import {BlueButton} from '../../../blue-button';
import {GreyButton} from '../../../grey-button';

export default class RelationshipType extends React.Component {
  constructor() {
    super();

    this.state = {
      editing: false
    };

    this.enabledChanged = this.enabledChanged.bind(this);
    this.close = this.close.bind(this);
    this.configure = this.configure.bind(this);
    this.typeEnabledChanged = this.typeEnabledChanged.bind(this);
    this.typeOptionsChanged = this.typeOptionsChanged.bind(this);
    this.amountEnabledChanged = this.amountEnabledChanged.bind(this);
    this.amountOptionsChanged = this.amountOptionsChanged.bind(this);
  }

  enabledChanged() {
    const checkbox = this.refs.enabledCheckbox;
    this.props.enabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  configure() {
    this.setState({
      editing: true
    });
  }

  close() {
    this.setState({
      editing: false
    });
  }

  typeEnabledChanged() {
    const checkbox = this.refs.typeEnabled;
    this.props.typeEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  typeOptionsChanged(newList) {
    this.props.typeOptionsChanged(this.props.typeCd, newList.map(item => {
      item.relationshipCd = this.props.typeCd;
      return item;
    }));
  }

  amountEnabledChanged() {
    const checkbox = this.refs.amountEnabled;
    this.props.amountEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  amountOptionsChanged(newList) {
    this.props.amountOptionsChanged(this.props.typeCd, newList.map(item => {
      item.relationshipCd = this.props.typeCd;
      return item;
    }));
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
          <div className={'flexbox row'} style={{paddingLeft: 27}}>
            <span className={styles.left}>
              <input id="typeCheckbox" type="checkbox" ref="typeEnabled" checked={this.props.typeEnabled === 1} onChange={this.typeEnabledChanged} />
              <label htmlFor="typeCheckbox" className={styles.checkboxLabel}>Type</label>
            </span>
            <span className={'fill'} style={{display: 'inline-block'}}>
              <EditableList
                items={this.props.typeOptions}
                onChange={this.typeOptionsChanged}
              />
            </span>
          </div>
          <div className={`flexbox row ${styles.amountSection}`}>
            <span className={styles.left}>
              <input id="amountCheckbox" type="checkbox" ref="amountEnabled" checked={this.props.amountEnabled === 1} onChange={this.amountEnabledChanged} />
              <label htmlFor="amountCheckbox" className={styles.checkboxLabel}>Amount</label>
            </span>
            <span className={'fill'}>
              <EditableList
                items={this.props.amountOptions}
                onChange={this.amountOptionsChanged}
              />
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
        <span className={'fill'}>
          {content}
        </span>
      </div>
    );
  }
}
