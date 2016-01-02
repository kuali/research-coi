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

import styles from './style';
import classNames from 'classnames';
import React from 'react';
import {DisclosureActions} from '../../../../actions/DisclosureActions';
import {EntityRelation} from '../../EntityRelation';
import {BlueButton} from '../../../BlueButton';
import {GreyButton} from '../../../GreyButton';

export class ProjectRelationDialog extends React.Component {
  constructor() {
    super();

    this.onNext = this.onNext.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.findDeclarationTypeByEntity = this.findDeclarationTypeByEntity.bind(this);
    this.findCommentByEntity = this.findCommentByEntity.bind(this);
    this.setAll = this.setAll.bind(this);
  }

  shouldComponentUpdate() { return true; }

  onNext() {
    this.props.onNext(this.props.id, 'PROJECT');
  }

  onPrevious() {
    this.props.onPrevious(this.props.id, 'PROJECT');
  }

  findDeclarationTypeByEntity(id) {
    const declaration = this.props.declarations.find(element => {
      return element.finEntityId === id;
    });

    if (declaration) {
      return declaration.typeCd;
    }

    return null;
  }

  findCommentByEntity(id) {
    const declaration = this.props.declarations.find(element => {
      return element.finEntityId === id;
    });

    if (declaration) {
      return declaration.comments;
    }

    return null;
  }

  setAll() {
    DisclosureActions.setAllForProject(
      'PROJECT',
      this.props.projectId,
      parseInt(this.refs.setAllSelect.value)
    );
  }

  render() {
    const entityRelations = [];
    this.props.entities.filter(element => {
      return element.active === 1;
    })
    .forEach((element) => {
      entityRelations.push(
        <EntityRelation
          entity={element}
          relationType="PROJECT"
          projectId={this.props.projectId}
          typeCd={this.findDeclarationTypeByEntity(element.id)}
          comments={this.findCommentByEntity(element.id)}
          declarationTypes={this.props.declarationTypes}
          key={element.id}
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
    if (this.props.projectCount > 0) {
      if (this.props.id > 0) {
        navButtons.push(
          <GreyButton key='previous' onClick={this.onPrevious} className={`${styles.override} ${styles.button}`}>
            Previous Project
            <i className={`fa fa-caret-up`} style={{marginLeft: 5}}></i>
          </GreyButton>
        );
      }
      if (this.props.id < this.props.projectCount - 1) {
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
      this.props.className,
      {[styles.multipleProjects]: this.props.projectCount > 1}
    );

    return (
      <div className={classes} >
        <div className={styles.content}>
          <div className={styles.instructions}>
            Indicate how each Financial Entity is related to project #
            <span style={{marginRight: 3}}>{this.props.projectId}</span>
            -
            <span style={{marginLeft: 3}}>{this.props.title}</span>:
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
            <span className={styles.heading} style={{width: '25%'}}>FINANCIAL ENTITY</span>
            <span className={styles.heading} style={{width: '30%'}}>REPORTER RELATIONSHIP</span>
            <span className={styles.heading} style={{width: '45%'}}>REPORTER COMMENTS</span>
          </div>
          {entityRelations}
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
