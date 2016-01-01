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
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {ManualRelationDialog} from './ManualRelationDialog';
import {GreyButton} from '../../GreyButton';
import {undefinedRelationExists} from '../undefinedRelationExists';

export class ManualEventRelations extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.toggleDialog = this.toggleDialog.bind(this);
    this.getDisplayStatus = this.getDisplayStatus.bind(this);
    this.getDeclarationDescription = this.getDeclarationDescription.bind(this);
    this.editProject = this.editProject.bind(this);
  }

  shouldComponentUpdate() { return true; }

  toggleDialog() {
    DisclosureActions.toggleDeclaration(this.props.disclosure.id, 'MANUAL');
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
    const declarationType = window.config.declarationTypes.find(type => {
      return type.typeCd === typeCd;
    });

    if (declarationType) {
      return declarationType.description;
    }

    return null;
  }

  editProject() {
    DisclosureActions.editManualEvent(this.props.disclosure.id);
  }

  renderMobile() {}

  renderDesktop() {
    const desktopStyles = {
      container: {
        display: 'block',
        overflow: 'hidden',
        marginBottom: 25,
        boxShadow: '0 0 15px #E6E6E6',
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
        width: '50%',
        verticalAlign: 'top'
      },
      item: {
        marginTop: 9
      },
      button: {
        margin: '7px 10px 7px 0',
        fontSize: 11
      },
      value: {
        fontWeight: 'bold',
        marginLeft: 5
      },
      attention: {
        color: window.colorBlindModeOn ? 'black' : 'red',
        textTransform: 'capitalize',
        marginBottom: 28
      }
    };
    const styles = merge(this.commonStyles, desktopStyles);

    let relationshipDialog;
    if (this.props.open) {
      relationshipDialog = (
        <ManualRelationDialog
          declarations={this.props.declarations}
          entities={this.props.entities}
          title={this.props.disclosure.title}
          projectId={this.props.disclosure.projectId}
          onSave={this.toggleDialog}
          onCancel={this.toggleDialog}
        />
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
            Project Title:
            <span style={styles.value}>
              {this.props.disclosure.title}
            </span>
          </div>
          <div>
            <span style={styles.left}>
              <div style={styles.item}>
                Project Type:
                <span style={styles.value}>
                  {this.props.disclosure.projectType}
                </span>
              </div>
              <div style={styles.item}>
                Project Role:
                <span style={styles.value}>
                  {this.props.disclosure.role}
                </span>
              </div>
              <div style={styles.item}>
                Sponsor:
                <span style={styles.value}>
                  {this.props.disclosure.sponsor}
                </span>
              </div>
            </span>
            <span style={styles.right}>
              {status}

              <div>
                <GreyButton style={styles.button} onClick={this.toggleDialog}>Edit Declarations</GreyButton>
                <GreyButton style={merge(styles.button, {marginBottom: 0})} onClick={this.editProject}>
                  Edit Project Details
                </GreyButton>
              </div>
            </span>
          </div>
        </div>

        {relationshipDialog}

      </div>
    );
  }
}

ManualEventRelations.defaultProps = {
  relations: [],
  entities: []
};
