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
import {EntityRelation} from '../EntityRelation';
import {BlueButton} from '../../BlueButton';
import {GreyButton} from '../../GreyButton';

export class ProjectRelationDialog extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.onNext = this.onNext.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.findDeclarationTypeByEntity = this.findDeclarationTypeByEntity.bind(this);
    this.findCommentByEntity = this.findCommentByEntity.bind(this);
    this.setAll = this.setAll.bind(this);
  }

  shouldComponentUpdate() { return true; }

  onNext() {
    this.props.onNext(this.props.id, 'PROJECT');
  }

  onPrevious() {
    this.props.onPrevious(this.props.id, 'PROJECT');
  }

  findDeclarationTypeByEntity(id) {
    let declaration = this.props.declarations.find(element => {
      return element.finEntityId === id;
    });

    if (declaration) {
      return declaration.typeCd;
    }

    return null;
  }

  findCommentByEntity(id) {
    let declaration = this.props.declarations.find(element => {
      return element.finEntityId === id;
    });

    if (declaration) {
      return declaration.comments;
    }

    return null;
  }

  setAll() {
    DisclosureActions.setAllForProject(
      'PROJECT',
      this.props.projectId,
      parseInt(this.refs.setAllSelect.value)
    );
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        backgroundColor: '#c1c1c1'
      },
      content: {
        padding: '25px 25px 15px 25px',
        position: 'relative',
        backgroundColor: 'white'
      },
      instructions: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 15
      },
      setAllButton: {
        margin: '7px 10px 7px 0'
      },
      heading: {
        display: 'inline-block',
        fontSize: 12,
        color: window.colorBlindModeOn ? 'black' : '#888'
      },
      headings: {
        marginTop: 25,
        paddingBottom: 5
      },
      buttons: {
        backgroundColor: 'white',
        padding: 15,
        textAlign: 'right',
        borderTop: '1px solid #C3C3C3'
      },
      spacer: {
        display: this.props.projectCount > 1 ? 'inline-block' : 'none',
        width: 10,
        borderRight: '1px solid #666',
        height: 32,
        verticalAlign: 'middle'
      },
      button: {
        margin: '0 10px 0 10px',
        padding: 8,
        minWidth: 90,
        width: 'initial'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let entityRelations = [];
    this.props.entities.filter(element => {
      return element.active === 1;
    })
    .forEach((element) => {
      entityRelations.push(
        <EntityRelation
          entity={element}
          relationType="PROJECT"
          projectId={this.props.projectId}
          typeCd={this.findDeclarationTypeByEntity(element.id)}
          comments={this.findCommentByEntity(element.id)}
          declarationTypes={this.props.declarationTypes}
          key={element.id}
        />
      );
    });

    let declarationTypeOptions = this.props.declarationTypes.map(option =>{
      return (
        <option key={option.typeCd} value={option.typeCd}>{option.description}</option>
      );
    });

    let navButtons = [];
    if (this.props.projectCount > 0) {
      if (this.props.id > 0) {
        navButtons.push(
          <GreyButton key='previous' onClick={this.onPrevious} style={styles.button}>
            Previous Project
            <i className="fa fa-caret-up" style={{marginLeft: 5}}></i>
          </GreyButton>
        );
      }
      if (this.props.id < this.props.projectCount - 1) {
        navButtons.push(
          <GreyButton key='next' onClick={this.onNext} style={styles.button}>
            Next Project
            <i className="fa fa-caret-down" style={{marginLeft: 5}}></i>
          </GreyButton>
        );
      }
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.content}>
          <div style={styles.instructions}>
            Indicate how each Financial Entity is related to project #
            <span style={{marginRight: 3}}>{this.props.projectId}</span>
            -
            <span style={{marginLeft: 3}}>{this.props.title}</span>:
          </div>
          <div>
            <BlueButton onClick={this.setAll} style={styles.setAllButton}>Set All:</BlueButton>
            to:
            <select ref="setAllSelect" style={{marginLeft: 10}}>
              {declarationTypeOptions}
            </select>
          </div>
          <div style={styles.headings}>
            <span style={merge(styles.heading, {width: '25%'})}>FINANCIAL ENTITY</span>
            <span style={merge(styles.heading, {width: '30%'})}>REPORTER RELATIONSHIP</span>
            <span style={merge(styles.heading, {width: '45%'})}>REPORTER COMMENTS</span>
          </div>
          {entityRelations}
        </div>
        <div style={styles.buttons}>
          <div>
            {navButtons}
            <span style={styles.spacer} />
            <GreyButton onClick={this.props.onSave} style={styles.button}>Done</GreyButton>
          </div>
        </div>
      </div>
    );
  }
}
