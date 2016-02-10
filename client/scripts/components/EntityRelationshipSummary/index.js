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
import {formatDate} from '../../format-date';
import numeral from 'numeral';
import ConfigStore from '../../stores/config-store';
import {COIConstants} from '../../../../coi-constants';

export default class EntityRelationshipSummary extends React.Component {
  constructor() {
    super();

    this.remove = this.remove.bind(this);
  }

  remove() {
    this.props.onRemove(this.props.relationship.id, this.props.entityId);
  }

  render() {
    let commentSection;
    if (this.props.relationship.comments) {
      commentSection = (
        <div>
          <div className={styles.commentValue}>
            {this.props.relationship.comments}
          </div>
        </div>
      );
    }

    let removeButton;
    if (!this.props.readonly) {
      removeButton = (
        <button onClick={this.remove} className={styles.removeButton}>
          <i className={`fa fa-times ${styles.x}`}></i>
        </button>
      );
    }
    if (this.props.relationship.relationshipCd === COIConstants.ENTITY_RELATIONSHIP.TRAVEL) {
      const dateRange = `${formatDate(this.props.relationship.travel.startDate)} - ${formatDate(this.props.relationship.travel.endDate)}`;
      return (
        <div className={`${styles.container} ${this.props.className}`}>
          <div className={styles.summary}>
            {removeButton}
            <span>
              {`${ConfigStore.getRelationshipPersonTypeString(this.props.relationship.personCd)} • `}
              {`${ConfigStore.getRelationshipCategoryTypeString(this.props.relationship.relationshipCd)} • `}
              {this.props.relationship.travel.amount ? `${numeral(this.props.relationship.travel.amount).format('$0,0.00')} • ` : ''}
              {this.props.relationship.travel.destination ? `${this.props.relationship.travel.destination} • ` : ''}
              {dateRange ? `${dateRange} • ` : ''}
              {this.props.relationship.travel.reason ? this.props.relationship.travel.reason : ''}
            </span>
          </div>
          {commentSection}
        </div>
      );
    }

    return (
      <div className={`${styles.container} ${this.props.className}`}>
        <div className={styles.summary}>
          {removeButton}
          <span>
            <span style={{display: 'inline'}}>
              {`${ConfigStore.getRelationshipPersonTypeString(this.props.relationship.personCd)} • `}
            </span>
            <span style={{display: 'inline'}}>
              {`${ConfigStore.getRelationshipCategoryTypeString(this.props.relationship.relationshipCd)} • `}
            </span>
            <span style={{display: 'inline'}}>
              {
                this.props.relationship.typeCd ?
                  `${ConfigStore.getRelationshipTypeString(this.props.relationship.relationshipCd, this.props.relationship.typeCd)} • ` :
                  ''
              }
            </span>
            <span style={{display: 'inline'}}>
              {
                this.props.relationship.amountCd ?
                  ConfigStore.getRelationshipAmountString(this.props.relationship.relationshipCd, this.props.relationship.amountCd) :
                  ''
              }
            </span>
          </span>
        </div>
        {commentSection}
      </div>
    );
  }
}
