import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DatePicker} from '../../DatePicker.jsx';
import {KButton} from '../../KButton';
import {AdminActions} from '../../../actions/AdminActions';

export class DisclosureFilterByDate extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.state = {
      fromDate : '',
      toDate : '',
      showingStartCalendar: false,
      showingEndCalendar: false
    };
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

  clearFilter() {
    AdminActions.clearDateFilter();
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container : {
        whiteSpace : 'nowrap',
        color : 'black',
        position : 'relative',
      },
      inputDivs : {
        textAlign: 'left',
        padding : 10,
      },
      label : {
        display: 'block',
        fontSize: 13
      },
      datesContainer : {
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
    let styles = merge(this.commonStyles, desktopStyles);

    let filter = this.props.filter || this.state.filter;
    return (
      <div className="flexbox column" style={merge(styles.container, this.props.style)}>
        <div className="flexbox row" style={styles.datesContainer}>
          <div style={styles.inputDivs}>
            <label htmlFor="fromDate" style={styles.label}>From Date:</label>
            <DatePicker id="fromDate" onChange={this.setFromDate} value={this.props.startDate} />
          </div>
          <div style={styles.inputDivs}>
            <label htmlFor="toDate" style={styles.label}>To Date:</label>
            <DatePicker id="toDate" onChange={this.setToDate} value={this.props.endDate} />
          </div>
        </div>
        <div style={styles.inputDivs}>
          <label htmlFor="dateSort" style={styles.label}>Sort</label>
          <select style={styles.dropDown} id="dateSort" value={this.props.sortDirection} onChange={this.setOrder}>
            <option value="DESCENDING">Newest - Oldest</option>
            <option value="ASCENDING">Oldest - Newest</option>
          </select>
        </div>
        <div>
          <KButton style={styles.clearButton} onClick={this.clearFilter}>CLEAR FILTER</KButton>
        </div>
      </div>
    );
  }
}