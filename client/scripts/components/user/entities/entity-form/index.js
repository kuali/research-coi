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
import {GreyButton} from '../../../grey-button';
import classNames from 'classnames';
import {EntityFormNameStep} from '../entity-form-name-step';
import {EntityFormInformationStep} from '../entity-form-information-step';
import {EntityFormRelationshipStep} from '../entity-form-relationship-step';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {DisclosureStore} from '../../../../stores/disclosure-store';

export class EntityForm extends React.Component {
  constructor() {
    super();

    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.cancel = this.cancel.bind(this);
    this.submit = this.submit.bind(this);
    this.done = this.done.bind(this);
    this.edit = this.edit.bind(this);
    this.undo = this.undo.bind(this);
    this.isCurrentStepValid = this.isCurrentStepValid.bind(this);
    this.onAnswerQuestion = this.onAnswerQuestion.bind(this);
    this.onAddRelationship = this.onAddRelationship.bind(this);
  }

  shouldComponentUpdate() { return true; }

  onAddRelationship() {
    const stepNumber = 2;
    DisclosureActions.turnOffValidation(stepNumber);
    DisclosureActions.addEntityRelationship(this.props.entity.id);
  }

  onAnswerQuestion(value, id) {
    DisclosureActions.answerEntityQuestion({
      entityId: this.props.entity.id,
      id,
      answer: {value}
    });
  }

  isCurrentStepValid() {
    const {step, entity} = this.props;

    switch (step) {
      case 0:
        return DisclosureStore.entityNameStepComplete();
      case 1:
        return DisclosureStore.entityInformationStepComplete(entity.id);
      case 2:
        return DisclosureStore.entityRelationshipStepComplete(entity.id);
    }
  }

  isStepValidating() {
    const {step, appState} = this.props;

    switch (step) {
      case 0:
        return appState.validatingEntityNameStep;
      case 1:
        return appState.validatingEntityInformationStep;
      case 2:
        return appState.validatingEntityRelationshipStep;
    }
  }

  next() {
    const {step, entity} = this.props;

    if (this.isCurrentStepValid()) {
      DisclosureActions.turnOffValidation(step);
      DisclosureActions.entityFormNextClicked(entity.id);
    }
    else {
      DisclosureActions.turnOnValidation(step);
    }
  }

  back() {
    DisclosureActions.entityFormBackClicked(this.props.entity.id);
  }

  cancel() {
    DisclosureActions.entityFormClosed(this.props.entity);
    DisclosureActions.turnOffValidation(0);
    DisclosureActions.turnOffValidation(1);
    DisclosureActions.turnOffValidation(2);
  }

  submit() {
    const {entity, step} = this.props;

    if (DisclosureStore.entityRelationshipsAreSubmittable(entity.id)) {
      DisclosureActions.turnOffValidation(step);
      DisclosureActions.saveInProgressEntity(entity);
    }
    else {
      DisclosureActions.turnOnValidation(step);
    }
  }

  edit() {
    const {entity} = this.props;

    if (!DisclosureStore.entityInformationStepComplete(entity.id)) {
      DisclosureActions.turnOnValidation(1);
    }
    if (!DisclosureStore.entityRelationshipsAreSubmittable(entity.id)) {
      DisclosureActions.turnOnValidation(2);
    }
    DisclosureActions.editEntity(entity.id);
  }

  done() {
    const {entity, editing} = this.props;

    const relationshipsSubmittable = DisclosureStore.entityRelationshipsAreSubmittable(entity.id);
    const informationStepSubmittable = DisclosureStore.entityInformationStepComplete(entity.id);
    if (!editing || (relationshipsSubmittable && informationStepSubmittable)) {
      DisclosureActions.entityFormClosed(entity);
      DisclosureActions.turnOffValidation(1);
      DisclosureActions.turnOffValidation(2);
    }
    else if (!informationStepSubmittable) {
      DisclosureActions.turnOnValidation(1);
    } else if (!relationshipsSubmittable) {
      DisclosureActions.turnOnValidation(2);
    }
  }

  undo() {
    DisclosureActions.undoEntityChanges(this.props.snapshot);
  }

