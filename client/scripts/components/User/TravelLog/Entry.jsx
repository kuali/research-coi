/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

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

import React from 'react/addons';
import {GreyButton} from '../../GreyButton';
import {BlueButton} from '../../BlueButton';
import {formatDateWithFormat} from '../../../formatDate';
import {COIConstants} from '../../../../../COIConstants';
import {TravelLogActions} from '../../../actions/TravelLogActions';
import {TravelLogStore} from '../../../stores/TravelLogStore.js';
import TextField from '../TextField';
import CurrencyField from '../CurrencyField';
import DateRangeField from '../DateRangeField';
import numeral from 'numeral';

export class Entry extends React.Component {
  constructor() {
    super();

    this.deleteEntry = this.deleteEntry.bind(this);
    this.archiveEntry = this.archiveEntry.bind(this);
    this.editEntry = this.editEntry.bind(this);
    this.saveEntry = this.saveEntry.bind(this);
    this.cancelEntry = this.cancelEntry.bind(this);
    this.updateField = this.updateField.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
  }

  deleteEntry() {
    TravelLogActions.deleteEntry(this.props.travelLog.relationshipId);
  }

  archiveEntry() {
    TravelLogActions.archiveEntry(this.props.travelLog.relationshipId);
  }

  editEntry() {
    TravelLogActions.editEntry(this.props.travelLog.relationshipId);
  }

  saveEntry() {
    let errors = TravelLogStore.getErrorsForId(this.props.travelLog.relationshipId);
    let isValid = Object.keys(errors).length === 0;
    if (isValid) {
      TravelLogActions.saveEntry(this.props.travelLog.relationshipId);
    } else {
      TravelLogActions.turnOnValidationsForEntry(this.props.travelLog.relationshipId);
    }
  }

  cancelEntry() {
    TravelLogActions.cancelEntry(this.props.travelLog.relationshipId);
  }

  updateField(evt) {
    TravelLogActions.updateEntry(evt.target.id, evt.target.value, this.props.travelLog.relationshipId);
  }

  updateStartDate(newValue) {
    TravelLogActions.updateEntry('startDate', newValue, this.props.travelLog.relationshipId);
  }

  updateEndDate(newValue) {
    TravelLogActions.updateEntry('endDate', newValue, this.props.travelLog.relationshipId);
  }

