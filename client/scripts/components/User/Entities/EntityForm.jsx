import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {ProminentButton} from '../../ProminentButton';
import {merge} from '../../../merge';
import {EntityFormPartZero} from './EntityFormPartZero';
import {EntityFormPartOne} from './EntityFormPartOne';
import {EntityFormPartTwo} from './EntityFormPartTwo';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class EntityForm extends ResponsiveComponent {
  constructor(props) {
    super();
    this.commonStyles = {};
    this.state = {
      invalid: props.update ? false : true
    };

    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.formValidation = this.formValidation.bind(this);
    this.cancel = this.cancel.bind(this);
    this.submit = this.submit.bind(this);
    this.done = this.done.bind(this);
    this.edit = this.edit.bind(this);
    this.undo = this.undo.bind(this);
  }

  shouldComponentUpdate() { return true; }

  next() {
    if (!this.state.invalid) {
      DisclosureActions.entityFormNextClicked(this.props.entity.id);
      this.setState({invalid: true});
    }
  }

  back() {
    DisclosureActions.entityFormBackClicked(this.props.entity.id);
  }

  cancel() {
    DisclosureActions.entityFormClosed(this.props.entity.id);
  }

  submit() {
    DisclosureActions.saveInProgressEntity(this.props.entity);
    this.setState({invalid: false});
  }

  edit() {
    DisclosureActions.editEntity(this.props.entity.id);
  }

  done() {
    if (!this.props.editing || !this.state.invalid) {
      DisclosureActions.entityFormClosed(this.props.entity.id);
    }
  }

  undo() {
    DisclosureActions.undoEntityChanges(this.props.snapshot);
  }

  formValidation(isValid) {
    this.setState({
      invalid: !isValid
    });
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
    let nextButtonStyle = this.state.invalid ? merge(styles.button, styles.disabled) : styles.button;
    let nextButton = (
      <ProminentButton style={nextButtonStyle} onClick={this.next}>Next &gt;</ProminentButton>
    );

    let entity = this.props.entity;
    let buttons;
    let backButton;
    if (this.props.update) {
      currentStep = (
        <div>
          <EntityFormPartOne
            id={entity.id}
            readonly={!this.props.editing}
            update={this.props.update}
            name={entity.name}
            status={entity.status}
            type={entity.type}
            isPublic={entity.isPublic}
            isSponsor={entity.isSponsor}
            description={entity.description}
            onValidation={this.formValidation}
          />
          <EntityFormPartTwo
            id={entity.id}
            readonly={!this.props.editing}
            update={this.props.update}
            relations={this.props.entity.relationships}
            name={this.props.entity.name}
            style={{borderTop: '1px solid #888', marginTop: 16, paddingTop: 16}}
            onValidation={this.formValidation}
            appState={this.props.appState}
          />
        </div>
      );

      let doneButtonStyle = this.state.invalid ? merge(styles.button, styles.disabled) : styles.button;
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
            <EntityFormPartZero
              entityName={entity.name}
              onValidation={this.formValidation}
            />
          );
          break;
        case 1:
          currentStep = (
            <EntityFormPartOne
              update={this.props.update}
              name={entity.name}
              status={entity.status}
              type={entity.type}
              isPublic={entity.isPublic}
              isSponsor={entity.isSponsor}
              description={entity.description}
              onValidation={this.formValidation}
            />
          );

          backButton = (
            <ProminentButton style={styles.button} onClick={this.back}>Back</ProminentButton>
          );

          break;
        default:
          currentStep = (
            <EntityFormPartTwo
              update={this.props.update}
              relations={this.props.entity.relationships}
              name={this.props.entity.name}
              onValidation={this.formValidation}
              appState={this.props.appState}
            />
          );

          submitButton = (
            <ProminentButton style={styles.button} onClick={this.submit}>Submit</ProminentButton>
          );


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
