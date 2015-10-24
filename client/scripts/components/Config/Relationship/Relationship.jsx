import React from 'react/addons';
import {merge} from '../../../merge';
import Sidebar from '../Sidebar';
import Panel from '../Panel';
import ActionPanel from '../ActionPanel';
import EditableList from '../EditableList';
import ConfigActions from '../../../actions/ConfigActions';
import ConfigStore from '../../../stores/ConfigStore';
import RelationshipType from './RelationshipType';
import TravelRelationshipType from './TravelRelationshipType';

export default class Relationship extends React.Component {
  constructor() {
    super();

    this.state = {};

    this.itemsChanged = this.itemsChanged.bind(this);
    this.onChange = this.onChange.bind(this);
    this.peopleEnabledChanged = this.peopleEnabledChanged.bind(this);
    this.enabledChanged = this.enabledChanged.bind(this);
    this.typeEnabledChanged = this.typeEnabledChanged.bind(this);
    this.amountEnabledChanged = this.amountEnabledChanged.bind(this);
    this.typeOptionsChanged = this.typeOptionsChanged.bind(this);
    this.amountOptionsChanged = this.amountOptionsChanged.bind(this);
  }

  componentDidMount() {
    this.onChange();
    ConfigStore.listen(this.onChange);
  }

  componentWillUnmount() {
    ConfigStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = ConfigStore.getState();
    this.setState({
      list: storeState.config.relationshipPersonTypes,
      peopleEnabled: storeState.config.general.peopleEnabled,
      matrixTypes: storeState.config.matrixTypes,
      instructions: storeState.config.general.instructions,
      dirty: storeState.dirty
    });
  }

  itemsChanged(newList) {
    ConfigActions.relationshipPeopleChanged(newList);
  }

  peopleEnabledChanged() {
    let checkbox = React.findDOMNode(this.refs.peopleEnabled);
    ConfigActions.relationshipPeopleEnabled(checkbox.checked);
  }

  enabledChanged(typeCd, newValue) {
    ConfigActions.enabledChanged(typeCd, newValue);
  }

  typeEnabledChanged(typeCd, newValue) {
    ConfigActions.typeEnabledChanged(typeCd, newValue);
  }

  amountEnabledChanged(typeCd, newValue) {
    ConfigActions.amountEnabledChanged(typeCd, newValue);
  }

  typeOptionsChanged(relationshipType, newList) {
    ConfigActions.typeOptionsChanged(relationshipType, newList);
  }

  amountOptionsChanged(relationshipType, newList) {
    ConfigActions.amountOptionsChanged(relationshipType, newList);
  }

  destinationEnabledChanged(typeCd, newValue) {
    ConfigActions.destinationEnabledChanged(typeCd, newValue);
  }

  dateEnabledChanged(typeCd, newValue) {
    ConfigActions.dateEnabledChanged(typeCd, newValue);
  }

  reasonEnabledChanged(typeCd, newValue) {
    ConfigActions.reasonEnabledChanged(typeCd, newValue);
  }

  render() {
    let styles = {
      container: {
        minHeight: 100
      },
      content: {
        backgroundColor: '#eeeeee',
        boxShadow: '2px 8px 8px #ccc inset'
      },
      stepTitle: {
        boxShadow: '0 2px 8px #D5D5D5',
        fontSize: 33,
        textTransform: 'uppercase',
        padding: '15px 15px 15px 35px',
        color: '#525252',
        fontWeight: 300,
        backgroundColor: 'white',
        minHeight: 68
      },
      configurationArea: {
        padding: 35,
        overflowY: 'auto',
        minHeight: 0
      },
      peopleLeft: {
        paddingRight: 25
      },
      panelInstructions: {
        marginBottom: 35
      },
      peopleCheckboxLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        verticalAlign: 'middle'
      }
    };

    let matrixTypes;
    if (this.state.matrixTypes) {
      matrixTypes = this.state.matrixTypes.map(matrixType => {
        if (matrixType.description === 'Travel') {
          return (
            <TravelRelationshipType
              key={matrixType.typeCd}
              typeCd={matrixType.typeCd}
              name={matrixType.description}
              enabled={matrixType.enabled}
              amountEnabled={matrixType.amountEnabled}
              enabledChanged={this.enabledChanged}
              amountEnabledChanged={this.amountEnabledChanged}
              destinationEnabled={matrixType.destinationEnabled}
              dateEnabled={matrixType.dateEnabled}
              reasonEnabled={matrixType.reasonEnabled}
              destinationEnabledChanged={this.destinationEnabledChanged}
              dateEnabledChanged={this.dateEnabledChanged}
              reasonEnabledChanged={this.reasonEnabledChanged}
            />
          );
        } else {
          return (
            <RelationshipType
              key={matrixType.typeCd}
              typeCd={matrixType.typeCd}
              name={matrixType.description}
              enabled={matrixType.enabled}
              typeEnabled={matrixType.typeEnabled}
              amountEnabled={matrixType.amountEnabled}
              typeOptions={matrixType.typeOptions}
              amountOptions={matrixType.amountOptions}
              enabledChanged={this.enabledChanged}
              typeEnabledChanged={this.typeEnabledChanged}
              amountEnabledChanged={this.amountEnabledChanged}
              typeOptionsChanged={this.typeOptionsChanged}
              amountOptionsChanged={this.amountOptionsChanged}
            />
          );
        }
      });
    }

    return (
      <span className="fill flexbox row" style={merge(styles.container, this.props.style)}>
        <Sidebar active="relationship" />
        <span style={styles.content} className="inline-flexbox column fill">
          <div style={styles.stepTitle}>
            Relationship Matrix
          </div>
          <div className="fill flexbox row" style={styles.configurationArea}>
            <span className="fill" style={{display: 'inline-block'}}>
              <Panel title="Relationship Matrix People Configuration">
                <div style={{padding: '7px 21px 15px 21px'}}>
                  <div style={styles.panelInstructions}>Configure the people types for your relationship matrix:</div>
                  <div className="flexbox row" style={{paddingLeft: 27}}>
                    <span style={styles.peopleLeft}>
                      <input id="peopleCheckbox" type="checkbox" ref="peopleEnabled" checked={this.state.peopleEnabled} onChange={this.peopleEnabledChanged} />
                      <label htmlFor="peopleCheckbox" style={styles.peopleCheckboxLabel}>People</label>
                    </span>
                    <span className="fill">
                      <EditableList
                        items={this.state.list}
                        onChange={this.itemsChanged}
                      />
                    </span>
                  </div>
                </div>
              </Panel>
              <Panel title="Relationship Matrix Configuration">
                <div style={{padding: '7px 21px 15px 21px'}}>
                  <div style={styles.panelInstructions}>Configure the relationship types for your relationship matrix:</div>
                  {matrixTypes}
                </div>
              </Panel>
            </span>
            <ActionPanel visible={this.state.dirty} />
          </div>
        </span>
      </span>
    );
  }
}
