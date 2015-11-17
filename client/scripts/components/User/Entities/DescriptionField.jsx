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

export class DescriptionField extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.setDescription = this.setDescription.bind(this);
  }

  setDescription() {
    this.props.onChange(this.refs.description.value);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        color: this.props.invalid ? 'red' : 'inherit'
      },
      value: {
        color: 'black',
        fontWeight: 'bold'
      },
      description: {
        width: '100%',
        height: 90,
        border: '1px solid #C7C7C7',
        fontSize: 16,
        padding: 5,
        borderBottom: this.props.invalid ? '3px solid red' : '1px solid #aaa'
      },
      invalidError: {
        fontSize: 10,
        marginTop: 2
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let requiredFieldError;
    if (this.props.invalid) {
      requiredFieldError = (
        <div style={styles.invalidError}>Required Field</div>
      );
    }

    let dom;
    if (this.props.readonly) {
      dom = (
        <div style={styles.value}>{this.props.value}</div>
      );
    }
    else {
      dom = (
        <textarea
          required
          ref="description"
          onChange={this.setDescription}
          style={styles.description}
          value={this.props.value}
        />
      );
    }

    return (
      <span style={merge(styles.container, this.props.style)}>
        <div style={{fontSize: 13}}>Describe the entity's area of business and your relationship to it:</div>
        <div>
          {dom}
        </div>
        {requiredFieldError}
      </span>
    );
  }
}
