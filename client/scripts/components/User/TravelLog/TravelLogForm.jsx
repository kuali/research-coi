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
        endDate: ''
      };
      this.addEntry = this.addEntry.bind(this);
      this.setStartDate = this.setStartDate.bind(this);
      this.setEndDate = this.setEndDate.bind(this);
      this.onEntityNameChange = this.onEntityNameChange.bind(this);
    }

    addEntry() {
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
        endDate: ''
      });

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
    }

    setEndDate(newValue) {
      this.setState({
       endDate: newValue
      });
    }

    onEntityNameChange(newValue) {
      this.setState({
        entityName: newValue
      });
    }

    render() {
      let styles = {
        container: {
          margin: '44px 50px',
          width: '75%'
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
          width: '40%',
          display: 'inline-block',
          verticalAlign: 'top'
        },
        middle: {
          width: '40%',
          display: 'inline-block',
          verticalAlign: 'top'
        },
        right: {
          width: '20%',
          display: 'inline-block',
          verticalAlign: 'bottom',
          textAlign: 'right'
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
        invalidError: {
          fontSize: 10,
          marginTop: 2
        }
      };
      styles = merge(this.commonStyles, styles);

      let inputAttributes = {
        onChange: this.onEntityNameChange
      };

      return (
        <div style={styles.container}>
          <div style={styles.left}>
            <div style={styles.top}>
              <span style={styles.field}>
                <div style={{marginBottom: 5, fontWeight: '500'}}>ENTITY NAME</div>
                <div>
                  <AutoSuggest suggestions={this.getSuggestions} inputAttributes={inputAttributes}/>
                </div>
              </span>
            </div>
            <div style={styles.top}>
              <span style={styles.field}>
                <div style={{marginBottom: 5, fontWeight: '500'}}>TIME</div>
                <div style={styles.date}>
                  <DatePicker required id="startDate" onChange={this.setStartDate} value={this.state.startDate} textFieldStyle={styles.input}/>
                </div>
                <div style={styles.dateMiddle}>TO</div>
                <div style={styles.date}>
                  <DatePicker required id="endDate" onChange={this.setEndDate} value={this.state.endDate} textFieldStyle={styles.input}/>
                </div>
              </span>
            </div>
            <div style={styles.top}>
              <span style={styles.field}>
                <div style={{marginBottom: 5, fontWeight: '500'}}>DESTINATION</div>
                <div>
                  <input required ref="destination" type="text" style={styles.input}/>
                </div>
              </span>
            </div>
          </div>
          <div style={styles.middle}>
            <div style={styles.top}>
              <span style={styles.field}>
                <div style={{marginBottom: 5, fontWeight: '500'}}>AMOUNT</div>
                <div>
                  <input required ref="amount" type="text" style={styles.input}/>
                </div>
              </span>
            </div>

            <div style={styles.top}>
              <span style={styles.field}>
                <div style={{marginBottom: 5, fontWeight: '500'}}>REASON</div>
                <div>
                  <input required ref="reason" type="text" style={styles.input}/>
                </div>
              </span>
            </div>
          </div>
          <div style={styles.right}>
            <ProminentButton onClick={this.addEntry}>ADD</ProminentButton>
          </div>
        </div>
      );
    }
}