  render() {
    const {entity, update, editing, appState, step, className} = this.props;
    const buttonClasses = `${styles.override} ${styles.button}`;

    let buttons;
    let currentStep;
    if (update) {
      currentStep = (
        <div>
          <EntityFormInformationStep
            id={entity.id}
            readonly={!editing}
            update={update}
            name={entity.name}
            answers={entity.answers}
            files={entity.files}
            validating={appState.validatingEntityInformationStep}
            addEntityAttachments={DisclosureActions.addEntityAttachments}
            deleteEntityAttachment={DisclosureActions.deleteEntityAttachment}
            onAnswerQuestion={this.onAnswerQuestion}
          />
          <EntityFormRelationshipStep
            id={entity.id}
            readonly={!editing}
            update={update}
            relations={entity.relationships}
            name={entity.name}
            style={{borderTop: '1px solid #888', marginTop: 16, paddingTop: 16}}
            validating={appState.validatingEntityRelationshipStep}
            appState={appState}
            onAddRelationship={this.onAddRelationship}
            onRemoveRelationship={DisclosureActions.removeEntityRelationship}
          />
        </div>
      );

      const entityIsSubmittable = (
        DisclosureStore.entityRelationshipsAreSubmittable(entity.id) &&
        DisclosureStore.entityInformationStepComplete(entity.id)
      );

      if (editing) {
        const disabledStyle = classNames(
          {[styles.disabled]: !entityIsSubmittable}
        );

        buttons = (
          <span>
            <GreyButton
              className={buttonClasses}
              onClick={this.undo}
            >
              Undo
            </GreyButton>
            <GreyButton
              className={`${buttonClasses} ${disabledStyle}`}
              onClick={this.done}
            >
              Done
            </GreyButton>
          </span>
        );
      }
      else {
        buttons = (
          <span>
            <GreyButton
              className={buttonClasses}
              onClick={this.edit}
            >
              Edit
            </GreyButton>
            <GreyButton
              className={buttonClasses}
              onClick={this.done}
            >
              Done
            </GreyButton>
          </span>
        );
      }
    }
    else {
      let nextButton;
      if (this.isStepValidating() && !this.isCurrentStepValid()) {
        nextButton = (
          <GreyButton
            title="Please correct the marked fields"
            className={`${styles.override} ${styles.button} ${styles.disabled}`}
            onClick={this.next}
          >
            Next &gt;
          </GreyButton>
        );
      }
      else {
        nextButton = (
          <GreyButton
            id='nextButton'
            className={buttonClasses}
            onClick={this.next}
          >
            Next &gt;
          </GreyButton>
        );
      }

      let submitButton;
      let backButton = (
        <GreyButton
          className={buttonClasses}
          onClick={this.back}
        >
          Back
        </GreyButton>
      );

      switch (step) {
        case 0:
          currentStep = (
            <EntityFormNameStep
              entityName={entity.name}
              validating={appState.validatingEntityNameStep}
            />
          );
          backButton = null;
          break;
        case 1:
          currentStep = (
            <EntityFormInformationStep
              update={update}
              name={entity.name}
              answers={entity.answers}
              files={entity.files}
              validating={appState.validatingEntityInformationStep}
              onAnswerQuestion={this.onAnswerQuestion}
              addEntityAttachments={DisclosureActions.addEntityAttachments}
              deleteEntityAttachment={DisclosureActions.deleteEntityAttachment}
            />
          );

          break;
        default:
          currentStep = (
            <EntityFormRelationshipStep
              update={update}
              relations={entity.relationships}
              name={entity.name}
              appState={appState}
              validating={appState.validatingEntityRelationshipStep}
              onAddRelationship={this.onAddRelationship}
              onRemoveRelationship={DisclosureActions.removeEntityRelationship}
            />
          );

          if (this.isStepValidating() && !this.isCurrentStepValid()) {
            submitButton = (
              <GreyButton
                id="submitButton"
                title="Please correct the marked fields"
                className={`${buttonClasses} ${styles.disabled}`}
                onClick={this.submit}
              >
                Submit
              </GreyButton>
            );
          }
          else {
            submitButton = (
              <GreyButton
                id='submitButton'
                className={buttonClasses}
                onClick={this.submit}
              >
                Submit
              </GreyButton>
            );
          }

          nextButton = null;
          break;
      }

      buttons = (
        <span>
          {backButton}
          <GreyButton
            className={buttonClasses}
            onClick={this.cancel}
          >
            Cancel
          </GreyButton>
          {nextButton}
          {submitButton}
        </span>
      );
    }

    return (
      <span ref="theForm" className={`${styles.container} ${className}`}>
        <div className={styles.content}>
          {currentStep}
        </div>
        <div className={styles.controls}>
          {buttons}
        </div>
      </span>
    );
  }
}

EntityForm.propTypes = {
  entity: React.PropTypes.object.isRequired,
  step: React.PropTypes.number,
  appState: React.PropTypes.object.isRequired,
  editing: React.PropTypes.bool,
  snapshot: React.PropTypes.object,
  className: React.PropTypes.string,
  update: React.PropTypes.bool
};

EntityForm.defaultProps = {
  editing: false,
  update: false,
  className: ''
};