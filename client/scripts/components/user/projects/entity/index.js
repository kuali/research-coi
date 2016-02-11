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
import React from 'react';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {EntityRelationDialog} from '../entity-relation-dialog';
import {GreyButton} from '../../../grey-button';
import {undefinedRelationExists} from '../../undefined-relation-exists';
import ConfigStore from '../../../../stores/config-store';

export class Entity extends React.Component {
  constructor() {
    super();

    this.toggleDialog = this.toggleDialog.bind(this);
    this.getDisplayStatus = this.getDisplayStatus.bind(this);
    this.getDeclarationDescription = this.getDeclarationDescription.bind(this);
  }

  shouldComponentUpdate() { return true; }

  toggleDialog() {
    DisclosureActions.toggleDeclaration(this.props.entity.id, 'ENTITY');
  }

  getDisplayStatus() {
    if (undefinedRelationExists('PROJECT', this.props.projects, this.props.declarations)) {
      return 'Action Required';
    }

    let worstDeclaration = 1;

    this.props.declarations.forEach(element => {
      if (worstDeclaration !== 2 && element.typeCd > 1) {
        worstDeclaration = element.typeCd;
      }
    });

    return this.getDeclarationDescription(worstDeclaration);
  }

  getDeclarationDescription(typeCd) {
    const declarationType = window.config.declarationTypes.find(type => {
      return type.typeCd === typeCd;
    });

    if (declarationType) {
      return declarationType.description;
    }

    return null;
  }

  render() {
    let relationshipDialog;
    if (this.props.open) {
      relationshipDialog = (
        <EntityRelationDialog
          declarations={this.props.declarations}
          projects={this.props.projects}
          className={`${styles.override} ${this.props.open ? styles.block : styles.none}`}
          title={this.props.title}
          type={this.props.type}
          role={this.props.role}
          sponsor={this.props.sponsor}
          cosponsor={this.props.cosponsor}
          declarationTypes={this.props.declarationTypes}
          finEntityId={this.props.entity.id}
          id={this.props.id}
          entityCount={this.props.entityCount}
          onSave={this.toggleDialog}
          onNext={this.props.onNext}
          onPrevious={this.props.onPrevious}
        />
      );
    }

    const relationships = [];
    this.props.entity.relationships.forEach((element) => {
      relationships.push(
        <div key={element.id}>
          {ConfigStore.getRelationshipPersonTypeString(element.personCd)}
          -
          {ConfigStore.getRelationshipCategoryTypeString(element.relationshipCd)}
        </div>
      );
    });

    let status;
    if (this.getDisplayStatus() === 'Action Required') {
      status = (
        <div className={styles.attention}>
          - {this.getDisplayStatus()} -
        </div>
      );
    }
    else {
      status = (
        <div style={{marginBottom: 10}}>
          <div style={{fontWeight: '300'}}>Relationship Status:</div>
          <div style={{fontWeight: '700'}}>{this.getDisplayStatus()}</div>
        </div>
      );
    }

    return (
      <div className={`${styles.container} ${this.props.className}`}>
        <div className={styles.content}>
          <div className={styles.title}>
            <span className={styles.value}>
              {this.props.title}
            </span>
          </div>
          <div>
            <span className={styles.left}>
              <div className={styles.item}>
                <span style={{display: 'inline-block', verticalAlign: 'top'}}>
                  Relationship:
                </span>
                <span className={styles.value}>
                  {relationships}
                </span>
              </div>
            </span>
            <span className={styles.right}>
              {status}

              <div>
                <GreyButton className={`${styles.override} ${styles.button}`} onClick={this.toggleDialog}>
                  Update
                </GreyButton>
              </div>
            </span>
          </div>
        </div>

        {relationshipDialog}
      </div>
    );
  }
}
