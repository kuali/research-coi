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
        backgroundColor: 'white',
        padding: '13px 8px 13px 25px',
        lineHeight: '20px',
        minHeight: 89,
        boxShadow: '0 2px 9px #CCC',
        zIndex: 1,
        position: 'relative'
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
        width: 165,
        padding: '4px 7px 5px 7px',
        margin: '15px 20px 0 0',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#DFDFDF',
        borderBottom: '2px solid #717171',
        color: window.colorBlindModeOn ? 'white' : '#666'
      }
    };

    let disclosure = this.props.disclosure;

    let dateSection;
    if (disclosure.revisedDate) {
      dateSection = (
        <div style={merge(styles.details)}>
          <span style={styles.label}>Revised On:</span>
          <span style={styles.value}>
            <span style={{marginRight: 3}}>{formatDate(disclosure.revisedDate)}</span>
            <span style={{marginRight: 3}}>•</span>
            {ConfigStore.getAdminDisclosureStatusString(disclosure.statusCd)}
          </span>
        </div>
      );
    }
    else {
      dateSection = (
        <div style={merge(styles.details)}>
          <span style={styles.label}>Submitted On:</span>
          <span style={styles.value}>
            <span style={{marginRight: 3}}>{formatDate(disclosure.submittedDate)}</span>
            <span style={{marginRight: 3}}>•</span>
            {ConfigStore.getAdminDisclosureStatusString(disclosure.statusCd)}
          </span>
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <Link to={`/`} style={{float: 'right'}}>
          <KButton style={styles.backButton}>
            <span>
              <i className="fa fa-list-ul" style={{marginRight: 5}}></i>
              Back To List View
            </span>
          </KButton>
        </Link>
        <span>
          <div style={styles.heading}>
            <span style={styles.disclosure}>
              <span style={{marginRight: 3}}>
                {ConfigStore.getDisclosureTypeString(disclosure.typeCd)}
              </span>
              •
            </span>
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
