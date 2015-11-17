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
import {merge} from '../../merge';
import ToggleButton from './ToggleButton';

export class Toggle extends React.Component {
  constructor() {
    super();
    this.commonStyles = {};

    this.clicked = this.clicked.bind(this);
  }

  clicked(value) {
    this.props.onChange(value.code);
  }

  render() {
    let styles = {
      container: {
        display: 'inline-block'
      },
      first: {
        borderRadius: '7px 0 0 7px',
        borderRight: 0
      },
      last: {
        borderRadius: '0 7px 7px 0',
        borderLeft: 0
      }
    };

    let buttons = this.props.values.map((value, index, array) => {
      let isFirst = index === 0;
      let isLast = index === array.length - 1;
      let isSelected = this.props.selected === value.code;

      return (
        <ToggleButton
          style={merge(
            isFirst ? styles.first : {},
            isLast ? styles.last : {}
          )}
          onClick={this.clicked}
          value={value}
          key={value.code}
          isSelected={isSelected}
        />
      );
    });

    return (
      <span style={merge(styles.container, this.props.style)}>
        {buttons}
      </span>
    );
  }
}
