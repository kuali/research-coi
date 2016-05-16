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
import Panel from '../../panel';
import EditableList from '../../editable-list';
import ConfigActions from '../../../../actions/config-actions';
import RelationshipType from '../relationship-type';
import TravelRelationshipType from '../travel-relationship-type';
import ConfigPage from '../../config-page';

export default class Relationship extends React.Component {
  constructor() {
    super();

    this.itemsChanged = this.itemsChanged.bind(this);
    this.peopleEnabledChanged = this.peopleEnabledChanged.bind(this);
    this.enabledChanged = this.enabledChanged.bind(this);
    this.typeEnabledChanged = this.typeEnabledChanged.bind(this);
    this.amountEnabledChanged = this.amountEnabledChanged.bind(this);
    this.typeOptionsChanged = this.typeOptionsChanged.bind(this);
    this.amountOptionsChanged = this.amountOptionsChanged.bind(this);
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
    const { config, dirty } = this.context.configState;
    let matrixTypes;
    if (config.matrixTypes) {
      matrixTypes = config.matrixTypes.map(matrixType => {
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
      <ConfigPage
        title='Relationship Matrix'
        routeName='relationship'
        dirty={dirty}
        className={this.props.className}
      >
        <Panel title="Relationship Matrix People Configuration">
          <div style={{padding: '7px 21px 15px 21px'}}>
            <div className={styles.panelInstructions}>Configure the people types for your relationship matrix:</div>
            <div className={`flexbox row`} style={{paddingLeft: 27}}>
              <span className={styles.peopleLeft}>
                <input
                  id="peopleCheckbox"
                  type="checkbox"
                  ref="peopleEnabled"
                  checked={config.general.peopleEnabled}
                  onChange={this.peopleEnabledChanged}
                />
                <label htmlFor="peopleCheckbox" className={styles.peopleCheckboxLabel}>People</label>
              </span>
              <span className={`fill`}>
                <EditableList
                  items={config.relationshipPersonTypes}
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
      </ConfigPage>
    );
  }
}

Relationship.contextTypes = {
  configState: React.PropTypes.object
};
