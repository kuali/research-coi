import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {DatePicker} from '../DatePicker';
import {KButton} from '../KButton';
import {AdminActions} from '../../actions/AdminActions';
import DisclosureFilter from './DisclosureFilter';
import DoneWithFilterButton from './DoneWithFilterButton';

export class DisclosureFilterByDate extends DisclosureFilter {
  constructor() {
    super();

    this.label = 'DATE/DATE RANGE';
  }

  clear(e) {
    AdminActions.clearDateFilter();
    e.stopPropagation();
  }

  setFromDate(newValue) {
    AdminActions.setStartDateFilter(newValue);
  }

  setToDate(newValue) {
    AdminActions.setEndDateFilter(newValue);
  }

  setOrder(evt) {
    AdminActions.setSortDirection(evt.target.value);
  }

  // render() is implemented in DisclosureFilter, which will call renderFilter
  renderFilter() {
    let styles = {
      container: {
        whiteSpace: 'nowrap',
        color: 'black',
        position: 'relative'
      },
      inputDivs: {
        textAlign: 'left',
        padding: 10,
        flex: 1
      },
      label: {
        display: 'block',
        fontSize: 13
      },
      dropDown: {
        width: 176,
        height: 27,
        backgroundColor: 'white',
        fontSize: 14,
        borderBottom: '1px solid #aaa'
      },
      clearButton: {
        backgroundColor: '#444',
        color: 'white'
      }
    };

    let sortFields;
    if (this.props.showSort) {
      sortFields = (
        <div style={styles.inputDivs}>
          <label htmlFor="dateSort" style={styles.label}>Sort</label>
          <select style={styles.dropDown} id="dateSort" value={this.props.sortDirection} onChange={this.setOrder}>
            <option value="DESCENDING">Newest - Oldest</option>
            <option value="ASCENDING">Oldest - Newest</option>
          </select>
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <DoneWithFilterButton onClick={this.close} />
        <div className="flexbox row">
          <div style={styles.inputDivs}>
            <label htmlFor="fromDate" style={styles.label}>From Date:</label>
            <DatePicker id="fromDate" onChange={this.setFromDate} value={this.props.startDate} />
          </div>
          <div style={styles.inputDivs}>
            <label htmlFor="toDate" style={styles.label}>To Date:</label>
            <DatePicker id="toDate" onChange={this.setToDate} value={this.props.endDate} />
          </div>
        </div>
        {sortFields}
        <div>
          <KButton style={styles.clearButton} onClick={this.clear}>CLEAR FILTER</KButton>
        </div>
      </div>
    );
  }
}
