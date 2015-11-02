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
import {ManualEventEntry} from './ManualEventEntry';
import {ManualEventRelations} from './ManualEventRelations';
import {Instructions} from '../Instructions';
import {COIConstants} from '../../../../../COIConstants';

export class ManualEvent extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.isDeclarationOpen = this.isDeclarationOpen.bind(this);
  }

  shouldComponentUpdate() { return true; }

  isDeclarationOpen(id) {
    if (this.props.declarationStates && this.props.declarationStates.manual) {
      let state = this.props.declarationStates.manual[id];
      return (state && state.open);
    }
    else {
      return false;
    }
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        overflow: 'hidden'
      },
      content: {
        padding: '46px 0 0 50px'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

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

    let instructionText = window.config.general.instructions[COIConstants.DISCLOSURE_STEP.MANUAL];
    let instructions = (
      <Instructions
        text={instructionText}
        collapsed={!this.props.instructionsShowing}
      />
    );

    return (
      <div style={merge(styles.container, this.props.style)}>
        {instructions}

        <div style={styles.content}>
          {screen}
        </div>
      </div>
    );
  }
}
