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
import {ProminentButton} from '../../ProminentButton';
import {formatDate} from '../../../formatDate';
import {COIConstants} from '../../../../../COIConstants';
import {TravelLogActions} from '../../../actions/TravelLogActions';
import TextField from '../TextField';
import CurrencyField from '../CurrencyField';
import DateRangeField from '../DateRangeField';

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
    TravelLogActions.saveEntry(this.props.travelLog.relationshipId);
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
        fontSize: 20,
        fontWeight: 'bold',
        width: '35%',
        display: 'inline-block'
      },
      left: {
        width: '70%',
        display: 'inline-block'
      },
      midDot: {
        float: 'right',
        marginRight: '10px'
      },
      dates: {
        width: '55%',
        display: 'inline-block'
      },
      label: {
        fontSize: 14,
        marginRight: '5px'
      },
      reason: {
        marginTop: 10
      },
      data: {
        fontWeight: 550
      },
      buttons: {
        width: '30%',
        display: 'inline-block',
        verticalAlign: 'bottom'
      },
      button: {
        margin: '5'
      },
      amount: {
        width: '55%',
        display: 'inline-block'
      },
      destination: {
        width: '35%',
        display: 'inline-block'
      },
      middle: {
        marginTop: 10
      },
      textField: {
        container: {
          display: 'inline-block',
          width: '33%'
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
          fontWeight: '500'
        }
      }
    };

    let actionButtons;
    let disclosedDate;

    if (this.props.travelLog.disclosedDate) {
      disclosedDate = (
        <div style={{marginBottom: '25px'}}>
          <span style={styles.label}>Disclosure Date:</span>
          <span name="Dates" data-for={this.props.travelLog.entityName} style={styles.data}>{formatDate(this.props.travelLog.disclosedDate)}</span>
        </div>
      );
    }

    let archiveButton;

    if (this.props.travelLog.active === 1) {
      archiveButton = (
        <ProminentButton name="Archive" data-for={this.props.travelLog.entityName} onClick={this.archiveEntry} style={styles.button}>Archive</ProminentButton>
      );
    }

    if (this.props.editing === true) {
      actionButtons = (
        <div style={styles.buttons}>
          <ProminentButton name="Save" data-for={this.props.travelLog.entityName} onClick={this.saveEntry} style={styles.button}>Save</ProminentButton>
          <ProminentButton name="Cancel" data-for={this.props.travelLog.entityName} onClick={this.cancelEntry} style={styles.button}>Cancel</ProminentButton>
        </div>
      );
    } else if (this.props.travelLog.status === COIConstants.RELATIONSHIP_STATUS.DISCLOSED) {
      actionButtons = (
        <div style={styles.buttons}>
          {disclosedDate}
          {archiveButton}
        </div>
      );
    } else {
      actionButtons = (
        <div style={styles.buttons}>
          <ProminentButton name="Edit" data-for={this.props.travelLog.entityName} onClick={this.editEntry} style={styles.button}>Edit</ProminentButton>
          <ProminentButton name="Delete" data-for={this.props.travelLog.entityName} onClick={this.deleteEntry} style={styles.button}>Delete</ProminentButton>
        </div>
      );
    }

    let jsx;
    if (this.props.editing) {
      jsx = (
        <div>
          <TextField
          id='entityName'
          label='ENTITY NAME'
          onChange={this.updateField}
          name="Entity Name"
          styles={styles.textField}
          value={this.props.travelLog.entityName}
          />
          <CurrencyField
          id='amount'
          label='AMOUNT'
          onChange={this.updateField}
          name="Amount"
          styles={styles.textField}
          value={this.props.travelLog.amount}
          />
          <TextField
          id='destination'
          label='DESTINATION'
          onChange={this.updateField}
          name="Destinantion"
          styles={styles.textField}
          value={this.props.travelLog.destination}
          />
          <DateRangeField
          id='dateRange'
          label='DATE RANGE'
          onStartDateChange={this.updateStartDate}
          onEndDateChange={this.updateEndDate}
          styles={styles.textField}
          startDate={this.props.travelLog.startDate}
          endDate={this.props.travelLog.endDate}
          />
          <TextField
          id='reason'
          label='REASON'
          onChange={this.updateField}
          name="Reason"
          styles={styles.textField}
          value={this.props.travelLog.reason}
          />
          {actionButtons}
        </div>
      );
    } else {
      jsx = (
        <div>
          <div style={styles.left}>
            <div>
              <div name="Name" style={styles.entityName}>
                {this.props.travelLog.entityName}
                <span style={styles.midDot}>&middot;</span>
              </div>
              <div style={styles.dates}>
                <span style={styles.label}>Dates:</span>
                <span name="Dates" data-for={this.props.travelLog.entityName} style={styles.data}>{formatDate(this.props.travelLog.startDate)} - {formatDate(this.props.travelLog.endDate)}</span>
              </div>
            </div>
            <div style={styles.middle}>
              <div style={styles.destination}>
                <span style={styles.label}>Destination:</span>
                <span name="Destination" data-for={this.props.travelLog.entityName} style={styles.data}>{this.props.travelLog.destination}</span>
              </div>
              <div style={styles.amount}>
                <span style={styles.label}>Amount:</span>
                <span name="Amount" data-for={this.props.travelLog.entityName} style={styles.data}>${this.props.travelLog.amount}</span>
              </div>
            </div>
            <div style={styles.reason}>
              <span style={styles.label}>Reason:</span>
              <span name="Reason" data-for={this.props.travelLog.entityName} style={styles.data}>{this.props.travelLog.reason}</span>
            </div>
          </div>
          {actionButtons}
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
