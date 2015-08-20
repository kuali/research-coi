import React from 'react/addons';
import {merge} from '../../../merge';
import {ProminentButton} from '../../ProminentButton';
import {TravelLogActions} from '../../../actions/TravelLogActions';
import {DatePicker} from '../../DatePicker';
import AutoSuggest from 'react-autosuggest';

var entitySuggestions = [
  {entityId: '1', entityName: 'Pfizer'},
  {entityId: '2', entityName: 'Johnson & Johnson'},
  {entityId: '3', entityName: 'Phillip Morris'},
  {entityId: '4', entityName: 'Pacific Life'},
  {entityId: '5', entityName: 'PepsiCo'}];

export class TravelLogForm extends React.Component {
    constructor() {
      super();
      this.commonStyles = {
      };

      this.state = {
        entityName: '',
        startDate: '',
        endDate: '',
        isValid: false
      };
      this.addEntry = this.addEntry.bind(this);
      this.setStartDate = this.setStartDate.bind(this);
      this.setEndDate = this.setEndDate.bind(this);
      this.setEntityName = this.setEntityName.bind(this);
      this.validateForm = this.validateForm.bind(this);
      this.validateNumeric = this.validateNumeric.bind(this);
    }

    addEntry() {
      if (this.state.isValid) {
        TravelLogActions.addEntry(
            this.state.entityName,
            this.refs.amount.getDOMNode().value,
            this.state.startDate,
            this.state.endDate,
            this.refs.reason.getDOMNode().value,
            this.refs.destination.getDOMNode().value);

        this.refs.amount.getDOMNode().value = '';
        this.refs.reason.getDOMNode().value = '';
        this.refs.destination.getDOMNode().value = '';
        this.setState({
        entityName: '',
        startDate: '',
        endDate: '',
        isValid: false
      });
      }
    }

    getSuggestions(input, callback) {
      let escapedInput = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      let suburbMatchRegex = new RegExp('\\b' + escapedInput, 'i');
      let suggestions = entitySuggestions
        .filter( entity => suburbMatchRegex.test(entity.entityName) )
        .map( entity => entity.entityName )
        .sort();

      setTimeout(() => callback(null, suggestions), 300);
    }

    setStartDate(newValue) {
      this.setState({
        startDate: newValue
      });
      this.validateForm();
    }

    setEndDate(newValue) {
      this.setState({
       endDate: newValue
      });
      this.validateForm();
    }

    setEntityName(newValue) {
      this.setState({
        entityName: newValue
      });
      this.validateForm();
    }

    validateForm() {
      let isValid = this.state.entityName !== ''
        && this.refs.amount.getDOMNode().value !== ''
        && this.state.startDate !== ''
        && this.state.endDate !== ''
        && this.refs.reason.getDOMNode().value !== ''
        && this.refs.destination.getDOMNode().value !== '';

      this.setState({
        isValid: isValid
      });
    }

    validateNumeric(e) {
      var event = e || window.event;
      var key = event.keyCode || event.which;
      key = String.fromCharCode( key );
      var regex = /[0-9]|\./;
      if( !regex.test(key) ) {
        event.returnValue = false;
        if(event.preventDefault) {
          event.preventDefault();
        }
      }
    }

    render() {
      let styles = {
        container: {
          margin: '44px 50px'
        },
        field: {
          display: 'inline-block',
          marginRight: 20,
          width: 275
        },
        top: {
          marginTop: 20
        },
        left: {
          width: '30%',
          display: 'inline-block',
          verticalAlign: 'top'
        },
        middle: {
          width: '30%',
          display: 'inline-block',
          verticalAlign: 'top'
        },
        right: {
          width: '30%',
          display: 'inline-block',
          verticalAlign: 'bottom'
        },
        input: {
          padding: '2px 8px',
          fontSize: 16,
          borderRadius: 5,
          border: '1px solid #ccc',
          height: 30,
          width: '100%'
        },
        date: {
          width: '40%',
          display: 'inline-block'
        },
        dateMiddle: {width: '20%',
          display: 'inline-block',
          textAlign: 'center'
        },
        disabled: {
          color: '#AAA',
          cursor: 'default'
        },
        invalidError: {
          fontSize: 10,
          marginTop: 2
        },
        currency: {
          position: 'absolute',
          display: 'inline',
          float: 'left',
          color: 'grey',
          left: 6,
          top: 4
        },
        amount: {
          padding: '2px 20px'
        },
        addButton: {
          width: 'auto'
        }
      };
      styles = merge(this.commonStyles, styles);

      let inputAttributes = {
        onChange: this.setEntityName,
        value: ''
      };

      let addButtonStyle = merge(styles.addButton, this.state.isValid ? '' : styles.disabled);

      let amount = merge(styles.input, styles.amount);

      return (
        <div style={styles.container}>
          <div style={{width: '100%'}}>
            <div style={styles.left}>
              <div style={styles.top}>
                <span style={styles.field}>
                  <div style={{marginBottom: 5, fontWeight: '500'}}>ENTITY NAME</div>
                  <div>
                    <AutoSuggest suggestions={this.getSuggestions} inputAttributes={inputAttributes}/>
                  </div>
                </span>
              </div>
            </div>
            <div style={styles.middle}>
              <div style={styles.top}>
                <span style={styles.field}>
                  <div style={{marginBottom: 5, fontWeight: '500'}}>AMOUNT</div>
                  <div style={{position: 'relative'}}>
                    <span style={styles.currency}>$</span>
                    <input required ref="amount" onChange={this.validateForm} onKeyPress={this.validateNumeric} type="text" style={amount}/>
                  </div>
                </span>
              </div>
            </div>
            <div style={styles.right}>
              <div style={styles.top}>
                <span style={styles.field}>
                  <div style={{marginBottom: 5, fontWeight: '500'}}>DESTINATION</div>
                  <div>
                    <input required ref="destination" onChange={this.validateForm} type="text" style={styles.input}/>
                  </div>
                </span>
              </div>
            </div>
          </div>

          <div style={{width: '100%'}}>
            <div style={styles.left}>
              <div style={styles.top}>
                <span style={styles.field}>
                  <div style={{marginBottom: 5, fontWeight: '500'}}>DATE RANGE</div>
                  <div style={styles.date}>
                    <DatePicker id="startDate" onChange={this.setStartDate} value={this.state.startDate} textFieldStyle={styles.input}/>
                  </div>
                  <div style={styles.dateMiddle}>TO</div>
                  <div style={styles.date}>
                    <DatePicker id="endDate" onChange={this.setEndDate} value={this.state.endDate} textFieldStyle={styles.input}/>
                  </div>
                </span>
              </div>
            </div>
            <div style={styles.middle}>
              <div style={styles.top}>
                <span style={styles.field}>
                  <div style={{marginBottom: 5, fontWeight: '500'}}>REASON</div>
                  <div>
                    <input required ref="reason" onChange={this.validateForm} type="text" style={styles.input}/>
                  </div>
                </span>
              </div>
            </div>
            <div style={styles.right}>
              <ProminentButton onClick={this.addEntry} style={addButtonStyle}>+ ADD</ProminentButton>
            </div>
          </div>
        </div>
      );
    }
}
