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
import SortArrow from './SortArrow';

export class TableHeading extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };
  }

  renderMobile() {
    let mobileStyles = {
      container: {
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <span style={merge(styles.container, this.props.style)}>
      </span>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        padding: '15px 0',
        display: 'table-cell',
        borderBottom: '1px solid #aaa',
        whiteSpace: 'nowrap'
      },
      label: {
        verticalAlign: 'middle'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let sortArrow = <SortArrow direction={this.props.sortDirection} />;

    return (
      <span style={merge(styles.container, this.props.style)} role="columnheader" onClick={this.props.sort}>
        <span style={styles.label}>{this.props.children}</span>
        {this.props.active ? sortArrow : <span></span>}
      </span>
    );
  }
}
