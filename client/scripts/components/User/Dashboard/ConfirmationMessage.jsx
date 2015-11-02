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
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class ConfirmationMessage extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
      close: {
        cursor: 'pointer',
        fontWeight: 'normal',
        fontSize: 18,
        float: 'right',
        marginTop: -5
      },
      x: {
        fontWeight: 'bold',
        marginLeft: 6,
        marginRight: 12
      }
    };

    this.close = this.close.bind(this);
  }

  close() {
    DisclosureActions.toggleConfirmationMessage();
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        textAlign: 'center',
        fontSize: 22,
        position: 'relative',
        padding: '12px 8px',
        margin: 0
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={styles.close} onClick={this.close}>
          CLOSE
          <span style={styles.x}>X</span>
        </span>
        <div>Awesome, you have successfully submitted your disclosure!</div>
      </div>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        textAlign: 'center',
        fontSize: 22,
        position: 'relative',
        padding: '12px 8px',
        margin: '42px 49px 36px 49px',
        borderRadius: 5
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={styles.close} onClick={this.close}>
          CLOSE
          <i className="fa fa-times" style={styles.x}></i>
        </span>
        <div>Awesome, you have successfully submitted your disclosure!</div>
      </div>
    );
  }
}
