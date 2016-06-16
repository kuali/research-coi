/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import styles from './style';
import React from 'react';
import {BlueButton} from '../../../blue-button';
import {TravelLogActions} from '../../../../actions/travel-log-actions';
import {TravelLogStore} from '../../../../stores/travel-log-store';
import TextField from '../../text-field';
import CurrencyField from '../../currency-field';
import DateRangeField from '../../date-range-field';

export default class TravelLogForm extends React.Component {
  constructor() {
    super();

    this.addEntry = this.addEntry.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
  }

  addEntry() {
    const validationErrors = TravelLogStore.getErrors();
    const isValid = Object.keys(validationErrors).length === 0;
    if (isValid) {
      TravelLogActions.addEntry();
    } else {
      TravelLogActions.turnOnValidations();
    }
  }

  updateField(evt) {
    TravelLogActions.updateTravelLog(evt.target.id, evt.target.value);
  }

  updateStartDate(newValue) {
    TravelLogActions.updateTravelLog('startDate', newValue);
  }

  updateEndDate(newValue) {
    TravelLogActions.updateTravelLog('endDate', newValue);
  }

  render() {
    const textFieldStyles = {
      container: {
        display: 'inline-block',
        width: '33%',
        paddingRight: 15
      },
      input: {
        padding: '2px 8px',
        fontSize: 16,
        borderRadius: 5,
        border: '1px solid #ccc',
        height: 30,
        width: '95%'
      },
      label: {
        marginBottom: 5,
        fontSize: 12,
        display: 'inline-block'
      }
    };

    const errors = TravelLogStore.getErrors();
    return (
      <div className={styles.container} name='Travel Log Form'>
        <div className={styles.row}>
          <TextField
            id='entityName'
            label='ENTITY NAME'
            onChange={this.updateField}
            name="Entity Name"
            styles={textFieldStyles}
            value={this.props.entry.entityName}
            invalid={this.props.validating && errors.entityName ? true : false}
          />
          <CurrencyField
            id='amount'
            label='AMOUNT'
            onChange={this.updateField}
            name="Amount"
            styles={textFieldStyles}
            value={this.props.entry.amount}
            invalid={this.props.validating && errors.amount ? true : false}
          />
          <TextField
            id='destination'
            label='DESTINATION'
            onChange={this.updateField}
            name="Destinantion"
            styles={textFieldStyles}
            value={this.props.entry.destination}
            invalid={this.props.validating && errors.destination ? true : false}
          />
        </div>
        <div className={styles.row}>
          <DateRangeField
            id='dateRange'
            label='DATE RANGE'
            onStartDateChange={this.updateStartDate}
            onEndDateChange={this.updateEndDate}
            styles={textFieldStyles}
            startDate={this.props.entry.startDate}
            endDate={this.props.entry.endDate}
            startDateInvalid={this.props.validating && errors.startDate ? true : false}
            endDateInvalid={this.props.validating && errors.endDate ? true : false}
          />
          <TextField
            id='reason'
            label='REASON'
            onChange={this.updateField}
            name="Reason"
            styles={textFieldStyles}
            value={this.props.entry.reason}
            invalid={this.props.validating && errors.reason ? true : false}
          />
          <div style={textFieldStyles.container}>
            <BlueButton onClick={this.addEntry}>+ ADD</BlueButton>
          </div>
        </div>
      </div>
    );
  }
}
