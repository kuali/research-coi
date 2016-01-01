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

import React from 'react';
import {GreyButton} from '../../GreyButton';
import {BlueButton} from '../../BlueButton';
import {formatDate} from '../../../formatDate';
import {COIConstants} from '../../../../../COIConstants';
import {TravelLogActions} from '../../../actions/TravelLogActions';
import {TravelLogStore} from '../../../stores/TravelLogStore';
import TextField from '../TextField';
import CurrencyField from '../CurrencyField';
import DateRangeField from '../DateRangeField';
import numeral from 'numeral';

export default class Entry extends React.Component {
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
    const errors = TravelLogStore.getErrorsForId(this.props.travelLog.relationshipId);
    const isValid = Object.keys(errors).length === 0;
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
    const styles = {
      container: {
        marginTop: '44px',
        backgroundColor: 'white',
        padding: '15px 20px',
        borderRadius: 5,
        boxShadow: '0 0 10px #C0C0C0'
      },
      entityName: {
        display: 'inline-block',
        width: '95%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: 24
      },
      actionButtonContainer: {
        display: 'inline-block',
        width: 150,
        textAlign: 'right',
        position: 'relative'
      },
      editingActionButtons: {
        textAlign: 'right',
        borderTop: '1px solid #CCC',
        padding: '13px 10px 0px 0px'
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
          marginBottom: 5,
          display: 'block',
          fontSize: 12
        }
      },
      button: {
        marginBottom: 3
      },
      archiveButton: {
        position: 'absolute',
        bottom: 0,
        right: 0
      }
    };

    let actionButtons;
    let disclosedDate;

    if (this.props.travelLog.disclosedDate) {
      disclosedDate = (
        <div style={{marginTop: 3}}>
          <div style={styles.label}>Disclosure Date:</div>
          <div name="Disclosure Date" data-for={this.props.travelLog.entityName} style={styles.data}>{formatDate(this.props.travelLog.disclosedDate)}</div>
        </div>
      );
    }

    let archiveButton;

    if (this.props.travelLog.active === 1) {
      archiveButton = (
        <GreyButton name="Archive" data-for={this.props.travelLog.entityName} onClick={this.archiveEntry} style={styles.archiveButton}>
          Archive
        </GreyButton>
      );
    }

    if (this.props.editing === true) {
      actionButtons = (
        <div style={styles.editingActionButtons}>
          <BlueButton name="Done" data-for={this.props.travelLog.entityName} onClick={this.saveEntry} style={{marginRight: 7}}>Save</BlueButton>
          <GreyButton name="Cancel" data-for={this.props.travelLog.entityName} onClick={this.cancelEntry} style={{marginRight: 7}}>Cancel</GreyButton>
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
        <div style={{position: 'absolute', bottom: 0, right: 0}}>
          <div>
            <GreyButton name="Edit" data-for={this.props.travelLog.entityName} onClick={this.editEntry} style={styles.button}>EDIT</GreyButton>
          </div>
          <div>
            <GreyButton name="Delete" data-for={this.props.travelLog.entityName} onClick={this.deleteEntry} style={styles.button} >DELETE</GreyButton>
          </div>
        </div>
      );
    }

    let jsx;
    if (this.props.editing) {
      const errors = TravelLogStore.getErrorsForId(this.props.travelLog.relationshipId);
      jsx = (
        <div name='Entry Editor'>
          <div style={{marginBottom: 9}}>
            <TextField
              id='entityName'
              label='ENTITY NAME'
              onChange={this.updateField}
              name="Entity Name"
              styles={styles.textField}
              value={this.props.travelLog.entityName}
              invalid={this.props.validating && errors.entityName ? true : false}
            />
          </div>
          <div style={{marginBottom: 9}}>
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
          </div>
          <div style={{marginBottom: 15}}>
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
          </div>
          {actionButtons}
        </div>
      );
    } else {
      jsx = (
        <div className="flexbox row" name='Entry Viewer'>
          <span className="fill">
            <div style={{marginBottom: 10}}>
              <span style={{width: '50%', fontSize: 20, fontWeight: 'bold', verticalAlign: 'middle'}}>
                <div style={styles.entityName}>{this.props.travelLog.entityName}</div>
              </span>
              <span style={{width: '50%', verticalAlign: 'middle'}}>
                <span style={styles.label}>Dates:</span>
                <span name="Dates" data-for={this.props.travelLog.entityName} style={styles.data}>
                  {`${formatDate(this.props.travelLog.startDate)} - ${formatDate(this.props.travelLog.endDate)}`}
                </span>
              </span>
            </div>
            <div style={{marginBottom: 10}}>
              <span style={{width: '50%'}}>
                <span style={styles.label}>Destination:</span>
                <span name="Destination" data-for={this.props.travelLog.entityName} style={styles.data}>{this.props.travelLog.destination}</span>
              </span>
              <span style={{width: '50%'}}>
                <span style={styles.label}>Amount:</span>
                <span name="Amount" data-for={this.props.travelLog.entityName} style={styles.data}>{numeral(this.props.travelLog.amount).format('$0,0.00')}</span>
              </span>
            </div>
            <div>
              <span style={styles.label}>Reason:</span>
              <span name="Reason" data-for={this.props.travelLog.entityName} style={styles.data}>{this.props.travelLog.reason}</span>
            </div>
          </span>
          <span style={styles.actionButtonContainer}>
            {disclosedDate}
            {actionButtons}
          </span>
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
