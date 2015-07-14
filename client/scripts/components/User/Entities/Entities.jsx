import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {NewEntityButton} from './NewEntityButton';
import {FEPlaceHolder} from '../../DynamicIcons/FEPlaceHolder';
import {Entity} from './Entity';
import {EntityForm} from './EntityForm';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {Instructions} from '../Instructions';
import {COIConstants} from '../../../../../COIConstants';
import {Toggle} from '../Toggle';

export class Entities extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  shouldComponentUpdate() {return true;}

  startNewEntity() {
    DisclosureActions.newEntityInitiated();
  }

  viewChanged(newView) {
    DisclosureActions.changeActiveEntityView(newView);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        overflow: 'hidden'
      },
      content: {
        padding: '46px 0 0 50px'
      },
      newentitybutton: {
        margin: '0 30px 30px 0',
      },
      newentityform: {
        verticalAlign: 'top',
        marginBottom: 30,
        display: 'block'
      },
      viewToggle: {
        'float': 'right',
        marginTop: 111
      },
      placeholder: {
        colorOne: window.config.colors.one, 
        colorTwo: window.config.colors.two, 
        width: 300, 
        height: 300, 
        marginTop: -61
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let viewToggle;
    let entities;
    if (this.props.entities) {
      entities = this.props.entities.filter(entity => {
        return entity.status === this.props.applicationState.activeEntityView;
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
            />
          );
        }
      );

      if (this.props.applicationState.newEntityFormStep < 0 && this.props.entities.length > 0) {
        viewToggle = (
          <Toggle 
            values={[
              COIConstants.DISCLOSURE_STATUS.ACTIVE, 
              COIConstants.DISCLOSURE_STATUS.INACTIVE
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

      if (this.props.entities.length === 0) {
        placeholder = (
          <div style={{textAlign: 'center'}}>
            <FEPlaceHolder style={styles.placeholder} />
            <div style={styles.placeholderText}>You currently have no reported financial entities.</div>
            <div style={styles.placeholderText}>Add new financial entities to view them here.</div>
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
        />
      );
    }

    let instructionText = window.config.instructions[COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY];
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