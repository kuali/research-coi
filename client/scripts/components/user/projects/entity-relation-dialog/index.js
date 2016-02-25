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
import classNames from 'classnames';
import React from 'react';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {ProjectRelation} from '../project-relation';
import {BlueButton} from '../../../blue-button';
import {GreyButton} from '../../../grey-button';

export class EntityRelationDialog extends React.Component {
  constructor() {
    super();

    this.onNext = this.onNext.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.findDeclarationTypeByProject = this.findDeclarationTypeByProject.bind(this);
    this.findCommentByProject = this.findCommentByProject.bind(this);
    this.setAll = this.setAll.bind(this);
  }

  shouldComponentUpdate() { return true; }

  onNext() {
    this.props.onNext(this.props.id, 'ENTITY');
  }

  onPrevious() {
    this.props.onPrevious(this.props.id, 'ENTITY');
  }

  findDeclarationTypeByProject(id) {
    const declaration = this.props.declarations.find((element) => {
      return element.projectId === id;
    });

    if (declaration) {
      return declaration.typeCd;
    }

    return null;
  }

  findCommentByProject(id) {
    const relation = this.props.declarations.find((element) => {
      return element.projectId === id;
    });

    if (relation) {
      return relation.comments;
    }

    return null;
  }

  setAll() {
    DisclosureActions.setAllForEntity(this.props.finEntityId, parseInt(this.refs.setAllSelect.value));
  }

  render() {
    const projectRelations = [];
    this.props.projects.forEach(project => {
      projectRelations.push(
        <ProjectRelation
          project={project}
          finEntityId={this.props.finEntityId}
          typeCd={this.findDeclarationTypeByProject(project.id)}
          comments={this.findCommentByProject(project.id)}
          declarationTypes={this.props.declarationTypes}
          key={project.id}
        />
      );
    });

    const declarationTypeOptions = this.props.declarationTypes.map(declarationType => {
      return (
        <option
          key={declarationType.typeCd}
          value={declarationType.typeCd}
        >
          {declarationType.description}
        </option>
      );
    });

    const navButtons = [];
    if (this.props.entityCount > 0) {
      if (this.props.id > 0) {
        navButtons.push(
          <GreyButton key='previous' onClick={this.onPrevious} className={`${styles.override} ${styles.button}`}>
            Previous Project
            <i className={`fa fa-caret-up`} style={{marginLeft: 5}}></i>
          </GreyButton>
        );
      }
      if (this.props.id < this.props.entityCount - 1) {
        navButtons.push(
          <GreyButton key='next' onClick={this.onNext} className={`${styles.override} ${styles.button}`}>
            Next Project
            <i className={`fa fa-caret-down`} style={{marginLeft: 5}}></i>
          </GreyButton>
        );
      }
    }

    const classes = classNames(
      styles.container,
      {[styles.multipleEntities]: this.props.entityCount > 1},
      this.props.className
    );

    return (
      <div className={classes} >
        <div className={styles.content}>
          <div className={styles.instructions}>
            Indicate how each project is related to this financial entity -
            <span style={{marginLeft: 3}}>{this.props.title}</span>
            :
          </div>
          <div>
            <BlueButton onClick={this.setAll} className={`${styles.override} ${styles.setAllButton}`}>
              Set All:
            </BlueButton>
            to:
            <select ref="setAllSelect" style={{marginLeft: 10}}>
              {declarationTypeOptions}
            </select>
          </div>
          <div className={styles.headings}>
            <span className={styles.heading} style={{width: '25%'}}>PROJECT</span>
            <span className={styles.heading} style={{width: '30%'}}>REPORTER RELATIONSHIP</span>
            <span className={styles.heading} style={{width: '45%'}}>REPORTER COMMENTS</span>
          </div>
          {projectRelations}
        </div>
        <div className={styles.buttons}>
          <div>
            {navButtons}
            <span className={styles.spacer} />
            <GreyButton onClick={this.props.onSave} className={`${styles.override} ${styles.button}`}>
              Done
            </GreyButton>
          </div>
        </div>
      </div>
    );
  }
}
