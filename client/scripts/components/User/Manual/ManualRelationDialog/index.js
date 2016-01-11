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
import {DisclosureActions} from '../../../../actions/DisclosureActions';
import {EntityRelation} from '../../EntityRelation';
import {BlueButton} from '../../../BlueButton';

export class ManualRelationDialog extends React.Component {
  constructor() {
    super();

    this.findDeclarationTypeByEntity = this.findDeclarationTypeByEntity.bind(this);
    this.findCommentByEntity = this.findCommentByEntity.bind(this);
    this.setAll = this.setAll.bind(this);
  }

  shouldComponentUpdate() { return true; }

  findDeclarationTypeByEntity(id) {
    const declaration = this.props.declarations.find((element) => {
      return element.finEntityId === id;
    });

    if (declaration) {
      return declaration.typeCd;
    }

    return null;
  }

  findCommentByEntity(id) {
    const declaration = this.props.declarations.find((element) => {
      return element.finEntityId === id;
    });

    if (declaration) {
      return declaration.comments;
    }

    return null;
  }

  setAll() {
    DisclosureActions.setAllForProject(
      'MANUAL',
      this.props.projectId,
      this.refs.setAllSelect.value
    );
  }

  render() {
    const entityRelations = [];
    this.props.entities.forEach((element) => {
      entityRelations.push(
        <EntityRelation
          entity={element}
          relationType="MANUAL"
          projectId={this.props.projectId}
          typeCd={this.findDeclarationTypeByEntity(element.id)}
          comments={this.findCommentByEntity(element.id)}
          key={element.id}
        />
      );
    });

    return (
      <div className={`${styles.container} ${this.props.className}`} >
        <div className={styles.content}>
          <div className={styles.instructions}>
            Indicate how each Financial Entity is related to project #{this.props.projectId} - {this.props.title}:
          </div>
          <div>
            <BlueButton onClick={this.setAll} className={`${styles.override} ${styles.setAllButton}`}>
              Set All:
            </BlueButton>
            to:
            <select ref="setAllSelect" defaultValue={'NONE'} style={{marginLeft: 10}}>
              <option value="NONE">No Conflict</option>
              <option value="POTENTIAL">Potential Relationship</option>
              <option value="MANAGED">Managed Relationship</option>
            </select>
          </div>
          <div className={styles.headings}>
            <span className={styles.heading} style={{width: '25%'}}>
              Financial Entity
            </span>
            <span className={styles.heading} style={{width: '30%'}}>
              Reporter Relationship
            </span>
            <span className={styles.heading} style={{width: '45%'}}>
              Reporter Comments
            </span>
          </div>
          {entityRelations}
        </div>
        <div className={styles.buttons}>
          <div>
            <BlueButton onClick={this.props.onSave} className={`${styles.override} ${styles.button}`}>
              Done
            </BlueButton>
          </div>
        </div>
      </div>
    );
  }
}
