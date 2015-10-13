import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import ConfigStore from '../../../stores/ConfigStore';
import {formatDate} from '../../../formatDate';
import {KButton} from '../../KButton';
import ReactRouter from 'react-router';
let Link = ReactRouter.Link;

export class DisclosureDetailHeading extends React.Component {
  constructor() {
    super();
  }

  render() {
    let styles = {
      container: {
        backgroundColor: '#efefef',
        padding: '13px 8px 13px 25px',
        lineHeight: '20px',
        minHeight: 89,
        boxShadow: '0 1px 1px #CCC'
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
      },
      backButton: {
        float: 'right',
        width: 155,
        marginTop: 15
      }
    };

    let disclosure = this.props.disclosure;

    let dateSection;
    if (disclosure.revisedDate) {
      dateSection = (
        <div style={merge(styles.details)}>
          <span style={styles.label}>Revised On:</span>
          <span style={styles.value}>{formatDate(disclosure.revisedDate)} • {ConfigStore.getAdminDisclosureStatusString(disclosure.statusCd)}</span>
        </div>
      );
    }
    else {
      dateSection = (
        <div style={merge(styles.details)}>
          <span style={styles.label}>Submitted On:</span>
          <span style={styles.value}>{formatDate(disclosure.submittedDate)} • {ConfigStore.getAdminDisclosureStatusString(disclosure.statusCd)}</span>
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <Link to={`/`}>
          <KButton style={styles.backButton}>
            Back To List View
          </KButton>
        </Link>
        <span>
          <div style={styles.heading}>
            <span style={styles.disclosure}>{ConfigStore.getDisclosureTypeString(disclosure.typeCd)} •</span>
            <span>ID</span>
            <span style={styles.id}>#{disclosure.id}</span>
          </div>
          <div style={styles.details}>
            <span style={styles.label}>Submitted By:</span>
            <span style={styles.value}>{disclosure.submittedBy}</span>
          </div>
          {dateSection}
        </span>
      </div>
    );
  }
}
