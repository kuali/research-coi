import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import Router from 'react-router';
let Link = Router.Link;

export class DisclosureTableRow extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        backgroundColor: 'white',
        margin: '8px 0',
        padding: '5px 25px 7px 25px',
        fontSize: 14
      },
      name: {
        fontWeight: 'bold',
        fontSize: 16
      },
      details: {
        display: 'inline-block',
        width: '60%',
        verticalAlign: 'top'
      },
      dates: {
        display: 'inline-block',
        width: '40%',
        verticalAlign: 'top'
      },
      label: {
        color: '#666'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);
    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.name}>{this.props.name}</div>
        <span style={styles.details}>
          <div>
            {this.props.submittedBy}
          </div>
          <div>
            {this.props.status}
          </div>
          <div>
            {this.props.disposition}
          </div>
        </span>
        <span style={styles.dates}>
          <div style={{marginBottom: 5}}>
            <div style={styles.label}>Submitted:</div>
            {formatDate(this.props.submittedOn)}
          </div>
          <div>
            <div style={styles.label}>Project Start Date:</div>
            {formatDate(this.props.submittedOn)}
          </div>
        </span>
      </div>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        display: 'table-row',
        height: 50
      },
      value: {
        padding: '14px 20px',
        display: 'table-cell',
        borderBottom: '1px solid #AAA',
        fontSize: 15,
        textOverflow: 'ellipsis'
      },
      startDate: {
        width: '10%'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);
    return (
      <Link className="hoverable" to="archivedetail" params={{id: this.props.id}} role="row" style={merge(styles.container, this.props.style)}>
        <span role="gridcell" style={styles.value}>
          {this.props.name}
        </span>
        <span role="gridcell" style={styles.value}>
          {formatDate(this.props.submittedOn)}
        </span>
        <span role="gridcell" style={styles.value}>
          {formatDate(this.props.approvedDate)}
        </span>
        <span role="gridcell" style={merge(styles.startDate, styles.value)}>
          {formatDate(this.props.startDate)}
        </span>
        <span role="gridcell" style={styles.value}>
          {this.props.type}
        </span>
      </Link>
    );
  }
}
