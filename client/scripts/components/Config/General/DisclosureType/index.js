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
import EditLink from '../EditLink';
import DoneLink from '../DoneLink';
import ConfigActions from '../../../actions/ConfigActions';

export default class DisclosureType extends React.Component {
  constructor() {
    super();

    this.state = {
      editing: false
    };

    this.editType = this.editType.bind(this);
    this.doneEditing = this.doneEditing.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const checkbox = this.refs.checkbox;
    if (checkbox.checked) {
      ConfigActions.enableDisclosureType(this.props.type.typeCd);
    }
    else {
      ConfigActions.disableDisclosureType(this.props.type.typeCd);
    }
  }

  keyUp(evt) {
    if (evt.keyCode === 13) {
      this.doneEditing();
    }
  }

  editType() {
    this.setState({
      editing: true
    });
  }

  doneEditing() {
    const textbox = this.refs.label;
    ConfigActions.updateDisclosureType(this.props.type.typeCd, textbox.value);
    this.setState({
      editing: false
    });
  }

  render() {
    const styles = {
      container: {
      },
      editLink: {
        marginLeft: 10
      },
      checkbox: {
        marginRight: 10,
        verticalAlign: 'middle'
      },
      textbox: {
        verticalAlign: 'middle',
        padding: '3px 6px',
        fontSize: 16,
        borderRadius: 5,
        border: '1px solid #AAA'
      },
      label: {
        fontSize: 17
      },
      dynamicSpan: {
        verticalAlign: 'middle',
        display: 'inline-block'
      }
    };

    let jsx;
    if (this.state.editing) {
      jsx = (
        <span style={styles.dynamicSpan}>
          <input type="text" ref="label" style={styles.textbox} defaultValue={this.props.type.description} onKeyUp={this.keyUp} />
          <DoneLink onClick={this.doneEditing} style={styles.editLink} />
        </span>
      );
    }
    else {
      jsx = (
        <span style={styles.dynamicSpan}>
          <label
            htmlFor={`${this.props.type.typeCd}disctype`}
            style={styles.label}
          >
            {this.props.type.description}
          </label>
          <EditLink onClick={this.editType} style={styles.editLink} />
        </span>
      );
    }

    let checkbox;
    if (this.props.canToggle) {
      checkbox = (
        <input
          ref="checkbox"
          id={`${this.props.type.typeCd}disctype`}
          type="checkbox"
          style={styles.checkbox}
          checked={this.props.type.enabled === 1}
          onChange={this.toggle}
        />
      );
    }

    return (
      <span className="fill" style={merge(styles.container, this.props.style)}>
        {checkbox}
        {jsx}
      </span>
    );
  }
}
