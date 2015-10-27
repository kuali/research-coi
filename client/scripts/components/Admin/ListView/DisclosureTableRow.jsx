import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import ReactRouter from 'react-router';
import ConfigStore from '../../../stores/ConfigStore';
let Link = ReactRouter.Link;

export class DisclosureTableRow extends React.Component {
  highlightSearchTerm(value) {
    let start = value.toLowerCase().indexOf(this.props.searchTerm.toLowerCase());
    if (start >= 0) {
      let matchingValue = value.substr(start, this.props.searchTerm.length);
      return (
        <span>
          <span style={{display: 'inline'}}>{value.substr(0, start) + ''}</span>
          <span className="highlight">
            {matchingValue}
          </span>
          <span style={{display: 'inline'}}>{value.substr(start + this.props.searchTerm.length)}</span>
        </span>
      );
    }
    else {
      return value;
    }
  }

  render() {
    let styles = {
      container: {
        display: 'table-row',
        height: 43
      },
      value: {
        padding: '12px 0 0 0',
        display: 'table-cell',
        borderBottom: '1px solid #AAA',
        fontSize: 15,
        textOverflow: 'ellipsis'
      },
      firstColumn: {
        padding: '12px 0 0 50px'
      },
      lastColumn: {
        padding: '12px 50px 0 0'
      }
    };

    return (
      <div role="row" style={merge(styles.container, this.props.style)}>
        <span role="gridcell" style={merge(styles.value, styles.firstColumn)}>
          <Link to={`/detailview/${this.props.id}/${this.props.statusCd}`}>
            {this.highlightSearchTerm(this.props.submittedBy)}
          </Link>
        </span>
        {/*<span role="gridcell" style={styles.value}>
          {this.highlightSearchTerm(this.props.type)}
        </span>*/}
        <span role="gridcell" style={styles.value}>
          {ConfigStore.getAdminDisclosureStatusString(this.props.statusCd)}
        </span>
        <span role="gridcell" style={merge(styles.value, styles.lastColumn)}>
          {formatDate(this.props.submittedDate)}
        </span>
      </div>
    );
  }
}
