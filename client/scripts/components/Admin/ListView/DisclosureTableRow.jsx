import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {getStatusText} from '../../../statusText';
import {formatDate} from '../../../formatDate';

export class DisclosureTableRow extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {}
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
            {getStatusText(this.props.status)}
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
        padding: '11px 20px',
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
      <div role="row" style={merge(styles.container, this.props.style)}>
        <span role="gridcell" style={styles.value}>
          {this.props.name}
        </span>
        <span role="gridcell" style={styles.value}>
          {this.props.submittedBy}
        </span>
        <span role="gridcell" style={styles.value}>
          {formatDate(this.props.submittedOn)}
        </span>
        <span role="gridcell" style={styles.value}>
          {getStatusText(this.props.status)}
        </span>
        <span role="gridcell" style={styles.value}>
          {this.props.disposition}
        </span>
        <span role="gridcell" style={merge(styles.startDate, styles.value)}>
          {formatDate(this.props.startDate)}
        </span>
      </div>
    );  
  }
}