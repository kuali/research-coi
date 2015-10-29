import React from 'react/addons';
import {merge} from '../../../merge';
import {KButton} from '../../KButton';
import Router from 'react-router';
import {formatDate} from '../../../formatDate';
import ConfigStore from '../../../stores/ConfigStore';
import {COIConstants} from '../../../../../COIConstants';

let Link = Router.Link;

export class DisclosureTableRow extends React.Component {
  render() {
    let styles = {
      container: {
        padding: '20px 60px',
        borderBottom: '5px solid white',
        backgroundColor: this.props.type === 'Annual' ? '#E9E9E9' : '#F7F7F7'
      },
      cell: {
        display: 'inline-block',
        verticalAlign: 'middle'
      },
      one: {
        width: this.props.showButtonColumn ? '35%' : '33%'
      },
      two: {
        width: this.props.showButtonColumn ? '25%' : '33%',
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontSize: 17
      },
      three: {
        width: this.props.showButtonColumn ? '25%' : '33%',
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontSize: 17
      },
      four: {
        width: '15%'
      },
      type: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontSize: 17
      },
      extra: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        fontSize: 14
      },
      button: {
        color: 'black',
        fontSize: 12
      }
    };

    let extraInfo;
    if (this.props.type === 2) {
      if (this.props.expiresOn) {
        extraInfo = (
          <div style={styles.extra}>Expires On: {formatDate(this.props.expiresOn)}</div>
        );
      }
    }
    else {
      extraInfo = (
        <div style={styles.extra}>Event Title: {this.props.title}</div>
      );
    }

    let button;
    if (this.props.status === COIConstants.DISCLOSURE_STATUS.IN_PROGRESS ||
        this.props.status === COIConstants.DISCLOSURE_STATUS.UP_TO_DATE ||
        this.props.status === COIConstants.DISCLOSURE_STATUS.EXPIRED
       ) {
      button = (
        <Link to="disclosure" query={{type: this.props.type }}>
          <KButton style={styles.button}>Update &gt;</KButton>
        </Link>
      );
    } else if (this.props.status === COIConstants.DISCLOSURE_STATUS.UPDATES_REQUIRED) {
      button = (
        <Link to={`/revise/${this.props.disclosureId}`}>
          <KButton style={styles.button}>Revise &gt;</KButton>
        </Link>
      );
    }

    let buttonColumn;
    if (this.props.showButtonColumn) {
      buttonColumn = (
        <span role="gridcell" style={merge(styles.cell, styles.four)}>
          {button}
        </span>
      );
    }

    return (
      <div role="row" style={merge(styles.container, this.props.style)}>
        <span role="gridcell" style={merge(styles.cell, styles.one)}>
          <div style={styles.type}>{ConfigStore.getDisclosureTypeString(this.props.type)}</div>
          {extraInfo}
        </span>
        <span role="gridcell" style={merge(styles.cell, styles.two)}>
          {ConfigStore.getDisclosureStatusString(this.props.status)}
        </span>
        <span role="gridcell" style={merge(styles.cell, styles.three)}>
          {this.props.lastreviewed ? formatDate(this.props.lastreviewed) : 'None'}
        </span>
        {buttonColumn}
      </div>
    );
  }
}
