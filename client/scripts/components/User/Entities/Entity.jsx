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

import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {GreyButton} from '../../GreyButton';
import {EntityForm} from './EntityForm';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {DisclosureStore} from '../../../stores/DisclosureStore';
import ConfigStore from '../../../stores/ConfigStore';

export class Entity extends React.Component {
  constructor() {
    super();

    this.toggleStatus = this.toggleStatus.bind(this);
    this.showForm = this.showForm.bind(this);
  }

  shouldComponentUpdate() { return true; }

  showForm() {
    DisclosureActions.updateEntityFormOpened(this.props.id);
  }

  toggleStatus() {
    let active = this.props.entity.active === 1 ? 0 : 1;
    DisclosureActions.setEntityActiveStatus(active, this.props.id);
  }

  render() {
    let styles = {
      container: {
        display: 'block',
        margin: '0 3px 25px 0',
        backgroundColor: 'white',
        boxShadow: '0px 0px 3px 1px #CCC',
        borderRadius: 5
      },
      content: {
        position: 'relative',
        zIndex: 10,
        padding: '13px 16px',
        boxShadow: '0 0 15px #E6E6E6',
        fontSize: 17,
        backgroundColor: 'white',
        borderRadius: 5
      },
      name: {
        display: 'inline-block',
        fontSize: 24,
        fontWeight: 'bold'
      },
      dataitem: {
        margin: '10px 0',
        fontSize: 20,
        display: 'inline-block'
      },
      button: {
        margin: '7px 10px 7px 0',
        minWidth: 110
      },
      relationships: {
        fontWeight: 'bold',
        marginLeft: 7,
        display: 'inline-block',
        verticalAlign: 'top'
      },
      entityForm: {
        display: this.props.step >= 0 ? 'block' : 'none',
        transition: 'margin-top .2s ease-in-out'
      },
      buttonCell: {
        width: 268
      },
      relationshipLabel: {
        display: 'inline-block',
        verticalAlign: 'top'
      },
      attention: {
        float: 'right',
        color: window.colorBlindModeOn ? 'black' : '#D3121C',
        marginRight: 20
      }
    };

    let statusButton;
    if (this.props.entity.active === 1) {
      statusButton = (<GreyButton onClick={this.toggleStatus} style={styles.button}>Deactivate</GreyButton>);
    } else {
      statusButton = (<GreyButton onClick={this.toggleStatus} style={styles.button}>Reactivate</GreyButton>);
    }

    let relationships = this.props.entity.relationships.map((relationship) => {
      return (
        <div key={relationship.id}>
          {ConfigStore.getRelationshipPersonTypeString(relationship.personCd)} - {ConfigStore.getRelationshipCategoryTypeString(relationship.relationshipCd)}
        </div>
      );
    });

    let warning;

    if (!DisclosureStore.entityInformationStepComplete(this.props.entity.id) ||
      !DisclosureStore.entityRelationshipsAreSubmittable(this.props.entity.id)) {
      warning = (
        <div style={styles.attention}>- Needs Attention -</div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.content}>
          <div style={styles.name}>{this.props.entity.name}</div>
          {warning}
          <div style={{margin: '10px 0 0 20px'}} className="flexbox row">
            <span className="fill" style={styles.dataitem}>
              <span style={styles.relationshipLabel}>Relationship:</span>
              <span style={styles.relationships}>
                {relationships}
              </span>
            </span>
            <span style={styles.buttonCell}>
              <GreyButton style={styles.button} onClick={this.showForm}>View Summary</GreyButton>
              {statusButton}
            </span>
          </div>
        </div>

        <EntityForm
          update="true"
          step={this.props.step}
          style={styles.entityForm}
          entity={this.props.entity}
          editing={this.props.editing}
          snapshot={this.props.snapshot}
          appState={this.props.appState}
        />
      </div>
    );
  }
}
