import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';

export class DisclosureDetailHeading extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        backgroundColor: '#efefef',
        padding: '13px 25px',
        lineHeight: '20px'
      },
      type: {
        fontWeight: 'bold'
      },
      heading: {
        fontSize: 19,
        marginBottom: 3
      },
      disclosure: {
        fontWeight: 'bold',
        marginRight: 5
      },
      id: {
        fontWeight: 'bold',
        marginLeft: 5
      },
      label: {
        marginRight: 5
      },
      value: {
        fontWeight: 'bold'
      },
      details: {
        fontSize: 15
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let disclosure = this.props.disclosure;
    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.heading}>
          <span style={styles.disclosure}>{disclosure.type} Disclosure •</span>
          <span>ID</span>
          <span style={styles.id}>#{disclosure.id}</span>
        </div>
        <div style={merge(styles.details)}>
          <span style={styles.label}>Submitted On:</span>
          <span style={styles.value}>{new Date(disclosure.submittedOn).toDateString()} • {disclosure.status}</span>
        </div>
        <div style={styles.details}>
          <span style={styles.label}>Reporter:</span>
          <span style={styles.value}>{disclosure.submittedBy}</span>
        </div>
      </div>
    );
  }
}
