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
import {merge} from '../../../merge';
import {NewEntityButton} from './NewEntityButton';
import {FEPlaceHolder} from '../../DynamicIcons/FEPlaceHolder';
import {Entity} from './Entity';
import {EntityForm} from './EntityForm';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {Instructions} from '../Instructions';
import {COIConstants} from '../../../../../COIConstants';
import {Toggle} from '../Toggle';

export class Entities extends React.Component {
  constructor() {
    super();
  }

  shouldComponentUpdate() { return true; }

  startNewEntity() {
    DisclosureActions.newEntityInitiated();
  }

  viewChanged(newView) {
    DisclosureActions.changeActiveEntityView(newView);
  }

  render() {
    let styles = {
      container: {
        overflow: 'hidden'
      },
      content: {
        padding: '46px 0 0 50px'
      },
      newentitybutton: {
        margin: '0 30px 30px 0'
      },
      newentityform: {
        verticalAlign: 'top',
        margin: '0 3px 30px 0',
        display: 'block',
        boxShadow: '0px 0px 3px 1px #CCC'
      },
      viewToggle: {
        'float': 'right',
        marginTop: 111
      },
      placeholder: {
        colorOne: '#0097a7',
        colorTwo: '#00bcd4',
        width: 300,
        height: 300,
        marginTop: -61
      }
    };

    let viewToggle;
    let entities;
    if (this.props.entities) {
      entities = this.props.entities.filter(entity => {
        return entity.active === this.props.applicationState.activeEntityView;
      }).map(
        (entity) => {
          let entityAppState = this.props.applicationState.entityStates[entity.id];
          return (
            <Entity
              entity={entity}
              step={entityAppState ? entityAppState.formStep : -1}
              id={entity.id}
              editing={entityAppState ? entityAppState.editing : false}
              snapshot={entityAppState ? entityAppState.snapshot : undefined}
              key={entity.id}
              appState={this.props.applicationState}
            />
          );
        }
      );

      if (this.props.applicationState.newEntityFormStep < 0 && this.props.entities.length > 0) {
        viewToggle = (
          <Toggle
            values={[
              {code: 1, description: 'ACTIVE'},
              {code: 0, description: 'INACTIVE'}
            ]}
            selected={this.props.applicationState.activeEntityView}
            onChange={this.viewChanged}
            style={styles.viewToggle}
          />
        );
      }
    }

    let newEntityButton;
    let entityForm;
    let placeholder;
    if (this.props.applicationState.newEntityFormStep < 0) {
      newEntityButton = (
        <NewEntityButton onClick={this.startNewEntity} style={styles.newentitybutton} />
      );

      if (entities.length === 0) {
        let text;
        if (this.props.applicationState.activeEntityView) {
          text = (
            <div>
              <div style={styles.placeholderText}>You currently have no active financial entities.</div>
              <div style={styles.placeholderText}>Add new financial entities to view them here.</div>
            </div>
          );
        }
        else {
          text = (
            <div>
              <div style={styles.placeholderText}>You currently have no inactive financial entities.</div>
            </div>
          );
        }

        placeholder = (
          <div style={{textAlign: 'center'}}>
            <FEPlaceHolder style={styles.placeholder} />
            {text}
          </div>
        );
      }
    }
    else {
      entityForm = (
        <EntityForm
          step={this.props.applicationState.newEntityFormStep}
          style={styles.newentityform}
          entity={this.props.inProgress}
          editing={true}
          appState={this.props.applicationState}
        />
      );
    }

    let instructionText = window.config.general.instructions[COIConstants.INSTRUCTION_STEP.FINANCIAL_ENTITIES];
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
          <div>
            <div>
              {newEntityButton}
              {viewToggle}
            </div>
            {entityForm}
          </div>

          {entities}
          {placeholder}
        </div>
      </div>
    );
  }
}
