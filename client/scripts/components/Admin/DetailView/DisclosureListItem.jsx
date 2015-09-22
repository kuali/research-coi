import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import {AdminActions} from '../../../actions/AdminActions';

export class DisclosureListItem extends React.Component {
  constructor() {
    super();

    this.selectDisclosure = this.selectDisclosure.bind(this);
    this.highlightSearchTerm = this.highlightSearchTerm.bind(this);
  }

  highlightSearchTerm(value) {
    let start = value.toLowerCase().indexOf(this.props.searchTerm.toLowerCase());
    if (start >= 0) {
      let matchingValue = value.substr(start, this.props.searchTerm.length);
      return (
        <span>
          {value.substr(0, start) + ''}
          <span className="highlight">
            {matchingValue}
          </span>
          {value.substr(start + this.props.searchTerm.length)}
        </span>
      );
    }
    else {
      return value;
    }
  }

  selectDisclosure() {
    AdminActions.loadDisclosure(this.props.disclosure.id);
  }

  render() {
    let styles = {
      container: {
        borderBottom: '1px solid #6d6d6d',
        padding: 6,
        paddingLeft: 40,
        fontSize: '.9em',
        backgroundColor: this.props.selected ? '#c1c1c1' : 'transparent',
        cursor: 'pointer'
      },
      disclosureType: {
        fontWeight: 'bold'
      }
    };

    let disclosure = this.props.disclosure;
    let dateToShow;
    if (disclosure.revised_date) {
      dateToShow = (
        <div>{formatDate(disclosure.revised_date)} - Revised</div>
      );
    }
    else {
      dateToShow = (
        <div>{formatDate(disclosure.submitted_date)} - Submitted for Approval</div>
      );
    }

    return (
      <li style={merge(styles.container, this.props.style)} onClick={this.selectDisclosure}>
        <div style={styles.disclosureType}>
          {this.highlightSearchTerm(disclosure.type)}
        </div>
        <div>{this.highlightSearchTerm(disclosure.submitted_by)}</div>
        {dateToShow}
        <div>Status: {this.highlightSearchTerm(disclosure.status)}</div>
      </li>
    );
  }
}
