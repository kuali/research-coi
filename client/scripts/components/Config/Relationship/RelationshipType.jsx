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

import React from 'react';
import {merge} from '../../../merge';
import EditableList from '../EditableList';
import {BlueButton} from '../../BlueButton';
import {GreyButton} from '../../GreyButton';

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
    let checkbox = this.refs.enabledCheckbox;
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
    let checkbox = this.refs.typeEnabled;
    this.props.typeEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  typeOptionsChanged(newList) {
    this.props.typeOptionsChanged(this.props.typeCd, newList.map(item=>{
      item.relationshipCd = this.props.typeCd;
      return item;
    }));
  }

  amountEnabledChanged() {
    let checkbox = this.refs.amountEnabled;
    this.props.amountEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  amountOptionsChanged(newList) {
    this.props.amountOptionsChanged(this.props.typeCd, newList.map(item=>{
      item.relationshipCd = this.props.typeCd;
      return item;
    }));
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
        width: 130
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
          <div className="flexbox row" style={{paddingLeft: 27}}>
            <span style={styles.left}>
              <input id="typeCheckbox" type="checkbox" ref="typeEnabled" checked={this.props.typeEnabled === 1} onChange={this.typeEnabledChanged} />
              <label htmlFor="typeCheckbox" style={styles.checkboxLabel}>Type</label>
            </span>
            <span className="fill" style={{display: 'inline-block'}}>
              <EditableList
                items={this.props.typeOptions}
                onChange={this.typeOptionsChanged}
              />
            </span>
          </div>
          <div className="flexbox row" style={styles.amountSection}>
            <span style={styles.left}>
              <input id="amountCheckbox" type="checkbox" ref="amountEnabled" checked={this.props.amountEnabled === 1} onChange={this.amountEnabledChanged} />
              <label htmlFor="amountCheckbox" style={styles.checkboxLabel}>Amount</label>
            </span>
            <span className="fill">
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
