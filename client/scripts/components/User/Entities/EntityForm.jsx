import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ProminentButton} from '../../ProminentButton';
import {merge} from '../../../merge';
import {EntityFormNameStep} from './EntityFormNameStep';
import {EntityFormInformationStep} from './EntityFormInformationStep';
import {EntityFormRelationshipStep} from './EntityFormRelationshipStep';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {DisclosureStore} from '../../../stores/DisclosureStore';

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
        return DisclosureStore.entityRelationshipStepComplete();
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
    DisclosureActions.editEntity(this.props.entity.id);
  }

  done() {
    let entityRelationshipsAreSubmittable = DisclosureStore.entityRelationshipsAreSubmittable(this.props.entity.id);
    let entityInformationIsSubmittable = DisclosureStore.entityInformationStepComplete(this.props.entity.id);
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

  render() {
    let styles = {
      container: {
        display: 'inline-block',
        borderRadius: 5,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 2
      },
      content: {
        backgroundColor: 'white',
        color: '#888',
        padding: 25,
        fontSize: 14,
        borderBottom: '1px solid #DEDEDE'
      },
      button: {
        marginLeft: 20
      },
      disabled: {
        color: '#AAA',
        cursor: 'default'
      },
      controls: {
        backgroundColor: 'white',
        padding: 15,
        textAlign: 'right'
      }
    };

    let currentStep;
    let submitButton;
    let nextButton;
    if (this.isStepValidating() && !this.isCurrentStepValid()) {
      nextButton = (
        <ProminentButton title="Please correct the marked fields" style={merge(styles.button, styles.disabled)} onClick={this.next}>Next &gt;</ProminentButton>
      );
    }
    else {
      nextButton = (
        <ProminentButton style={styles.button} onClick={this.next}>Next &gt;</ProminentButton>
      );
    }

    let entity = this.props.entity;
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
          />
        </div>
      );

      let entityIsSubmittable = DisclosureStore.entityRelationshipsAreSubmittable(this.props.entity.id) && DisclosureStore.entityInformationStepComplete(this.props.entity.id);
      let doneButtonStyle = entityIsSubmittable ? styles.button : merge(styles.button, styles.disabled);
      if (this.props.editing) {
        buttons = (
          <span>
            <ProminentButton style={styles.button} onClick={this.undo}>Undo</ProminentButton>
            <ProminentButton style={doneButtonStyle} onClick={this.done}>Done</ProminentButton>
          </span>
        );
      }
      else {
        buttons = (
          <span>
            <ProminentButton style={styles.button} onClick={this.edit}>Edit</ProminentButton>
            <ProminentButton style={styles.button} onClick={this.done}>Done</ProminentButton>
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
            />
          );

          backButton = (
            <ProminentButton style={styles.button} onClick={this.back}>Back</ProminentButton>
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
            />
          );

          if (this.isStepValidating() && !this.isCurrentStepValid()) {
            submitButton = (
              <ProminentButton title="Please correct the marked fields" style={merge(styles.button, styles.disabled)} onClick={this.submit}>Submit</ProminentButton>
            );
          }
          else {
            submitButton = (
              <ProminentButton style={styles.button} onClick={this.submit}>Submit</ProminentButton>
            );
          }

          backButton = (
            <ProminentButton style={styles.button} onClick={this.back}>Back</ProminentButton>
          );

          nextButton = null;
          break;
      }

      buttons = (
        <span>
          {backButton}
          <ProminentButton style={styles.button} onClick={this.cancel}>Cancel</ProminentButton>
          {nextButton}
          {submitButton}
        </span>
      );
    }

    return (
      <span ref="theForm" style={merge(styles.container, this.props.style)}>
        <div style={styles.content}>
          {currentStep}
        </div>
        <div style={styles.controls}>
          {buttons}
        </div>
      </span>
    );
  }
}
