/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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
import {NewEntityButton} from '../new-entity-button';
import {FEPlaceHolder} from '../../../dynamic-icons/fe-place-holder';
import {Entity} from '../entity';
import {EntityForm} from '../entity-form';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {Instructions} from '../../instructions';
import {COIConstants} from '../../../../../../coi-constants';
import {Toggle} from '../../toggle';
import {BlueButton} from '../../../blue-button';
import AddSection from '../../../add-section';

export class Entities extends React.Component {
  shouldComponentUpdate() { return true; }

  viewChanged(newView) {
    DisclosureActions.changeActiveEntityView(newView);
  }

  render() {
    let viewToggle;
    let entities;
    if (this.props.entities) {
      entities = this.props.entities.filter(entity => {
        return entity.active === this.props.applicationState.activeEntityView;
      }).map(
        (entity) => {
          const entityAppState = this.props.applicationState.entityStates[entity.id];
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
            className={`${styles.override} ${styles.viewToggle}`}
          />
        );
      }
    }

    let newEntitySection;
    let entityForm;
    let placeholder;
    if (this.props.applicationState.newEntityFormStep < 0) {
      const newEntityButton = (
        <NewEntityButton
          onClick={DisclosureActions.newEntityInitiated}
          className={`${styles.override} ${styles.newentitybutton}`}
        />
      );

      let message;

      if (this.props.nextDisabled) {
        message = 'You have answered "Yes" to a screening question, but do not have an active Financial Entity. Please add an active Financial Entity or edit your screening questionnaire in order to submit your disclosure.'; //eslint-disable-line max-len
      }

      newEntitySection = (
        <AddSection
          button={newEntityButton}
          message={message}
        />
      );

      const nextStep = this.props.nextDisabled ? '' : DisclosureActions.nextStep;
      const nextButtonStyle = this.props.nextDisabled ? {backgroundColor: '#AAA', cursor: 'default'} : {};
      if (entities.length === 0) {
        let text;
        if (this.props.applicationState.activeEntityView) {
          text = (
            <div>
              <div>You currently have no active financial entities.</div>
              <div>Add new financial entities to view them here.</div>
              <div style={{marginTop: 20}}>
                <BlueButton style={nextButtonStyle} onClick={nextStep}>
                  I have no entities to disclose
                </BlueButton>
              </div>
            </div>
          );
        }
        else {
          text = (
            <div>
              <div>You currently have no inactive financial entities.</div>
            </div>
          );
        }

        placeholder = (
          <div style={{textAlign: 'center'}}>
            <FEPlaceHolder className={`${styles.override} ${styles.placeholder}`} />
            {text}
          </div>
        );
      }
    }
    else {
      entityForm = (
        <EntityForm
          step={this.props.applicationState.newEntityFormStep}
          className={`${styles.override} ${styles.newentityform}`}
          entity={this.props.inProgress}
          editing={true}
          appState={this.props.applicationState}
        />
      );
    }

    const instructionText = window.config.general.instructions[COIConstants.INSTRUCTION_STEP.FINANCIAL_ENTITIES];
    const instructions = (
      <Instructions
        text={instructionText}
        collapsed={!this.props.instructionsShowing[COIConstants.INSTRUCTION_STEP.FINANCIAL_ENTITIES]}
      />
    );

    return (
      <div className={`${styles.container} ${this.props.className}`}>
        {instructions}

        <div className={styles.content}>
          <div>
            <div>
              {newEntitySection}
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
