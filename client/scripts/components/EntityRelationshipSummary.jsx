import React from 'react/addons';
import {merge} from '../merge';
import {DisclosureActions} from '../actions/DisclosureActions';

export default class EntityRelationshipSummary extends React.Component {
  constructor() {
    super();

    this.remove = this.remove.bind(this);
  }

  remove() {
    DisclosureActions.removeEntityRelationship(this.props.id, this.props.entityId);
  }

  render() {
    let styles = {
      container: {
        color: 'white',
        backgroundColor: window.config.colors.three,
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
      commentLabel: {
        marginBottom: 5
      },
      commentValue: {
        fontSize: 14
      }
    };

    let commentSection;
    if (this.props.comment) {
      commentSection = (
        <div>
          <div style={styles.commentLabel}>Comments:</div>
          <div style={styles.commentValue}>
            {this.props.comment}
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

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.summary}>
          {removeButton}
          <span>
            {this.props.person + ' • '}
            {this.props.relationship + ' • '}
            {this.props.type ? this.props.type + ' • ' : ''}
            {this.props.amount ? this.props.amount : ''}
          </span>
        </div>
        {commentSection}
      </div>
    );
  }
}
