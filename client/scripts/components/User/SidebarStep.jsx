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
import {merge} from '../../merge';
import {FutureStepIcon} from '../DynamicIcons/FutureStepIcon';
import {CurrentStepIcon} from '../DynamicIcons/CurrentStepIcon';
import {CompletedStepIcon} from '../DynamicIcons/CompletedStepIcon';
import {DisclosureActions} from '../../actions/DisclosureActions';

export class SidebarStep extends React.Component {
  constructor() {
    super();

    this.navigate = this.navigate.bind(this);
  }

  navigate() {
    DisclosureActions.jumpToStep(this.props.step);
  }

  render() {
    let styles = {
      container: {
        padding: '20px 20px 20px 10px',
        fontSize: 22,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #c0c0c0'
      },
      selected: {
        fontWeight: 'bold',
        backgroundColor: 'white',
        position: 'relative',
        color: 'black',
        boxShadow: '0 0 8px #CDCDCD',
        borderRight: window.colorBlindModeOn ? '5px solid black' : '5px solid #0095A0'
      },
      clickable: {
        cursor: 'pointer'
      },
      image: {
        width: 42,
        height: 42,
        verticalAlign: 'middle',
        color: window.config.colors.one
      },
      incomplete: {
        color: window.colorBlindModeOn ? 'black' : '#C1C1C1'
      },
      stepName: {
        verticalAlign: 'middle',
        paddingLeft: 5
      },
      icon: {
        width: 30,
        height: 30,
        verticalAlign: 'middle',
        color: window.colorBlindModeOn ? 'black' : '#0095A0'
      }
    };

    switch (this.props.state.toLowerCase()) {
      case 'complete':
        return (
          <div style={merge(styles.clickable, this.props.style)} onClick={this.navigate}>
            <li style={styles.container}>
              <CompletedStepIcon style={styles.icon} />
              <span style={styles.stepName}>{this.props.label}</span>
            </li>
          </div>
        );
      case 'active':
        return (
          <div style={this.props.style}>
            <li style={merge(styles.container, styles.selected)}>
              <CurrentStepIcon style={styles.icon} />
              <span style={styles.stepName}>{this.props.label}</span>
            </li>
          </div>
        );
      case 'incomplete':
        if (this.props.visited) {
          return (
            <li style={merge(styles.container, styles.clickable, this.props.style)} onClick={this.navigate}>
              <FutureStepIcon style={styles.icon} />
              <span style={styles.stepName}>{this.props.label}</span>
            </li>
          );
        }
        else {
          return (
            <li style={merge(styles.container, styles.incomplete, this.props.style)}>
              <FutureStepIcon style={styles.icon} />
              <span style={styles.stepName}>{this.props.label}</span>
            </li>
          );
        }
    }
  }
}

SidebarStep.defaultProps = {
  state: ''
};
