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
import {SidebarStep} from './SidebarStep';
import BackToDashboard from './BackToDashboard';

export class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showing: true
    };

    this.commonStyles = {
    };

    this.close = this.close.bind(this);
  }

  close() {
    this.setState({
      showing: !this.state.showing
    });
  }

  generateSteps() {
    let steps = [];
    this.props.steps.forEach((step, index) => {
      let stepState;
      if (index < this.props.activestep) {
        stepState = 'complete';
      }
      else if (index === this.props.activestep) {
        stepState = 'active';
      }
      else if (index > this.props.activestep) {
        stepState = 'incomplete';
      }

      let extraStyle;
      if (index === 0) {
        extraStyle = {
          borderTop: '1px solid #c0c0c0'
        };
      }
      steps.push(
        <SidebarStep
          label={step.label}
          state={stepState}
          key={index}
          step={step.value}
          style={extraStyle}
          visited={this.props.visitedSteps[step.value]}
        />
      );
    });

    return steps;
  }

  render() {
    let styles = {
      container: {
        display: 'inline-flex',
        flexDirection: 'column',
        verticalAlign: 'top',
        backgroundColor: '#eeeeee'
      },
      ul: {
        marginTop: 47,
        listStyleType: 'none',
        padding: 0,
        backgroundColor: '#eeeeee'
      },
      li: {
        padding: '12px 0 12px 58px',
        fontSize: 16,
        textTransform: 'uppercase',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      },
      selected: {
        fontWeight: 'bold',
        backgroundColor: 'white',
        position: 'relative',
        borderRight: '5px solid #1481A3'
      },
      incomplete: {
        color: '#bbb'
      },
      arrow: {
        display: 'inline-block',
        height: 0,
        width: 0,
        border: '10px solid transparent',
        borderLeft: '18px solid #e0e0e0',
        borderBottom: '21px solid transparent',
        borderTop: '21px solid transparent',
        position: 'absolute',
        right: '-28px',
        top: 0
      }
    };

    let steps = this.generateSteps();
    return (
      <span style={merge(styles.container, this.props.style)}>
        <div className="fill">
          <BackToDashboard />
          <ul style={styles.ul}>
            {steps}
          </ul>
        </div>
      </span>
    );
  }
}

Sidebar.defaultProps = {
  steps: [],
  activestep: 0
};
