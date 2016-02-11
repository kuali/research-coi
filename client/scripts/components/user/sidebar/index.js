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

import styles from './style';
import classNames from 'classnames';
import React from 'react';
import {SidebarStep} from '../sidebar-step';
import BackToDashboard from '../back-to-dashboard';

export class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showing: true
    };

    this.close = this.close.bind(this);
  }

  close() {
    this.setState({
      showing: !this.state.showing
    });
  }

  generateSteps() {
    const steps = [];
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

      const topClass = classNames(
        styles.override,
        {[styles.top]: index === 0}
      );

      steps.push(
        <SidebarStep
          label={step.label}
          state={stepState}
          key={index}
          step={step.value}
          className={topClass}
          visited={this.props.visitedSteps[step.value]}
        />
      );
    });

    return steps;
  }

  render() {
    const steps = this.generateSteps();
    return (
      <span className={`${styles.container} ${this.props.className}`}>
        <div className={`fill`}>
          <BackToDashboard />
          <ul className={styles.ul}>
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