  render() {
    let styles = {
      container: {
        marginTop: '44px',
        backgroundColor: 'white',
        padding: '10px 20px',
        borderRadius: 5
      },
      entityName: {
        display: 'inline-block',
        width: '95%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },
      actionButtonContainer: {
        display: 'inline-block',
        width: '33%',
        textAlign: 'right'
      },
      editingActionButtons: {
        textAlign: 'right',
        borderTop: '1px solid grey',
        padding: 5
      },
      data: {
        fontWeight: 'bold',
        marginLeft: 5
      },
      textField: {
        container: {
          display: 'inline-block',
          width: '50%',
          marginBottom: 10
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
          marginBottom: 5
        }
      }
    };

    let actionButtons;
    let disclosedDate;

    if (this.props.travelLog.disclosedDate) {
      disclosedDate = (
        <div>
          <span style={styles.label}>Disclosure Date:</span>
          <span name="Dates" data-for={this.props.travelLog.entityName} style={styles.data}>{formatDateWithFormat(this.props.travelLog.disclosedDate, 'M/D/YY')}</span>
        </div>
      );
    }

    let archiveButton;

    if (this.props.travelLog.active === 1) {
      archiveButton = (
        <GreyButton name="Archive" data-for={this.props.travelLog.entityName} onClick={this.archiveEntry} style={styles.button}>Archive</GreyButton>
      );
    }

    if (this.props.editing === true) {
      actionButtons = (
        <div style={styles.editingActionButtons}>
          <BlueButton name="Done" data-for={this.props.travelLog.entityName} onClick={this.saveEntry} style={{marginLeft: 5, width: 90, fontWeight: 300, fontSize: 10}}>Save</BlueButton>
          <GreyButton name="Cancel" data-for={this.props.travelLog.entityName} onClick={this.cancelEntry} style={{marginLeft: 5, width: 90, fontWeight: 300, fontSize: 10}}>Cancel</GreyButton>
        </div>
      );
    } else if (this.props.travelLog.status === COIConstants.RELATIONSHIP_STATUS.DISCLOSED) {
      actionButtons = (
        <div style={styles.buttons}>
          {archiveButton}
        </div>
      );
    } else {
      actionButtons = (
        <div style={{display: 'inline-block', width: '75%', textAlign: 'right'}}>
          <GreyButton name="Edit" data-for={this.props.travelLog.entityName} onClick={this.editEntry} style={{marginBottom: 5, width: 90, fontWeight: 300, fontSize: 10}}>EDIT</GreyButton>
          <GreyButton name="Delete" data-for={this.props.travelLog.entityName} onClick={this.deleteEntry} style={{marginBottom: 5, width: 90, fontWeight: 300, fontSize: 10}} >DELETE</GreyButton>
        </div>
      );
    }

    let jsx;
    if (this.props.editing) {
      let errors = TravelLogStore.getErrorsForId(this.props.travelLog.relationshipId);
      jsx = (
        <div>
          <TextField
            id='entityName'
            label='ENTITY NAME'
            onChange={this.updateField}
            name="Entity Name"
            styles={styles.textField}
            value={this.props.travelLog.entityName}
            invalid={this.props.validating && errors.entityName ? true : false}
          />
          <div style={styles.textField.container}/>
          <CurrencyField
            id='amount'
            label='AMOUNT'
            onChange={this.updateField}
            name="Amount"
            styles={styles.textField}
            value={this.props.travelLog.amount}
            invalid={this.props.validating && errors.amount ? true : false}
          />
          <TextField
            id='destination'
            label='DESTINATION'
            onChange={this.updateField}
            name="Destinantion"
            styles={styles.textField}
            value={this.props.travelLog.destination}
            invalid={this.props.validating && errors.destination ? true : false}
          />
          <DateRangeField
            id='dateRange'
            label='DATE RANGE'
            onStartDateChange={this.updateStartDate}
            onEndDateChange={this.updateEndDate}
            styles={styles.textField}
            startDate={this.props.travelLog.startDate}
            endDate={this.props.travelLog.endDate}
            startDateInvalid={this.props.validating && errors.startDate ? true : false}
            endDateInvalid={this.props.validating && errors.endDate ? true : false}
          />
          <TextField
            id='reason'
            label='REASON'
            onChange={this.updateField}
            name="Reason"
            styles={styles.textField}
            value={this.props.travelLog.reason}
            invalid={this.props.validating && errors.reason ? true : false}
          />
          {actionButtons}
        </div>
      );
    } else {
      jsx = (
        <div>
          <div style={{display: 'inline-block', width: '100%', marginBottom: 10}}>
            <div style={{display: 'inline-block', width: '33%', fontSize: 20, fontWeight: 'bold'}}>
              <div style={styles.entityName}>{this.props.travelLog.entityName}</div>
              <div style={{display: 'inline-block', width: '3%', textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>&middot;</div>
            </div>
            <div style={{display: 'inline-block', width: '33%'}}>
              <span style={styles.label}>Dates:</span>
              <span name="Dates" data-for={this.props.travelLog.entityName} style={styles.data}>{formatDateWithFormat(this.props.travelLog.startDate, 'M/D/YY') + ' - ' + formatDateWithFormat(this.props.travelLog.endDate, 'M/D/YY')}</span>
            </div>
            <div style={{display: 'inline-block', width: '33%'}}>
              {disclosedDate}
            </div>
          </div>
          <div style={{display: 'inline-block', width: '66%'}}>
            <div style={{display: 'inline-block', width: '50%'}}>
              <span style={styles.label}>Destination:</span>
              <span name="Destination" data-for={this.props.travelLog.entityName} style={styles.data}>{this.props.travelLog.destination}</span>
            </div>
            <div style={{display: 'inline-block', width: '50%'}}>
              <span style={styles.label}>Amount:</span>
              <span name="Amount" data-for={this.props.travelLog.entityName} style={styles.data}>{numeral(this.props.travelLog.amount).format('$0,0.00')}</span>
            </div>
            <div style={{display: 'inline-block', width: '100%', marginTop: 10}}>
              <span style={styles.label}>Reason:</span>
              <span name="Reason" data-for={this.props.travelLog.entityName} style={styles.data}>{this.props.travelLog.reason}</span>
            </div>
          </div>
          <div style={styles.actionButtonContainer}>
            {actionButtons}
          </div>
        </div>
      );
    }

    return (
      <div style={styles.container}>
        {jsx}
      </div>
    );
  }

}
