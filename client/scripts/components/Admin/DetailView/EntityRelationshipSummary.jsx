import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';

export class EntityRelationshipSummary extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        borderRadius: 5,
        backgroundColor: window.config.colors.three,
        color: 'white',
        padding: '2px 7px 7px 7px',
        fontSize: 13
      },
      summary: {
        fontWeight: 'bold'
      },
      commentLabel: {
        marginTop: 7
      },
      commentValue: {
        fontStyle: 'italic', 
        fontSize: 11
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.summary}>
          {this.props.relationship.person} • 
          {this.props.relationship.relationship} • 
          {this.props.relationship.type ? this.props.relationship.type + ' • ' : ''}{this.props.relationship.amount}
        </div>
        <div style={styles.commentLabel}>Comments:</div>
        <div style={styles.commentValue}>
          {this.props.relationship.comments}
        </div>
      </div>
    );  
  }
}