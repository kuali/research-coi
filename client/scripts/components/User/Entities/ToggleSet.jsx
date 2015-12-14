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
import {Toggle} from './Toggle';

export class ToggleSet extends ResponsiveComponent {
  constructor(props) {
    super();
    this.commonStyles = {};

    this.state = {
      value: props.selected
    };

    this.change = this.change.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.selected !== this.props.selected) {
      this.setState({
        value: newProps.selected
      });
    }
  }

  change(newValue) {
    this.setState({value: newValue});
    this.props.onChoose(newValue);
  }

  renderMobile() {}

  renderDesktop() {
    const desktopStyles = {
      container: {
      },
      toggle: {
        margin: '0 10px 10px 0'
      }
    };
    const styles = merge(this.commonStyles, desktopStyles);

    const toggles = this.props.values.map(value => {
      return (
        <Toggle
          style={styles.toggle}
          typeCd={value.typeCd}
          text={value.description}
          selected={this.state.value === value.typeCd}
          onClick={this.change}
          key={value.typeCd}
         />
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
        {toggles}
      </div>
    );
  }
}
