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
    this.onRemoveRelationship = this.onRemoveRelationship.bind(this);
    this.addEntityAttachments = this.addEntityAttachments.bind(this);
    this.deleteEntityAttachment = this.deleteEntityAttachment.bind(this);
  }

  onRemoveRelationship(relationshipId, entityId) {
    DisclosureActions.removeEntityRelationship(relationshipId, entityId);
  }

  onAddRelationship() {
    const stepNumber = 2;
    DisclosureActions.turnOffValidation(stepNumber);
    DisclosureActions.addEntityRelationship(this.props.entity.id);
  }

  onAnswerQuestion(newValue, questionId) {
    DisclosureActions.answerEntityQuestion({
      entityId: this.props.entity.id,
      id: questionId,
      answer: {
        value: newValue
      }
    });
  }

  shouldComponentUpdate() { return true; }

  isCurrentStepValid() {
    switch (this.props.step) {
      case 0:
        return DisclosureStore.entityNameStepComplete();
      case 1:
        return DisclosureStore.entityInformationStepComplete(this.props.entity.id);
      case 2:
        return DisclosureStore.entityRelationshipStepComplete(this.props.entity.id);
    }
  }

  isStepValidating() {
    switch (this.props.step) {
      case 0:
        return this.props.appState.validatingEntityNameStep;
      case 1:
        return this.props.appState.validatingEntityInformationStep;
      case 2:
        return this.props.appState.validatingEntityRelationshipStep;
    }
  }

  next() {
    if (this.isCurrentStepValid()) {
      DisclosureActions.turnOffValidation(this.props.step);
      DisclosureActions.entityFormNextClicked(this.props.entity.id);
    }
    else {
      DisclosureActions.turnOnValidation(this.props.step);
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
    if (DisclosureStore.entityRelationshipsAreSubmittable(this.props.entity.id)) {
      DisclosureActions.turnOffValidation(this.props.step);
      DisclosureActions.saveInProgressEntity(this.props.entity);
    }
    else {
      DisclosureActions.turnOnValidation(this.props.step);
    }
  }

  edit() {
    if (!DisclosureStore.entityInformationStepComplete(this.props.entity.id)) {
      DisclosureActions.turnOnValidation(1);
    }
    if (!DisclosureStore.entityRelationshipsAreSubmittable(this.props.entity.id)) {
      DisclosureActions.turnOnValidation(2);
    }
    DisclosureActions.editEntity(this.props.entity.id);
  }

  done() {
    const entityRelationshipsAreSubmittable = DisclosureStore.entityRelationshipsAreSubmittable(this.props.entity.id);
    const entityInformationIsSubmittable = DisclosureStore.entityInformationStepComplete(this.props.entity.id);
    if (!this.props.editing || (entityRelationshipsAreSubmittable && entityInformationIsSubmittable)) {
      DisclosureActions.entityFormClosed(this.props.entity);
      DisclosureActions.turnOffValidation(1);
      DisclosureActions.turnOffValidation(2);
    }
    else if (!entityInformationIsSubmittable) {
      DisclosureActions.turnOnValidation(1);
    } else if (!entityRelationshipsAreSubmittable) {
      DisclosureActions.turnOnValidation(2);
    }
  }

  undo() {
    DisclosureActions.undoEntityChanges(this.props.snapshot);
  }

  addEntityAttachments(files, entityId) {
    DisclosureActions.addEntityAttachments(files, entityId);
  }

  deleteEntityAttachment(index, entityId) {
    DisclosureActions.deleteEntityAttachment(index, entityId);
  }

  render() {
    let currentStep;
    let submitButton;
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
        <GreyButton id='nextButton' className={`${styles.override} ${styles.button}`} onClick={this.next}>
          Next &gt;
        </GreyButton>
      );
    }

    const entity = this.props.entity;
    let buttons;
    let backButton;
    if (this.props.update) {
      currentStep = (
        <div>
          <EntityFormInformationStep
            id={entity.id}
            readonly={!this.props.editing}
            update={this.props.update}
            name={entity.name}
            answers={entity.answers}
            files={entity.files}
            validating={this.props.appState.validatingEntityInformationStep}
            addEntityAttachments={this.addEntityAttachments}
            deleteEntityAttachment={this.deleteEntityAttachment}
            onAnswerQuestion={this.onAnswerQuestion}
          />
          <EntityFormRelationshipStep
            id={entity.id}
            readonly={!this.props.editing}
            update={this.props.update}
            relations={this.props.entity.relationships}
            name={this.props.entity.name}
            style={{borderTop: '1px solid #888', marginTop: 16, paddingTop: 16}}
            validating={this.props.appState.validatingEntityRelationshipStep}
            appState={this.props.appState}
            onAddRelationship={this.onAddRelationship}
            onRemoveRelationship={this.onRemoveRelationship}
          />
        </div>
      );

      const entityIsSubmittable = (
        DisclosureStore.entityRelationshipsAreSubmittable(this.props.entity.id) &&
        DisclosureStore.entityInformationStepComplete(this.props.entity.id)
      );

      const doneButtonStyle = classNames(
        styles.override,
        styles.button,
        {[styles.disabled]: !entityIsSubmittable}
      );

      if (this.props.editing) {
        buttons = (
          <span>
            <GreyButton className={`${styles.override} ${styles.button}`} onClick={this.undo}>Undo</GreyButton>
            <GreyButton className={doneButtonStyle} onClick={this.done}>Done</GreyButton>
          </span>
        );
      }
      else {
        buttons = (
          <span>
            <GreyButton className={`${styles.override} ${styles.button}`} onClick={this.edit}>Edit</GreyButton>
            <GreyButton className={`${styles.override} ${styles.button}`} onClick={this.done}>Done</GreyButton>
          </span>
        );
      }
    }
    else {
      switch (this.props.step) {
        case 0:
          currentStep = (
            <EntityFormNameStep
              entityName={entity.name}
              validating={this.props.appState.validatingEntityNameStep}
            />
          );
          break;
        case 1:
          currentStep = (
            <EntityFormInformationStep
              update={this.props.update}
              name={entity.name}
              answers={entity.answers}
              files={entity.files}
              validating={this.props.appState.validatingEntityInformationStep}
              onAnswerQuestion={this.onAnswerQuestion}
              addEntityAttachments={this.addEntityAttachments}
              deleteEntityAttachment={this.deleteEntityAttachment}
            />
          );

          backButton = (
            <GreyButton className={`${styles.override} ${styles.button}`} onClick={this.back}>Back</GreyButton>
          );

          break;
        default:
          currentStep = (
            <EntityFormRelationshipStep
              update={this.props.update}
              relations={this.props.entity.relationships}
              name={this.props.entity.name}
              appState={this.props.appState}
              validating={this.props.appState.validatingEntityRelationshipStep}
              onAddRelationship={this.onAddRelationship}
              onRemoveRelationship={this.onRemoveRelationship}
            />
          );

          if (this.isStepValidating() && !this.isCurrentStepValid()) {
            submitButton = (
              <GreyButton
                id="submitButton"
                title="Please correct the marked fields"
                className={`${styles.override} ${styles.button} ${styles.disabled}`}
                onClick={this.submit}
              >
                Submit
              </GreyButton>
            );
          }
          else {
            submitButton = (
              <GreyButton id='submitButton' className={`${styles.override} ${styles.button}`} onClick={this.submit}>Submit</GreyButton>
            );
          }

          backButton = (
            <GreyButton className={`${styles.override} ${styles.button}`} onClick={this.back}>Back</GreyButton>
          );

          nextButton = null;
          break;
      }

      buttons = (
        <span>
          {backButton}
          <GreyButton className={`${styles.override} ${styles.button}`} onClick={this.cancel}>Cancel</GreyButton>
          {nextButton}
          {submitButton}
        </span>
      );
    }

    return (
      <span ref="theForm" className={`${styles.container} ${this.props.className}`}>
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
