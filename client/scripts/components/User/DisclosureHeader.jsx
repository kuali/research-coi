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
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {RightArrowIcon} from '../DynamicIcons/RightArrowIcon';
import {InstructionIcon} from '../DynamicIcons/InstructionIcon';
import {DisclosureActions} from '../../actions/DisclosureActions';

export class DisclosureHeader extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };
  }

  showInstructions() {
    DisclosureActions.toggleInstructions();
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        position: 'relative',
        textAlign: 'center',
        padding: 8
      },
      headerIcon: {
        position: 'absolute',
        height: 29,
        width: 29,
        color: '#2E2E2E',
        top: 7
      },
      stepName: {
        fontSize: 21,
        fontWeight: 300
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <header style={merge(styles.container, this.props.style)}>
        <RightArrowIcon style={merge(styles.headerIcon, {left: 10})} />
        <span style={styles.stepName}>{this.props.children}</span>
        <InstructionIcon onClick={this.showInstructions} style={merge(styles.headerIcon, {right: 10})} />
      </header>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        backgroundColor: 'white',
        padding: '17px 0 17px 50px',
        position: 'relative',
        borderBottom: '1px solid #e3e3e3',
        boxShadow: '0 2px 8px #D5D5D5',
        zIndex: 2
      },
      instructionButton: {
        top: 0,
        position: 'absolute',
        right: '25%',
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontSize: 18,
        cursor: 'pointer',
        marginTop: 0,
        padding: '29px 14px',
        height: '100%'
      },
      heading: {
        fontSize: '33px',
        margin: '0 0 0 0',
        'textTransform': 'uppercase',
        fontWeight: 300,
        color: '#444'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={styles.instructionButton} onClick={this.showInstructions}>
          <i className="fa fa-info-circle" style={{marginRight: 5, fontSize: 20}}></i>
          Instructions
        </span>
        <h2 style={styles.heading}>
          {this.props.children}
        </h2>
      </div>
    );
  }
}
