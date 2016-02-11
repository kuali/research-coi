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

import styles from './style';
import classNames from 'classnames';
import React from 'react';
import Sidebar from '../../sidebar';
import Panel from '../../panel';
import ActionPanel from '../../action-panel';
import EditableList from '../../editable-list';
import ConfigActions from '../../../../actions/config-actions';
import ConfigStore from '../../../../stores/config-store';
import RelationshipType from '../relationship-type';
import TravelRelationshipType from '../travel-relationship-type';
import {AppHeader} from '../../../app-header';

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
    const storeState = ConfigStore.getState();
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
    const checkbox = this.refs.peopleEnabled;
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
        }

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
      });
    }

    return (
      <div className={`flexbox column`} style={{height: '100%'}}>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <span className={classNames('fill', 'flexbox', 'row', styles.container, this.props.className)}>
          <Sidebar active="relationship" />
          <span className={`inline-flexbox column fill ${styles.content}`}>
            <div className={styles.stepTitle}>
              Relationship Matrix
            </div>
            <div className={`fill flexbox row ${styles.configurationArea}`}>
              <span className={`fill`} style={{display: 'inline-block'}}>
                <Panel title="Relationship Matrix People Configuration">
                  <div style={{padding: '7px 21px 15px 21px'}}>
                    <div className={styles.panelInstructions}>Configure the people types for your relationship matrix:</div>
                    <div className={`flexbox row`} style={{paddingLeft: 27}}>
                      <span className={styles.peopleLeft}>
                        <input
                          id="peopleCheckbox"
                          type="checkbox"
                          ref="peopleEnabled"
                          checked={this.state.peopleEnabled}
                          onChange={this.peopleEnabledChanged}
                        />
                        <label htmlFor="peopleCheckbox" className={styles.peopleCheckboxLabel}>People</label>
                      </span>
                      <span className={`fill`}>
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
                    <div className={styles.panelInstructions}>Configure the relationship types for your relationship matrix:</div>
                    {matrixTypes}
                  </div>
                </Panel>
              </span>
              <ActionPanel visible={this.state.dirty} />
            </div>
          </span>
        </span>
      </div>
    );
  }
}
