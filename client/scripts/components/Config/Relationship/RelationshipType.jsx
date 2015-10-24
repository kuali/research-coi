import React from 'react/addons';
import {merge} from '../../../merge';
import EditableList from '../EditableList';

export default class RelationshipType extends React.Component {
  constructor() {
    super();

    this.state = {
      editing: false
    };

    this.enabledChanged = this.enabledChanged.bind(this);
    this.close = this.close.bind(this);
    this.configure = this.configure.bind(this);
    this.typeEnabledChanged = this.typeEnabledChanged.bind(this);
    this.typeOptionsChanged = this.typeOptionsChanged.bind(this);
    this.amountEnabledChanged = this.amountEnabledChanged.bind(this);
    this.amountOptionsChanged = this.amountOptionsChanged.bind(this);
  }

  enabledChanged() {
    let checkbox = React.findDOMNode(this.refs.enabledCheckbox);
    this.props.enabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  configure() {
    this.setState({
      editing: true
    });
  }

  close() {
    this.setState({
      editing: false
    });
  }

  typeEnabledChanged() {
    let checkbox = React.findDOMNode(this.refs.typeEnabled);
    this.props.typeEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  typeOptionsChanged(newList) {
    this.props.typeOptionsChanged(this.props.typeCd, newList.map(item=>{
      item.relationshipCd = this.props.typeCd;
      return item;
    }));
  }

  amountEnabledChanged() {
    let checkbox = React.findDOMNode(this.refs.amountEnabled);
    this.props.amountEnabledChanged(this.props.typeCd, checkbox.checked === true ? 1 : 0);
  }

  amountOptionsChanged(newList) {
    this.props.amountOptionsChanged(this.props.typeCd, newList.map(item=>{
      item.relationshipCd = this.props.typeCd;
      return item;
    }));
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
        width: 130
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
            <span style={styles.name}>{this.props.name}</span>
          </div>
          <div className="flexbox row" style={{paddingLeft: 27}}>
            <span style={styles.left}>
              <input id="typeCheckbox" type="checkbox" ref="typeEnabled" checked={this.props.typeEnabled === 1} onChange={this.typeEnabledChanged} />
              <label htmlFor="typeCheckbox" style={styles.checkboxLabel}>Type</label>
            </span>
            <span className="fill" style={{display: 'inline-block'}}>
              <EditableList
                items={this.props.typeOptions}
                onChange={this.typeOptionsChanged}
              />
            </span>
          </div>
          <div className="flexbox row" style={styles.amountSection}>
            <span style={styles.left}>
              <input id="amountCheckbox" type="checkbox" ref="amountEnabled" checked={this.props.amountEnabled === 1} onChange={this.amountEnabledChanged} />
              <label htmlFor="amountCheckbox" style={styles.checkboxLabel}>Amount</label>
            </span>
            <span className="fill">
              <EditableList
                items={this.props.amountOptions}
                onChange={this.amountOptionsChanged}
              />
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
          <span style={styles.name}>{this.props.name}</span>
        </div>
      );
    }

    return (
      <div className="flexbox row" style={merge(styles.container, this.props.style)}>
        <span style={{margin: '0 10px 0 20px'}}>
          <input
            type="checkbox"
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
