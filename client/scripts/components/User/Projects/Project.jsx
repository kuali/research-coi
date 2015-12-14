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

import React from 'react'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {ProjectRelationDialog} from './ProjectRelationDialog';
import {GreyButton} from '../../GreyButton';
import {undefinedRelationExists} from '../undefinedRelationExists';

export class Project extends React.Component {
  constructor() {
    super();

    this.toggleDialog = this.toggleDialog.bind(this);
    this.getDisplayStatus = this.getDisplayStatus.bind(this);
    this.getDeclarationDescription = this.getDeclarationDescription.bind(this);
  }

  shouldComponentUpdate() { return true; }

  toggleDialog() {
    DisclosureActions.toggleDeclaration(this.props.projectId, 'PROJECT');
  }

  getDisplayStatus() {
    if (undefinedRelationExists('ENTITY', this.props.entities, this.props.declarations)) {
      return 'Action Required';
    }

    let worstDeclaration = 1;

    this.props.declarations.forEach(element => {
      if (worstDeclaration !== 2 && element.typeCd > 1) {
        worstDeclaration = element.typeCd;
      }
    });

    return this.getDeclarationDescription(worstDeclaration);
  }

  getDeclarationDescription(typeCd) {
    let declarationType = window.config.declarationTypes.find(type=>{
      return type.typeCd === typeCd;
    });

    if (declarationType) {
      return declarationType.description;
    }

    return null;
  }

  render() {
    let styles = {
      container: {
        display: 'block',
        margin: '0 3px 25px 0',
        boxShadow: '0px 0px 3px 1px #CCC',
        borderRadius: 5,
        backgroundColor: 'white'
      },
      content: {
        padding: 16,
        fontSize: 22,
        zIndex: 10,
        position: 'relative',
        boxShadow: '0 0 10px #ddd'
      },
      title: {
        fontSize: 23,
        marginBottom: 5
      },
      right: {
        display: 'inline-block',
        margin: '0 0 0 17px',
        verticalAlign: 'top',
        fontSize: 18,
        paddingTop: 9
      },
      left: {
        display: 'inline-block',
        fontSize: 18,
        marginLeft: 25,
        width: '60%',
        verticalAlign: 'top'
      },
      item: {
        marginTop: 9,
        fontWeight: '300'
      },
      button: {
        margin: '7px 10px 7px 0',
        width: 100,
        fontSize: 12
      },
      value: {
        fontWeight: 'bold',
        marginLeft: 5
      },
      attention: {
        color: window.colorBlindModeOn ? 'black' : '#D3121C',
        textTransform: 'capitalize',
        marginBottom: 28
      }
    };

    let relationshipDialog;
    if (this.props.open) {
      relationshipDialog = (
        <ProjectRelationDialog
          declarations={this.props.declarations}
          entities={this.props.entities}
          style={{display: this.props.open ? 'block' : 'none'}}
          title={this.props.title}
          type={this.props.type}
          role={this.props.role}
          sponsor={this.props.sponsor}
          projectId={this.props.projectId}
          declarationTypes={this.props.declarationTypes}
          id={this.props.id}
          projectCount={this.props.projectCount}
          onSave={this.toggleDialog}
          onNext={this.props.onNext}
          onPrevious={this.props.onPrevious} />
      );
    }

    let status;
    if (this.getDisplayStatus() === 'Action Required') {
      status = (
        <div style={styles.attention}>
          - {this.getDisplayStatus()} -
        </div>
      );
    }
    else {
      status = (
        <div style={{marginBottom: 6}}>
          <div style={{fontWeight: '300'}}>Relationship Status:</div>
          <div style={{fontWeight: '700'}}>{this.getDisplayStatus()}</div>
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.content}>
          <div style={styles.title}>
            <span style={styles.value}>
              {this.props.title}
            </span>
          </div>
          <div>
            <span style={styles.left}>
              <div style={styles.item}>
                Project Type:
                <span style={styles.value}>
                  {this.props.type}
                </span>
              </div>
              <div style={styles.item}>
                Project Role:
                <span style={styles.value}>
                  {this.props.role}
                </span>
              </div>
              <div style={styles.item}>
                Sponsor:
                <span style={styles.value}>
                  {this.props.sponsor}
                </span>
              </div>
            </span>
            <span style={styles.right}>
              {status}

              <div>
                <GreyButton style={styles.button} onClick={this.toggleDialog}>Update</GreyButton>
              </div>
            </span>
          </div>
        </div>

        {relationshipDialog}
      </div>
    );
  }
}
