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

import React from 'react/addons';
import {merge} from '../../merge';
import {GreyButton} from '../GreyButton';

export default class PanelWithButtons extends React.Component {
  render() {
    let styles = {
      container: {
        borderRadius: 5,
        backgroundColor: 'white',
        boxShadow: '0 0 10px #BBB',
        marginBottom: 22
      },
      title: {
        borderBottom: '1px solid #AAA',
        padding: '10px 17px',
        fontSize: 17
      },
      content: {
        padding: 10
      },
      button: {
        marginLeft: 10,
        float: 'right',
        width: 124
      },
      buttonRow: {
        padding: '10px 20px',
        height: 53,
        borderTop: '1px solid #AAA'
      }
    };

    let buttons;
    if (this.props.buttons) {
      buttons = this.props.buttons.map(button => {
        return (
          <GreyButton key={button.label} style={styles.button} onClick={button.onClick}>{button.label}</GreyButton>
        );
      });
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.title}>
          {this.props.title}
        </div>
        <div style={styles.content}>
          {this.props.children}
        </div>
        <div style={styles.buttonRow}>
          {buttons}
        </div>
      </div>
    );
  }
}
