import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {Project} from './Project';
import {Entity} from './Entity';
import {Toggle} from '../Toggle';
import {Instructions} from '../Instructions';
import {COIConstants} from '../../../../../COIConstants';

export class Relationships extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.openNext = this.openNext.bind(this);
    this.openPrevious = this.openPrevious.bind(this);
    this.getEntityRelations = this.getEntityRelations.bind(this);
    this.getProjectRelations = this.getProjectRelations.bind(this);
    this.isProjectDeclarationOpen = this.isProjectDeclarationOpen.bind(this);
    this.isEntityDeclarationOpen = this.isEntityDeclarationOpen.bind(this);
    this.viewChanged = this.viewChanged.bind(this);
  }

  shouldComponentUpdate() { return true; }

  openNext(currentIndex, type) {
    if (type === 'PROJECT') {
      let currentId = this.props.projects[currentIndex].projectId;
      DisclosureActions.toggleDeclaration(currentId, type);
      let nextId;
      if (this.props.projects[currentIndex + 1]) {
        nextId = this.props.projects[currentIndex + 1].projectId;
        DisclosureActions.toggleDeclaration(nextId, type);
      }
    }
    else {
      let currentId = this.props.entities[currentIndex].id;
      DisclosureActions.toggleDeclaration(currentId, type);
      let nextId;
      if (this.props.entities[currentIndex + 1]) {
        nextId = this.props.entities[currentIndex + 1].id;
        DisclosureActions.toggleDeclaration(nextId, type);
      }
    }
  }

  openPrevious(currentIndex, type) {
    if (type === 'PROJECT') {
      let currentId = this.props.projects[currentIndex].projectId;
      DisclosureActions.toggleDeclaration(currentId, type);
      let previousId;
      if (this.props.projects[currentIndex - 1]) {
        previousId = this.props.projects[currentIndex - 1].projectId;
        DisclosureActions.toggleDeclaration(previousId, type);
      }
    }
    else {
      let currentId = this.props.entities[currentIndex].id;
      DisclosureActions.toggleDeclaration(currentId, type);
      let previousId;
      if (this.props.entities[currentIndex - 1]) {
        previousId = this.props.entities[currentIndex - 1].id;
        DisclosureActions.toggleDeclaration(previousId, type);
      }
    }
  }

  getEntityRelations(id) {
    if (this.props.relations) {
      return this.props.relations.filter(element => {
        return element.finEntityId === id;
      });
    }
    else {
      return [];
    }
  }

  getProjectRelations(id) {
    if (this.props.relations) {
      return this.props.relations.filter(element => {
        return element.projectId === id;
      });
    }
    else {
      return [];
    }
  }

  isProjectDeclarationOpen(id) {
    if (this.props.declarationStates && this.props.declarationStates.projects) {
      let state = this.props.declarationStates.projects[id];
      return (state && state.open);
    }
    else {
      return false;
    }
  }

  isEntityDeclarationOpen(id) {
    if (this.props.declarationStates && this.props.declarationStates.entities) {
      let state = this.props.declarationStates.entities[id];
      return (state && state.open);
    }
    else {
      return false;
    }
  }

  viewChanged(newView) {
    DisclosureActions.changeDeclarationView(newView);
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

    let projectView = this.props.view === 'Project View';
    let relationshipNodes = [];
    let relations;
    if (projectView) {
      for (let i = 0; i < this.props.projects.length; i++) {
        relations = this.getProjectRelations(this.props.projects[i].projectId);

        relationshipNodes.push(
          <Project
            relations={relations}
            entities={this.props.entities}
            title={this.props.projects[i].title}
            type={this.props.projects[i].type}
            role={this.props.projects[i].role}
            sponsor={this.props.projects[i].sponsor}
            cosponsor={this.props.projects[i].cosponsor}
            projectId={this.props.projects[i].projectId}
            relationshipStatuses={this.props.relationshipStatuses}
            open={this.isProjectDeclarationOpen(this.props.projects[i].projectId)}
            onNext={this.openNext}
            id={i}
            projectCount={this.props.projects.length}
            onPrevious={this.openPrevious}
            key={this.props.projects[i].projectId}
          />
        );
      }
    }
    else {
      for (let i = 0; i < this.props.entities.length; i++) {
        relations = this.getEntityRelations(this.props.entities[i].id);

        relationshipNodes.push(
          <Entity
            entity={this.props.entities[i]}
            relations={relations}
            projects={this.props.projects}
            title={this.props.entities[i].name}
            relationshipStatuses={this.props.relationshipStatuses}
            open={this.isEntityDeclarationOpen(this.props.entities[i].id)}
            onNext={this.openNext}
            onPrevious={this.openPrevious}
            id={i}
            entityCount={this.props.entities.length}
            key={this.props.entities[i].id}
          />
        );
      }
    }

    let instructionText = window.config.instructions[COIConstants.DISCLOSURE_STEP.PROJECTS];
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
          <div style={{textAlign: 'right'}}>
            <Toggle
              values={['Project View', 'SFI View']}
              selected={this.props.view}
              onChange={this.viewChanged}
              style={{marginBottom: 18}}
            />
          </div>

          {relationshipNodes}
        </div>
      </div>
    );
  }
}
