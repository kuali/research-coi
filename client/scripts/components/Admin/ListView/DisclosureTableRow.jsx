import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import ReactRouter from 'react-router';
let Link = ReactRouter.Link;

export class DisclosureTableRow extends React.Component {
  highlightSearchTerm(value) {
    if (this.props.searchTerm.length > 2) {
      return value.replace(new RegExp(this.props.searchTerm, 'g'), '<span class="highlight">' + this.props.searchTerm + '</span>');
    }
    else {
      return value;
    }
  }

  render() {
    let styles = {
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
      }
    };

    return (
      <div role="row" style={merge(styles.container, this.props.style)}>
        <span role="gridcell" style={styles.value}>
          <Link to={`/detailview/${this.props.id}`}>
            <span dangerouslySetInnerHTML={{__html: this.highlightSearchTerm(this.props.submittedBy)}} />
          </Link>
        </span>
        <span role="gridcell" style={styles.value}>
          <span dangerouslySetInnerHTML={{__html: this.highlightSearchTerm(this.props.type)}} />
        </span>
        <span role="gridcell" style={styles.value}>
          <span dangerouslySetInnerHTML={{__html: this.highlightSearchTerm(this.props.status)}} />
        </span>
        <span role="gridcell" style={styles.value}>
          {formatDate(this.props.submittedDate)}
        </span>
      </div>
    );
  }
}
