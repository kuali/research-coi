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
import {DisclosureStore} from '../../../../stores/disclosure-store';
import {ProjectRelationDialog} from '../project-relation-dialog';
import {GreyButton} from '../../../grey-button';
import {undefinedRelationExists} from '../../undefined-relation-exists';

export class Project extends React.Component {
  constructor() {
    super();

    this.toggleDialog = this.toggleDialog.bind(this);
    this.getDisplayStatus = this.getDisplayStatus.bind(this);
  }

  shouldComponentUpdate() { return true; }

  toggleDialog() {
    DisclosureActions.toggleDeclaration(this.props.projectId, 'PROJECT');
  }

  getDisplayStatus() {
    if (undefinedRelationExists('ENTITY', this.props.entities, this.props.declarations)) {
      return 'Action Required';
    }

    return DisclosureStore.getWorstDeclaration(this.props.declarations, window.config.declarationTypes);
  }

  render() {
    let relationshipDialog;
    if (this.props.open) {
      relationshipDialog = (
        <ProjectRelationDialog
          declarations={this.props.declarations}
          entities={this.props.entities}
          className={`${styles.override} ${this.props.open ? styles.block : styles.none}`}
          title={this.props.title}
          type={this.props.type}
          role={this.props.role}
          sponsor={this.props.sponsor}
          projectId={this.props.projectId}
          declarationTypes={this.props.declarationTypes}
          id={this.props.id}
          projectCount={this.props.projectCount}
          onSave={this.toggleDialog}
          onNext={this.props.onNext}
          onPrevious={this.props.onPrevious}
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
            <span className={styles.value}>
              {this.props.title}
            </span>
          </div>
          <div>
            <span className={styles.left}>
              <div className={styles.item}>
                Project Type:
                <span className={styles.value}>
                  {this.props.type}
                </span>
              </div>
              <div className={styles.item}>
                Project Role:
                <span className={styles.value}>
                  {this.props.role}
                </span>
              </div>
              <div className={styles.item}>
                Sponsor:
                <span className={styles.value}>
                  {this.props.sponsor}
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
