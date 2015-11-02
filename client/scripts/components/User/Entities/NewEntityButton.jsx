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

import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {PlusIcon} from '../../DynamicIcons/PlusIcon';

export class NewEntityButton extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        display: 'inline-block',
        width: 145,
        height: 145,
        backgroundColor: 'white',
        color: 'white',
        padding: '10px',
        fontSize: 23,
        position: 'relative',
        cursor: 'pointer',
        boxShadow: '0 0 8px #C0C0C0',
        borderRadius: 6
      },
      plus: {
        position: 'absolute',
        display: 'block',
        fontSize: 32,
        top: 10,
        right: 12,
        color: 'black'
      },
      newText: {
        color: '#535353',
        fontWeight: 400
      },
      financialText: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontWeight: 'bold'
      },
      entityText: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontWeight: 'bold'
      },
      img: {
        height: 42,
        width: 42,
        color: window.colorBlindModeOn ? 'black' : '#0095A0'
      },
      text: {
        verticalAlign: 'middle',
        marginTop: 43
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <span onClick={this.props.onClick} style={merge(styles.container, this.props.style)}>
        <div style={styles.text}>
          <div style={styles.newText}>New</div>
          <div style={styles.financialText}>Financial</div>
          <div style={styles.entityText}>Entity</div>
        </div>
        <span style={styles.plus}>
          <PlusIcon style={styles.img} />
        </span>
      </span>
    );
  }
}
