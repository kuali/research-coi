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
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {ManualRelationDialog} from '../manual-relation-dialog';
import {GreyButton} from '../../../grey-button';
import {undefinedRelationExists} from '../../undefined-relation-exists';

export class ManualEventRelations extends React.Component {
  constructor() {
    super();

    this.toggleDialog = this.toggleDialog.bind(this);
    this.getDisplayStatus = this.getDisplayStatus.bind(this);
    this.getDeclarationDescription = this.getDeclarationDescription.bind(this);
    this.editProject = this.editProject.bind(this);
  }

  shouldComponentUpdate() { return true; }

  toggleDialog() {
    DisclosureActions.toggleDeclaration(this.props.disclosure.id, 'MANUAL');
  }

  getDisplayStatus() {
    if (undefinedRelationExists('ENTITY', this.props.entities, this.props.declarations)) {
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
    const {declarationTypes} = this.context.configState.config;
    const declarationType = declarationTypes.find(type => {
      return type.typeCd === typeCd;
    });

    if (declarationType) {
      return declarationType.description;
    }

    return null;
  }

  editProject() {
    DisclosureActions.editManualEvent(this.props.disclosure.id);
  }

  render() {
    let relationshipDialog;
    if (this.props.open) {
      relationshipDialog = (
        <ManualRelationDialog
          declarations={this.props.declarations}
          entities={this.props.entities}
          title={this.props.disclosure.title}
          projectId={this.props.disclosure.projectId}
          onSave={this.toggleDialog}
          onCancel={this.toggleDialog}
        />
      );
    }

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
        <div style={{marginBottom: 6}}>
          <div style={{fontWeight: '300'}}>Relationship Status:</div>
          <div style={{fontWeight: '700'}}>{this.getDisplayStatus()}</div>
        </div>
      );
    }

    return (
      <div className={`${styles.container} ${this.props.className}`}>
        <div className={styles.content}>
          <div className={styles.title}>
            Project Title:
            <span className={styles.value}>
              {this.props.disclosure.title}
            </span>
          </div>
          <div>
            <span className={styles.left}>
              <div className={styles.item}>
                Project Type:
                <span className={styles.value}>
                  {this.props.disclosure.projectType}
                </span>
              </div>
              <div className={styles.item}>
                Project Role:
                <span className={styles.value}>
                  {this.props.disclosure.role}
                </span>
              </div>
              <div className={styles.item}>
                Sponsor:
                <span className={styles.value}>
                  {this.props.disclosure.sponsor}
                </span>
              </div>
            </span>
            <span className={styles.right}>
              {status}

              <div>
                <GreyButton
                  className={`${styles.override} ${styles.button}`}
                  onClick={this.toggleDialog}
                >
                  Edit Declarations
                </GreyButton>
                <GreyButton
                  className={`${styles.override} ${styles.button}
                  ${styles.editButton}`}
                  onClick={this.editProject}
                >
                  Edit Project Details
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

ManualEventRelations.defaultProps = {
  relations: [],
  entities: []
};

ManualEventRelations.contextTypes = {
  configState: React.PropTypes.object
};
