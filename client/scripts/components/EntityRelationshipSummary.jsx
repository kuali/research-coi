import React from 'react/addons';
import {merge} from '../merge';
import {formatDate} from '../formatDate';
import numeral from 'numeral';
import ConfigStore from '../stores/ConfigStore';

export default class EntityRelationshipSummary extends React.Component {
  constructor() {
    super();

    this.remove = this.remove.bind(this);
  }

  remove() {
    this.props.onRemove(this.props.relationship.id, this.props.entityId);
  }

  render() {
    let styles = {
      container: {
        color: 'white',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        padding: 13,
        borderRadius: 10,
        fontSize: 15
      },
      removeButton: {
        'float': 'right',
        backgroundColor: 'transparent',
        border: 0,
        color: 'white',
        fontWeight: 'normal'
      },
      summary: {
        marginBottom: 7,
        fontWeight: 'bold'
      },
      commentValue: {
        fontSize: 14
      }
    };

    let commentSection;
    if (this.props.relationship.comments) {
      commentSection = (
        <div>
          <div style={styles.commentValue}>
            {this.props.relationship.comments}
          </div>
        </div>
      );
    }

    let removeButton;
    if (!this.props.readonly) {
      removeButton = (
        <button onClick={this.remove} style={styles.removeButton}>X</button>
      );
    }
    if (this.props.relationship.relationship === 'Travel') {
      let dateRange = formatDate(this.props.relationship.travel.startDate) + ' - ' + formatDate(this.props.relationship.travel.endDate);
      return (
        <div style={merge(styles.container, this.props.style)}>
          <div style={styles.summary}>
            {removeButton}
            <span>
              {ConfigStore.getRelationshipPersonTypeString(this.props.relationship.personCd) + ' • '}
              {ConfigStore.getRelationshipCategoryTypeString(this.props.relationship.relationshipCd) + ' • '}
              {this.props.relationship.travel.amount ? numeral(this.props.relationship.travel.amount).format('$0,0.00') + ' • ' : ''}
              {this.props.relationship.travel.destination ? this.props.relationship.travel.destination + ' • ' : ''}
              {dateRange ? dateRange + ' • ' : ''}
              {this.props.relationship.travel.reason ? this.props.relationship.travel.reason : ''}
            </span>
          </div>
          {commentSection}
        </div>
      );
    } else {
      return (
        <div style={merge(styles.container, this.props.style)}>
          <div style={styles.summary}>
            {removeButton}
            <span>
              <span style={{display: 'inline'}}>
                {ConfigStore.getRelationshipPersonTypeString(this.props.relationship.personCd) + ' • '}
              </span>
              <span style={{display: 'inline'}}>
                {ConfigStore.getRelationshipCategoryTypeString(this.props.relationship.relationshipCd) + ' • '}
              </span>
              <span style={{display: 'inline'}}>
                {this.props.relationship.typeCd ? ConfigStore.getRelationshipTypeString(this.props.relationship.relationshipCd, this.props.relationship.typeCd) + ' • ' : ''}
              </span>
              <span style={{display: 'inline'}}>
                {this.props.relationship.amountCd ? ConfigStore.getRelationshipAmountString(this.props.relationship.relationshipCd, this.props.relationship.amountCd) : ''}
              </span>
            </span>
          </div>
          {commentSection}
        </div>
      );
    }

  }
}
