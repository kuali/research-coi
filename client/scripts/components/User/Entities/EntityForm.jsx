import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {ProminentButton} from '../../ProminentButton';
import {merge} from '../../../merge';
import {EntityFormNameStep} from './EntityFormNameStep';
import {EntityFormInformationStep} from './EntityFormInformationStep';
import {EntityFormRelationshipStep} from './EntityFormRelationshipStep';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {DisclosureStore} from '../../../stores/DisclosureStore';

export class EntityForm extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.cancel = this.cancel.bind(this);
    this.submit = this.submit.bind(this);
    this.done = this.done.bind(this);
    this.edit = this.edit.bind(this);
    this.undo = this.undo.bind(this);
    this.isCurrentStepValid = this.isCurrentStepValid.bind(this);
  }

  shouldComponentUpdate() { return true; }

  isCurrentStepValid() {
    switch (this.props.step) {
      case 0:
        return DisclosureStore.entityNameStepComplete();
      case 1:
        return DisclosureStore.entityInformationStepComplete();
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
    if (DisclosureStore.entityIsSubmittable()) {
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
    if (!this.props.editing || DisclosureStore.entityIsSubmittable(this.props.entity.id)) {
      DisclosureActions.entityFormClosed(this.props.entity);
      DisclosureActions.turnOffValidation(1);
      DisclosureActions.turnOffValidation(2);
    }
    else {
      DisclosureActions.turnOnValidation(1);
      DisclosureActions.turnOnValidation(2);
    }
  }

  undo() {
    DisclosureActions.undoEntityChanges(this.props.snapshot);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
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
    let styles = merge(this.commonStyles, desktopStyles);

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
            type={entity.type}
            isPublic={entity.isPublic}
            isSponsor={entity.isSponsor}
            description={entity.description}
            entityTypes={this.props.appState.entityTypes}
            validating={this.props.appState.validatingEntityInformationStep}
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
          />
        </div>
      );

      let doneButtonStyle = DisclosureStore.entityIsSubmittable(entity.id) ? styles.button : merge(styles.button, styles.disabled);
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
              type={entity.type}
              isPublic={entity.isPublic}
              isSponsor={entity.isSponsor}
              description={entity.description}
              entityTypes={this.props.appState.entityTypes}
              validating={this.props.appState.validatingEntityInformationStep}
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
