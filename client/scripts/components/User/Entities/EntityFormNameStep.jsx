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
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {DisclosureStore} from '../../../stores/DisclosureStore';

export class EntityFormNameStep extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.updateName = this.updateName.bind(this);
  }

  updateName() {
    let newNameValue = this.refs.entityName.value;
    DisclosureActions.setInProgressEntityName(newNameValue);
  }

  renderMobile() {}

  renderDesktop() {
    let validationErrors = DisclosureStore.entityNameStepErrors();

    let desktopStyles = {
      container: {
      },
      title: {
        fontWeight: 'bold',
        fontSize: 17,
        color: window.colorBlindModeOn ? 'black' : '#0095A0'
      },
      entityName: {
        display: 'inline-block',
        marginRight: 20,
        width: 275,
        color: this.props.validating && validationErrors.name ? 'red' : 'inherit'
      },
      top: {
        marginTop: 20
      },
      bottom: {
        marginTop: 20
      },
      name: {
        padding: '2px 8px',
        fontSize: 16,
        borderRadius: 5,
        border: '1px solid #AAA',
        height: 30,
        width: '100%',
        borderBottom: this.props.validating && validationErrors.name ? '3px solid red' : '1px solid #AAA'
      },
      invalidError: {
        fontSize: 10,
        marginTop: 2
      },
      nameLabel: {
        marginBottom: 3,
        fontWeight: '500',
        display: 'inline-block',
        color: window.colorBlindModeOn ? 'black' : '#888',
        fontSize: 12
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let requiredFieldError;
    if (this.props.validating && validationErrors.name) {
      requiredFieldError = (
        <div style={styles.invalidError}>{validationErrors.name}</div>
      );
    }

    let htmlId = Math.floor(Math.random() * 1000000000);
    return (
      <span style={merge(styles.container, this.props.style)}>
        <div style={styles.title}>Add New Financial Entity</div>

        <div style={styles.top}>
          <span style={styles.entityName}>
            <label htmlFor={htmlId} style={styles.nameLabel}>ENTITY NAME</label>
            <div>
              <input id={htmlId} required onChange={this.updateName} value={this.props.entityName} ref="entityName" type="text" style={styles.name} />
            </div>
            {requiredFieldError}
          </span>
        </div>
      </span>
    );
  }
}
