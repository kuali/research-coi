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
import React from 'react';
import {ManualEventEntry} from '../manual-event-entry';
import {ManualEventRelations} from '../manual-event-relations';
import {Instructions} from '../../instructions';
import {COIConstants} from '../../../../../../coi-constants';

export class ManualEvent extends React.Component {
  constructor() {
    super();

    this.isDeclarationOpen = this.isDeclarationOpen.bind(this);
  }

  shouldComponentUpdate() { return true; }

  isDeclarationOpen(id) {
    if (this.props.declarationStates && this.props.declarationStates.manual) {
      const state = this.props.declarationStates.manual[id];
      return (state && state.open);
    }

    return false;
  }

  render() {
    let screen;
    if (this.props.step === 3) {
      screen = (
        <ManualEventRelations
          disclosure={this.props.disclosure}
          entities={this.props.entities}
          declarations={this.props.declarations}
          open={this.isDeclarationOpen(this.props.disclosure.id)}
        />
      );
    }
    else {
      screen = (
        <ManualEventEntry
          step={this.props.step}
          disclosure={this.props.disclosure}
          selected={this.props.type}
        />
      );
    }

    const instructionText = window.config.general.instructions[COIConstants.DISCLOSURE_STEP.MANUAL];
    const instructions = (
      <Instructions
        text={instructionText}
        collapsed={!this.props.instructionsShowing}
      />
    );

    return (
      <div className={`${styles.container} ${this.props.className}`}>
        {instructions}

        <div className={styles.content}>
          {screen}
        </div>
      </div>
    );
  }
}
