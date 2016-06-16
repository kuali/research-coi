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
import {GreyButton} from '../../../grey-button';
import {EntityForm} from '../entity-form';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {DisclosureStore} from '../../../../stores/disclosure-store';
import {
  getRelationshipPersonTypeString,
  getRelationshipCategoryTypeString
} from '../../../../stores/config-store';

export class Entity extends React.Component {
  constructor() {
    super();

    this.toggleStatus = this.toggleStatus.bind(this);
    this.showForm = this.showForm.bind(this);
  }

  shouldComponentUpdate() { return true; }

  showForm() {
    DisclosureActions.updateEntityFormOpened(this.props.id);
  }

  toggleStatus() {
    const active = this.props.entity.active === 1 ? 0 : 1;
    DisclosureActions.setEntityActiveStatus(active, this.props.id);
  }

  render() {
    let statusButton;
    if (this.props.entity.active === 1) {
      statusButton = (
        <GreyButton
          onClick={this.toggleStatus}
          className={`${styles.override} ${styles.button}`}
        >
          Deactivate
        </GreyButton>
      );
    } else {
      statusButton = (
        <GreyButton
          onClick={this.toggleStatus}
          className={`${styles.override} ${styles.button}`}
        >
          Reactivate
        </GreyButton>
      );
    }

    const relationships = this.props.entity.relationships.map((relationship) => {
      const relationshipPersonType = getRelationshipPersonTypeString(
        this.context.configState,
        relationship.personCd,
        this.context.configState.config.id
      );
      
      const relationshipCategoryType = getRelationshipCategoryTypeString(
        this.context.configState,
        relationship.relationshipCd,
        this.context.configState.config.id
      );
      return (
        <div key={relationship.id}>
          {relationshipPersonType} - {relationshipCategoryType}
        </div>
      );
    });

    let warning;

    if (!DisclosureStore.entityInformationStepComplete(this.props.entity.id) ||
      !DisclosureStore.entityRelationshipsAreSubmittable(this.props.entity.id)) {
      warning = (
        <div className={styles.attention}>- Needs Attention -</div>
      );
    }

    const classes = classNames(
      styles.container,
      this.props.className,
      {[styles.showForm]: this.props.step >= 0}
    );

    return (
      <div className={classes}>
        <div className={styles.content}>
          <div className={styles.name}>{this.props.entity.name}</div>
          {warning}
          <div style={{margin: '10px 0 0 20px'}} className={'flexbox row'}>
            <span className={`fill ${styles.dataitem}`}>
              <span className={styles.relationshipLabel}>Relationship:</span>
              <span className={styles.relationships}>
                {relationships}
              </span>
            </span>
            <span className={styles.buttonCell}>
              <GreyButton
                className={`${styles.override} ${styles.button}`}
                onClick={this.showForm}
              >
                View Summary
              </GreyButton>
              {statusButton}
            </span>
          </div>
        </div>

        <EntityForm
          update="true"
          step={this.props.step}
          className={`${styles.override} ${styles.entityForm}`}
          entity={this.props.entity}
          editing={this.props.editing}
          snapshot={this.props.snapshot}
          appState={this.props.appState}
        />
      </div>
    );
  }
}

Entity.contextTypes = {
  configState: React.PropTypes.object
};
