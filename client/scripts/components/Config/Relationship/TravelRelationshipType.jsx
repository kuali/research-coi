import React from 'react/addons';
import {merge} from '../../../merge';
import RelationshipType from './RelationshipType';

export default class TravelRelationshipType extends RelationshipType {
  constructor() {
    super();

    this.destinationEnabledChanged = this.destinationEnabledChanged.bind(this);
    this.dateEnabledChanged = this.dateEnabledChanged.bind(this);
    this.reasonEnabledChanged = this.reasonEnabledChanged.bind(this);
  }

  enabledChanged() {
    let checkbox = React.findDOMNode(this.refs.enabledCheckbox);
    this.props.enabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  destinationEnabledChanged() {
    let checkbox = React.findDOMNode(this.refs.destinationEnabled);
    this.props.destinationEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  dateEnabledChanged() {
    let checkbox = React.findDOMNode(this.refs.dateEnabled);
    this.props.dateEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  reasonEnabledChanged() {
    let checkbox = React.findDOMNode(this.refs.reasonEnabled);
    this.props.reasonEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }


  render() {
    let styles = {
      container: {
      },
      collapsedContent: {
        borderBottom: '1px solid #E6E6E6',
        paddingBottom: 20,
        marginBottom: 15,
        verticalAlign: 'top'
      },
      configureButton: {
        float: 'right',
        backgroundColor: '#E6E6E6',
        border: 0,
        borderBottom: '2px solid #A6A6A6',
        borderRadius: 3,
        fontSize: 9,
        padding: '4px 13px'
      },
      closeButton: {
        float: 'right',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        border: 0,
        color: 'white',
        borderBottom: '2px solid #A6A6A6',
        borderRadius: 3,
        fontSize: 9,
        padding: '4px 24px'
      },
      name: {
        fontSize: 14
      },
      left: {
        paddingRight: 25,
        width: 200
      },
      checkboxLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        verticalAlign: 'middle'
      },
      amountSection: {
        paddingLeft: 27,
        margin: '40px 0'
      }
    };

    let content;
    if (this.state.editing) {
      content = (
      <div>
        <div style={{marginBottom: 30}}>
          <button style={styles.closeButton} onClick={this.close}>
            Close
          </button>
          <label htmlFor={`rtcb${this.props.typeCd}`} style={styles.name}>{this.props.name}</label>
        </div>
        <div className="flexbox row" style={styles.amountSection}>
            <span style={styles.left}>
              <input id="amountCheckbox" type="checkbox" ref="amountEnabled" checked={this.props.amountEnabled === 1} onChange={this.amountEnabledChanged} />
              <label htmlFor="amountCheckbox" style={styles.checkboxLabel}>Amount</label>
            </span>
        </div>
        <div className="flexbox row" style={styles.amountSection}>
            <span style={styles.left}>
              <input id="destinationCheckbox" type="checkbox" ref="destinationEnabled" checked={this.props.destinationEnabled === 1} onChange={this.destinationEnabledChanged} />
              <label htmlFor="destinationCheckbox" style={styles.checkboxLabel}>Destination</label>
            </span>
        </div>
        <div className="flexbox row" style={styles.amountSection}>
            <span style={styles.left}>
              <input id="dateCheckbox" type="checkbox" ref="dateEnabled" checked={this.props.dateEnabled === 1} onChange={this.dateEnabledChanged} />
              <label htmlFor="dateCheckbox" style={styles.checkboxLabel}>Date Range</label>
            </span>
        </div>
        <div className="flexbox row" style={styles.amountSection}>
            <span style={styles.left}>
              <input id="reasonCheckbox" type="checkbox" ref="reasonEnabled" checked={this.props.reasonEnabled === 1} onChange={this.reasonEnabledChanged} />
              <label htmlFor="reasonCheckbox" style={styles.checkboxLabel}>Reason</label>
            </span>
        </div>
      </div>
      );
    }
    else {
      content = (
      <div style={styles.collapsedContent}>
        <button style={styles.configureButton} onClick={this.configure}>
          Configure
        </button>
        <label htmlFor={`rtcb${this.props.typeCd}`} style={styles.name}>{this.props.name}</label>
      </div>
      );
    }

    return (
    <div className="flexbox row" style={merge(styles.container, this.props.style)}>
        <span style={{margin: '0 10px 0 20px'}}>
          <input
            type="checkbox"
            id={`rtcb${this.props.typeCd}`}
            checked={this.props.enabled === 1}
            onChange={this.enabledChanged}
            ref="enabledCheckbox"
            style={{verticalAlign: 'top'}}
          />
        </span>
        <span className="fill">
          {content}
        </span>
    </div>
    );
  }
}
