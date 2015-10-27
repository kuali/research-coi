import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {KButton} from '../KButton';
import {AdminActions} from '../../actions/AdminActions';
import DisclosureFilter from './DisclosureFilter';
import DoneWithFilterButton from './DoneWithFilterButton';
import {merge} from '../../merge';

export class DisclosureFilterByStatus extends DisclosureFilter {
  constructor() {
    super();

    this.label = 'STATUS';

    this.toggleFilter = this.toggleFilter.bind(this);
    this.isChecked = this.isChecked.bind(this);
  }

  clear(e) {
    AdminActions.clearStatusFilter();
    e.stopPropagation();
  }

  toggleFilter(evt) {
    let code = +(evt.target.id.replace('statFilt', ''));
    let theStatus = this.props.possibleStatuses.find(status => {
      return status.code === code;
    });
    AdminActions.toggleStatusFilter(theStatus);
  }

  isChecked(value) {
    return this.props.activeFilters.find(filter => {
      return filter === value;
    }) !== undefined;
  }

  // render() is implemented in DisclosureFilter, which will call renderFilter
  renderFilter() {
    let styles = {
      container: {
        whiteSpace: 'nowrap',
        color: 'black',
        width: 238
      },
      checkbox: {
        textAlign: 'left',
        padding: 10,
        fontSize: 15
      },
      clearButton: {
        backgroundColor: '#DFDFDF',
        color: 'black',
        borderBottom: '3px solid #717171',
        float: 'right',
        padding: '4px 7px',
        width: 135,
        margin: '10px 0'
      },
      x: {
        fontSize: 15,
        paddingRight: 8
      },
      approvedStatus: {
        borderTop: '1px solid #AAA',
        borderBottom: '1px solid #AAA',
        padding: '6px 0',
        margin: '0 10px 12px 10px'
      }
    };

    let options = this.props.possibleStatuses.filter(status => {
      return status.code !== 3;
    }).sort((a, b) => {
      return a.label.localeCompare(b.label);
    }).map((status) => {
      let id = `statFilt${status.code}`;
      return (
        <div style={styles.checkbox} key={status.code}>
          <input
            id={id}
            type="checkbox"
            checked={this.isChecked(status.code)}
            onChange={this.toggleFilter}
          />
          <label htmlFor={id} style={{paddingLeft: 9}}>{status.label}</label>
        </div>
      );
    });

    let approved = this.props.possibleStatuses.filter(status => {
      return status.code === 3;
    }).map(status => {
      let id = `statFilt${status.code}`;
      return (
        <div style={merge(styles.checkbox, {padding: '10px 0'})} key={status.code}>
          <input
            id={id}
            type="checkbox"
            checked={this.isChecked(status.code)}
            onChange={this.toggleFilter}
          />
          <label htmlFor={id} style={{paddingLeft: 9}}>{status.label}</label>
        </div>
      );
    });

    return (
      <div style={styles.container}>
        <DoneWithFilterButton onClick={this.close} />
        {options}

        <div style={styles.approvedStatus}>
          {approved}
        </div>

        <KButton style={styles.clearButton} onClick={this.clear}>
          <i className="fa fa-times" style={styles.x}></i>
          CLEAR FILTER
        </KButton>
      </div>
    );
  }
}
