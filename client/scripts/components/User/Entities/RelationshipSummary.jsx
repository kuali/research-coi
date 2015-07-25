import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class RelationshipSummary extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
    this.remove = this.remove.bind(this);
  }

  remove() {
    DisclosureActions.removeEntityRelationship(this.props.id, this.props.entityId);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        backgroundColor: window.config.colors.three,
        borderRadius: 10,
        padding: 13,
        color: 'white',
        fontSize: 15
      },
      removeButton: {
        'float': 'right',
        backgroundColor: 'transparent',
        border: 0,
        color: 'white'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let commentSection;
    if (this.props.comment) {
      commentSection = (
        <div>
          <div style={{marginBottom: 5}}>Comments:</div>
          <div style={{fontSize: 14}}>
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
        <div style={{marginBottom: 7}}>
          {removeButton}
          <span style={{fontWeight: 'bold'}}>
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
